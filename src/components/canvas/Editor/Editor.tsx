import hotkeys, { HotkeysEvent, KeyHandler } from "hotkeys-js"
import { useRef, useEffect } from "react"
import {
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  OrbitControls,
  Stage,
  TransformControls,
  useGLTF,
} from "@react-three/drei"
import { Floor } from "@/components/canvas/Editor/Overlays"
import SourceComponent from "@/components/canvas/Objects/Source"

import { PerspectiveCamera as PerspectiveCameraImpl } from "three"
import { Canvas, useThree } from "@react-three/fiber"

import useEditor from "@/state/editor"
import { button, useControls } from "@/components/dom/leva"
import { cameraPropertiesStore } from "@/components/dom/Properties/CameraProperties"
import { objectPropertiesStore } from "@/components/dom/Properties/ObjectProperties"
import Monke from "@/components/canvas/Objects/Monke"

import { useHotkeys } from "react-hotkeys-hook"
import ReceiverComponent from "../Objects/Receiver"

import { Suspense } from "react"
import MeshComponent from "../Objects/Mesh"

import { MenuHotkeys, ActionMap } from "@/components/custom/MainMenu"
import { Group, Mesh, ObjectType } from "@/state/types"
import GroupComponent from "../Objects/Group"

function onEnd({ target }) {
  const camera = target.object as PerspectiveCameraImpl
  useEditor.setState({ cameraMatrix: camera.matrix.toArray() })
}

const Controls = () => {
  const control = useRef(null)
  const transformControls = useRef(null)
  const selectedObject = useEditor((state) => state.selectedObject)

  const three = useThree()

  useEffect(() => {
    useEditor.setState({ scene: three.scene })
  }, [three.scene])

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
      // upload: button((get) => alert(`Number value is ${get('number').toFixed(2)}`))
    },
    { store: cameraPropertiesStore }
  )

  useEffect(() => {
    if (transformControls.current) {
      useEditor.setState({ transformControls: transformControls.current })
      const { current: controls } = transformControls
      const callback = (event) => {
        control.current.enabled = !event.value
      }
      const changeCallback = (event) => {
        if (objectPropertiesStore.getData()["position"]) {
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
      useEditor.setState({ orbitControls: controlValue })
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
      <OrbitControls ref={control} enableDamping={false} makeDefault />
      <GizmoHelper
        alignment='bottom-left'
        margin={[80, 80]}
        onUpdate={() => {
          control.current.object.up.set(0, 1, 0)
        }}
      >
        <GizmoViewport axisColors={["#ED3D59", "#80AF00", "#488FEA"]} labelColor='black' />
      </GizmoHelper>
    </>
  )
}

function Editor(props) {
  useHotkeys("esc", () => {
    useEditor.setState({ selectedObject: null })
  })

  useEffect(() => {
    Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
      hotkeys(hotkey, () => {
        if (ActionMap[action]) {
          ActionMap[action]()
          return false
        }
      })
    })

    return () => {
      Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
        if (ActionMap[action]) {
          hotkeys.unbind(hotkey, ActionMap[action])
        }
      })
    }
  }, [])

  useEffect(() => {
    Object.assign(window, { useEditor })
  }, [])

  const sources = useEditor((state) => state.sources)
  const receivers = useEditor((state) => state.receivers)
  const meshes = useEditor((state) => state.meshes)

  return (
    <Canvas mode='concurrent' shadows dpr={[1, 2]} style={{ background: "#20252B" }}>
      <fog attach='fog' args={[0x20252b, 20, 60]} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[2.5, 8, 5]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Controls />
      <Floor size={100} segments={100} primary={0xb2b2b2} secondary={0x252525} />
      {Object.entries(sources).map(([id, source]) => (
        <SourceComponent key={id} name={source.userData.name} position={source.position} id={id} />
      ))}
      {Object.entries(receivers).map(([id, receiver]) => (
        <ReceiverComponent key={id} name={receiver.userData.name} position={receiver.position} id={id} />
      ))}
      {Object.entries(meshes).map(([id, mesh]) =>
        mesh.userData.type === ObjectType.GROUP ? (
          <GroupComponent key={id} group={mesh as Group} />
        ) : (
          <MeshComponent key={id} mesh={mesh as Mesh} />
        )
      )}
    </Canvas>
  )
}

export default Editor
