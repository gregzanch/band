import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useEditor from "@/state/editor"

const ReceiverComponent = ({ name = "", id, position = [0, 0, 0] as [number, number, number] }) => {
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef(null)
  return (
    <>
      <mesh
        ref={mesh}
        onClick={(e) => {
          useEditor.setState({ selectedObject: mesh })
          e.stopPropagation()
        }}
        scale={[0.2, 0.2, 0.2]}
        userData={{
          type: "Receiver",
          name,
          id,
        }}
        position={position}
      >
        <sphereBufferGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={0xe5732a} />
        <Edges scale={1} threshold={0} color={0xb2b2b2} />
      </mesh>
    </>
  )
}
export default ReceiverComponent
