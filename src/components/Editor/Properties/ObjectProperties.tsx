import useEditor from "@/components/Editor/State/useEditor"
import { LevaPanel, useControls } from "@/components/Editor/Leva"
import { Store } from "../Leva/store"
import { useEffect, useRef } from "react"
import { Text } from "@/components/shared/Text"
import { Box } from "@/components/shared/Box"
import { ObjectType } from "@/components/Editor/Objects/types"

export const objectPropertiesStore = new Store()

function ReceiverProperties({ uuid }) {
  const selectedObject = useEditor((state) => state.selectedObject?.current)
  const initialRef = useRef(false)

  useEffect(() => {
    initialRef.current = false
  }, [uuid])

  const [, set] = useControls(
    () => ({
      type: {
        value: ObjectType.RECEIVER,
        editable: false,
      },
      name: {
        value: selectedObject.name || "",
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.name = value
            useEditor.setState((state) => ({
              receivers: {
                ...state.receivers,
              },
            }))
          }
        },
      },
      scale: {
        value: selectedObject.scale.toArray(),
        settings: {
          min: 0.001,
          step: 0.1,
        },
        lock: true,
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value)
          }
        },
      },
      position: {
        value: {
          x: selectedObject.position.x,
          y: selectedObject.position.y,
          z: selectedObject.position.z,
        },
        x: {
          step: 0.1,
        },
        y: {
          step: 0.1,
        },
        z: {
          step: 0.1,
        },
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.position.set(value.x, value.y, value.z)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  )

  useEffect(() => {
    set({
      type: ObjectType.RECEIVER,
      position: {
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      },
      scale: selectedObject.scale.toArray(),
      name: selectedObject.name,
    })
    initialRef.current = true
  }, [selectedObject, set, uuid])

  return null
}

function SourceProperties({ uuid }) {
  const selectedObject = useEditor((state) => state.selectedObject?.current)
  const initialRef = useRef(false)

  useEffect(() => {
    initialRef.current = false
  }, [uuid])

  const [, set] = useControls(
    () => ({
      type: {
        value: ObjectType.SOURCE,
        editable: false,
      },
      name: {
        value: selectedObject.name || "",
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.name = value
            useEditor.setState((state) => ({
              sources: {
                ...state.sources,
              },
            }))
          }
        },
      },
      scale: {
        value: selectedObject.scale.toArray(),
        settings: {
          min: 0.001,
          step: 0.1,
        },
        lock: true,
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value)
          } else {
            // console.log("skipping scale", selectedObject?.userData?.name)
          }
        },
      },
      position: {
        value: {
          x: selectedObject.position.x,
          y: selectedObject.position.y,
          z: selectedObject.position.z,
        },
        x: {
          step: 0.1,
        },
        y: {
          step: 0.1,
        },
        z: {
          step: 0.1,
        },
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.position.set(value.x, value.y, value.z)
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  )

  useEffect(() => {
    set({
      type: ObjectType.SOURCE,
      position: {
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      },
      scale: selectedObject.scale.toArray(),
      name: selectedObject.name,
    })
    initialRef.current = true
  }, [selectedObject, set, uuid])

  return null
}

function MeshProperties({ uuid, selectedObject }) {
  // const selectedObject = useEditor((state) => state.selectedObject?.current)
  // const selectedObject = useEditor.getState().selectedObject?.current
  const initialRef = useRef(false)
  // console.log(selectedObject?.userData?.type)

  useEffect(() => {
    // console.log("setting initial to false")
    initialRef.current = false
  }, [uuid])

  // console.log("initialRef.current", initialRef.current, selectedObject?.userData?.name)

  const [, set] = useControls(
    () => ({
      type: {
        value: ObjectType.MESH,
        editable: false,
      },
      name: {
        value: selectedObject.name || "",
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.name = value
            useEditor.setState((state) => ({
              meshes: {
                ...state.meshes,
              },
            }))
          }
        },
      },
      scale: {
        value: selectedObject.scale.toArray(),
        settings: {
          min: 0.001,
          step: 0.1,
        },
        lock: true,
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value)
          } else {
            // console.log("skipping scale", selectedObject?.userData?.name)
          }
        },
      },
      position: {
        value: {
          x: selectedObject.position.x,
          y: selectedObject.position.y,
          z: selectedObject.position.z,
        },
        x: {
          step: 0.1,
        },
        y: {
          step: 0.1,
        },
        z: {
          step: 0.1,
        },
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.position.set(value.x, value.y, value.z)
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  )

  useEffect(() => {
    set({
      type: ObjectType.MESH,
      position: {
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      },
      scale: selectedObject.scale.toArray(),
      name: selectedObject.name,
    })
    initialRef.current = true
  }, [selectedObject, set, uuid])

  return null
}

function GroupProperties({ uuid, selectedObject }) {
  const initialRef = useRef(false)

  useEffect(() => {
    initialRef.current = false
  }, [uuid])

  const [, set] = useControls(
    () => ({
      type: {
        value: ObjectType.GROUP,
        editable: false,
      },
      name: {
        value: selectedObject.name || "",
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.name = value
            useEditor.setState((state) => ({
              meshes: {
                ...state.meshes,
              },
            }))
          }
        },
      },
      scale: {
        value: selectedObject.scale.toArray(),
        settings: {
          min: 0.001,
          step: 0.1,
        },
        lock: true,
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value)
          } else {
            // console.log("skipping scale", selectedObject?.userData?.name)
          }
        },
      },
      position: {
        value: {
          x: selectedObject.position.x,
          y: selectedObject.position.y,
          z: selectedObject.position.z,
        },
        x: {
          step: 0.1,
        },
        y: {
          step: 0.1,
        },
        z: {
          step: 0.1,
        },
        onChange: (value) => {
          if (initialRef.current !== false) {
            selectedObject.position.set(value.x, value.y, value.z)
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  )

  useEffect(() => {
    set({
      type: ObjectType.GROUP,
      position: {
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      },
      scale: selectedObject.scale.toArray(),
      name: selectedObject.name,
    })
    initialRef.current = true
  }, [selectedObject, set, uuid])

  return null
}

function EmptySelection() {
  return (
    <Box
      css={{
        backgroundColor: "$slate2",
        py: "0.5rem",
      }}
    >
      <Text
        size='1'
        css={{
          textAlign: "center",
          // opacity: "0.25",
          fontFamily: "$mono",
          color: "$highlight1",
        }}
      >
        Nothing Selected
      </Text>
    </Box>
  )
}

function SelectedObjectSwitcher() {
  const selectedObject = useEditor((state) => state.selectedObject)
  if (selectedObject == null) {
    return <EmptySelection />
  }
  const objectType = selectedObject?.current?.type
  switch (objectType) {
    case ObjectType.RECEIVER:
      return <ReceiverProperties uuid={selectedObject?.current?.uuid} />
    case ObjectType.SOURCE:
      return <SourceProperties uuid={selectedObject?.current?.uuid} />
    case ObjectType.MESH:
      return <MeshProperties uuid={selectedObject?.current?.uuid} selectedObject={selectedObject?.current} />
    case ObjectType.GROUP:
      return <GroupProperties uuid={selectedObject?.current?.uuid} selectedObject={selectedObject?.current} />
    default:
      return null
  }
}

export default function ObjectProperties() {
  useEffect(() => {
    Object.assign(window, { objectPropertiesStore })
  }, [])
  return (
    <Box fillHeight id='object-properties'>
      <SelectedObjectSwitcher />
      <LevaPanel store={objectPropertiesStore} fill flat titleBar={false} hideCopyButton />
    </Box>
  )
}
