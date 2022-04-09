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
  ContactShadows,
} from "@react-three/drei"
import { Floor, Lights, Ground, Shadows } from "@/components/Editor/Overlays"
import SourceComponent from "@/components/Editor/Objects/Source/SourceComponent"
import { Source } from "@/components/Editor/Objects/Source/Source"

import {
  PerspectiveCamera as PerspectiveCameraImpl,
  Camera as THREECamera,
  Vector3,
  Scene as THREEScene,
  Color as THREEColor,
  Color,
} from "three"
import { Canvas, useThree, useFrame, createPortal } from "@react-three/fiber"

import useEditor, { EditorColorMap } from "@/components/Editor/State/useEditor"

import { cameraPropertiesStore } from "@/components/Editor/Properties/CameraProperties"
import { objectPropertiesStore } from "@/components/Editor/Properties/ObjectProperties"

import { useHotkeys } from "react-hotkeys-hook"
import ReceiverComponent from "./Objects/Receiver/ReceiverComponent"

import MeshComponent from "./Objects/Mesh/MeshComponent"

import { MenuHotkeys, ActionMap } from "@/components/Editor/MainMenu"
import { ObjectType } from "@/components/Editor/Objects/types"
import GroupComponent from "./Objects/Group/GroupComponent"

// import { Outline, OutlineEffectOptions, OutlineProvider } from "@/components/canvas/Effects/useOutline"

// import { Bloom, , Noise, SMAA, SSAO } from "@react-three/postprocessing"
import { EffectComposer, Outline } from "@/components/Editor/Effects"
import {
  OutlineEffect,
  BlurPass,
  Resolution,
  KernelSize,
  BlendFunction,
  EffectComposer as EffectComposerImpl,
} from "postprocessing"

import BoxComponent from "./Objects/Box"
import { GizmoHelper } from "@/components/Editor/Gizmos/GizmoHelper"
import { GizmoViewport } from "@/components/Editor/Gizmos/GizmoViewport"
import { darkTheme, theme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"
import { LayerMap } from "@/components/Editor/Objects/types"
import { Mesh } from "./Objects/Mesh/Mesh"
import { Group } from "./Objects/Group/Group"
import { useControls } from "./Leva"

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
              ? selectedObject.current.type === ObjectType.GROUP
                ? [...selectedObject.current.children]
                : [selectedObject.current]
              : undefined
          }
          blur
          //@ts-ignore
          ref={outlineRef}
        />
        {/* <Noise opacity={0.1} /> */}
        {/* <Bloom
          intensity={1.0}
          // width={Resolution.AUTO_SIZE}
          // height={Resolution.AUTO_SIZE}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.025}
        /> */}
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
  const transformType = useEditor((state) => state.transformType)

  const three = useThree()

  useEffect(() => {
    three.raycaster.layers.enableAll()
  }, [three.raycaster])

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
        },
      },
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
        if (event.target.mode === "translate" && objectPropertiesStore.getData()["position"]) {
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
        if (event.target.mode === "scale" && objectPropertiesStore.getData()["scale"]) {
          const { x, y, z } = objectPropertiesStore.get("scale")
          if (!selectedObject.current) {
            return
          }
          if (
            selectedObject.current.scale.x !== x ||
            selectedObject.current.scale.y !== y ||
            selectedObject.current.scale.z !== z
          ) {
            objectPropertiesStore.setValueAtPath(
              "scale",
              {
                x: selectedObject.current.scale.x,
                y: selectedObject.current.scale.y,
                z: selectedObject.current.scale.z,
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
      // controlValue.layers.enable(LayerMap.TRANSFORM_CONTROLS)
      useEditor.setState({ orbitControls: controlValue })
      // dom.current.style['touch-action'] = 'none'
      const camera = controlValue.object as PerspectiveCameraImpl
      camera.layers.enableAll()
      // camera.layers.enable(LayerMap.TRANSFORM_CONTROLS)
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
          mode={transformType}
          renderOrder={1}
          // layers={LayerMap.TRANSFORM_CONTROLS}
          name='transform-controls'
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

  const x = useEditor((state) => state.orientationHelperMarginX)

  return (
    <GizmoHelper
      // autoClear={false}
      alignment='bottom-left'
      margin={[x, 80]}
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
  const colors = useEditor((state) => state.colors)

  useEffect(() => {
    const unsub = useTheme.subscribe(
      (store) => store.theme,
      (theme) => {
        if (EditorColorMap.has(theme)) {
          useEditor.setState({ colors: EditorColorMap.get(theme) })
        }
      },
      {
        fireImmediately: true,
      }
    )
    return unsub
  }, [])

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
    Object.assign(window, { useEditor, darkTheme, theme, Color })
    setTimeout(() => {
      console.clear()
    }, 500)
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
        // alpha: false,
      }}
      style={{ backgroundColor: `#${colors.canvasBackground.getHexString()}` }}
      onPointerMissed={(e) => {
        useEditor.getState().signals.pointerMissed.dispatch()
        e.stopPropagation()
      }}
    >
      <OrientationGizmo />
      <Controls />
      <Suspense fallback={null}>
        <Lights />
        <fog attach='fog' args={[colors.fog.getHex(), 0, 60]} />
      </Suspense>
      <Floor
        size={100}
        segments={100}
        primary={colors.floorPrimary.getHex()}
        secondary={colors.floorSecondary.getHex()}
      />
      <Ground color={colors.ground.getHex()} size={100} segments={100} />
      {Object.entries(sources).map(([id, source]) => (
        <primitive
          key={id}
          object={source}
          onClick={(e) => {
            useEditor.getState().signals.objectSelected.dispatch(source)
            e.stopPropagation()
          }}
        />
      ))}

      {Object.entries(receivers).map(([id, receiver]) => (
        <primitive
          key={id}
          object={receiver}
          onClick={(e) => {
            useEditor.setState({ selectedObject: { current: receiver } })
            e.stopPropagation()
          }}
        />
      ))}
      {Object.entries(meshes).map(([id, mesh]) =>
        mesh.type === ObjectType.GROUP ? (
          <GroupComponent key={id} item={mesh as Group} />
        ) : (
          <MeshComponent key={id} item={mesh as Mesh} />
        )
      )}
      <Shadows />

      <Effects />
    </Canvas>
  )
}

export default Editor
