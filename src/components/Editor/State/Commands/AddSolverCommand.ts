import { Command } from "../Command";
import { Editor } from "../useEditor";
import { CommandType } from "./types";
import { Solver } from "@/solvers";

/**
 * `AddSolverCommand` is the command that handles adding a new solver to the editor state
 */
export class AddSolverCommand extends Command {
  type: CommandType = CommandType.AddSolverCommand;
  solver: Solver;
  constructor(editor: Editor, solver: Solver) {
    super(editor);
    this.solver = solver;
    this.name = `Add Solver: ${solver.name}`;
  }

  execute() {
    this.editor.getState().signals.solverAdded.dispatch(this.solver);
  }

  undo() {
    this.editor.getState().signals.solverRemoved.dispatch(this.solver);
  }

  toJSON() {
    const output = super.toJSON();
    // TODO implement solver to json
    // output.solver = this.solver.toJSON();
    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);
  }
}
