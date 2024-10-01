import useEditor from "@/components/Editor/State/useEditor";
import { RayTracer, SolverTypes } from "@/solvers";
import { RayTracerResults } from "./RayTracerResults";

export function RenderSolutions() {
  const solvers = useEditor(
    (state) => state.solvers,
    (solvers, newSolvers) => {
      const oldIds = new Set(Object.keys(solvers));
      const newIds = new Set(Object.keys(newSolvers));
      return oldIds.difference(newIds).size == 0;
    }
  );

  return (
    <>
      {Object.keys(solvers).map((id) => {
        const solver = solvers[id];
        switch (solver.type) {
          case SolverTypes.RAYTRACER:
            return <RayTracerResults raytracer={solver as RayTracer} />;
          default:
            return <></>;
        }
      })}
    </>
  );
}
