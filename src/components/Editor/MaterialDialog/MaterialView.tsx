import { Box } from "@/components/shared/Box";
import { Flex } from "@/components/shared/Flex";
import { Text } from "@/components/shared/Text";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { css, styled } from "@/styles/stitches.config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import * as MenuPrimitive from "@radix-ui/react-menu";

import { baseItemCss, itemCss, menuCss } from "@/components/shared/Menu";

import { Table, Tbody, Tr as StockTr, Td } from "@/components/shared/Table";
import { ScrollArea, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "@/components/shared/ScrollArea";
import { Button } from "@/components/shared/Button";
import { panelStyles } from "@/components/shared/Panel";

import { Tag } from "@/components/shared/Tag";
import { GlobeIcon } from "@radix-ui/react-icons";

import { AbsorptionChart } from "./AbsorptionChart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/Tabs";
import { AbsorptionTable } from "./AbsorptionTable";
import { useEventListener } from "@/hooks/useEventListener";
import useEditor from "../State/useEditor";
import { ObjectType } from "../Objects/types";
import { Mesh } from "../Objects";
import { useMaterialView } from "@/components/Editor/State/materials";

// Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

const Tr = styled(StockTr, {
  "& > :first-child": {
    px: "$2",
  },
  variants: {
    selectable: {
      true: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "$slate4",
        },
        '&[aria-selected="true"]': {
          backgroundColor: "$blue9",
        },
        "&>td,&>td>p": {
          cursor: "pointer !important",
        },
      },
    },
  },
});

const Fieldset = styled("fieldset", {
  all: "unset",
  display: "flex",
  gap: 20,
  alignItems: "center",
  marginBottom: 15,
  variants: {
    noMargin: {
      true: {
        marginBottom: "unset",
      },
    },
  },
});

const Label = styled("label", {
  color: "$highlight2",
  width: 90,
  textAlign: "right",
  variants: {
    size: {
      "1": {
        fontSize: "$1",
      },
      "2": {
        fontSize: "$2",
      },
      "3": {
        fontSize: "$3",
      },
      "4": {
        fontSize: "$4",
      },
    },
  },
  defaultVariants: {
    size: "4",
  },
});

const Input = styled("input", {
  all: "unset",
  width: "100%",
  flex: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "$2",
  padding: "0 10px",
  fontSize: 15,
  lineHeight: 1,
  color: "$highlight2",
  backgroundColor: "$slate2",
  boxShadow: "inset 0px 0px 0px 1px $colors$slate7",
  height: 35,

  "&:focus": { boxShadow: "inset 0px 0px 0px 2px $colors$slate7", color: "$hiContrast" },
});

const Form = styled("form", {
  width: "400px",
  zIndex: "$max",
});

function Search() {
  const setQuery = useMaterialView((state) => state.setQuery);
  const query = useMaterialView((state) => state.query);
  const set = useMaterialView((state) => state.set);
  const searchResultsVisible = useMaterialView((state) => state.searchResultsVisible);
  const [value, setValue] = useState("");

  const changeHandler = useCallback(
    (event) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );

  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 300), [changeHandler]);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  return (
    <Form
      autoComplete='off'
      onSubmit={(e) => {
        setQuery(value);
        e.preventDefault();
      }}
    >
      <Fieldset noMargin>
        <Input
          autoFocus={false}
          css={{ zIndex: "$max" }}
          id='search'
          type='search'
          placeholder='Search...'
          value={value}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              set({ searchResultsVisible: false });
              e.preventDefault();
              e.stopPropagation();
            } else {
              if (!searchResultsVisible) {
                set({ searchResultsVisible: true });
              }
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
            debouncedChangeHandler(e);
          }}
          onFocus={(e) => {
            console.log("focus");
            if (query) {
              set((prev) => ({ searchResultsVisible: true }));
            }
          }}
        />
      </Fieldset>
    </Form>
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function MaterialItem({ material, query }) {
  let materialString = material.material;

  const htmlstring = useMemo(() => {
    const htmlstr = materialString.replace(new RegExp(`(${escapeRegExp(query)})`, "gim"), `<mark>$1</mark>`);
    return htmlstr;
  }, [materialString, query]);

  return (
    <Text
      css={{
        justifyContent: "unset",
        alignItems: "unset",
        // whiteSpace: "pre",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
        width: "100%",
        "&>mark": {
          borderRadius: "$1",
          // mx: "0.5em",
          // px: "0.125em",
        },
      }}
      dangerouslySetInnerHTML={{ __html: htmlstring }}
    />
  );
  return <Text>{material.material}</Text>;
}

