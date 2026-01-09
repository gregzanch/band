import { Mesh, Source, Receiver } from "@/components/Editor/Objects";
import { NotImplementedError, Solver, SolverConfig } from "@/solvers/Solver";
import { Effect, Data } from "effect";


export type Intersection = {
  // need to know the surface properties like absorption and diffusion
  surface: Mesh;
  // need the incident angle to calculate adjusted absorption
  incidentAngle: number;
}

export type Path = {
  // who shot the ray
  source: Source;
  // who caught it
  receiver: Receiver;
  // who did it hit along the way
  intersections: Intersection[];
};
export class RayTracerError extends Data.TaggedError("RayTracerError")<{
  message: string;
}> {}

export interface RayTracerSolverConfig extends SolverConfig {
  maxOrder: number;
  rayCount: number;
  outputName: string;
  stepsPerIteration: number;
}

export class RayTracerSolver extends Solver<RayTracerSolverConfig> {
  type = "RayTracerSolver"
  private localSolveStep() {
    // iterate over all sources
    // get random direction for ray within in theta, phi limit
    // apply sources rotation to the ray direction
    // trace ray against our scene, with maxOrder, return path of intersected objects or null
    // if not null, add path to valid paths list
  }

  private localSolve() {
    const self = this;
    return Effect.gen(function* () {
      // For now, simulate progress
      const { rayCount, stepsPerIteration } = self.config;
      const totalPasses = Math.ceil(rayCount / stepsPerIteration);
      const stepCountRemainder = rayCount % stepsPerIteration;

      for (let i = 0; i < totalPasses; i++) {
        // how far done are we?
        const progress = (i + 1) / totalPasses;
        const isLastIteration = i === totalPasses - 1;
        const stepCount = isLastIteration && stepCountRemainder !== 0 ? stepCountRemainder : stepsPerIteration;

        // do this passes steps
        for (let j = 0; j < stepCount; j++) {
          self.localSolveStep();
        }

        self.progressCallbacks.progress.forEach((cb) => cb({ type: "progress", time: Date.now(), progress }));

        // Simulate work
        yield* Effect.sleep(100);
      }
    });
  }

  private workerSolve() {
    return Effect.gen(function* () {
      // for this we will link our progress callbacks with the incomming data from worker
      yield* Effect.fail(new NotImplementedError({ message: "need to implement workerSolve()" }));
    });
  }

  private cloudSolve() {
    return Effect.gen(function* () {
      // for this we will link our progress callbacks with the incomming websocket data
      yield* Effect.fail(new NotImplementedError({ message: "need to implement cloudSolve()" }));
    });
  }

  start() {
    const self = this;
    return Effect.gen(function* () {
      // Emit start event
      const startTime = Date.now();
      self.progressCallbacks.start.forEach((cb) => cb({ type: "start", time: startTime }));

      // Validate configuration
      if (!self.config) {
        yield* Effect.fail(
          new RayTracerError({
            message: "Configuration not set. Call setConfig() before start().",
          })
        );
      }

      const { maxOrder, rayCount } = self.config;

      if (maxOrder <= 0) {
        yield* Effect.fail(
          new RayTracerError({
            message: "max_order must be greater than 0",
          })
        );
      }

      if (rayCount <= 0) {
        yield* Effect.fail(
          new RayTracerError({
            message: "ray_count must be greater than 0",
          })
        );
      }

      // TODO: Implement actual ray tracing logic based on location

      switch (self.location) {
        case "local":
          yield* self.localSolve();
          break;
        case "worker":
          yield* self.workerSolve();
          break;
        case "cloud":
          yield* self.cloudSolve();
          break;
        default:
          break;
      }

      // Emit end event
      const endTime = Date.now();
      self.progressCallbacks.end.forEach((cb) => cb({ type: "end", time: endTime }));

      return true;
    });
  }
}
