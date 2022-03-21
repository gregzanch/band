import * as THREE from "three"
import { Mesh } from "three"
import React, { useRef } from "react"
import { Edges, Stage } from "@react-three/drei"

type MeshProps = {
  mesh: Mesh
}

export default function MeshComponent({ mesh }: MeshProps) {
  return (
    <mesh {...mesh}>
      <meshPhysicalMaterial color={0x595e61} opacity={0.5} />
      <Edges scale={1} threshold={15} color={0xb2b2b2} />
    </mesh>
  )
}
