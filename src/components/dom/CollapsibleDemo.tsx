import React from "react"
import { styled, keyframes } from "@/styles/stitches.config"
import { violet, blackA } from "@radix-ui/colors"
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"

const StyledCollapsible = styled(CollapsiblePrimitive.Root, {
  width: 300,
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

const CollapsibleContent = styled(CollapsiblePrimitive.Content, {
  overflow: "hidden",
  '&[data-state="open"]': { animation: `${open} 300ms ease-out forwards` },
  '&[data-state="closed"]': { animation: `${close} 300ms ease-out forwards` },
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

const Repository = styled("div", {
  backgroundColor: "white",
  borderRadius: 4,
  margin: "10px 0",
  padding: 10,
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
})

export const CollapsibleDemo = () => {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Flex css={{ alignItems: "center", justifyContent: "space-between" }}>
          <Text css={{ color: "white" }}>Object Properties</Text>
        </Flex>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ObjectProperties />
      </CollapsibleContent>
    </Collapsible>
  )
}

export default CollapsibleDemo
