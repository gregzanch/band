import { LevaPanel } from "@/components/dom/leva"
import { Store } from "../leva/store"
import { useEffect, useRef } from "react"
import { Box } from "@/components/shared/Box"

export const cameraPropertiesStore = new Store()

export default function CameraProperties() {
  useEffect(() => {
    Object.assign(window, { cameraPropertiesStore })
  }, [])
  return (
    <Box fillHeight>
      <LevaPanel store={cameraPropertiesStore} fill flat titleBar={false} hideCopyButton />
    </Box>
  )
}
