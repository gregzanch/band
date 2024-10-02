import { nanoid } from "nanoid";
import { SolverTypes } from "./types";

export type SolverParams = {};

export enum SolverUpdateKeys {
  ID = "id",
  NAME = "name",
}

export type SolverUpdateKeyType = {
  [SolverUpdateKeys.ID]: string;
  [SolverUpdateKeys.NAME]: string;
};

/**
 * Solver is an abstraction over any generic solver
 */
export class Solver<T extends SolverParams = SolverParams> {
  /** type of solver */
  public type: SolverTypes;
  /** unique nanoid */
  public id: SolverUpdateKeyType[SolverUpdateKeys.ID];
  /** solver name */
  public name: SolverUpdateKeyType[SolverUpdateKeys.NAME];
  /** solver parameters. Unique to each solver */
  public params: T;
  public updateSymbol: Symbol;
  /**
   * Constructs a new solver instance
   * @param params
   */
  constructor(name: string, params: T) {
    this.id = nanoid();
    this.name = name;
    this.params = params;
    this.updateSymbol = Symbol();
  }
  update<T extends SolverUpdateKeys>(key: T, value: SolverUpdateKeyType[T]) {
    switch (key) {
      case SolverUpdateKeys.ID:
        this.id = value;
      case SolverUpdateKeys.NAME:
        this.name = value;
      default:
        break;
    }
    this.updateSymbol = Symbol();
  }
  save() {}
  restore() {}
  dispose() {}
}

export default Solver;
