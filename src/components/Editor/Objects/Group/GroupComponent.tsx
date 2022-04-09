/* eslint-disable react/no-children-prop */
import { useRef } from "react"
import useEditor from "@/components/Editor/State/useEditor"
import { extend, Object3DNode } from "@react-three/fiber"
import { Group } from "./Group"

import { ComponentMap } from "../"

extend({ GroupObject: Group })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      groupObject: Object3DNode<Group, typeof Group>
    }
  }
}

export default function GroupComponent({ item }: { item: Group }) {
  const itemRef = useRef(item)
  // const childMeshes = useMemo(() => group.children.filter((x) => x.type === "Mesh") as Mesh[], [group])
  return (
    <groupObject
      ref={itemRef}
      {...item}
      onClick={(e) => {
        useEditor.setState({ selectedObject: itemRef })
        e.stopPropagation()
      }}
    >
      {item.children.map((child) => {
        if (ComponentMap[child.type]) {
          const Component = ComponentMap[child.type]
          return <Component key={child.uuid} item={child} />
        }
        return null
      })}
    </groupObject>
  )
}
