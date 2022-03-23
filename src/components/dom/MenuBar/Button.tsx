import { styled } from "@/components/dom/leva/styles"

export const Button = styled("button", {
  display: "block",
  $reset: "",
  fontFamily: "$mono",
  fontSize: "$root",
  fontWeight: "$button",
  height: "$rowHeight",
  borderStyle: "none",
  borderRadius: "$sm",
  backgroundColor: "$elevation1",
  color: "$highlight1",
  minWidth: "48px",
  boxShadow: "$level2",
  paddingLeft: "0.5em",
  paddingRight: "0.5em",
  "&:not(:disabled)": {
    color: "$highlight2",
    backgroundColor: "$elevation1",
    cursor: "pointer",
    $hover: "$accent3",
    $active: "$accent3 $accent1",
    $focus: "",
  },
  "&:focus": {
    backgroundColor: "$elevation2",
  },
})

export default Button
