import React from "react"
import { styled, keyframes } from "@/styles/stitches.config"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: "var(--radix-accordion-content-height)" },
})

const slideUp = keyframes({
  from: { height: "var(--radix-accordion-content-height)" },
  to: { height: 0 },
})

const StyledAccordion = styled(AccordionPrimitive.Root, {
  borderRadius: "$3",
  width: "100%",
  backgroundColor: "$elevation1",
  boxShadow: "$floating2",
  // borderColor: "$highlight1",
  // borderWidth: "1px",
})

const StyledItem = styled(AccordionPrimitive.Item, {
  overflow: "hidden",
  marginTop: 1,

  "&:first-child": {
    marginTop: 0,
    borderTopLeftRadius: "$3",
    borderTopRightRadius: "$3",
  },

  "&:last-child": {
    borderBottomLeftRadius: "$3",
    borderBottomRightRadius: "$3",
  },

  "&:focus-within": {
    position: "relative",
    zIndex: 1,
    // boxShadow: `0 0 0 2px ${blue.blue9}`,
  },
})

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: "unset",
  display: "flex",
})

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  all: "unset",
  fontFamily: "inherit",
  backgroundColor: "$slate3",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "$hiContrast",
  fontSize: "$2",
  fontVariantNumeric: "tabular-nums",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: "$5",
  px: "$2",
  py: "$1",

  "&:hover": { backgroundColor: "$slate5" },
  variants: {
    hideChevron: {
      true: {
        "&:hover": { backgroundColor: "$slate3" },
      },
    },
  },
})

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: "hidden",
  fontSize: 15,
  color: "$hiContrast",
  backgroundColor: "$slate2",
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
    animationDelay: 0,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards`,
    animationDelay: 0,
  },
})

const StyledChevron = styled(ChevronDownIcon, {
  color: "inherit",
  transition: "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
  "[data-state=open] &": { transform: "rotate(180deg)" },
})

// Exports
export const Accordion = StyledAccordion
export const AccordionItem = StyledItem
export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof StyledTrigger>,
  React.ComponentProps<typeof StyledTrigger> & { hideChevron?: boolean }
>(({ children, hideChevron, ...props }, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger hideChevron={hideChevron} {...props} ref={forwardedRef}>
      {children}
      {!hideChevron && <StyledChevron aria-hidden />}
    </StyledTrigger>
  </StyledHeader>
))

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof StyledContent>,
  React.ComponentProps<typeof StyledContent>
>(({ children, ...props }, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    {children}
  </StyledContent>
))
