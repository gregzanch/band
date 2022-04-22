import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { ObjectType } from "../Objects/types"
import { Source } from "../Objects/Source/Source"
import { Receiver } from "../Objects/Receiver/Receiver"
import { Group } from "../Objects/Group/Group"
import { Mesh } from "../Objects/Mesh/Mesh"
import { openFilePicker } from "@/helpers/dom/openFilePicker"
import { GLTFLoader } from "@/components/Editor/Loaders/GLTFLoader"
import { Color, Box3, Scene, Material, MeshStandardMaterial, DoubleSide, Vector3, Matrix4 } from "three";
import { stripExtension } from "@/helpers/string";
import { darkTheme, lightTheme } from "@/styles/stitches.config";
import { useTheme } from "@/state/theme";

import { slateDark } from "@radix-ui/colors";
import React from "react";
import { Signal } from "./Signal";

import { History } from "./History";
import { omit } from "@/helpers/object";
import { BandObject } from "../Objects";
import { BandObjectExportExtension, GLTFExporter } from "../Exporters/GLTFExporter";
import { saveString } from "@/helpers/io";
import { NODE_TYPE, RayaParameters } from "../Exporters/Raya";
import { nanoid } from "nanoid";

export type EditorColors = {
  canvasBackground: Color;
  fog: Color;
  ground: Color;
  floorPrimary: Color;
  floorSecondary: Color;
  ambientLight: Color;
  spotLight: Color;
  directionalLight: Color;
  wireframe: Color;
};

export const EditorColorMap = new Map<typeof darkTheme | typeof lightTheme, EditorColors>();

EditorColorMap.set(lightTheme, {
  canvasBackground: new Color().setStyle(lightTheme.colors.elevation0.value),
  fog: new Color().setStyle(lightTheme.colors.elevation0.value),
  ground: new Color().setStyle(lightTheme.colors.elevation0.value),
  floorPrimary: new Color().setStyle(lightTheme.colors.elevation1.value),
  floorSecondary: new Color().setStyle(lightTheme.colors.elevation2.value),
  ambientLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  spotLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  directionalLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  wireframe: new Color(0xf9bd15),
});

EditorColorMap.set(darkTheme, {
  canvasBackground: new Color(0x0d0d0d),
  fog: new Color(1 / 255, 1 / 255, 1 / 255),
  ground: new Color().setHSL(197 / 360, 6.8 / 100, 3 / 100),
  floorPrimary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  floorSecondary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  ambientLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  spotLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  directionalLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  wireframe: new Color(0xf9bd15),
});

type EditorState = {
  resetSymbol: Symbol;
  cameraMatrix: number[];
  orbitControls: any;
  transformControls: any;

  selection: BandObject[];
  scene: Scene | null;

  objects: Record<string, BandObject>;
  materials: Record<string, Material>;
  editorMaterials: {
    wireframe: MeshStandardMaterial;
  };
  // acousticMaterials: Record<string, AcousticMaterial>

  colors: EditorColors;
  orientationHelperMarginX: number;
  transformType: "translate" | "rotate" | "scale";

  signals: {
    objectAdded: Signal;
    objectRemoved: Signal;
    objectChanged: Signal;
    objectSelected: Signal;
    pointerMissed: Signal;
    historyChanged: Signal;
    sceneGraphChanged: Signal;
    objectAcousticMaterialChanged: Signal;
  };

  debug: boolean;

  history: History | null;

  materialDialogOpen: boolean;
  raytracerSolverAlertOpen: boolean;

  sources: Record<string, Source>; // TODO remove deprecated
  receivers: Record<string, Receiver>; // TODO remove deprecated
  meshes: Record<string, Mesh | Group>; // TODO remove deprecated
  selectedObject: any; // TODO remove deprecated
};

type EditorReducers = {
  uploadFile: () => Promise<void>;
  uploadFileFromUrl: (url: string) => Promise<void>;
  set: SetState<EditorState & EditorReducers>;
  calculateBounds: () => any;
  initialize: () => void;
  exportGLTF: () => void;
  exportRaya: (rayaParameters: RayaParameters, filename: string) => void;
  getRayaModelFile: (rayaParameters: RayaParameters, filename: string) => Promise<File>;
};

