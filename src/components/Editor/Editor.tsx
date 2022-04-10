import hotkeys from "hotkeys-js"
import { useRef, useEffect, Suspense } from "react"
import { OrbitControls, TransformControls, softShadows, Stats } from "@react-three/drei"
import { Floor, Lights, Ground, Shadows } from "@/components/Editor/Overlays"

import { PerspectiveCamera as PerspectiveCameraImpl, Color } from "three"
import { Canvas, useThree } from "@react-three/fiber"

import useEditor, { EditorColorMap } from "@/components/Editor/State/useEditor"

import { cameraPropertiesStore } from "@/components/Editor/Properties/CameraProperties"
import { objectPropertiesStore } from "@/components/Editor/Properties/ObjectProperties"

import { useHotkeys } from "react-hotkeys-hook"

import { MenuHotkeys, ActionMap } from "@/components/Editor/MainMenu"
import { ObjectType } from "@/components/Editor/Objects/types"

import { EffectComposer, Outline } from "@/components/Editor/Effects"
import { OutlineEffect, BlendFunction, EffectComposer as EffectComposerImpl } from "postprocessing"

import { GizmoHelper } from "@/components/Editor/Gizmos/GizmoHelper"
import { GizmoViewport } from "@/components/Editor/Gizmos/GizmoViewport"
import { darkTheme, theme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"
import { useControls } from "./Leva"

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
        label: "fov",
        hint: "Field of View",
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
          name='transform-controls'
          showX
          showY
          showZ
          object={selectedObject}
        />
      )}
      <OrbitControls ref={control} enableDamping={false} makeDefault />
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

  const objects = useEditor((state) => state.objects)
  const debug = useEditor((state) => state.debug)

  const { fogDistance } = useControls(
    {
      fogDistance: {
        label: "fog",
        value: 75,
        step: 1,
      },
    },
    { store: cameraPropertiesStore }
  )

  return (
    <Canvas
      mode='concurrent'
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        stencil: true,
      }}
      style={{ backgroundColor: `#${colors.canvasBackground.getHexString()}` }}
      onPointerMissed={(e) => {
        // useEditor.getState().signals.pointerMissed.dispatch()
        const { transformControls } = useEditor.getState()
        if (transformControls && transformControls.enabled) {
          transformControls.enabled = false
          transformControls.visible = false
        } else {
          useEditor.setState({ selectedObject: null })
        }
        e.stopPropagation()
      }}
    >
      <OrientationGizmo />
      <Controls />
      <Suspense fallback={null}>
        <Lights />
        <fog attach='fog' args={[colors.fog.getHex(), 0, fogDistance]} />
      </Suspense>
      <Floor
        size={100}
        segments={100}
        primary={colors.floorPrimary.getHex()}
        secondary={colors.floorSecondary.getHex()}
      />
      <Ground color={colors.ground.getHex()} size={100} segments={100} />

      {Object.entries(objects).map(([id, object]) => (
        <primitive
          key={id}
          object={object}
          onClick={(e) => {
            useEditor.getState().signals.objectSelected.dispatch(object)
            e.stopPropagation()
          }}
          onDoubleClick={(e) => {
            if (object.type === ObjectType.GROUP) {
              useEditor.getState().signals.objectSelected.dispatch(e.object)
              e.stopPropagation()
            }
          }}
        />
      ))}

      <Shadows />

      <Effects />
      {debug && <Stats className='editor-stats' />}
    </Canvas>
  )
}

export default Editor
