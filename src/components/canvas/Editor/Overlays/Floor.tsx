type FloorProps = {
  size?: number
  segments?: number
  primary?: string | number
  secondary?: string | number
}

export function Floor({ size = 10, segments = 10, primary = "white", secondary = "gray" }: FloorProps) {
  return <gridHelper args={[size, segments, primary, secondary]} />
}
