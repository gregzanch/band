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
    // this.editor.getState().signals.objectAdded.dispatch(this.object);
  }

  undo() {
    // this.editor.getState().signals.objectRemoved.dispatch(this.object);
  }

  toJSON() {
    const output = super.toJSON();
    // output.solver = this.solver.toJSON();
    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);
  }
}