const initialState: EditorState = {
  resetSymbol: Symbol(),
  // prettier-ignore
  cameraMatrix: [
    +0.82421503295086050,
    +0.00000000000000000,
    -0.56627694589998270,
    +0.00000000000000000,
    -0.26995224867809190,
    +0.87905835567036470,
    -0.39291499177271955,
    +0.00000000000000000,
    +0.49779048091687483,
    +0.47671417781110165,
    +0.72453311158457890,
    +0.00000000000000000,
    +2.48895240458437740,
    +2.38357088905551100,
    +3.62266555792289950,
    +1.00000000000000000,
  ],
  orbitControls: null,
  transformControls: null,

  selection: [],
  scene: null,

  objects: {},
  materials: {},
  editorMaterials: {
    wireframe: new MeshStandardMaterial({
      color: EditorColorMap.get(useTheme.getState().theme || darkTheme).wireframe,
      emissive: EditorColorMap.get(useTheme.getState().theme || darkTheme).wireframe,
      metalness: 1,
      roughness: 1,
      transparent: false,
      depthTest: true,
      side: DoubleSide,
      wireframe: true,
    }),
  },

  colors: EditorColorMap.get(useTheme.getState().theme || darkTheme),
  orientationHelperMarginX: 380,
  transformType: "translate",

  materialDialogOpen: false,
  raytracerSolverAlertOpen: false,

  signals: {
    objectAdded: new Signal(),
    objectRemoved: new Signal(),
    objectChanged: new Signal(),
    objectSelected: new Signal(),
    pointerMissed: new Signal(),
    historyChanged: new Signal(),
    sceneGraphChanged: new Signal(),
    objectAcousticMaterialChanged: new Signal(),
  },

  debug: false,

  history: null,

  selectedObject: null, // TODO remove deprecated
  sources: {}, // TODO remove deprecated
  receivers: {}, // TODO remove deprecated
  meshes: {}, // TODO remove deprecated
};

function isNumber(val: any): val is number {
  return typeof val === "number" && !isNaN(val);
}

function numberOr(val: any, def: number) {
  return isNumber(val) ? val : def;
}

const vectorMin = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.min(numberOr(vecA[i], Infinity), numberOr(vecB[i], Infinity)));
const vectorMax = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.max(numberOr(vecA[i], -Infinity), numberOr(vecB[i], -Infinity)));

