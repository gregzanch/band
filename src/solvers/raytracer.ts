import { Source, Receiver, BandObject, ObjectType } from "@/components/Editor/Objects";
import { Solver } from "./solver";
import type { SolverParams } from "./solver";
import {
  AlwaysDepth,
  BufferGeometry,
  DynamicDrawUsage,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  NormalBlending,
  Raycaster,
  Vector3,
} from "three";
import { deg2rad, random } from "@/helpers/math";
import { SolverTypes } from "./types";

export type Ray = {
  origin: Vector3;
  direction: Vector3;
};

export type PathSegment = Ray & {
  incidentAngle: number;
  faceNormal: Vector3;
};

export type RayPath = {
  intersectedReceiver: Receiver | null;
  path: PathSegment[];
  source: Source;
};

export type RayPathBuffers = {
  bufferGeometry: BufferGeometry;
  bufferAttribute: Float32BufferAttribute;
  colorBufferAttribute: Float32BufferAttribute;
  rays: LineSegments;
  maxRays: number;
  rayPaths: Map<Source, RayPath[]>;
};

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
export class RayTracer extends Solver<RayTracerParams> {
  /** RayTracer type */
  type: SolverTypes = SolverTypes.RAYTRACER;
  /** Sources to use for raytracing */
  sources: Set<Source>;
  /** Receivers to collect data */
  receivers: Set<Receiver>;
  /** All objects that can be intersected */
  intersectableObjects: BandObject[];

  /** The ray caster that performs intersecion checks */
  raycaster: Raycaster;

  /** Contains the information for visualizing ray paths */
  rayPathBuffers: RayPathBuffers;

  intervalId: number | null = null;

  /** Constructs a new RayTracer instance */
  constructor(name: string, params: Partial<RayTracerParams> = {}) {
    super(name, { ...defaultRayTracerParams, ...params });
    this.raycaster = new Raycaster();
    this.sources = new Set();
    this.receivers = new Set();
    this.intersectableObjects = [];
    this.rayPathBuffers = this.initializeRayPathBuffers();
    this.step = this.step.bind(this);
  }

  /**
   * `initializeRayPathBuffers` sets up the data structure for visualizing ray paths
   * @returns {RayPathBuffers} the ray path buffer struct
   */
  private initializeRayPathBuffers(): RayPathBuffers {
    const bufferGeometry = new BufferGeometry();
    bufferGeometry.name = "raytracer-ray-buffer-geometry";
    const maxRays = 1e6 - 1;
    const bufferAttribute = new Float32BufferAttribute(new Float32Array(maxRays), 3);
    bufferAttribute.setUsage(DynamicDrawUsage);
    bufferGeometry.setAttribute("position", bufferAttribute);
    bufferGeometry.setDrawRange(0, maxRays);
    const colorBufferAttribute = new Float32BufferAttribute(new Float32Array(maxRays), 2);
    colorBufferAttribute.setUsage(DynamicDrawUsage);
    bufferGeometry.setAttribute("color", colorBufferAttribute);
    const rays = new LineSegments(
      bufferGeometry,
      new LineBasicMaterial({
        fog: false,
        color: 0x282929,
        transparent: true,
        opacity: 0.2,
        premultipliedAlpha: true,
        blending: NormalBlending,
        depthFunc: AlwaysDepth,
        name: "raytracer-rays-material",
      })
    );
    rays.renderOrder = -0.5;
    rays.frustumCulled = false;

    return {
      maxRays,
      bufferAttribute,
      bufferGeometry,
      colorBufferAttribute,
      rays,
      rayPaths: new Map(),
    };
  }

  /**
   * `getRandomRayDirection` calculates a random ray direction from a source.
   * The ray lies within the sources `theta` and `phi` constraints
   * @param {Source} source the source to calculate the random ray from
   * @returns {Vector3} random ray direction
   */
  private getRandomRayDirection(source: Source): Vector3 {
    const theta = deg2rad(source.theta) * random(); // random theta
    const phi = deg2rad(source.phi) * random(); // random phi
    const direction = new Vector3().setFromSphericalCoords(1, phi, theta);
    direction.applyEuler(source.rotation);
    return direction;
  }

  private traceRayForSource(source: Source, ray: Ray, path: PathSegment[] = [], depth: number = 1): RayPath | null {
    // end condition
    if (depth >= this.params.reflectionOrder) return null;

    // set the ray caster parameters
    this.raycaster.ray.origin = ray.origin;
    this.raycaster.ray.direction = ray.direction;

    // find the intersections
    const intersections = this.raycaster.intersectObjects(this.intersectableObjects);

    // return if no objects were intersected
    if (intersections.length == 0) return null;

    // pull out the first intersection
    const intersection = intersections[0];

    const { object, face, distance, faceIndex, point } = intersection;
    // debugger;
    if (!face || faceIndex === undefined) return null;
    // continue recursing if no receiver was intersected
    if (intersection.object.type !== ObjectType.RECEIVER) {
      // find the incident angle
      const incidentAngle = ray.direction.clone().multiplyScalar(-1).angleTo(face.normal);
      const pathSegment: PathSegment = {
        direction: ray.direction,
        faceNormal: face.normal,
        incidentAngle,
        origin: point,
      };
      path.push(pathSegment);

      // get the normal direction of the intersection
      const normal = face.normal.normalize();

      // find the reflected direction
      const reflectedRayDirection = ray.direction
        .clone()
        .sub(normal.clone().multiplyScalar(ray.direction.dot(normal)).multiplyScalar(2));

      // TODO implement scattering
      return this.traceRayForSource(
        source,
        { direction: reflectedRayDirection, origin: point.clone().addScaledVector(normal.clone(), 0.01) },
        path,
        depth + 1
      );
    }

    // valid full path for ray
    return {
      path,
      source,
      intersectedReceiver: object as Receiver,
    };
  }

  private getRayPath(source: Source): RayPath | null {
    const origin = source.position;
    const direction = this.getRandomRayDirection(source).normalize();
    const path = this.traceRayForSource(source, { origin, direction });
    return path;
  }

  private step() {
    // cast rays for each source
    const rayPaths = this.rayPathBuffers.rayPaths;
    for (const source of this.sources) {
      const rayPath = this.getRayPath(source);
      if (rayPath === null) return;
      if (rayPaths.has(source)) {
        rayPaths.set(source, rayPaths.get(source).concat(rayPath));
      } else {
        rayPaths.set(source, [rayPath]);
      }
    }
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = window.setInterval(this.step, this.params.updateInterval);
    }
  }

  stop() {
    if (this.intervalId !== null) window.clearInterval(this.intervalId);
  }

  clearRays() {
    // TODO
  }
}
