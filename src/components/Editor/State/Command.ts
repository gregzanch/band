import { nanoid } from "nanoid";
import { CommandType } from "./Commands/types";
import type { Editor } from "./useEditor";

/**
 * Commands to execute that get stored in history
 */
export class Command {
  /** unique id */
  id: string;
  /** type of command */
  type: CommandType;
  /** the name of the command that will appear in the history */
  name: string = "Untitled Command";
  /** Editor state */
  editor: Editor;

  inMemory: boolean;
  updatable: boolean;

  /** constructs a new command object */
  constructor(editor: Editor) {
    this.id = nanoid();
    this.inMemory = false;
    this.updatable = false;
    this.editor = editor;
  }

  toJSON() {
    const output = {
      type: this.type,
      id: this.id,
      name: this.name,
    } as Record<string, any>;

    return output;
  }

  fromJSON(json) {
    this.inMemory = true;
    this.type = json.type;
    this.id = json.id;
    this.name = json.name;
  }
}
