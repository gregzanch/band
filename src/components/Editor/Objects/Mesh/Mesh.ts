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
} from "three"
import { Editor } from "../../State/useEditor"
import { ObjectType } from "../types"

export class Mesh extends ThreeMesh {
  type: ObjectType.MESH

  constructor(
    name: string,
    geometry: BufferGeometry,
    material = new MeshPhongMaterial({
      color: 0x999b9d,
      specular: 0xffffff,
      shininess: 0.2,
      reflectivity: 0.5,
      transparent: true,
      opacity: 0.25,
      side: DoubleSide,
      wireframe: false,
    })
  ) {
    super(geometry, material)

    this.name = name

    this.type = ObjectType.MESH

    this.matrixAutoUpdate = true

    this.castShadow = true
    this.receiveShadow = true

    const lineSegments = new LineSegments(new EdgesGeometry(this.geometry), new LineBasicMaterial({ color: 0x000000 }))
    lineSegments.material.polygonOffset = true
    lineSegments.material.polygonOffsetFactor = -0.1
    lineSegments.castShadow = false
    lineSegments.receiveShadow = false
    lineSegments.raycast = () => null
    this.add(lineSegments)
    // this.update()
  }

  addToDefaultScene(editor: Editor) {
    const { scene } = editor.getState()
    scene && scene.add(this)
    return this
  }

  // dispose() {
  //   this.geometry.dispose()
  //   ensureArray(this.material).forEach((material) => material.dispose())
  // }

  // update() {
  //   this.userData = {
  //     id: this.uuid,
  //     name: this.name,
  //     type: this.type,
  //   }
  // }
}
