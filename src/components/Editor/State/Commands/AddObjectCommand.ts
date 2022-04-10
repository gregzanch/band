//@ts-nocheck
import { Command } from "../Command"
import { Editor } from "../useEditor"
import { CommandType } from "./types"
import { ObjectType } from "../../Objects/types"

class AddObjectCommand extends Command {
  constructor(editor: Editor, object) {
    super(editor)

    this.type = CommandType.AddObjectCommand

    this.object = object
    if (object !== undefined) {
      this.name = `Add Object: ${object.name}`
    }
  }

  execute() {
    // this.editor.addObject(this.object)
    this.editor.getState().signals.objectAdded.dispatch(this.object)
    // this.editor.select(this.object)
  }

  undo() {
    this.editor.getState().signals.objectRemoved.dispatch(this.object)
    // switch (this.object.type) {
    //   case ObjectType.SOURCE:
    //     this.editor.getState().signals.objectRemoved.dispatch(this.object)
    //     break
    //   case ObjectType.RECEIVER:
    //     this.editor.getState().signals.receiverRemoved.dispatch(this.object)
    //     break
    // }
    // this.editor.removeObject(this.object)
    // this.editor.deselect()
  }

  toJSON() {
    const output = super.toJSON(this)

    output.object = this.object.toJSON()

    return output
  }

  fromJSON(json) {
    super.fromJSON(json)

    // this.object = this.editor.objectByUuid(json.object.object.uuid)

    // if (this.object === undefined) {
    //   const loader = new ObjectLoader()
    //   this.object = loader.parse(json.object)
    // }
  }
}

export { AddObjectCommand }
