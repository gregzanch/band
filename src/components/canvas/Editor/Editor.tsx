import hotkeys from "hotkeys-js"
import { useRef, useEffect, Suspense, MutableRefObject, Ref, RefAttributes, Fragment, useMemo } from "react"
import {
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
  useFBO,
  Box,
  TorusKnot,
  softShadows,
  BakeShadows,
} from "@react-three/drei"
import { Floor, Lights, Ground, Shadows } from "@/components/canvas/Editor/Overlays"
import SourceComponent from "@/components/canvas/Objects/Source"

import {
  PerspectiveCamera as PerspectiveCameraImpl,
  Camera as THREECamera,
  Vector3,
  Scene as THREEScene,
  Color as THREEColor,
} from "three"
import { Canvas, useThree, useFrame, createPortal } from "@react-three/fiber"

import useEditor from "@/state/editor"
import { useControls } from "@/components/dom/leva"
import { cameraPropertiesStore } from "@/components/dom/Properties/CameraProperties"
import { objectPropertiesStore } from "@/components/dom/Properties/ObjectProperties"

import { useHotkeys } from "react-hotkeys-hook"
import ReceiverComponent from "../Objects/Receiver"

import MeshComponent from "../Objects/Mesh"

import { MenuHotkeys, ActionMap } from "@/components/custom/MainMenu"
import { Group, Mesh, ObjectType } from "@/state/types"
import GroupComponent from "../Objects/Group"

// import { Outline, OutlineEffectOptions, OutlineProvider } from "@/components/canvas/Effects/useOutline"

import { EffectComposer, Bloom, Outline, Noise, SMAA, SSAO } from "@react-three/postprocessing"
import {
  OutlineEffect,
  BlurPass,
  Resolution,
  KernelSize,
  BlendFunction,
  EffectComposer as EffectComposerImpl,
} from "postprocessing"

import BoxComponent from "../Objects/Box"
import { GizmoHelper } from "@/components/canvas/Gizmos/GizmoHelper"
import { GizmoViewport } from "@/components/canvas/Gizmos/GizmoViewport"

function FrameBufferThing() {
  const target = useFBO({ multisample: true, samples: 8, stencilBuffer: false })
  const boxRef = useRef()
  const { scene, camera } = useThree()
  useFrame((state) => {
    if (boxRef.current) {
      //@ts-ignore
      boxRef.current.visible = false
    }
    state.gl.setRenderTarget(target)
    state.gl.clear()
    // state.gl.clearTarget(target, 0x000000, false, false)
    state.gl.render(scene, camera)
    state.gl.setRenderTarget(null)
    if (boxRef.current) {
      //@ts-ignore
      boxRef.current.visible = true
    }
  })
  return (
    <Box args={[3, 3, 3]} ref={boxRef}>
      <meshStandardMaterial attach='material' map={target.texture} />
    </Box>
  )
}

function Effects() {
  const outlineRef = useRef<OutlineEffect>()
  const composerRef = useRef<EffectComposerImpl>()
  const { gl, camera, scene } = useThree()
  const selectedObject = useEditor((state) => state.selectedObject)
  console.log(selectedObject)

  return (
    <Suspense fallback={null}>
      <EffectComposer ref={composerRef} autoClear={false} enabled camera={camera} scene={scene} multisampling={8}>
        <Outline
          edgeStrength={5}
          blendFunction={BlendFunction.ALPHA}
          pulseSpeed={0.0}
          visibleEdgeColor={0xffcc00}
          hiddenEdgeColor={0xffcc00}
          // width={Resolution.AUTO_SIZE}
          // height={Resolution.AUTO_SIZE}
          selection={
            selectedObject
              ? selectedObject.current.userData.type === ObjectType.GROUP
                ? [...selectedObject.current.children]
                : [selectedObject.current]
              : undefined
          }
          blur
          //@ts-ignore
          ref={outlineRef}
        />
        {/* <Noise opacity={0.1} /> */}
        <Bloom
          intensity={1.0}
          // width={Resolution.AUTO_SIZE}
          // height={Resolution.AUTO_SIZE}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.025}
        />
      </EffectComposer>
    </Suspense>
  )
}

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
      transformControls.current.enabled = false
      transformControls.current.visible = false
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
        <TransformControls
          ref={transformControls}
          castShadow={false}
          receiveShadow={false}
          mode='translate'
          renderOrder={1}
          showX
          showY
          showZ
          object={selectedObject}
        />
      )}
      <OrbitControls ref={control} enableDamping={false} makeDefault />
      {/* <OrientationGizmo /> */}
    </>
  )
}

function OrientationGizmo() {
  const { camera } = useThree()
  return (
    <GizmoHelper
      // autoClear={false}
      alignment='bottom-left'
      margin={[80, 80]}
      renderPriority={2}
      castShadow={false}
      onUpdate={() => {
        camera.up.set(0, 1, 0)
      }}
    >
      <GizmoViewport axisColors={["#ED3D59", "#80AF00", "#488FEA"]} labelColor='black' />
    </GizmoHelper>
  )
}

// Soft shadows are expensive, uncomment and refresh when it's too slow
softShadows()

function Editor(props) {
  useHotkeys("esc", () => {
    const { transformControls } = useEditor.getState()
    if (transformControls && transformControls.enabled) {
      transformControls.enabled = false
      transformControls.visible = false
    } else {
      useEditor.setState({ selectedObject: null })
    }
  })

  useHotkeys("m", (keyboardEvent, hotkeysEvent) => {
    // console.log(keyboardEvent, hotkeysEvent)
    const { transformControls } = useEditor.getState()
    if (transformControls) {
      transformControls.enabled = true
      transformControls.visible = true
    }
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
  const selectObject = useEditor((state) => state.selectedObject)
  const controls = useEditor((state) => state.orbitControls)

  return (
    <Canvas
      mode='concurrent'
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        stencil: true,
      }}
      // style={{ backgroundColor: "#20252b" }}
    >
      <OrientationGizmo />
      <Controls />
      <Suspense fallback={null}>
        <Lights />
        <fog attach='fog' args={["white", 0, 60]} />
      </Suspense>
      <Floor size={100} segments={100} primary={0x999999} secondary={0x999999} />
      <Ground color={0xb3b3b3} size={100} segments={100} />
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

      <Effects />
    </Canvas>
  )
}

export default Editor
