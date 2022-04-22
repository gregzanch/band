import hotkeys from "hotkeys-js"
import { useRef, useEffect, Suspense } from "react"
import { OrbitControls, TransformControls, softShadows, Stats } from "@react-three/drei"
import { Floor, Lights, Ground, Shadows } from "@/components/Editor/Overlays"

import { PerspectiveCamera as PerspectiveCameraImpl, Color, Vector3, Euler } from "three"
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
import { SetPositionCommand } from "./State/Commands/SetPositionCommand"
import { SetRotationCommand } from "./State/Commands/SetRotationCommand"
import { SetScaleCommand } from "./State/Commands/SetScaleCommand"
import { AddObjectCommand } from "./State/Commands/AddObjectCommand"
import { Source } from "./Objects/Source/Source"
import { Receiver } from "./Objects/Receiver/Receiver"
import { BandObject } from "./Objects"
import { Group } from "./Objects/Group/Group"
import { Mesh } from "./Objects/Mesh/Mesh"
import { makeLoopedArray } from "@/helpers/array";

const CAMERA_MOVE_THRESHOLD = 1;

function isBandObject(obj: any): obj is BandObject {
  return [Group, Mesh, Receiver, Source].some((ObjClass) => obj instanceof ObjClass);
}

function unwrapSelection(selection: BandObject[]): BandObject[] {
  return selection.reduce((acc, curr) => {
    if (curr.type === ObjectType.GROUP) {
      //@ts-ignore
      return [...acc, ...unwrapSelection(curr.children.filter((child) => isBandObject(child)))];
    } else {
      return [...acc, curr];
    }
  }, []);
}

function Effects() {
  const outlineRef = useRef<OutlineEffect>();
  const composerRef = useRef<EffectComposerImpl>();
  const { gl, camera, scene } = useThree();
  // const selectedObject = useEditor((state) => state.selectedObject)
  const selection = useEditor((state) => state.selection);

  return (
    <Suspense fallback={null}>
      <EffectComposer ref={composerRef} autoClear={false} enabled camera={camera} scene={scene} multisampling={8}>
        <Outline
          edgeStrength={5}
          blendFunction={BlendFunction.ALPHA}
          pulseSpeed={0.0}
          visibleEdgeColor={0xffcc00}
          hiddenEdgeColor={0xffcc00}
          selection={selection.length > 0 ? unwrapSelection(selection) : undefined}
          blur
          //@ts-ignore
          ref={outlineRef}
        />
      </EffectComposer>
    </Suspense>
  );
}

