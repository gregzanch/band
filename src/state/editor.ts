import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { Source, Receiver, ObjectType, BriefMesh, BriefAttribute, Mesh, Group } from "./types"
import { openFilePicker } from "@/helpers/dom/openFilePicker"
import { GLTFLoader } from "three-stdlib"
import { BufferAttribute, Color, Group as ThreeGroup, Mesh as ThreeMesh, Box3 } from "three"
import { nanoid } from "nanoid"
import { stripExtension } from "@/helpers/string"
import { darkTheme, theme } from "@/styles/stitches.config"
import { useTheme } from "@/state/theme"

import { slateDark } from "@radix-ui/colors"

export type EditorColors = {
  canvasBackground: Color
  fog: Color
  ground: Color
  floorPrimary: Color
  floorSecondary: Color
  ambientLight: Color
  spotLight: Color
  directionalLight: Color
}

export const EditorColorMap = new Map<typeof darkTheme | typeof theme, EditorColors>()

EditorColorMap.set(theme, {
  canvasBackground: new Color().setStyle(theme.colors.elevation0.value),
  fog: new Color().setStyle(theme.colors.elevation0.value),
  ground: new Color().setStyle(theme.colors.elevation0.value),
  floorPrimary: new Color().setStyle(theme.colors.elevation1.value),
  floorSecondary: new Color().setStyle(theme.colors.elevation2.value),
  ambientLight: new Color().setStyle(theme.colors.elevation0.value),
  spotLight: new Color().setStyle(theme.colors.elevation0.value),
  directionalLight: new Color().setStyle(theme.colors.elevation0.value),
})

EditorColorMap.set(darkTheme, {
  canvasBackground: new Color(0x0d0d0d),
  fog: new Color(1 / 255, 1 / 255, 1 / 255),
  ground: new Color().setHSL(197 / 360, 6.8 / 100, 3 / 100),
  floorPrimary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  floorSecondary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  ambientLight: new Color().setStyle(theme.colors.elevation0.value),
  spotLight: new Color().setStyle(theme.colors.elevation0.value),
  directionalLight: new Color().setStyle(theme.colors.elevation0.value),
})

type EditorState = {
  cameraMatrix: number[]
  orbitControls: any
  transformControls: any
  selectedObject: any
  scene: any
  sources: Record<string, Source>
  receivers: Record<string, Receiver>
  meshes: Record<string, Mesh | Group>
  colors: EditorColors
  // method: () => void
}

type EditorReducers = {
  uploadFile: () => Promise<void>
  set: SetState<EditorState & EditorReducers>
  calculateBounds: () => any
}

const initialState: EditorState = {
  cameraMatrix: [
    0.8242150329508605, 0, -0.5662769458999827, 0, -0.2699522486780919, 0.8790583556703647, -0.39291499177271955, 0,
    0.49779048091687483, 0.47671417781110165, 0.7245331115845789, 0, 2.4889524045843774, 2.383570889055511,
    3.6226655579228995, 1,
  ],
  orbitControls: null,
  transformControls: null,
  selectedObject: null,
  scene: null,
  sources: {
    "57C19E93-33CC-4AC5-A435-E284C0F1CDA1": {
      position: [0.2, 1, 3],
      userData: {
        type: ObjectType.SOURCE,
        name: "Source Left 1",
        id: "57C19E93-33CC-4AC5-A435-E284C0F1CDA1",
      },
    },
  },
  receivers: {
    "DC78D831-BAE7-49F9-9337-514186917A7B": {
      position: [1, 1.5, 4],
      userData: {
        type: ObjectType.RECEIVER,
        name: "Receiver",
        id: "DC78D831-BAE7-49F9-9337-514186917A7B",
      },
    },
  },
  meshes: {},
  colors: EditorColorMap.get(useTheme.getState().theme || darkTheme),
}

function isNumber(val: any): val is number {
  return typeof val === "number" && !isNaN(val)
}

function numberOr(val: any, def: number) {
  return isNumber(val) ? val : def
}

const vectorMin = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.min(numberOr(vecA[i], Infinity), numberOr(vecB[i], Infinity)))
const vectorMax = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.max(numberOr(vecA[i], -Infinity), numberOr(vecB[i], -Infinity)))

export const useEditor = create<
  EditorState & EditorReducers,
  SetState<EditorState & EditorReducers>,
  GetState<EditorState & EditorReducers>,
  Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/persist", Partial<EditorState & EditorReducers>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        set,
        uploadFile: async () => {
          const files = await openFilePicker({ multiple: true, accept: ".gltf" })
          for (const file of files) {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = async (e) => {
              if (reader.readyState === reader.DONE) {
                const parsed = await new GLTFLoader().parseAsync(reader.result, "")
                //@ts-ignore
                const meshes = parsed.scene.children
                  .filter((x) => x.type === "Mesh")
                  .map((x) => {
                    x.userData = {
                      id: x.uuid,
                      name: x.name || "",
                      type: ObjectType.MESH,
                    }
                    return x
                  }) as Mesh[]

                const group = new ThreeGroup()
                group.name = stripExtension(file.name)
                group.userData = {
                  id: group.uuid,
                  name: group.name,
                  type: ObjectType.GROUP,
                }
                for (const mesh of meshes) {
                  group.add(mesh)
                }

                set({
                  meshes: {
                    ...get().meshes,
                    // ...meshes,
                    ...{
                      [group.uuid]: group as Group,
                    },
                  },
                })
              }
            }
          }
        },
        calculateBounds: () => {
          const { sources, receivers, meshes } = get()
          let min = [Infinity, Infinity, Infinity]
          let max = [-Infinity, -Infinity, -Infinity]
          for (const [id, source] of Object.entries(sources)) {
            min = vectorMin(source.position, min)
            max = vectorMax(source.position, max)
          }
          for (const [id, receiver] of Object.entries(receivers)) {
            min = vectorMin(receiver.position, min)
            max = vectorMax(receiver.position, max)
          }
          for (const [id, mesh] of Object.entries(meshes)) {
            const aabb = new Box3()
            aabb.setFromObject(mesh)
            min = vectorMin(aabb.min.toArray(), min)
            max = vectorMax(aabb.max.toArray(), max)
          }
          return { min, max }
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
)

export default useEditor
