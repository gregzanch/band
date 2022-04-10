import SourceComponent from "./Source/SourceComponent"
import { Source } from "./Source/Source"
import ReceiverComponent from "./Receiver/ReceiverComponent"
import { Receiver } from "./Receiver/Receiver"
import MeshComponent from "./Mesh/MeshComponent"
import { Mesh } from "./Mesh/Mesh"
import GroupComponent from "./Group/GroupComponent"
import { Group } from "./Group/Group"
import { ObjectType } from "./types"

export const ComponentMap = {
  [ObjectType.SOURCE]: SourceComponent,
  [ObjectType.RECEIVER]: ReceiverComponent,
  [ObjectType.MESH]: MeshComponent,
  [ObjectType.GROUP]: GroupComponent,
}

export type BandObject = Source | Receiver | Mesh | Group