const Controls = () => {
  const control = useRef(null);
  const transformControls = useRef(null);
  const selection = useEditor((state) => state.selection);
  const transformType = useEditor((state) => state.transformType);
  const resetSymbol = useEditor((state) => state.resetSymbol);

  const three = useThree();

  useEffect(() => {
    three.raycaster.layers.enableAll();
  }, [three.raycaster]);

  useEffect(() => {
    useEditor.setState({
      scene: three.scene,
      transformControls: transformControls.current,
      orbitControls: control.current,
    });
  }, [three.scene, resetSymbol]);

  useControls(
    {
      fov: {
        label: "fov",
        hint: "Field of View",
        value: 50,

        onChange: (value) => {
          // @ts-ignore
          control?.current.object.fov = value;
          control?.current.object.updateProjectionMatrix();
        },
      },
    },
    { store: cameraPropertiesStore }
  );

  useEffect(() => {
    if (transformControls.current) {
      transformControls.current.enabled = false;
      transformControls.current.visible = false;
      useEditor.setState({ transformControls: transformControls.current });
      const { current: controls } = transformControls;

      const changeCallback = (event) => {
        if (event.target.mode === "translate" && objectPropertiesStore.getData()["position"]) {
          const { x, y, z } = objectPropertiesStore.get("position");
          if (selection.length === 0) {
            return;
          }
          if (
            selection[selection.length - 1].position.x !== x ||
            selection[selection.length - 1].position.y !== y ||
            selection[selection.length - 1].position.z !== z
          ) {
            objectPropertiesStore.setValueAtPath(
              "position",
              {
                x: selection[selection.length - 1].position.x,
                y: selection[selection.length - 1].position.y,
                z: selection[selection.length - 1].position.z,
              },
              false
            );
          }
        }
        if (event.target.mode === "scale" && objectPropertiesStore.getData()["scale"]) {
          const { x, y, z } = objectPropertiesStore.get("scale");
          if (selection.length === 0) {
            return;
          }
          if (
            selection[selection.length - 1].scale.x !== x ||
            selection[selection.length - 1].scale.y !== y ||
            selection[selection.length - 1].scale.z !== z
          ) {
            objectPropertiesStore.setValueAtPath(
              "scale",
              {
                x: selection[selection.length - 1].scale.x,
                y: selection[selection.length - 1].scale.y,
                z: selection[selection.length - 1].scale.z,
              },
              false
            );
          }
        }
      };

      const callback = (event) => {
        control.current.enabled = !event.value;
      };

      let objectPositionOnDown: Vector3;
      let objectRotationOnDown: Euler;
      let objectScaleOnDown: Vector3;

      const handleMouseDown = () => {
        const object = controls.object;
        objectPositionOnDown = object.position.clone();
        objectRotationOnDown = object.rotation.clone();
        objectScaleOnDown = object.scale.clone();
      };

      const handleMouseUp = () => {
        const object = controls.object;
        if (object !== undefined) {
          switch (controls.getMode()) {
            case "translate":
              if (!objectPositionOnDown.equals(object.position)) {
                useEditor
                  .getState()
                  .history.execute(new SetPositionCommand(useEditor, object, object.position, objectPositionOnDown));
              }
              break;
            case "rotate":
              if (!objectRotationOnDown.equals(object.rotation)) {
                useEditor
                  .getState()
                  .history.execute(new SetRotationCommand(useEditor, object, object.rotation, objectRotationOnDown));
              }
              break;
            case "scale":
              if (!objectScaleOnDown.equals(object.scale)) {
                useEditor
                  .getState()
                  .history.execute(new SetScaleCommand(useEditor, object, object.scale, objectScaleOnDown));
              }
              break;
          }
        }
      };

      controls.addEventListener("mouseDown", handleMouseDown);
      controls.addEventListener("mouseUp", handleMouseUp);
      controls.addEventListener("objectChange", changeCallback);
      controls.addEventListener("dragging-changed", callback);
      return () => {
        controls.removeEventListener("mouseDown", handleMouseDown);
        controls.removeEventListener("mouseUp", handleMouseUp);
        controls.removeEventListener("objectChange", changeCallback);
        controls.removeEventListener("dragging-changed", callback);
      };
    }
  }, [selection]);

  useEffect(() => {
    const controlValue = control?.current;
    const onEnd = ({ target }) => {
      const camera = target.object as PerspectiveCameraImpl;
      useEditor.setState({ cameraMatrix: camera.matrix.toArray() });
      const newFogDistance = Math.max(camera.position.length() * 2, 75);
      const currentFogDistance = cameraPropertiesStore.get("fogDistance");
      if (currentFogDistance !== newFogDistance) {
        cameraPropertiesStore.setValueAtPath("fogDistance", newFogDistance, true);
      }
    };
    if (controlValue) {
      // controlValue.layers.enable(LayerMap.TRANSFORM_CONTROLS)
      useEditor.setState({ orbitControls: controlValue });
      // dom.current.style['touch-action'] = 'none'
      const camera = controlValue.object as PerspectiveCameraImpl;
      camera.layers.enableAll();
      // camera.layers.enable(LayerMap.TRANSFORM_CONTROLS)
      const matrix = useEditor.getState().cameraMatrix;
      camera.matrix.fromArray(matrix);
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
      controlValue.addEventListener("end", onEnd);
    }
    return () => {
      controlValue.removeEventListener("end", onEnd);
    };
  }, [control]);

  return (
    <>
      {selection.length > 0 && (
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
          object={{ current: selection[selection.length - 1] }}
        />
      )}
      <OrbitControls ref={control} enableDamping={false} makeDefault />
    </>
  );
};

function OrientationGizmo() {
  const { camera } = useThree();

  const x = useEditor((state) => state.orientationHelperMarginX);

  return (
    <GizmoHelper
      // autoClear={false}
      alignment='bottom-left'
      margin={[x, 80]}
      renderPriority={2}
      castShadow={false}
      onUpdate={() => {
        camera.up.set(0, 1, 0);
      }}
    >
      <GizmoViewport axisColors={["#ED3D59", "#80AF00", "#488FEA"]} labelColor='black' />
    </GizmoHelper>
  );
}

// TODO: Soft shadows are expensive, uncomment and refresh when it's too slow
// softShadows()

