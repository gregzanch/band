import { LevaPanel } from "@/components/Leva"
import { Store } from "../../Leva/store"
import { useEffect, useRef } from "react"
import { Box } from "@/components/Shared/Box"

export const cameraPropertiesStore = new Store()

export default function CameraProperties() {
  useEffect(() => {
    Object.assign(window, { cameraPropertiesStore })
  }, [])
  // debugger
  return (
    <Box fillHeight>
      <LevaPanel store={cameraPropertiesStore} fill flat titleBar={false} hideCopyButton />
    </Box>
  )
}