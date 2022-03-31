import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useEditor from "@/state/editor"
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing"
import { LayerMap } from "@/components/canvas/types"

const ReceiverComponent = ({ name = "", id, position = [0, 0, 0] as [number, number, number] }) => {
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef(null)
  const selectedObject = useEditor((state) => state.selectedObject)
  return (
    // <Select enabled={selectedObject?.current?.uuid === id}>
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
        id: mesh.current?.uuid || id,
      }}
      position={position}
      uuid={id}
      castShadow
      receiveShadow
      // layers={LayerMap.OBJECTS}
    >
      <sphereBufferGeometry args={[1, 16, 16]} />
      <meshPhongMaterial color={0xe5732a} specular={0xf54b8c} shininess={5} />
      {/* {selectedObject?.current?.uuid === id && <Edges scale={1} threshold={0} color={0xb2b2b2} />} */}
      {/* <Edges scale={1} threshold={0} color={0xb2b2b2} /> */}
    </mesh>
    // </Select>
  )
}
export default ReceiverComponent
