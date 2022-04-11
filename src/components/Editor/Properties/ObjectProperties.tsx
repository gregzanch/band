import useEditor from "@/components/Editor/State/useEditor"
import { LevaPanel, useControls } from "@/components/Editor/Leva"
import { Store } from "../Leva/store"
import { useEffect, useMemo, useRef } from "react"
import { Text } from "@/components/shared/Text"
import { Box } from "@/components/shared/Box"
import { ObjectType } from "@/components/Editor/Objects/types"
import { BandObject } from "../Objects"
import { intersection } from "@/helpers/set"
import { Vector3Tuple } from "three"
import { Schema } from "../Leva/types";
import { Receiver } from "../Objects/Receiver/Receiver";
import { Mesh } from "../Objects/Mesh/Mesh";
import { Source } from "../Objects/Source/Source";

export const objectPropertiesStore = new Store();

function ReceiverProperties({ uuid }) {
  const selectedObject = useEditor((state) => state.selection[state.selection.length - 1]);
  const initialRef = useRef(false);

  useEffect(() => {
    initialRef.current = false;
  }, [uuid]);

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
            selectedObject.name = value;
            useEditor.setState((state) => ({
              objects: {
                ...state.objects,
              },
            }));
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
        onChange: (value: [number, number, number]) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value);
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
            selectedObject.position.set(value.x, value.y, value.z);
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  );

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
    });
    initialRef.current = true;
  }, [selectedObject, set, uuid]);

  return null;
}

function SourceProperties({ uuid }) {
  const selectedObject = useEditor((state) => state.selection[state.selection.length - 1]);
  const initialRef = useRef(false);

  useEffect(() => {
    initialRef.current = false;
  }, [uuid]);

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
            selectedObject.name = value;
            useEditor.setState((state) => ({
              objects: {
                ...state.objects,
              },
            }));
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
        onChange: (value: [number, number, number]) => {
          if (initialRef.current !== false) {
            selectedObject.scale.set(...value);
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
            selectedObject.position.set(value.x, value.y, value.z);
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  );

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
    });
    initialRef.current = true;
  }, [selectedObject, set, uuid]);

  return null;
}

function MeshProperties({ uuid, selectedObject }) {
  // const selectedObject = useEditor((state) => state.selectedObject?.current)
  // const selectedObject = useEditor.getState().selectedObject?.current
  const initialRef = useRef(false);
  // console.log(selectedObject?.userData?.type)

  useEffect(() => {
    // console.log("setting initial to false")
    initialRef.current = false;
  }, [uuid]);

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
            selectedObject.name = value;
            useEditor.setState((state) => ({
              objects: {
                ...state.objects,
              },
            }));
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
            selectedObject.scale.set(...value);
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
            selectedObject.position.set(value.x, value.y, value.z);
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  );

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
    });
    initialRef.current = true;
  }, [selectedObject, set, uuid]);

  return null;
}

function GroupProperties({ uuid, selectedObject }) {
  const initialRef = useRef(false);

  useEffect(() => {
    initialRef.current = false;
  }, [uuid]);

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
            selectedObject.name = value;
            useEditor.setState((state) => ({
              objects: {
                ...state.objects,
              },
            }));
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
            selectedObject.scale.set(...value);
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
            selectedObject.position.set(value.x, value.y, value.z);
          } else {
            // console.log("skipping position", selectedObject?.userData?.name)
          }
        },
      },
    }),
    { store: objectPropertiesStore },
    [selectedObject, uuid]
  );

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
    });
    initialRef.current = true;
  }, [selectedObject, set, uuid]);

  return null;
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
  );
}

enum ObjectInputs {
  TYPE = "type",
  POSITION = "position",
  SCALE = "scale",
  NAME = "name",
  SHOW_NORMALS = "showNormals",
  WIREFRAME = "wireframe",
  MATERIAL = "material",
}

// prettier-ignore
const InputSetMap = {
  [ObjectType.SOURCE]: new Set([
    ObjectInputs.TYPE,
    ObjectInputs.NAME,
    ObjectInputs.POSITION,
    ObjectInputs.SCALE,
  ]),
  [ObjectType.RECEIVER]: new Set([
    ObjectInputs.TYPE,
    ObjectInputs.NAME,
    ObjectInputs.POSITION,
    ObjectInputs.SCALE,
  ]),
  [ObjectType.GROUP]: new Set([
    ObjectInputs.TYPE,
    ObjectInputs.NAME,
    ObjectInputs.POSITION,
    ObjectInputs.SCALE,
  ]),
  [ObjectType.MESH]:new Set([
    ObjectInputs.TYPE,
    ObjectInputs.NAME,
    ObjectInputs.POSITION,
    ObjectInputs.SCALE,
    ObjectInputs.SHOW_NORMALS,
    ObjectInputs.WIREFRAME,
    ObjectInputs.MATERIAL,
  ])
}

