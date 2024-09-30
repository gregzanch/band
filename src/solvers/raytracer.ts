import { Source, Receiver, BandObject } from "@/components/Editor/Objects";
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

/**
 * RayTracer solver
 */
export class RayTracer extends Solver {
  /** Sources to use for raytracing */
  sources: Set<Source>;
  /** Receivers to collect data */
  receivers: Set<Receiver>;
  /** All objects that can be intersected */
  intersectableObjects: Set<BandObject>;

  /** Constructs a new RayTracer instance */
  constructor(name: string, params: Partial<RayTracerParams>) {
    super(name, { ...defaultRayTracerParams, ...params });
  }

  private castRaysForSource(source: Source) {
    // random theta within the sources theta limits (0 to 180)
    const theta = Math.random() * source.theta;

    // random phi within the sources phi limits (0 to 360)
    const phi = Math.random() * source.phi;
  }

  private step() {
    // cast rays for each source
    for (const source of this.sources) {
    }
  }
}
