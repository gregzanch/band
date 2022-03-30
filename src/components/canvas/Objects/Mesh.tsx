import * as THREE from "three"
import React, { useRef } from "react"
import { Edges, Stage } from "@react-three/drei"
import useEditor from "@/state/editor"
import { Mesh } from "@/state/types"

type MeshProps = {
  mesh: Mesh
}

export default function MeshComponent({ mesh }: MeshProps) {
  const meshRef = useRef(mesh)
  const selectedObject = useEditor((state) => state.selectedObject)
  return (
    <mesh
      ref={meshRef}
      {...mesh}
      onClick={(e) => {
        useEditor.setState({ selectedObject: meshRef })
        e.stopPropagation()
      }}
    >
      <meshPhysicalMaterial color={0x595e61} opacity={0.5} />
      {selectedObject?.current?.uuid === mesh.uuid && <Edges scale={1} threshold={15} color={0xb2b2b2} />}
    </mesh>
  )
}
