export function union<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b])
}
export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => b.has(x)))
}
export function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => !b.has(x)))
}

const a = new Set([1, 2, 3, -1])
const b = new Set([2, 3, 4, -1])
const c = new Set([3, 4, 5, -1])

const arr = [a, b, c]

arr.reduce((acc, curr, index) => intersection(index === 0 ? curr : acc, curr), new Set()) //?
