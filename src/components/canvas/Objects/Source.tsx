import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useEditor from "@/state/editor"
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing"
import { LayerMap } from "@/components/canvas/types"
// import { useOutline } from "@/components/canvas/Effects/useOutline"

const SourceComponent = ({ name = "", id, position = [0, 0, 0] as [number, number, number] }) => {
  const mesh = useRef(null)
  const selectedObject = useEditor((state) => state.selectedObject)
  // const outlineEffect = useOutline()
  return (
    // <Select enabled={selectedObject?.current?.uuid === id}>
    <mesh
      ref={mesh}
      onClick={(e) => {
        useEditor.setState({ selectedObject: mesh })
        // outlineEffect.selection.set([mesh.current])
        e.stopPropagation()
      }}
      scale={[0.2, 0.2, 0.2]}
      userData={{
        type: "Source",
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
      {/* <meshBasicMaterial color={0x44a273} /> */}
      <meshPhongMaterial color={0x44a273} specular={0x89eddd} shininess={5} />
      {/* {selectedObject?.current?.uuid === id && <Edges scale={1} threshold={0} color={0xb2b2b2} />} */}
      {/* <Edges scale={1} threshold={0} color={0xb2b2b2} /> */}
    </mesh>
    // </Select>
  )
}
export default SourceComponent
