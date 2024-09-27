import { OrbitControls, TransformControls } from "@react-three/drei";
import { useEditor } from "@/components/Editor/State/useEditor";
import { SetPositionCommand, SetScaleCommand, SetRotationCommand } from "@/components/Editor/State/Commands";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useControls } from "@/components/Editor/Leva";
import { cameraPropertiesStore, objectPropertiesStore } from "@/components/Editor/Properties";
import { PerspectiveCamera as PerspectiveCameraImpl, Euler, Vector3 } from "three";

export function Controls() {
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
}
