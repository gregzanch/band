import { Mesh, Source, Receiver } from "@/components/Editor/Objects";
import { NotImplementedError, Solver, SolverConfig } from "@/solvers/Solver";
import { Effect, Data } from "effect";
import { Raycaster, Vector3 } from "three";


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
  private raycaster = new Raycaster();
  private validPaths: Path[] = [];

  private localSolveStep() {
    // iterate over all sources
    const sources = Object.values(this.objects).filter((obj): obj is Source => obj.type === "SOURCE");
    const receivers = Object.values(this.objects).filter((obj): obj is Receiver => obj.type === "RECEIVER");
    const meshes = Object.values(this.objects).filter((obj): obj is Mesh => obj.type === "MESH");

    for (const source of sources) {
      // get random direction for ray within theta, phi limit
      const theta = Math.random() * Math.PI * 2; // 0 to 2π (full azimuthal range)
      const phi = Math.random() * Math.PI; // 0 to π (full polar range)

      // convert spherical to cartesian
      const direction = new Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );

      // apply sources rotation to the ray direction
      direction.applyQuaternion(source.quaternion);
      direction.normalize();

      // trace ray against our scene, with maxOrder, return path of intersected objects or null
      const path = this.traceRay(source, direction, meshes, receivers, this.config.maxOrder);

      // if not null, add path to valid paths list
      if (path) {
        this.validPaths.push(path);
      }
    }
  }

  private traceRay(
    source: Source,
    direction: Vector3,
    meshes: Mesh[],
    receivers: Receiver[],
    maxOrder: number
  ): Path | null {
    const intersections: Intersection[] = [];
    let currentPosition = source.position.clone();
    let currentDirection = direction.clone();

    for (let order = 0; order < maxOrder; order++) {
      this.raycaster.set(currentPosition, currentDirection);

      // check for receiver intersection first
      const receiverIntersects = this.raycaster.intersectObjects(receivers, false);

      // check for mesh intersections
      const meshIntersects = this.raycaster.intersectObjects(meshes, false);

      // if we hit a receiver, we have a valid path
      if (receiverIntersects.length > 0 &&
          (meshIntersects.length === 0 || receiverIntersects[0].distance < meshIntersects[0].distance)) {
        return {
          source,
          receiver: receiverIntersects[0].object as Receiver,
          intersections
        };
      }

      // if we hit a mesh, continue tracing
      if (meshIntersects.length > 0) {
        const intersection = meshIntersects[0];
        const mesh = intersection.object as Mesh;

        // calculate incident angle
        const normal = intersection.face?.normal.clone().applyQuaternion(mesh.quaternion).normalize();
        const incidentAngle = normal ? Math.acos(Math.abs(currentDirection.dot(normal))) : 0;

        intersections.push({
          surface: mesh,
          incidentAngle
        });

        // reflect the ray for the next iteration
        if (normal) {
          currentDirection.reflect(normal).normalize();
        }
        currentPosition = intersection.point.clone();

        // offset slightly to avoid self-intersection
        currentPosition.addScaledVector(currentDirection, 0.001);
      } else {
        // ray escaped the scene without hitting a receiver
        return null;
      }
    }

    // exceeded max order without hitting a receiver
    return null;
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
