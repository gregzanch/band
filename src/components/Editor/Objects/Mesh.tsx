import * as THREE from "three"
import React, { useRef } from "react"
import { Edges, Stage } from "@react-three/drei"
import useEditor from "@/state/editor"
import { Mesh } from "@/state/types"
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing"
import { LayerMap } from "@/components/Editor/types"
type MeshProps = {
  mesh: Mesh
}

export default function MeshComponent({ mesh }: MeshProps) {
  const meshRef = useRef(mesh)
  const selectedObject = useEditor((state) => state.selectedObject)
  return (
    // <Select enabled={selectedObject?.current?.uuid === mesh.uuid}>
    <mesh
      ref={meshRef}
      {...mesh}
      onClick={(e) => {
        useEditor.setState({ selectedObject: meshRef })
        e.stopPropagation()
      }}
      castShadow
      receiveShadow
      // layers={LayerMap.OBJECTS}
    >
      {/* <meshLambertMaterial color={0x595e61} opacity={0.5} side={THREE.BackSide} /> */}
      <meshPhongMaterial attach='material' color={0x999b9d} specular={0xffffff} shininess={5} side={THREE.DoubleSide} />
      {/* <meshPhysicalMaterial attach='material' color={0x999b9d} side={THREE.DoubleSide} /> */}
      {/* {selectedObject?.current?.uuid === mesh.uuid && <Edges scale={1} threshold={15} color={0xb2b2b2} />} */}
    </mesh>
    // </Select>
  )
}
