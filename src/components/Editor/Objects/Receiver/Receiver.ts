import { ColorRepresentation, Mesh, MeshPhongMaterial, SphereGeometry, Color } from "three"
import { Editor } from "../../State/useEditor"
import { ObjectType } from "../types"

export class Receiver extends Mesh<SphereGeometry, MeshPhongMaterial> {
  type: ObjectType.RECEIVER
  color: ColorRepresentation
  material: MeshPhongMaterial
  constructor(name: string, position: [number, number, number] = [0, 0, 0], color: ColorRepresentation = 0xe5732a) {
    const geometry = new SphereGeometry(0.5, 16, 16)
    const material = new MeshPhongMaterial({
      wireframe: false,
      fog: true,
      shininess: 2,
      specular: new Color(color).lerp(new Color(0xffffff), 0.125),
    })

    super(geometry, material)

    this.color = color
    this.name = name
    this.position.set(...position)

    this.type = ObjectType.RECEIVER

    this.matrixAutoUpdate = true
    this.castShadow = true
    this.receiveShadow = true

    this.update()
  }

  addToDefaultScene(editor: Editor) {
    const { scene } = editor.getState()
    scene && scene.add(this)
    return this
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }

  update() {
    this.material.color.set(this.color)
    this.userData = {
      id: this.uuid,
      name: this.name,
      type: this.type,
    }
  }
}
