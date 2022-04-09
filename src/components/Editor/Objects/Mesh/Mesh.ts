import { ensureArray } from "@/helpers/array"
import { Mesh as ThreeMesh, MeshPhongMaterial, DoubleSide, BufferGeometry, Material } from "three"
import { Editor } from "../../State/useEditor"
import { ObjectType } from "../types"

export class Mesh extends ThreeMesh {
  type: ObjectType.MESH

  constructor(
    name: string,
    geometry: BufferGeometry,
    material = new MeshPhongMaterial({ color: 0x999b9d, specular: 0xffffff, shininess: 5, side: DoubleSide })
  ) {
    super(geometry, material)
    this.name = name

    this.type = ObjectType.MESH

    this.matrixAutoUpdate = true

    this.castShadow = true
    this.receiveShadow = true

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
