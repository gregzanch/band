import { GizmoHelper } from "@/components/Editor/Gizmos/GizmoHelper";
import { GizmoViewport } from "@/components/Editor/Gizmos/GizmoViewport";
import { useThree } from "@react-three/fiber";
import useEditor from "@/components/Editor/State/useEditor";

export function OrientationGizmo() {
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
