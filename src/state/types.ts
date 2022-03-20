export interface Source {
  userData: {
    type: "Source"
    name: string
  }
  position: [number, number, number]
}

export interface Receiver {
  userData: {
    type: "Receiver"
    name: string
  }
  position: [number, number, number]
}
