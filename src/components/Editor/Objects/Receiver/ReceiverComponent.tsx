import { useEffect, useRef } from "react"
import useEditor from "@/components/Editor/State/useEditor"
import { extend, Object3DNode } from "@react-three/fiber"
import { Receiver } from "./Receiver"
extend({ ReceiverObject: Receiver })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      receiverObject: Object3DNode<Receiver, typeof Receiver>
    }
  }
}

export const ReceiverComponent = ({ item }: { item: Receiver }) => {
  const itemRef = useRef(item)

  useEffect(() => {
    useEditor.setState((prev) => ({
      receivers: {
        ...prev.receivers,
        [itemRef.current.uuid]: itemRef.current,
      },
    }))
  }, [item])

  return (
    <receiverObject
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
export default ReceiverComponent
