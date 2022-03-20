import { PerspectiveCamera } from 'three'
import { Canvas, EventManager } from '@react-three/fiber'
import { OrbitControls, Preload, TransformControls } from '@react-three/drei'
import useStore from '@/state/store'
import useEditor from '@/state/editor'
import { useEffect, useRef } from 'react'

function onEnd({ target }) {
  const camera = target.object as PerspectiveCamera
  useEditor.setState({ cameraMatrix: camera.matrix.toArray() })
}

const LControl = () => {
  const dom = useStore((state) => state.dom)
  const control = useRef(null)
  const orbitControlDisabled = useEditor((state) => state.orbitControlDisabled)
  const selectedObject = useEditor((state) => state.selectedObject)

  const transformControls = useRef(null)

  useEffect(() => {
    if (transformControls.current) {
      const { current: controls } = transformControls
      const callback = (event) => (control.current.enabled = !event.value)
      controls.addEventListener('dragging-changed', callback)
      return () => controls.removeEventListener('dragging-changed', callback)
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
      controlValue.addEventListener('end', onEnd)
    }
    return () => {
      controlValue.removeEventListener('end', onEnd)
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
const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom)

  return (
    <Canvas
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
      }}
      onCreated={(state) => {
        state.events.connect(dom.current)
      }}
    >
      <fog attach='fog' args={[0x20252b, 20, 60]} />
      <LControl />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
