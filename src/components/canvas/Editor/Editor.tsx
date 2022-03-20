import * as THREE from "three"
import { useFrame, extend } from "@react-three/fiber"
import { useRef, useState } from "react"
import useStore from "@/state/store"
import { shaderMaterial, TransformControls } from "@react-three/drei"
import { Floor } from "@/components/canvas/Editor/Overlays"
import BoxComponent from "@/components/canvas/Box"

function Editor(props) {
  const group = useRef()

  return (
    <group ref={group}>
      <Floor size={100} segments={100} primary={0xb2b2b2} secondary={0x252525} />
      <BoxComponent />
      <BoxComponent />
      <BoxComponent />
      <BoxComponent />
    </group>
  )
}

export default Editor
