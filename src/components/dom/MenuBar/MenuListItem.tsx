import { styled } from "@/components/dom/leva/styles"

export const MenuListItem = styled("li", {
  display: "block",
  $reset: "",
  fontFamily: "$mono",
  fontSize: "$root",
  fontWeight: "$button",
  height: "$rowHeight",
  borderStyle: "none",

  backgroundColor: "$elevation1",
  color: "$highlight1",
  minWidth: "48px",
  paddingLeft: "0.5em",
  paddingRight: "0.5em",
  "&:first-child": {
    borderTopLeftRadius: "$sm",
    borderTopRightRadius: "$sm",
  },
  "&:last-child": {
    borderBottomLeftRadius: "$sm",
    borderBottomRightRadius: "$sm",
  },
  "&:not(:disabled)": {
    color: "$highlight2",
    backgroundColor: "$elevation1",
    cursor: "pointer",
    $focus: "",
    $hover: "$accent3",
  },
  "&>a": {
    width: "100%",
    display: "block",
    height: "100%",
    boxSizing: "border-box",
  },

  "&>a:focus-visible": {
    // outlineColor: "$accent2",
    // outlineWidth: "1px",
    // outlineStyle: "outset",
    outline: "none",
  },
  "&:focus-within": {
    backgroundColor: "$elevation2",
    outline: "none",
    borderColor: "$accent2",
  },
})

export default MenuListItem
