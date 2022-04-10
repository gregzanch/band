import { Command } from "../Command"
import { Vector3 } from "three"
import { Editor } from "../useEditor"
import { CommandType } from "./types"
import { BandObject } from "../../Objects"

class SetScaleCommand extends Command {
  object: BandObject
  oldScale: Vector3
  newScale: Vector3

  constructor(editor: Editor, object: BandObject, newScale: Vector3, optionalOldScale?: Vector3) {
    super(editor)

    this.type = CommandType.SetScaleCommand
    this.name = "Set Scale"
    this.updatable = true

    this.object = object

    if (object !== undefined && newScale !== undefined) {
      this.oldScale = object.scale.clone()
      this.newScale = newScale.clone()
    }

    if (optionalOldScale !== undefined) {
      this.oldScale = optionalOldScale.clone()
    }
  }

  execute() {
    this.object.scale.copy(this.newScale)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  undo() {
    this.object.scale.copy(this.oldScale)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  update(command) {
    this.newScale.copy(command.newScale)
  }

  // toJSON() {

  // 	const output = super.toJSON( this );

  // 	output.objectUuid = this.object.uuid;
  // 	output.oldScale = this.oldScale.toArray();
  // 	output.newScale = this.newScale.toArray();

  // 	return output;

  // }

  // fromJSON( json ) {

  // 	super.fromJSON( json );

  // 	this.object = this.editor.objectByUuid( json.objectUuid );
  // 	this.oldScale = new Vector3().fromArray( json.oldScale );
  // 	this.newScale = new Vector3().fromArray( json.newScale );

  // }
}

export { SetScaleCommand }
