import { useRef, useEffect } from "react"
import { OrbitControls, TransformControls } from "@react-three/drei"
import { Floor } from "@/components/canvas/Editor/Overlays"
import SourceComponent from "@/components/canvas/Objects/Source"

import { PerspectiveCamera as PerspectiveCameraImpl } from "three"
import { Canvas, useThree } from "@react-three/fiber"

import useEditor from "@/state/editor"
import { useControls } from "@/components/dom/leva"
import { cameraPropertiesStore } from "@/components/dom/Properties/CameraProperties"
import { objectPropertiesStore } from "@/components/dom/Properties/ObjectProperties"

import { useHotkeys } from "react-hotkeys-hook"
import ReceiverComponent from "../Objects/Receiver"

function onEnd({ target }) {
  const camera = target.object as PerspectiveCameraImpl
  useEditor.setState({ cameraMatrix: camera.matrix.toArray() })
}

const Controls = () => {
  const control = useRef(null)
  const transformControls = useRef(null)
  const selectedObject = useEditor((state) => state.selectedObject)

  useControls(
    {
      fov: {
        value: 50,
        onChange: (value) => {
          // @ts-ignore
          control?.current.object.fov = value
          control?.current.object.updateProjectionMatrix()
          // console.log(value)
        },
      },
    },
    { store: cameraPropertiesStore }
  )

  useEffect(() => {
    if (transformControls.current) {
      const { current: controls } = transformControls
      const callback = (event) => {
        control.current.enabled = !event.value
      }
      const changeCallback = (event) => {
        const { x, y, z } = objectPropertiesStore.get("position")
        if (!selectedObject.current) {
          return
        }
        if (
          selectedObject.current.position.x !== x ||
          selectedObject.current.position.y !== y ||
          selectedObject.current.position.z !== z
        ) {
          objectPropertiesStore.setValueAtPath(
            "position",
            {
              x: selectedObject.current.position.x,
              y: selectedObject.current.position.y,
              z: selectedObject.current.position.z,
            },
            false
          )
        }
      }
      controls.addEventListener("objectChange", changeCallback)
      controls.addEventListener("dragging-changed", callback)
      return () => {
        controls.removeEventListener("objectChange", changeCallback)
        controls.removeEventListener("dragging-changed", callback)
      }
    }
  }, [selectedObject])

  useEffect(() => {
    const controlValue = control?.current
    if (controlValue) {
      // dom.current.style['touch-action'] = 'none'
      const camera = controlValue.object as PerspectiveCameraImpl
      const matrix = useEditor.getState().cameraMatrix
      camera.matrix.fromArray(matrix)
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale)
      controlValue.addEventListener("end", onEnd)
    }
    return () => {
      controlValue.removeEventListener("end", onEnd)
    }
  }, [control])
  return (
    <>
      {selectedObject && (
        <TransformControls ref={transformControls} mode='translate' showX showY showZ object={selectedObject} />
      )}
      <OrbitControls ref={control} enableDamping={false} />
    </>
  )
}

function Editor(props) {
  useHotkeys("esc", () => {
    useEditor.setState({ selectedObject: null })
  })
  useEffect(() => {
    Object.assign(window, { useEditor })
  }, [])

  const sources = useEditor((state) => state.sources)
  const receivers = useEditor((state) => state.receivers)

  return (
    <Canvas mode='concurrent' shadows dpr={[1, 2]} style={{ background: "#20252B" }}>
      <fog attach='fog' args={[0x20252b, 20, 60]} />
      <Controls />
      <Floor size={100} segments={100} primary={0xb2b2b2} secondary={0x252525} />
      {Object.entries(sources).map(([id, source]) => (
        <SourceComponent key={id} name={source.userData.name} position={source.position} />
      ))}
      {Object.entries(receivers).map(([id, receiver]) => (
        <ReceiverComponent key={id} name={receiver.userData.name} position={receiver.position} />
      ))}
    </Canvas>
  )
}

export default Editor
