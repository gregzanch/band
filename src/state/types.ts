export enum ObjectType {
  SOURCE = "Source",
  RECEIVER = "Receiver",
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
