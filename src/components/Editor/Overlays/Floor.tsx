import { LayerMap } from "@/components/Editor/Objects/types"
import useEditor from "../State/useEditor"

type FloorProps = {
  size?: number
  segments?: number
  primary?: string | number
  secondary?: string | number
}

export function Floor({ size = 100, segments = 100, primary = 0xb2b2b2, secondary = 0x252525 }: FloorProps) {
  return (
    <gridHelper
      receiveShadow
      args={[size, segments, primary, secondary]}
      layers={LayerMap.ENVIRONMENT}
      // onClick={(e) => {
      //   useEditor.getState().signals.pointerMissed.dispatch()
      //   // console.log("clicked grid helper")
      //   e.stopPropagation()
      // }}
      raycast={null}
    />
  )
}
