import { Mesh as ThreeMesh, Group as ThreeGroup } from "three"
import type { BufferGeometry, Material } from "three"

export enum ObjectType {
  SOURCE = "Source",
  RECEIVER = "Receiver",
  BRIEF_MESH = "BriefMesh",
  MESH = "Mesh",
  GROUP = "Group",
}

export interface Source {
  userData: {
    type: ObjectType.SOURCE
    name: string
    id: string
  }
  position: [number, number, number]
}

export interface Receiver {
  userData: {
    type: ObjectType.RECEIVER
    name: string
    id: string
  }
  position: [number, number, number]
}

export interface BriefAttribute {
  count: number
  array: ArrayLike<number>
  itemSize: number
}

export interface BriefMesh {
  userData: {
    type: ObjectType.BRIEF_MESH
    name: string
    id: string
  }
  position: [number, number, number]
  geometry: {
    attributes: Record<string, BriefAttribute>
    index: BriefAttribute
  }
}

export type Mesh = ThreeMesh<BufferGeometry, Material | Material[]> & {
  userData: {
    type: ObjectType.MESH
    name: string
    id: string
  }
}

export type Group = ThreeGroup & {
  userData: {
    type: ObjectType.GROUP
    name: string
    id: string
  }
}
