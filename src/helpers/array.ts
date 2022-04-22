export function ensureArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}

export function* makeLoopedArray<T>(arr: T[]) {
  let i = 0;
  while (true) {
    yield arr[i];
    i = (i + 1) % arr.length;
  }
  return arr[i];
}
