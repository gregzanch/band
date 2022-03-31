import * as THREE from "three"
import { Group, Mesh } from "@/state/types"
import React, { useRef, useMemo } from "react"
import { Edges, Stage } from "@react-three/drei"
import useEditor from "@/state/editor"
import MeshComponent from "@/components/canvas/Objects/Mesh"
import { Selection, Select, EffectComposer, Outline } from "@react-three/postprocessing"
import { LayerMap } from "@/components/canvas/types"
type MeshProps = {
  group: Group
}

export default function GroupComponent({ group }: MeshProps) {
  const groupRef = useRef(group)
  const childMeshes = useMemo(() => group.children.filter((x) => x.type === "Mesh") as Mesh[], [group])
  const selectedObject = useEditor((state) => state.selectedObject)
  return (
    // <Select enabled={selectedObject?.current?.uuid === group.uuid}>
    <group
      ref={groupRef}
      {...group}
      onClick={(e) => {
        useEditor.setState({ selectedObject: groupRef })
        e.stopPropagation()
      }}
      // layers={LayerMap.OBJECTS}
    >
      {childMeshes.map((mesh) => {
        return <MeshComponent key={mesh.uuid} mesh={mesh} />
      })}
    </group>
    // </Select>
  )
}