export const useEditor = create<
  EditorState & EditorReducers,
  SetState<EditorState & EditorReducers>,
  GetState<EditorState & EditorReducers>,
  Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/persist", Partial<EditorState & EditorReducers>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get, api) => ({
        ...initialState,
        set,
        uploadFile: async () => {
          const files = await openFilePicker({ multiple: true, accept: ".gltf" });
          for (const file of files) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = async (e) => {
              if (reader.readyState === reader.DONE) {
                const parsed = await new GLTFLoader().parseAsync(reader.result, "");
                const group = parsed.scene;
                group.name = stripExtension(file.name);
                group.addToDefaultScene(api as Editor);

                set({
                  objects: {
                    ...get().objects,
                    [group.uuid]: group as Group,
                  },
                });
              }
            };
          }
        },
        uploadFileFromUrl: async (url: string) => {
          const buffer = await fetch(url).then((res) => res.arrayBuffer());
          const parsed = await new GLTFLoader().parseAsync(buffer, "");
          console.log(parsed);
          const group = parsed.scene;
          group.name = stripExtension(url.split("/").slice(-1)[0]);
          group.addToDefaultScene(api as Editor);

          set({
            objects: {
              ...get().objects,
              [group.uuid]: group as Group,
            },
          });
        },
        exportGLTF: async (filename: string = "scene.gltf") => {
          const exports = Object.values(get().objects);
          const animations = [];

          // const { GLTFExporter } = await import( '../../examples/jsm/exporters/GLTFExporter.js' );

          const exporter = new GLTFExporter();
          exporter.register(function (writer) {
            return new BandObjectExportExtension(writer, api);
          });

          exporter.parse(
            exports,
            function (result) {
              saveString(JSON.stringify(result, undefined, 2), filename);
            },
            undefined,
            { binary: false, animations: animations, embedImages: false }
          );
        },
        exportRaya: async (rayaParameters: RayaParameters, filename: string = "scene.gltf") => {
          const exports = Object.values(get().objects);
          const animations = [];

          // const { GLTFExporter } = await import( '../../examples/jsm/exporters/GLTFExporter.js' );

          const exporter = new GLTFExporter();
          exporter.register(function (writer) {
            return new BandObjectExportExtension(writer, api);
          });

          exporter.parse(
            exports,
            function (result) {
              result.scenes[0].extras = {
                max_order: rayaParameters.max_order,
                ray_count: rayaParameters.ray_count,
              };
              for (const node of result.nodes) {
                if ([NODE_TYPE.SOURCE, NODE_TYPE.RECEIVER].includes(node.extras.node_type)) {
                  const vec = new Vector3();
                  vec.setFromMatrixPosition(new Matrix4().fromArray(node.matrix));
                  node.translation = vec.toArray();
                }
              }
              for (const mesh of result.meshes) {
                mesh.name = mesh.name || nanoid(10);
              }
              saveString(JSON.stringify(result, undefined, 2), filename);
            },
            undefined,
            { binary: false, animations: animations, embedImages: false }
          );
        },
        getRayaModelFile: async (rayaParameters: RayaParameters, filename: string = "scene.gltf") => {
          const exports = Object.values(get().objects);
          const animations = [];

          // const { GLTFExporter } = await import( '../../examples/jsm/exporters/GLTFExporter.js' );

          const exporter = new GLTFExporter();
          exporter.register(function (writer) {
            return new BandObjectExportExtension(writer, api);
          });

          return new Promise<File>((resolve, reject) => {
            exporter.parse(
              exports,
              function (result) {
                result.scenes[0].extras = {
                  max_order: rayaParameters.max_order,
                  ray_count: rayaParameters.ray_count,
                };
                for (const node of result.nodes) {
                  if ([NODE_TYPE.SOURCE, NODE_TYPE.RECEIVER].includes(node.extras.node_type)) {
                    const vec = new Vector3();
                    vec.setFromMatrixPosition(new Matrix4().fromArray(node.matrix));
                    node.translation = vec.toArray();
                  }
                }
                for (const mesh of result.meshes) {
                  mesh.name = mesh.name || nanoid(10);
                }
                const file = new File([JSON.stringify(result, undefined, 2)], filename);
                resolve(file);
                // saveString(JSON.stringify(result, undefined, 2), filename);
              },
              undefined,
              { binary: false, animations: animations, embedImages: false }
            );
          });
        },
        calculateBounds: () => {
          const { sources, receivers, meshes } = get();
          let min = [Infinity, Infinity, Infinity];
          let max = [-Infinity, -Infinity, -Infinity];
          for (const [id, source] of Object.entries(sources)) {
            min = vectorMin(source.position.toArray(), min);
            max = vectorMax(source.position.toArray(), max);
          }
          for (const [id, receiver] of Object.entries(receivers)) {
            min = vectorMin(receiver.position.toArray(), min);
            max = vectorMax(receiver.position.toArray(), max);
          }
          for (const [id, mesh] of Object.entries(meshes)) {
            const aabb = new Box3();
            aabb.setFromObject(mesh);
            min = vectorMin(aabb.min.toArray(), min);
            max = vectorMax(aabb.max.toArray(), max);
          }
          return { min, max };
        },
        initialize: () => {
          set({
            ...initialState,
            //@ts-ignore
            history: new History(api),
            resetSymbol: Symbol(),
          });
        },

        // method: () => {},
      }),

      {
        name: "band.editor",
        partialize: (state) => ({
          cameraMatrix: state.cameraMatrix,
        }),
      }
    )
  )
);
export type Editor = typeof useEditor
export default useEditor

useEditor.setState({
  history: new History(useEditor),
})

export const getSignals = () => useEditor.getState().signals

getSignals().objectAdded.add((object: BandObject) => {
  useEditor.setState((state) => ({
    objects: {
      ...state.objects,
      [object.uuid]: object,
    },
  }))
})

getSignals().objectRemoved.add((object: BandObject) => {
  useEditor.setState((state) => ({
    objects: omit([object.uuid], state.objects),
  }))
})

getSignals().objectSelected.add((object: BandObject, { meta, shift }) => {
  const currentSelection = useEditor.getState().selection
  let selection: BandObject[]
  if (shift) {
    if (currentSelection.includes(object)) {
      selection = currentSelection.filter((obj) => obj !== object)
    } else {
      selection = [...currentSelection, object]
    }
  } else {
    selection = [object]
  }
  useEditor.setState({ selection })

  // const selectedObject = object ? { current: object } : null
  // useEditor.setState({ selectedObject })
})