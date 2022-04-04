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

export enum LayerMap {
  OBJECTS = 1,
  ENVIRONMENT = 2,
  LIGHTS = 3,
  TRANSFORM_CONTROLS = 4,
}
