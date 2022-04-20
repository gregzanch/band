import { Box } from "@/components/shared/Box";
import { Flex } from "@/components/shared/Flex";
import { Text } from "@/components/shared/Text";
import { useDebounce } from "@/hooks/useDebounce";
import { css, styled } from "@/styles/stitches.config";
import { Fragment, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import debounce from "lodash.debounce";
import * as MenuPrimitive from "@radix-ui/react-menu";

import { baseItemCss, itemCss, labelCss, menuCss, MenuCheckboxItem } from "@/components/shared/Menu";

import { Table, Thead, Tbody, Tr as StockTr, Td, Tfoot } from "@/components/shared/Table";
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/shared/ScrollArea";
import { Button } from "@/components/shared/Button";
import { panelStyles } from "@/components/shared/Panel";

import { PersonIcon, GlobeIcon } from "@radix-ui/react-icons";
import { Tag } from "@/components/shared/Tag";

import create, { SetState } from "zustand";
import createContext from "zustand/context";
import { usePrevious } from "@/hooks/usePrevious";
import { AbsorptionChart } from "./AbsorptionChart";

// Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

type MaterialViewStore = {
  query: string;
  setQuery: (newQuery: string) => void;
  selectedMaterial: any;
  setSelectedMaterial: (mat: any) => void;
  materials: any[];
  set: SetState<MaterialViewStore>;
};

const { Provider, useStore: useMaterialView } = createContext<MaterialViewStore>();

const createStore = () =>
  create<MaterialViewStore>(
    (set) =>
      ({
        query: "",
        setQuery: (newQuery: string) => set({ query: newQuery }),
        selectedMaterial: null,
        setSelectedMaterial: (mat: any) => set({ selectedMaterial: mat }),
        materials: [],
        set,
      } as MaterialViewStore)
  );

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
  boxShadow: "0px 0px 0px 1px $colors$slate7",
  height: 35,

  "&:focus": { boxShadow: "0px 0px 0px 2px $colors$slate7", color: "$hiContrast" },
});

const Form = styled("form", {
  width: "100%",
});

function Search() {
  const setQuery = useMaterialView((state) => state.setQuery);
  const set = useMaterialView((state) => state.set);
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
          id='search'
          type='search'
          placeholder='Search...'
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debouncedChangeHandler(e);
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
    // const parser = new DOMParser();
    // const doc2 = parser.parseFromString(htmlstr, "text/html");
    // const innerHtml = [...doc2.body.childNodes]
    //   .map((node) => {
    //     if (node.nodeType === Node.TEXT_NODE) {
    //       return `<span>${node.textContent}</span>`;
    //     }
    //     return node["outerHTML"];
    //   })
    //   .join("\n");

    // return innerHtml;
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

const fetcher = (url) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 10;

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
  width: "100%",
  height: "200px",
  maxHeight: "200px",
  backgroundColor: "$slate2",
  boxShadow: "0px 0px 0px 1px $colors$slate7",
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
      <Tbody>
        {materials.map((material, index) => (
          <Tr
            role='row'
            aria-selected={selectedMaterial && selectedMaterial.id === material.id}
            selectable
            key={material.id}
            onClick={() => {
              setSelectedMaterial(material);
              console.log(material);
            }}
          >
            <Td>
              <MaterialItem material={material} query={query} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function MaterialList() {
  const query = useMaterialView((state) => state.query);
  const set = useMaterialView((state) => state.set);

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    (index) => `/api/materials/search?query=${query}&page=${index}&count=${PAGE_SIZE}`,
    fetcher
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  // const isRefreshing = isValidating && data && data.length === size;

  useEffect(() => {
    if (!isLoadingMore && !error) {
      set({ materials: data ? [].concat(...data) : [] });
    }
  }, [isLoadingMore, error, set, data]);

  return (
    <StyledMaterialList direction='column' justify='start' align='start'>
      <ScrollArea
        css={{ width: "100%", height: "100%" }}
        onScroll={(e) => {
          console.log(e);
        }}
        onWheel={(e) => {
          const container = e.currentTarget.querySelector("div");
          const scrollAmount = container.scrollTop / (container.scrollHeight - container.clientHeight);
          if (!isLoadingMore && !isReachingEnd && scrollAmount > 0.75) {
            setSize((prev) => prev + 1);
            console.log(size);
          }
        }}
      >
        <ScrollAreaViewport css={{ py: "$2" }}>
          <MaterialResultTable />
        </ScrollAreaViewport>
        <ScrollAreaScrollbar orientation='vertical'>
          <ScrollAreaThumb />
        </ScrollAreaScrollbar>
        {/* <ScrollAreaCorner /> */}
      </ScrollArea>
    </StyledMaterialList>
  );
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
      return material.frequencies.map((frequency, index) => ({ frequency, absorption: material.absorption[index] }));
    }
    return [];
  }, [material]);
  return material ? (
    <Flex css={{ flexDirection: "column", gap: "$2", width: "100%" }}>
      <Flex direction='row' fillWidth justify='between'>
        <Flex direction='row' gap='1' align='end'>
          <Text bold>{material.name}</Text>
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
      <Box css={{ height: 200, maxWidth: 400 }}>
        <AbsorptionChart data={absorptionData} />
      </Box>
    </Flex>
  ) : null;
}

export function MaterialView() {
  return (
    <Provider createStore={createStore}>
      <Flex direction='column' justify='start' align='start' gap='1' css={{ width: "100%" }}>
        <Search />
        <MaterialList />
        <MaterialDetail />
      </Flex>
    </Provider>
  );
}
