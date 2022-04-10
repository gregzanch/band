import { Command } from "../Command"
import { Euler, Vector3 } from "three"
import { Editor } from "../useEditor"
import { CommandType } from "./types"
import { BandObject } from "../../Objects"

class SetRotationCommand extends Command {
  object: BandObject
  oldRotation: Euler
  newRotation: Euler

  constructor(editor: Editor, object: BandObject, newRotation: Euler, optionalOldRotation?: Euler) {
    super(editor)

    this.type = CommandType.SetRotationCommand
    this.name = "Set Rotation"
    this.updatable = true

    this.object = object

    if (object !== undefined && newRotation !== undefined) {
      this.oldRotation = object.rotation.clone()
      this.newRotation = newRotation.clone()
    }

    if (optionalOldRotation !== undefined) {
      this.oldRotation = optionalOldRotation.clone()
    }
  }

  execute() {
    this.object.rotation.copy(this.newRotation)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  undo() {
    this.object.rotation.copy(this.oldRotation)
    this.object.updateMatrixWorld(true)
    this.editor.getState().signals.objectChanged.dispatch(this.object)
  }

  update(command) {
    this.newRotation.copy(command.newRotation)
  }

  // toJSON() {

  // 	const output = super.toJSON( this );

  // 	output.objectUuid = this.object.uuid;
  // 	output.oldRotation = this.oldRotation.toArray();
  // 	output.newRotation = this.newRotation.toArray();

  // 	return output;

  // }

  // fromJSON( json ) {

  // 	super.fromJSON( json );

  // 	this.object = this.editor.objectByUuid( json.objectUuid );
  // 	this.oldRotation = new Euler().fromArray( json.oldRotation );
  // 	this.newRotation = new Euler().fromArray( json.newRotation );

  // }
}

export { SetRotationCommand }
