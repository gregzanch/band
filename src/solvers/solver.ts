import { nanoid } from "nanoid";

export type SolverParams = {};

/**
 * Solver is an abstraction over any generic solver
 */
export class Solver {
  /** unique nanoid */
  public id: string;
  /** solver name */
  public name: string;
  /** solver parameters. Unique to each solver */
  public params: SolverParams;
  /**
   * Constructs a new solver instance
   * @param params
   */
  constructor(name: string, params: SolverParams = {}) {
    this.id = nanoid();
    this.name = name;
    this.params = params;
  }
  save() {}
  restore() {}
  dispose() {}
}

export default Solver;
