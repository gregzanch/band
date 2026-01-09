import { BandObject } from "@/components/Editor/Objects";
import { Effect, Exit, Data } from "effect";

export class NotImplementedError extends Data.TaggedError("NotImplementedError")<{
  message: string;
}> {}

class UnknownError extends Data.TaggedError("UnknownError")<{
  message: string;
}> {}

interface ProgressPayload {
  start: {
    type: "start";
    time: number;
  };
  progress: {
    type: "progress";
    time: number;
    progress: number;
  };
  end: {
    type: "end";
    time: number;
  };
  fail: {
    type: "fail";
    time: number;
    reason: string;
  };
  cancel: {
    type: "cancel";
    time: number;
  };
}
type ProgressType = keyof ProgressPayload;
type ProgressCallbacks = {
  [key in ProgressType]: Array<ProgressCallback<key>>;
};

export type ProgressCallback<T extends ProgressType> = (data: ProgressPayload[T]) => void;

export type SolutionLocation = "worker" | "local" | "cloud";

export interface SolverConfig {}

export class Solver<T extends SolverConfig> {
  type = "Solver"
  constructor(location: SolutionLocation = "worker") {
    this._location = location;
  }

  protected _objects: Record<string, BandObject>;
  get objects() {
    return this._objects;
  }
  public setObjects(objects: Record<string, BandObject>): typeof this {
    this._objects = objects;
    return this;
  }

  private _config: T;
  get config() {
    return this._config;
  }
  public setConfig(config: T): typeof this {
    this._config = config;
    return this;
  }

  private _location: SolutionLocation;
  get location() {
    return this._location;
  }

  protected progressCallbacks: ProgressCallbacks = {
    start: [],
    progress: [],
    end: [],
    fail: [],
    cancel: [],
  };
  addProgressCallback<T extends ProgressType>(type: T, callback: ProgressCallback<T>): typeof this {
    this.progressCallbacks[type].push(callback);
    return this;
  }

  start(): Effect.Effect<boolean, any> {
    return Effect.gen(function* () {
      yield* Effect.fail(new NotImplementedError({message: "Solver hasn't implemented the start() function"}));
      return false;
    });
  }
}
