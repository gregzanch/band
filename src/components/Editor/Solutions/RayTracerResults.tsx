import { RayTracer } from "@/solvers";

export type RayTracerResultsProps = {
  raytracer: RayTracer;
};

export function RayTracerResults({ raytracer }: RayTracerResultsProps) {
  return <></>;
  return <primitive object={raytracer.rayPathBuffers.bufferAttribute} />;
}
