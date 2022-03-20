import { useControls } from "@/components/dom/leva"

type FloorProps = {
  size?: number
  segments?: number
  primary?: string | number
  secondary?: string | number
}

export function Floor({ size = 10, segments = 10, primary = "white", secondary = "gray" }: FloorProps) {
  const { sizeMultiplier } = useControls({ sizeMultiplier: 1 })

  return <gridHelper args={[size * sizeMultiplier, segments, primary, secondary]} />
}