const Menu = styled(MenuPrimitive.Root, menuCss, {
  height: "100%",
});

export const contentStyle = css({
  backgroundColor: "$slate3",
  borderRadius: "$3",
  boxShadow: "$colors$shadowLight 0px 10px 38px -10px, $colors$shadowDark 0px 10px 20px -15px",
  variants: {
    outline: {
      true: {
        boxShadow:
          "$colors$shadowLight 0px 10px 38px -10px, $colors$shadowDark 0px 10px 20px -15px, 0px 0px 1px 1px $colors$highlight1",
      },
    },
  },
});

const MenuContent = styled(MenuPrimitive.Content, contentStyle);
const MenuItem = styled(MenuPrimitive.Content, baseItemCss, itemCss);

const StyledMaterialList = styled(Flex, panelStyles, {
  width: "400px",

  height: "150px",
  maxHeight: "150px",
  backgroundColor: "$slate2",
  borderTopRightRadius: "0",
  borderTopLeftRadius: "0",
  // boxShadow: "0px 0px 0px 1px $colors$slate7",
  boxShadow: "$level2",
  position: "absolute",
  transform: "translateY(-$radii$2)",
  pt: "$radii$2",
  zIndex: "$4",
});

function EmptyList() {
  return (
    <StyledMaterialList direction='column' justify='center' align='center' fillWidth>
      <Text faded>Nothing Found</Text>
    </StyledMaterialList>
  );
}

function MaterialResultTable() {
  const selectedMaterial = useMaterialView((state) => state.selectedMaterial);
  const setSelectedMaterial = useMaterialView((state) => state.setSelectedMaterial);
  const query = useMaterialView((state) => state.query);
  const materials = useMaterialView((state) => state.materials);

  return (
    <Table aria-label='Search results'>
      <Tbody role='listbox'>
        {materials.map((material, index) =>
          material.material.toLowerCase().includes(query) ? (
            <Tr
              role='option'
              // role='row'
              aria-selected={selectedMaterial && selectedMaterial.uuid === material.uuid}
              selectable
              key={material.id}
              onClick={() => {
                setSelectedMaterial(material);
                console.log(material);
              }}
            >
              <Td align='start'>
                <MaterialItem material={material} query={query} />
              </Td>
            </Tr>
          ) : null
        )}
      </Tbody>
    </Table>
  );
}

function MaterialList() {
  const query = useMaterialView((state) => state.query);
  const set = useMaterialView((state) => state.set);
  const searchResultsVisible = useMaterialView((state) => state.searchResultsVisible);

  return searchResultsVisible && query ? (
    <StyledMaterialList id='material-list' direction='column' justify='start' align='start'>
      <ScrollArea
        css={{ width: "100%", height: "100%" }}
        onScroll={(e) => {
          console.log(e);
        }}
        onWheel={(e) => {
          const container = e.currentTarget.querySelector("div");
          const scrollAmount = container.scrollTop / (container.scrollHeight - container.clientHeight);
        }}
      >
        <ScrollAreaViewport css={{ py: "$2" }}>
          <MaterialResultTable />
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation='vertical'>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
      </ScrollArea>
    </StyledMaterialList>
  ) : null;
}

function Manufacturer({ material }) {
  return material.manufacturer ? (
    <Flex title='Manufacturer' align='center' direction='row' css={{ color: "$loContrast" }}>
      <GlobeIcon style={{ display: "inline-block" }} />
      <Text faded inline as='span' css={{ mx: "$1", display: "inline-block", lineHeight: "1em" }}>
        {material.manufacturer}
      </Text>
    </Flex>
  ) : null;
}

function MaterialTags({ material }) {
  return (
    <Flex direction='row' gap='1' align='center'>
      {[...new Set(material.tags as string[])].map((tag: string) => (
        <Tag label={tag} key={tag} color='#1c5688' />
      ))}
    </Flex>
  );
}

