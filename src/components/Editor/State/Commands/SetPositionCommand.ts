import { Command } from "../Command"
import { Vector3 } from "three"
import { Editor } from "../useEditor"
import { CommandType } from "./types"
import { BandObject } from "../../Objects"

class SetPositionCommand extends Command {
  object: BandObject
  oldPosition: Vector3
  newPosition: Vector3

  constructor(editor: Editor, object: BandObject, newPosition: Vector3, optionalOldPosition?: Vector3) {
    super(editor)

    this.type = CommandType.SetPositionCommand
    this.name = "Set Position"
    this.updatable = true

    this.object = object

    if (object !== undefined && newPosition !== undefined) {
      this.oldPosition = object.position.clone()
      this.newPosition = newPosition.clone()
    }

    if (optionalOldPosition !== undefined) {
      this.oldPosition = optionalOldPosition.clone()
    }
  }

  execute() {
    this.object.position.copy(this.newPosition)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  undo() {
    this.object.position.copy(this.oldPosition)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  update(command) {
    this.newPosition.copy(command.newPosition)
  }

  // toJSON() {
  //   const output = super.toJSON()

  //   // output.objectUuid = this.object.uuid
  //   // output.oldPosition = this.oldPosition.toArray()
  //   // output.newPosition = this.newPosition.toArray()

  //   return output
  // }

  // fromJSON(json) {
  //   super.fromJSON(json)

  //   this.object = this.editor.objectByUuid(json.objectUuid)
  //   this.oldPosition = new Vector3().fromArray(json.oldPosition)
  //   this.newPosition = new Vector3().fromArray(json.newPosition)
  // }
}

export { SetPositionCommand }
