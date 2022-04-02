import { styled } from "@/styles/stitches.config"
import type { CSS } from "@/styles/stitches.config"
import { violet, blackA, mauve } from "@radix-ui/colors"
import * as ToolbarPrimitive from "@radix-ui/react-toolbar"

const StyledToolbar = styled(ToolbarPrimitive.Root, {
  display: "flex",
  padding: "$2",
  width: "100%",
  minWidth: "max-content",
  borderRadius: "$3",
  backgroundColor: "$slate3",
  boxShadow: `$floating2`,
})

const itemStyles: CSS = {
  all: "unset",
  flex: "0 0 auto",
  color: "$slate10",
  height: "$5",
  padding: "0 $1",
  borderRadius: "$1",
  display: "inline-flex",
  fontSize: "$2",
  lineHeight: 1,
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { backgroundColor: "$slate2", color: "$slate12" },
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px $colors$accent2` },
}

const StyledButton = styled(
  ToolbarPrimitive.Button,
  {
    ...itemStyles,
    px: "$2",
    color: "white",
    backgroundColor: "$orange9",
  },
  { "&:hover": { color: "white", backgroundColor: "$orange10" } }
)

const StyledLink = styled(
  ToolbarPrimitive.Link,
  {
    ...itemStyles,
    backgroundColor: "transparent",
    color: "$slate11",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  { "&:hover": { backgroundColor: "transparent", cursor: "pointer" } }
)

const StyledSeparator = styled(ToolbarPrimitive.Separator, {
  width: 1,
  backgroundColor: "$slate10",
  margin: "0 $2",
})

const StyledToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
  display: "inline-flex",
  borderRadius: "$1",
})

const StyledToggleItem = styled(ToolbarPrimitive.ToggleItem, {
  ...itemStyles,
  boxShadow: 0,
  backgroundColor: "$slate3",
  marginLeft: "$half",
  "&:first-child": { marginLeft: 0 },
  "&[data-state=on]": { backgroundColor: "$slate2", color: "$slate12" },
})

// Exports
export const Toolbar = StyledToolbar
export const ToolbarButton = StyledButton
export const ToolbarSeparator = StyledSeparator
export const ToolbarLink = StyledLink
export const ToolbarToggleGroup = StyledToggleGroup
export const ToolbarToggleItem = StyledToggleItem
