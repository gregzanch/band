import { ensureArray } from "@/helpers/array"
import {
  Mesh as ThreeMesh,
  MeshPhongMaterial,
  DoubleSide,
  BufferGeometry,
  Material,
  MeshPhysicalMaterial,
  MeshBasicMaterial,
  AdditiveBlending,
  MultiplyBlending,
  NormalBlending,
  SubtractiveBlending,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  MeshStandardMaterial,
} from "three";
import useEditor, { Editor } from "../../State/useEditor";
import { ObjectType } from "../types";
import { Material as AcousticMaterial } from "@prisma/client";
import { NODE_TYPE } from "../../Exporters/Raya";

const defaultMaterial = new MeshPhongMaterial({
  color: 0x999b9d,
  specular: 0xffffff,
  shininess: 0.2,
  reflectivity: 0.5,
  transparent: true,
  opacity: 0.25,
  side: DoubleSide,
  wireframe: false,
});

const defaultAcousticMaterial = () =>
  ({
    id: 441,
    createdAt: new Date(Date.parse("2022-03-31T20:44:25.773Z")),
    updatedAt: new Date(Date.parse("2022-03-31T20:44:25.789Z")),
    name: "Gypsum Board",
    material: "Gypsum board, 1/2in thick",
    manufacturer: "",
    description: "",
    source: "Egan",
    tags: ["Ceilings", "Gypsum Board Ceilings"],
    frequencies: [63, 125, 250, 500, 1000, 2000, 4000, 8000],
    absorption: [0.05, 0.29, 0.1, 0.05, 0.04, 0.07, 0.09, 0.09],
  } as AcousticMaterial);

export class Mesh extends ThreeMesh {
  type: ObjectType.MESH;
  material: Material;
  originalMaterial: Material;
  private _wireframe: boolean;
  edges: LineSegments<EdgesGeometry, LineBasicMaterial>;
  acousticMaterial: AcousticMaterial;
  constructor(name: string, geometry: BufferGeometry, material?: Material, acousticMaterial?: AcousticMaterial) {
    super(geometry, material || defaultMaterial.clone());
    this.originalMaterial = this.material;

    this.acousticMaterial = acousticMaterial || defaultAcousticMaterial();

    this.name = name;

    this.type = ObjectType.MESH;

    this.matrixAutoUpdate = true;

    this.castShadow = true;
    this.receiveShadow = true;

    this.edges = new LineSegments(new EdgesGeometry(this.geometry), new LineBasicMaterial({ color: 0x7a8082 }));
    this.edges.material.polygonOffset = true;
    this.edges.material.polygonOffsetFactor = 0.1;
    this.edges.castShadow = false;
    this.edges.receiveShadow = false;
    this.edges.raycast = () => null;
    this.add(this.edges);

    this.wireframe = false;

    this.userData = {
      id: this.uuid,
      name: this.name,
      type: this.type,
      node_type: NODE_TYPE.REFLECTOR,
      active: 1,
    };

    // this.update()
  }

  exportStack: Array<() => void> = [];

  beforeParse() {
    const edgesOriginalState = this.edges.visible;
    this.edges.visible = false;
    this.exportStack.push(() => (this.edges.visible = edgesOriginalState));

    const originalMaterial = this.material;

    this.material = this.material.clone();
    this.material.side = DoubleSide;
    this.material.name = this.acousticMaterial.name;
    this.exportStack.push(() => (this.material = originalMaterial));
    const frequencies = [...this.acousticMaterial.frequencies];
    const alphas = [...this.acousticMaterial.absorption];
    if (frequencies.at(-1) === 8000) {
      frequencies.push(16000);
      alphas.push(alphas.at(-1));
    }

    const keys = frequencies.map((freq) => `abs${freq}`);
    const absorbtionData = {};
    keys.forEach((key, i) => {
      absorbtionData[key] = alphas[i];
    });

    this.material.userData = {
      ...absorbtionData,
    };
  }

  afterParse() {
    while (this.exportStack.length > 0) {
      this.exportStack.pop()();
    }
  }

  addToDefaultScene(editor: Editor) {
    const { scene } = editor.getState();
    scene && scene.add(this);
    return this;
  }

  get wireframe() {
    return this._wireframe;
  }

  set wireframe(visible: boolean) {
    this._wireframe = visible;
    if (visible) {
      const wireframeMaterial = useEditor.getState().editorMaterials.wireframe;
      this.material = wireframeMaterial;
      this.edges.material.color.set(wireframeMaterial.color);
    } else {
      this.material = this.originalMaterial;
      this.children[0].visible = true;
      this.edges.material.color.set(0x7a8082);
    }
  }

  // dispose() {
  //   this.geometry.dispose()
  //   ensureArray(this.material).forEach((material) => material.dispose())
  //   this.edges.geometry.dispose()
  //   this.edges.material.dispose();
  // }

  // update() {

  // }
}
