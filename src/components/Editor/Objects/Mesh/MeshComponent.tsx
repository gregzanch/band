import { useRef } from "react"
import useEditor from "@/components/Editor/State/useEditor"
import { extend, Object3DNode } from "@react-three/fiber"
import { Mesh } from "./Mesh"
extend({ MeshObject: Mesh })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshObject: Object3DNode<Mesh, typeof Mesh>
    }
  }
}

export default function MeshComponent({ item }: { item: Mesh }) {
  const itemRef = useRef(item)

  return (
    <meshObject
      ref={itemRef}
      {...item}
      onClick={(e) => {
        useEditor.setState({ selectedObject: itemRef })
        e.stopPropagation()
      }}
      castShadow
      receiveShadow
    />
  )
}
