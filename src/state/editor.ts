import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { Source, Receiver, ObjectType, BriefMesh, BriefAttribute, Mesh, Group } from "./types"
import { openFilePicker } from "@/helpers/dom/openFilePicker"
import { GLTFLoader } from "three-stdlib"
import { BufferAttribute, Group as ThreeGroup, Mesh as ThreeMesh } from "three"
import { nanoid } from "nanoid"
import { stripExtension } from "@/helpers/string"

type EditorState = {
  cameraMatrix: number[]
  orbitControls: any
  transformControls: any
  selectedObject: any
  scene: any
  sources: Record<string, Source>
  receivers: Record<string, Receiver>
  meshes: Record<string, Mesh | Group>
  // method: () => void
}

type EditorReducers = {
  uploadFile: () => Promise<void>
}

const initialState: EditorState = {
  cameraMatrix: [
    0.8242150329508605, 0, -0.5662769458999827, 0, -0.2699522486780919, 0.8790583556703647, -0.39291499177271955, 0,
    0.49779048091687483, 0.47671417781110165, 0.7245331115845789, 0, 2.4889524045843774, 2.383570889055511,
    3.6226655579228995, 1,
  ],
  orbitControls: null,
  transformControls: null,
  selectedObject: null,
  scene: null,
  sources: {
    "57C19E93-33CC-4AC5-A435-E284C0F1CDA1": {
      position: [0.2, 0, 3],
      userData: {
        type: ObjectType.SOURCE,
        name: "Source Left 1",
        id: "57C19E93-33CC-4AC5-A435-E284C0F1CDA1",
      },
    },
  },
  receivers: {
    "DC78D831-BAE7-49F9-9337-514186917A7B": {
      position: [0.2, 0, -1],
      userData: {
        type: ObjectType.RECEIVER,
        name: "Receiver",
        id: "DC78D831-BAE7-49F9-9337-514186917A7B",
      },
    },
  },
  meshes: {},
}

function makeBriefAttribute(attribute: BufferAttribute, makeTyped = (x) => new Float32Array(x)): BriefAttribute {
  return {
    array: makeTyped(Array.from(attribute.array)),
    count: attribute.count,
    itemSize: attribute.itemSize,
  }
}

function makeBriefIndex(attribute: BufferAttribute, makeTyped = (x) => new Uint16Array(x)): BriefAttribute {
  return {
    array: makeTyped(Array.from(attribute.array)),
    count: attribute.count,
    itemSize: attribute.itemSize,
  }
}

function makeBriefMesh(mesh: Mesh): BriefMesh {
  const briefAttributes = {}
  for (const [key, attr] of Object.entries(mesh.geometry.attributes)) {
    briefAttributes[key] = makeBriefAttribute(attr as BufferAttribute)
  }
  return {
    userData: {
      type: ObjectType.BRIEF_MESH,
      name: mesh.name || "",
      id: nanoid(10),
    },
    position: mesh.position.toArray(),
    geometry: {
      attributes: briefAttributes,
      index: makeBriefIndex(mesh.geometry.index),
    },
  }
}

function scene2mesh(scene: Group): Record<string, Mesh> {
  const meshes = scene.children.filter((x) => x.type === "Mesh")
  return meshes.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.uuid]: {
        ...curr,
        userData: {
          type: ObjectType.MESH,
          name: curr.name || "",
          id: curr.uuid,
        },
      },
    }),
    {}
  )
}

export const useEditor = create<
  EditorState & EditorReducers,
  SetState<EditorState & EditorReducers>,
  GetState<EditorState & EditorReducers>,
  Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/persist", Partial<EditorState & EditorReducers>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
        uploadFile: async () => {
          const files = await openFilePicker({ multiple: true, accept: ".gltf" })
          for (const file of files) {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = async (e) => {
              if (reader.readyState === reader.DONE) {
                const parsed = await new GLTFLoader().parseAsync(reader.result, "")
                //@ts-ignore
                const meshes = parsed.scene.children
                  .filter((x) => x.type === "Mesh")
                  .map((x) => {
                    x.userData = {
                      id: x.uuid,
                      name: x.name || "",
                      type: ObjectType.MESH,
                    }
                    return x
                  }) as Mesh[]

                const group = new ThreeGroup()
                group.name = stripExtension(file.name)
                group.userData = {
                  id: group.uuid,
                  name: group.name,
                  type: ObjectType.GROUP,
                }
                for (const mesh of meshes) {
                  group.add(mesh)
                }

                set({
                  meshes: {
                    ...get().meshes,
                    // ...meshes,
                    ...{
                      [group.uuid]: group as Group,
                    },
                  },
                })
              }
            }
          }
        },
        // method: () => {},
      }),

      {
        name: "band.editor",
        partialize: (state) => ({
          cameraMatrix: state.cameraMatrix,
        }),
      }
    )
  )
)

export default useEditor
