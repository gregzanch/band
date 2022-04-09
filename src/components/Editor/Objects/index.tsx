import SourceComponent from "./Source/SourceComponent"
import ReceiverComponent from "./Receiver/ReceiverComponent"
import MeshComponent from "./Mesh/MeshComponent"
import GroupComponent from "./Group/GroupComponent"
import { ObjectType } from "./types"

export const ComponentMap = {
  [ObjectType.SOURCE]: SourceComponent,
  [ObjectType.RECEIVER]: ReceiverComponent,
  [ObjectType.MESH]: MeshComponent,
  [ObjectType.GROUP]: GroupComponent,
}
