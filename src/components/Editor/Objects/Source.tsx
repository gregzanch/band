import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import useEditor from "@/components/Editor/State/useEditor"
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing"
import { LayerMap } from "@/components/Editor/Objects/types"
// import { useOutline } from "@/components/canvas/Effects/useOutline"
import { extend, Object3DNode } from "@react-three/fiber"
import { Source } from "./Source/Source"
extend({ SourceObject: Source })

// Add types to JSX.Intrinsic elements so primitives pick up on it
declare global {
  namespace JSX {
    interface IntrinsicElements {
      sourceObject: Object3DNode<Source, typeof Source>
    }
  }
}

const SourceComponent = ({ source }: { source: Source }) => {
  const sourceRef = useRef(source)

  return (
    <sourceObject
      ref={sourceRef}
      {...source}
      onClick={(e) => {
        useEditor.setState({ selectedObject: sourceRef })
        e.stopPropagation()
      }}
      castShadow
      receiveShadow
    />
  )
}
export default SourceComponent