function MaterialDetail() {
  const material = useMaterialView((state) => state.selectedMaterial);
  const absorptionData = useMemo(() => {
    if (material != null) {
      const frequencies = Object.keys(material.absorption).map(Number);
      return frequencies.map((frequency, index) => ({ frequency, absorption: material.absorption[frequency] }));
    }
    return [];
  }, [material]);
  return material ? (
    <Flex css={{ flexDirection: "column", gap: "$2", width: "100%" }}>
      <Flex direction='row' fillWidth justify='between'>
        <Flex direction='column' gap='1' align='start' css={{ flexWrap: "wrap" }}>
          <Text bold wrap>
            {material.name}
          </Text>
          <MaterialTags material={material} />
        </Flex>
        <Manufacturer material={material} />
      </Flex>
      {/* <Text faded>@{material.source}</Text> */}
      <Text wrap css={{ fontWeight: "300", fontStyle: "italic" }} size='2' faded>
        {material.material}
      </Text>
      <Text wrap css={{ fontWeight: "300" }} size='2'>
        {material.description}
      </Text>
      <Box css={{ maxWidth: 400 }}>
        <Tabs defaultValue='chart' css={{ height: "auto" }}>
          <TabsList>
            <TabsTrigger value='chart'>Chart</TabsTrigger>
            <TabsTrigger value='table'>Table</TabsTrigger>
          </TabsList>
          <TabsContent value='chart'>
            <Box css={{ height: 200, maxWidth: 400 }}>
              <AbsorptionChart data={absorptionData} />
            </Box>
          </TabsContent>
          <TabsContent value='table'>
            <AbsorptionTable data={absorptionData} />
          </TabsContent>
        </Tabs>
      </Box>
    </Flex>
  ) : null;
}

function SearchComponent() {
  const set = useMaterialView((state) => state.set);
  const searchResultsVisible = useMaterialView((state) => state.searchResultsVisible);
  const selection = useEditor((state) => state.selection);

  useEffect(() => {
    fetch("db/material.json")
      .then((res) => res.json())
      .then((materials) => set({ materials }))
      .catch(console.error);
  }, [set]);

  const ref = useRef(null);

  const handleClickOutside = () => {
    // Your custom logic here
    set({ searchResultsVisible: false });
    console.log("clicked outside");
  };

  const handleClickInside = () => {
    // Your custom logic here
    set({ searchResultsVisible: true });
    console.log("clicked inside");
  };

  useOnClickOutside(ref, handleClickOutside);

  useEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchResultsVisible) {
      set({ searchResultsVisible: false });
      e.preventDefault();
      e.stopPropagation();
    }
  });

  useEffect(() => {
    if (selection && selection.length === 1 && selection[0].type === ObjectType.MESH) {
      const s = selection[0] as Mesh;
      set({ selectedMaterial: s.acousticMaterial });
    }
  }, []);

  return (
    <Box
      ref={ref}
      onClick={handleClickInside}
      fillWidth

      // onBlur={(e) => {
      //   set((prev) => ({ searchResultsVisible: false }));
      // }}
    >
      <Search />
      <MaterialList />
    </Box>
  );
}

function DialogActions() {
  const selection = useEditor((state) => state.selection);
  const selectedMaterial = useMaterialView((state) => state.selectedMaterial);
  const canApply = selection && selection.length > 0 && selectedMaterial != null;
  return (
    <Flex fillWidth justify='end' gap='2'>
      <Button
        variant='gray'
        onClick={() => {
          useEditor.setState({ materialDialogOpen: false });
        }}
      >
        Cancel
      </Button>
      <Button
        variant='green'
        disabled={!canApply}
        onClick={(e) => {
          selection
            .filter((obj) => Object.prototype.hasOwnProperty.call(obj, "acousticMaterial"))
            .forEach((obj: Mesh) => {
              obj.acousticMaterial = selectedMaterial;
            });
          useEditor.getState().signals.objectAcousticMaterialChanged.dispatch(selectedMaterial);
        }}
      >
        Apply
      </Button>
    </Flex>
  );
}

export function MaterialView() {
  return (
    <Flex direction='column' justify='start' align='start' gap='2' css={{ width: "100%" }}>
      <SearchComponent />
      <MaterialDetail />
      <DialogActions />
    </Flex>
  );
}
