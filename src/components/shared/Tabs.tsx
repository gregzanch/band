import React from "react"
import { styled, CSS } from "@/styles/stitches.config"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

export const Separator = styled(SeparatorPrimitive.Root, {
  border: "none",
  margin: 0,
  flexShrink: 0,
  backgroundColor: "$slate1",
  cursor: "default",
  height: "1px",
  width: "$7",
})

export const Tabs = styled(TabsPrimitive.Root, {
  display: "flex",
  height: "calc(100vh - $2 - $2)",
  '&[data-orientation="horizontal"]': {
    flexDirection: "column",
  },
})

export const TabsTrigger = styled(TabsPrimitive.Trigger, {
  all: "unset",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  "&:first-child": { borderTopLeftRadius: "$3" },
  "&:last-child": { borderTopRightRadius: "$3" },
  '&[data-state="active"]': {
    color: "$hiContrast",
    backgroundColor: "$slate2",
    // boxShadow: "inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
  // "&:focus": { position: "relative", boxShadow: `0 0 0 2px black`, zIndex: "$4" },

  flexShrink: 0,
  height: "$5",
  fontFamily: "inherit",
  backgroundColor: "$slate3",
  // display: "inline-flex",
  lineHeight: 1,
  fontSize: "$2",
  outline: "none",
  color: "$slate11",
  // border: "1px solid transparent",
  zIndex: "$3",
  px: "$2",
  py: "$1",

  // "@hover": {
  //   "&:hover": {
  //     color: "$hiContrast",
  //   },
  // },

  // '&[data-state="active"]': {
  //   color: "$hiContrast",
  //   borderColor: "$slate6",
  //   borderBottomColor: "transparent",
  // },

  // '&[data-orientation="vertical"]': {
  //   justifyContent: "flex-start",
  //   borderTopRightRadius: 0,
  //   borderBottomLeftRadius: "$2",
  //   borderBottomColor: "transparent",

  //   '&[data-state="active"]': {
  //     borderBottomColor: "$slate6",
  //     borderRightColor: "transparent",
  //   },
  // },
})

const StyledTabsList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: "flex",
  "&:focus": {
    outline: "none",
    boxShadow: "inset 0 0 0 1px $slate8, 0 0 0 1px $slate8",
  },
  '&[data-orientation="vertical"]': {
    flexDirection: "column",
    boxShadow: "inset -1px 0 0 $slate6",
  },
})

type TabsListPrimitiveProps = React.ComponentProps<typeof TabsPrimitive.List>
type TabsListProps = TabsListPrimitiveProps & { css?: CSS }

export const TabsList = React.forwardRef<React.ElementRef<typeof StyledTabsList>, TabsListProps>((props, forwardedRef) => (
  <>
    <StyledTabsList {...props} ref={forwardedRef} />
    {/* <Separator css={{ width: "100%" }} /> */}
  </>
))

export const TabsContent = styled(TabsPrimitive.Content, {
  flexGrow: 1,
  backgroundColor: "$slate2",
  boxShadow: "$floating2",
  borderBottomLeftRadius: "$3",
  borderBottomRightRadius: "$3",
  "&:focus": {
    outline: "none",
    boxShadow: "inset 0 0 0 1px $slate8, 0 0 0 1px $slate8",
  },
})
