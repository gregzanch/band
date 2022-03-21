export enum ObjectType {
  SOURCE = "Source",
  RECEIVER = "Receiver",
  BRIEF_MESH = "BriefMesh",
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