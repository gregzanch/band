export function stripExtension(file: string): string {
  const lastDotIndex = file.lastIndexOf(".")
  return lastDotIndex !== -1 ? file.slice(0, lastDotIndex) : file
}
