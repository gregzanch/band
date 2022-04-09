export function ensureArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}
