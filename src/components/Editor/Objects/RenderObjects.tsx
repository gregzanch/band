import { useEditor } from "@/components/Editor/State/useEditor";
import { useCallback, useRef } from "react";
import { Source } from "./Source";
import { Receiver } from "./Receiver";

const CAMERA_MOVE_THRESHOLD = 1;

export function RenderObjects() {
  const objects = useEditor((state) => state.objects);
  const pointerDownRef = useRef(null);

  const handleClick = useCallback((e) => {
    // check if the user is panning or orbiting the scene
    const cameraMoved =
      pointerDownRef.current && e.camera.position.distanceToSquared(pointerDownRef.current) > CAMERA_MOVE_THRESHOLD;

    if (!cameraMoved) {
      let sourceOrReceiverClicked = false;
      let clickedObject = e.intersections[0].object;
      for (let i = 0; i < e.intersections.length; i++) {
        const obj = e.intersections[i].object;
        const sourceOrReceiver = [Source, Receiver].some((t) => obj instanceof t);
        if (sourceOrReceiver) {
          sourceOrReceiverClicked = true;
          clickedObject = obj;
          useEditor.getState().signals.objectSelected.dispatch(obj, {
            meta: e.nativeEvent.metaKey,
            shift: e.nativeEvent.shiftKey,
          });
          e.stopPropagation();
          break;
        }
      }
      if (!sourceOrReceiverClicked) {
        useEditor.getState().signals.objectSelected.dispatch(clickedObject, {
          meta: e.nativeEvent.metaKey,
          shift: e.nativeEvent.shiftKey,
        });
        e.stopPropagation();
      }
    }
    pointerDownRef.current = null;
  }, []);

  return (
    <>
      {Object.entries(objects).map(([id, object]) => (
        <primitive
          key={id}
          object={object}
          onPointerDown={(e) => {
            pointerDownRef.current = e.camera.position.clone();
          }}
          onClick={handleClick}
        />
      ))}
    </>
  );
}
