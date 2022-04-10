import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { ObjectType } from "../Objects/types"
import { Source } from "../Objects/Source/Source"
import { Receiver } from "../Objects/Receiver/Receiver"
import { Group } from "../Objects/Group/Group"
import { Mesh } from "../Objects/Mesh/Mesh"
import { openFilePicker } from "@/helpers/dom/openFilePicker"
import { GLTFLoader } from "three-stdlib"
import { BufferAttribute, Color, Group as ThreeGroup, Mesh as ThreeMesh, Box3, Scene } from "three"
import { nanoid } from "nanoid"
import { stripExtension } from "@/helpers/string"
import { darkTheme, lightTheme } from "@/styles/stitches.config"
import { useTheme } from "@/state/theme"

import { slateDark } from "@radix-ui/colors"
import React from "react"
import { Signal } from "./Signal"

import { History } from "./History"
import { omit } from "@/helpers/object"
import { BandObject } from "../Objects"

export type EditorColors = {
  canvasBackground: Color
  fog: Color
  ground: Color
  floorPrimary: Color
  floorSecondary: Color
  ambientLight: Color
  spotLight: Color
  directionalLight: Color
}

export const EditorColorMap = new Map<typeof darkTheme | typeof lightTheme, EditorColors>()

EditorColorMap.set(lightTheme, {
  canvasBackground: new Color().setStyle(lightTheme.colors.elevation0.value),
  fog: new Color().setStyle(lightTheme.colors.elevation0.value),
  ground: new Color().setStyle(lightTheme.colors.elevation0.value),
  floorPrimary: new Color().setStyle(lightTheme.colors.elevation1.value),
  floorSecondary: new Color().setStyle(lightTheme.colors.elevation2.value),
  ambientLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  spotLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  directionalLight: new Color().setStyle(lightTheme.colors.elevation0.value),
})

EditorColorMap.set(darkTheme, {
  canvasBackground: new Color(0x0d0d0d),
  fog: new Color(1 / 255, 1 / 255, 1 / 255),
  ground: new Color().setHSL(197 / 360, 6.8 / 100, 3 / 100),
  floorPrimary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  floorSecondary: new Color().setHSL(197 / 360, 6.8 / 100, 13.6 / 100),
  ambientLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  spotLight: new Color().setStyle(lightTheme.colors.elevation0.value),
  directionalLight: new Color().setStyle(lightTheme.colors.elevation0.value),
})

type EditorState = {
  cameraMatrix: number[]
  orbitControls: any
  transformControls: any
  selectedObject: any
  scene: Scene | null

  sources: Record<string, Source>
  receivers: Record<string, Receiver>
  meshes: Record<string, Mesh | Group>

  objects: Record<string, BandObject>

  colors: EditorColors
  orientationHelperMarginX: number
  transformType: "translate" | "rotate" | "scale"

  signals: {
    objectAdded: Signal
    objectRemoved: Signal
    objectChanged: Signal
    objectSelected: Signal
    pointerMissed: Signal
    historyChanged: Signal
    sceneGraphChanged: Signal
  }

  debug: boolean

  history: History | null

  // method: () => void
}

type EditorReducers = {
  uploadFile: () => Promise<void>
  set: SetState<EditorState & EditorReducers>
  calculateBounds: () => any
}

const initialState: EditorState = {
  // prettier-ignore
  cameraMatrix: [
    +0.82421503295086050,
    +0.00000000000000000,
    -0.56627694589998270,
    +0.00000000000000000,
    -0.26995224867809190,
    +0.87905835567036470,
    -0.39291499177271955,
    +0.00000000000000000,
    +0.49779048091687483,
    +0.47671417781110165,
    +0.72453311158457890,
    +0.00000000000000000,
    +2.48895240458437740,
    +2.38357088905551100,
    +3.62266555792289950,
    +1.00000000000000000,
  ],
  orbitControls: null,
  transformControls: null,
  selectedObject: null,
  scene: null,
  sources: {},
  receivers: {},
  meshes: {},
  objects: {},
  colors: EditorColorMap.get(useTheme.getState().theme || darkTheme),
  orientationHelperMarginX: 380,
  transformType: "translate",

  signals: {
    objectAdded: new Signal(),
    objectRemoved: new Signal(),
    objectChanged: new Signal(),
    objectSelected: new Signal(),
    pointerMissed: new Signal(),
    historyChanged: new Signal(),
    sceneGraphChanged: new Signal(),
  },

  debug: false,

  history: null,
}

function isNumber(val: any): val is number {
  return typeof val === "number" && !isNaN(val)
}

function numberOr(val: any, def: number) {
  return isNumber(val) ? val : def
}

const vectorMin = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.min(numberOr(vecA[i], Infinity), numberOr(vecB[i], Infinity)))
const vectorMax = (vecA: number[], vecB: number[]) =>
  vecA.map((_, i) => Math.max(numberOr(vecA[i], -Infinity), numberOr(vecB[i], -Infinity)))

export const useEditor = create<
  EditorState & EditorReducers,
  SetState<EditorState & EditorReducers>,
  GetState<EditorState & EditorReducers>,
  Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<EditorState & EditorReducers>, [["zustand/persist", Partial<EditorState & EditorReducers>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get, api) => ({
        ...initialState,
        set,
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
                  .map((m) => {
                    const newMesh = new Mesh(m.name, m.geometry.clone())
                    newMesh.position.copy(m.position)
                    newMesh.scale.copy(m.scale)
                    newMesh.rotation.copy(m.rotation)
                    newMesh.applyMatrix4(m.matrix)
                    newMesh.updateMatrix()
                    return newMesh
                  }) as Mesh[]

                const group = new Group(stripExtension(file.name)).addToDefaultScene(api as Editor)

                for (const mesh of meshes) {
                  group.add(mesh)
                }

                set({
                  objects: {
                    ...get().objects,
                    [group.uuid]: group as Group,
                  },
                })
              }
            }
          }
        },
        calculateBounds: () => {
          const { sources, receivers, meshes } = get()
          let min = [Infinity, Infinity, Infinity]
          let max = [-Infinity, -Infinity, -Infinity]
          for (const [id, source] of Object.entries(sources)) {
            min = vectorMin(source.position.toArray(), min)
            max = vectorMax(source.position.toArray(), max)
          }
          for (const [id, receiver] of Object.entries(receivers)) {
            min = vectorMin(receiver.position.toArray(), min)
            max = vectorMax(receiver.position.toArray(), max)
          }
          for (const [id, mesh] of Object.entries(meshes)) {
            const aabb = new Box3()
            aabb.setFromObject(mesh)
            min = vectorMin(aabb.min.toArray(), min)
            max = vectorMax(aabb.max.toArray(), max)
          }
          return { min, max }
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
export type Editor = typeof useEditor
export default useEditor

useEditor.setState({
  history: new History(useEditor),
})

export const getSignals = () => useEditor.getState().signals

getSignals().objectAdded.add((object: BandObject) => {
  useEditor.setState((state) => ({
    objects: {
      ...state.objects,
      [object.uuid]: object,
    },
  }))
})

getSignals().objectRemoved.add((object: BandObject) => {
  useEditor.setState((state) => ({
    objects: omit([object.uuid], state.objects),
  }))
})

getSignals().objectSelected.add((object: any) => {
  const selectedObject = object ? { current: object } : null
  useEditor.setState({ selectedObject })
})