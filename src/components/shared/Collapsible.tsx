import { styled, keyframes } from "@/styles/stitches.config"
import { violet, blackA } from "@radix-ui/colors"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const StyledCollapsible = styled(CollapsiblePrimitive.Root, {
  width: "100%",
})

// Exports
export const Collapsible = StyledCollapsible
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const open = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-collapsible-content-height)" },
})
const close = keyframes({
  from: { height: "var(--radix-collapsible-content-height)" },
  to: { height: 0 },
})

export const CollapsibleContent = styled(CollapsiblePrimitive.Content, {
  overflow: "hidden",
  '&[data-state="open"]': { animation: `${open} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards` },
  '&[data-state="closed"]': { animation: `${close} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards` },
})

// Your app...
const Flex = styled("div", { display: "flex" })
const Text = styled("span", {
  color: violet.violet11,
  fontSize: 15,
  lineHeight: "25px",
})

const IconButton = styled("button", {
  all: "unset",
  fontFamily: "inherit",
  borderRadius: "100%",
  height: 25,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: violet.violet11,
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  '&[data-state="closed"]': { backgroundColor: "white" },
  '&[data-state="open"]': { backgroundColor: violet.violet3 },
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
})
