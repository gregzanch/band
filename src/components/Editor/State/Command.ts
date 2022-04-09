import { CommandType } from "./Commands/types"
import type { Editor } from "./useEditor"

export class Command {
  id: number
  inMemory: boolean
  updatable: boolean
  type: string
  name: string
  editor: Editor

  constructor(editor: Editor) {
    this.id = -1
    this.inMemory = false
    this.updatable = false
    this.type = ""
    this.name = ""
    this.editor = editor
  }

  toJSON() {
    const output = {
      type: this.type,
      id: this.id,
      name: this.name,
    }

    return output
  }

  fromJSON(json) {
    this.inMemory = true
    this.type = json.type
    this.id = json.id
    this.name = json.name
  }
}
