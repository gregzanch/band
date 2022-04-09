import { useEffect, useRef } from "react"
import useEditor from "@/components/Editor/State/useEditor"
import { extend, Object3DNode } from "@react-three/fiber"
import { Source } from "./Source"
extend({ SourceObject: Source })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sourceObject: Object3DNode<Source, typeof Source>
    }
  }
}

export const SourceComponent = ({ item }: { item: Source }) => {
  const itemRef = useRef(item)

  useEffect(() => {
    useEditor.setState((prev) => ({
      sources: {
        ...prev.sources,
        [itemRef.current.uuid]: itemRef.current,
      },
    }))
    // useEditor.getState().signals.sourceRendered
  }, [item])

  return (
    <sourceObject
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
export default SourceComponent
