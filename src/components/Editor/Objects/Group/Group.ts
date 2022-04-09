import { ColorRepresentation, Group as ThreeGroup, MeshPhongMaterial, SphereGeometry, Color } from "three"
import { Editor } from "../../State/useEditor"
import { ObjectType } from "../types"

export class Group extends ThreeGroup {
  type: ObjectType.GROUP

  constructor(name: string, position: [number, number, number] = [0, 0, 0]) {
    super()

    this.name = name
    this.position.set(...position)

    this.type = ObjectType.GROUP

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

  update() {
    this.userData = {
      id: this.uuid,
      name: this.name,
      type: this.type,
    }
  }
}
