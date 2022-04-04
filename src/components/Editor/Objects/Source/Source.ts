import { ColorRepresentation, Mesh, MeshPhongMaterial, SphereGeometry, Color } from "three"
import { ObjectType } from "../types"

export class Source extends Mesh<SphereGeometry, MeshPhongMaterial> {
  type: ObjectType.SOURCE
  color: ColorRepresentation

  constructor(name: string, position: [number, number, number] = [0, 0, 0], color: ColorRepresentation = 0x44a273) {
    const geometry = new SphereGeometry(0.5, 16, 16)
    const material = new MeshPhongMaterial({ wireframe: false, fog: true, shininess: 5 })

    super(geometry, material)

    this.color = color
    this.name = name
    this.position.set(...position)

    this.type = ObjectType.SOURCE

    this.matrixAutoUpdate = true

    this.update()
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
