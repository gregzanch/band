import { ColorRepresentation, Mesh, MeshPhongMaterial, SphereGeometry, Color } from "three";
import { NODE_TYPE } from "@/components/Editor/Exporters/Raya";
import { Editor } from "@/components/Editor/State/useEditor";
import { ObjectType } from "./types";

export class Source extends Mesh<SphereGeometry, MeshPhongMaterial> {
  type: ObjectType.SOURCE;
  color: ColorRepresentation;
  material: MeshPhongMaterial;

  /**
   * Theta is an angle between 0 and 180 degrees.
   * It represents the vertical spread of the rays.
   */
  theta: number;
  /**
   * Phi is an angle between 0 and 360 degrees.
   * It represents the horizontal spread of the rays.
   */
  phi: number;

  constructor(name: string, position: [number, number, number] = [0, 0, 0], color: ColorRepresentation = 0x44a273) {
    const geometry = new SphereGeometry(0.5, 16, 16);
    const material = new MeshPhongMaterial({
      wireframe: false,
      fog: true,
      shininess: 2,
      specular: new Color(color).lerp(new Color(0xffffff), 0.25),
    });

    super(geometry, material);

    this.color = color;
    this.name = name;
    this.position.set(...position);

    this.type = ObjectType.SOURCE;

    this.matrixAutoUpdate = true;
    this.castShadow = true;
    this.receiveShadow = true;

    this.update();
  }

  exportStack: Array<() => void> = [];

  beforeParse() {}

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

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }

  update() {
    this.material.color.set(this.color);
    this.userData = {
      id: this.uuid,
      name: this.name,
      type: this.type,
      node_type: NODE_TYPE.SOURCE,
      active: 1,
    };
  }
}
