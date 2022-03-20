import { useFrame } from "@react-three/fiber"
import { TransformControls } from "@react-three/drei"
import { useRef, useState } from "react"
import { folder, useControls } from "@/components/dom/leva"
import useEditor from "@/state/editor"

// const { showLighting, showStats } = useControls('My folder', {
//   lighting: folder({
//     showLighting: true,
//   }),
//   'Show stats': folder({
//     showStats: false,
//   }),
// })

const BoxComponent = () => {
  const [{ yPos }, set] = useControls(() => ({
    yPos: {
      value: 0,
      min: -Infinity,
      max: Infinity,
      step: 0.1,
    },
  }))

  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef(null)

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <mesh
        ref={mesh}
        onClick={() => {
          useEditor.setState({ selectedObject: mesh })
        }}
        position={[0, yPos, 0]}
      >
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color={"orange"} />
      </mesh>
      <directionalLight position={[5, 5, 5]} />
      <ambientLight />
    </>
  )
}
export default BoxComponent
