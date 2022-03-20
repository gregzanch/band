import useEditor from "@/state/editor"
import useStore from "@/state/store"
import { LevaPanel } from "@/components/dom/leva"
import { Store } from "../leva/store"
import { useEffect, useRef } from "react"

export const cameraPropertiesStore = new Store()

export default function CameraProperties() {
  useEffect(() => {
    Object.assign(window, { cameraPropertiesStore })
  }, [])
  return (
    <div className='h-full'>
      <LevaPanel store={cameraPropertiesStore} fill flat titleBar={false} hideCopyButton />
    </div>
  )
}
