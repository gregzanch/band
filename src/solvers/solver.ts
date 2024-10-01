import { nanoid } from "nanoid";
import { SolverTypes } from "./types";

export type SolverParams = {};

/**
 * Solver is an abstraction over any generic solver
 */
export class Solver<T extends SolverParams = SolverParams> {
  /** type of solver */
  public type: SolverTypes;
  /** unique nanoid */
  public id: string;
  /** solver name */
  public name: string;
  /** solver parameters. Unique to each solver */
  public params: T;
  /**
   * Constructs a new solver instance
   * @param params
   */
  constructor(name: string, params: T) {
    this.id = nanoid();
    this.name = name;
    this.params = params;
  }
  save() {}
  restore() {}
  dispose() {}
}

export default Solver;
