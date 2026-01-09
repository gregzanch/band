import { NotImplementedError, Solver, SolverConfig } from "@/solvers/Solver";
import { Effect, Data } from "effect";

class RayTracerError extends Data.TaggedError("RayTracerError")<{
  message: string;
}> {}

export interface RayTracerSolverConfig extends SolverConfig {
  maxOrder: number;
  rayCount: number;
  outputName: string;
}

export class RayTracerSolver extends Solver<RayTracerSolverConfig> {


  private localSolve() {
    const self = this;
    return Effect.gen(function* () {
      // For now, simulate progress
      const progressSteps = 10;
      for (let i = 1; i <= progressSteps; i++) {
        const percent = (i / progressSteps) * 100;
        self.progressCallbacks.progress.forEach((cb) => cb({ type: "progress", time: Date.now(), percent }));

        // Simulate work
        yield* Effect.sleep(100);
      }
    });
  }

  private workerSolve() {
    return Effect.gen(function* () {
      yield* Effect.fail(new NotImplementedError({ message: "need to implement workerSolve()" }));
    });
  }

  private cloudSolve() {
    return Effect.gen(function* () {
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