function Editor(props) {
  const colors = useEditor((state) => state.colors);

  useEffect(() => {
    const unsub = useTheme.subscribe(
      (store) => store.theme,
      (theme) => {
        if (EditorColorMap.has(theme)) {
          // TODO change wireframe color?
          useEditor.setState({ colors: EditorColorMap.get(theme) });
        }
      },
      {
        fireImmediately: true,
      }
    );
    return unsub;
  }, []);

  useHotkeys("esc", () => {
    const { transformControls, materialDialogOpen } = useEditor.getState();
    if (transformControls && transformControls.enabled) {
      transformControls.enabled = false;
      transformControls.visible = false;
    } else if (!materialDialogOpen) {
      useEditor.setState({ selection: [] });
    }
  });

  useHotkeys("m", (keyboardEvent, hotkeysEvent) => {
    // console.log(keyboardEvent, hotkeysEvent)
    const { transformControls } = useEditor.getState();
    if (transformControls) {
      transformControls.enabled = true;
      transformControls.visible = true;
    }
  });

  useEffect(() => {
    Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
      hotkeys(hotkey, () => {
        if (ActionMap[action]) {
          ActionMap[action]();
          return false;
        }
      });
    });

    return () => {
      Object.entries(MenuHotkeys).forEach(([action, hotkey]) => {
        if (ActionMap[action]) {
          hotkeys.unbind(hotkey, ActionMap[action]);
        }
      });
    };
  }, []);

  useEffect(() => {
    Object.assign(window, { useEditor, darkTheme, theme, Color, Vector3 });
    setTimeout(() => {
      console.clear();
      const { initialize, uploadFileFromUrl, history } = useEditor.getState();
      initialize();
      uploadFileFromUrl("models/raya/split-strange.gltf");
      history.execute(
        new AddObjectCommand(
          useEditor,
          new Source("New Source", [-2.15, 1.85, -5.5], 0x44a273).addToDefaultScene(useEditor)
        )
      );
      const rec = new Receiver("New Receiver", [7.4, 2.87, -10.2], 0xe5732a).addToDefaultScene(useEditor);
      rec.scale.set(0.5, 0.5, 0.5);
      history.execute(new AddObjectCommand(useEditor, rec));

      // const matIds = makeLoopedArray([147, 401, 285, 376, 472, 600]);
      const matIds = makeLoopedArray([
        147, 401, 37, 376, 472, 600, 31, 401, 420, 376, 472, 600, 285, 285, 472, 376, 523, 523, 523,
      ]);
      fetch("/api/materials/getAll")
        .then((res) => res.json())
        .then((res) => {
          const group = Object.values(useEditor.getState().objects).find((item) => item.type === "Group");
          for (const child of group.children) {
            (child as Mesh).acousticMaterial = res[matIds.next().value - 1];
          }
        })
        .catch(console.error);
    }, 500);
  }, []);

  const objects = useEditor((state) => state.objects);
  const debug = useEditor((state) => state.debug);

  const { fogDistance } = useControls(
    {
      fogDistance: {
        label: "fog",
        value: 75,
        step: 1,
      },
    },
    { store: cameraPropertiesStore }
  );

  const pointerDownRef = useRef(null);

  return (
    <Canvas
      mode='concurrent'
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        stencil: true,
      }}
      style={{ backgroundColor: `#${colors.canvasBackground.getHexString()}`, userSelect: "none" }}
      onPointerMissed={(e) => {
        // useEditor.getState().signals.pointerMissed.dispatch()
        const { transformControls } = useEditor.getState();
        if (transformControls && transformControls.enabled) {
          transformControls.enabled = false;
          transformControls.visible = false;
        } else {
          // useEditor.setState({ selectedObject: null })
          useEditor.setState((prev) => ({ selection: e.shiftKey ? prev.selection : [] }));
        }
        e.stopPropagation();
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
          onPointerDown={(e) => {
            pointerDownRef.current = e.camera.position.clone();
          }}
          onClick={(e) => {
            const cameraMoved =
              pointerDownRef.current &&
              e.camera.position.distanceToSquared(pointerDownRef.current) > CAMERA_MOVE_THRESHOLD;

            if (!cameraMoved) {
              const obj = e.intersections[0].object;
              useEditor.getState().signals.objectSelected.dispatch(obj, {
                meta: e.nativeEvent.metaKey,
                shift: e.nativeEvent.shiftKey,
              });
              e.stopPropagation();
            }
            pointerDownRef.current = null;
          }}
          onDoubleClick={(e) => {
            const obj = e.intersections[0].object;
            Object.assign(window, { obj });
            console.log(obj);
          }}
        />
      ))}

      <Shadows />

      <Effects />
      {debug && <Stats className='editor-stats' />}
    </Canvas>
  );
}

export default Editor
