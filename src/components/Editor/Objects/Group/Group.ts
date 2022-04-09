import { ColorRepresentation, Group as ThreeGroup, MeshPhongMaterial, SphereGeometry, Color } from "three"
import { ObjectType } from "../types"

export class Group extends ThreeGroup {
  type: ObjectType.GROUP

  constructor(name: string, position: [number, number, number] = [0, 0, 0]) {
    super()

    this.name = name
    this.position.set(...position)

    this.type = ObjectType.GROUP

    this.matrixAutoUpdate = true

    this.update()
  }

  update() {
    this.userData = {
      id: this.uuid,
      name: this.name,
      type: this.type,
    }
  }
}
