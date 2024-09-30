import { Solver } from "./solver";
import type { SolverParams } from "./solver";

/** Parameters for the RayTracer solver */
export type RayTracerParams = {
  /**
   * Number of rays cast per update cycle.
   * Defaults to `100`
   */
  passes: number;
  /**
   * Number of reflections per ray path.
   * Defaults to `50`
   */
  reflectionOrder: number;
  /**
   * Length of time each cycle runs in `ms`.
   * Defaults to `5`ms
   */
  updateInterval: number;
} & SolverParams;

/** Default parameters for the RayTracer solver */
export const defaultRayTracerParams: RayTracerParams = {
  passes: 100,
  reflectionOrder: 50,
  updateInterval: 5,
};

export class RayTracer extends Solver {
  constructor(name: string, params: Partial<RayTracerParams>) {
    super(name, { ...defaultRayTracerParams, ...params });
  }
}
