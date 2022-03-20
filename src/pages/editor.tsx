import { Fragment } from "react"
import Toolbar from "@/components/dom/Toolbar"
import Editor from "@/components/canvas/Editor/Editor"
import { PerspectiveCamera } from "three"
import { Canvas, EventManager } from "@react-three/fiber"
import { OrbitControls, Preload, TransformControls } from "@react-three/drei"
import useStore from "@/state/store"
import useEditor from "@/state/editor"
import { useEffect, useRef } from "react"

function onEnd({ target }) {
  const camera = target.object as PerspectiveCamera
  useEditor.setState({ cameraMatrix: camera.matrix.toArray() })
}

const Controls = () => {
  const dom = useStore((state) => state.dom)
  const control = useRef(null)
  const orbitControlDisabled = useEditor((state) => state.orbitControlDisabled)
  const selectedObject = useEditor((state) => state.selectedObject)

  const transformControls = useRef(null)

  useEffect(() => {
    if (transformControls.current) {
      const { current: controls } = transformControls
      const callback = (event) => (control.current.enabled = !event.value)
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })

  useEffect(() => {
    const controlValue = control?.current
    if (controlValue) {
      // dom.current.style['touch-action'] = 'none'
      const camera = controlValue.object as PerspectiveCamera
      const matrix = useEditor.getState().cameraMatrix
      camera.matrix.fromArray(matrix)
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale)
      controlValue.addEventListener("end", onEnd)
    }
    return () => {
      controlValue.removeEventListener("end", onEnd)
    }
  }, [dom, control])
  // @ts-ignore
  return (
    <>
      {selectedObject && (
        <TransformControls ref={transformControls} mode='translate' showX showY showZ object={selectedObject} />
      )}
      <OrbitControls ref={control} enabled={!orbitControlDisabled} enableDamping={false} />
    </>
  )
}

export default function EditorPage() {
  return (
    <>
      <Toolbar />
      <Canvas mode='concurrent'>
        <fog attach='fog' args={[0x20252b, 20, 60]} />
        <Controls />
        <Preload all />
        <Editor />
      </Canvas>
    </>
  )
}
