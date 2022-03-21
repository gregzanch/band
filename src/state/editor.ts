import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { Source, Receiver, ObjectType } from "./types"

type EditorState = {
  cameraMatrix: number[]
  orbitControls: any
  transformControls: any
  selectedObject: any
  scene: any
  sources: Record<string, Source>
  receivers: Record<string, Receiver>
  // method: () => void
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
    XtCFxCk4QT: {
      position: [0.2, 0, 3],
      userData: {
        type: ObjectType.SOURCE,
        name: "Source Left",
        id: "XtCFxCk4QT",
      },
    },
  },
  receivers: {
    zTvorIzlMj: {
      position: [0.2, 0, -1],
      userData: {
        type: ObjectType.RECEIVER,
        name: "Receiver",
        id: "zTvorIzlMj",
      },
    },
  },
}

export const useEditor = create<
  EditorState,
  SetState<EditorState>,
  GetState<EditorState>,
  Mutate<StoreApi<EditorState>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<EditorState>, [["zustand/persist", Partial<EditorState>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...initialState,
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