function averageVectors(vectors: Vector3Tuple[]): Vector3Tuple {
  const arr = vectors[0];
  for (let i = 1; i < vectors.length; i++) {
    for (let j = 0; j < 3; j++) {
      arr[j] = arr[j] + vectors[i][j];
    }
  }
  return arr.map((x) => x / vectors.length) as Vector3Tuple;
}

const InputBuildMap = {
  [ObjectInputs.TYPE]: (selection: BandObject[], initialRef) => {
    const types = [...new Set(selection.map((object) => object.type))];
    const value = types.length > 1 ? "Mixed" : types[0];
    return {
      type: {
        value,
        editable: false,
      },
    };
  },
  [ObjectInputs.NAME]: (selection: BandObject[], initialRef) => {
    const multiple = selection.length > 1;
    return {
      name: {
        value: multiple ? "Mixed" : selection[0].name,
        disabled: multiple,
        onChange: (value) => {
          if (initialRef.current !== false) {
            selection[0].name = value;
            useEditor.setState((state) => ({
              objects: {
                ...state.objects,
              },
            }));
          }
        },
      },
    };
  },
  [ObjectInputs.POSITION]: (selection: BandObject[], initialRef) => {
    const multiple = selection.length > 1;
    return {
      position: {
        value: multiple
          ? averageVectors(selection.map((obj) => obj.position.toArray()))
          : selection[0].position.toArray(),
        disabled: multiple,
        onChange: (value: Vector3Tuple) => {
          if (initialRef.current !== false) {
            selection[0].position.set(...value);
          }
        },
      },
    };
  },
  [ObjectInputs.WIREFRAME]: (selection: Array<Mesh>, initialRef): Schema => {
    return {
      wireframe: {
        value: selection.at(-1).wireframe,
        onChange: (value: boolean) => {
          if (initialRef.current !== false) {
            for (const obj of selection) {
              obj.wireframe = value;
            }
          }
        },
      },
    };
  },
};

const InputValueMap = {
  [ObjectInputs.TYPE]: (selection: BandObject[]) => {
    const types = [...new Set(selection.map((object) => object.type))];
    const value = types.length > 1 ? "Mixed" : types[0];
    return {
      type: value,
    };
  },
  [ObjectInputs.NAME]: (selection: BandObject[]) => {
    const multiple = selection.length > 1;
    return {
      name: multiple ? "Mixed" : selection[0].name,
    };
  },
  [ObjectInputs.POSITION]: (selection: BandObject[]) => {
    const multiple = selection.length > 1;
    return {
      position: multiple
        ? averageVectors(selection.map((obj) => obj.position.toArray()))
        : selection[0].position.toArray(),
    };
  },
  [ObjectInputs.WIREFRAME]: (selection: Array<Mesh>) => {
    return {
      wireframe: selection.at(-1).wireframe,
    };
  },
};

function getInputIntersection(selection: BandObject[]): Set<ObjectInputs> {
  return [...new Set(selection.map((object) => object.type))]
    .map((type) => InputSetMap[type])
    .reduce((acc, curr, index) => intersection(index === 0 ? curr : acc, curr), new Set());
}

function SelectedObjectSwitcher() {
  const selection = useEditor((state) => state.selection);

  const initialRef = useRef(false);

  useEffect(() => {
    initialRef.current = false;
  }, [selection]);

  const inputs = useMemo(() => [...getInputIntersection(selection)], [selection]);

  const [, set] = useControls(
    () => {
      console.log("new control schema ran");
      return inputs
        .filter((input) => InputBuildMap[input])
        .map((input) => InputBuildMap[input](selection, initialRef))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    },
    { store: objectPropertiesStore },
    [inputs, selection]
  );

  useEffect(() => {
    console.log("set effect ran");
    const initialValues = inputs
      .filter((input) => InputValueMap[input])
      .map((input) => InputValueMap[input](selection))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
    set(initialValues);
    initialRef.current = true;
  }, [inputs, selection, set]);

  return null;
}

export default function ObjectProperties() {
  useEffect(() => {
    Object.assign(window, { objectPropertiesStore })
  }, [])
  const selection = useEditor((state) => state.selection)
  return (
    <Box fillHeight id='object-properties'>
      {selection.length > 0 ? <SelectedObjectSwitcher /> : <EmptySelection />}
      <LevaPanel store={objectPropertiesStore} fill flat titleBar={false} hideCopyButton />
    </Box>
  )
}
