export function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b])
}
export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => b.has(x)))
}
export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => !b.has(x)))
}

import { Vector3, Vector3Tuple } from "three"

const a = new Vector3(1, 2, 3)
const b = new Vector3(3, 4, 0)
const c = new Vector3(5, 6, -2)
const selection = [a, b, c].map((x) => x.toArray())

function averageVectors(vectors: Vector3Tuple[]): Vector3Tuple {
  const arr = vectors[0]
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < 3; j++) {
      arr[j] = arr[j] + vectors[i][j]
    }
  }
  return arr.map((x) => x / vectors.length) as Vector3Tuple
}

averageVectors(selection) //?

// vecs.reduce((acc, curr) => acc.map((a, i) => (a + curr[i]) / 2)) //?
