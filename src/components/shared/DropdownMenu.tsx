import React, { ReactText } from "react"
import { keyframes } from "@stitches/react"
import { CheckIcon } from "@radix-ui/react-icons"
import { styled, CSS } from "@/styles/stitches.config"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { menuCss, separatorCss, itemCss, labelCss } from "./Menu"
import type { BaseMenuItemVariants } from "./Menu"
import { Box } from "./Box"
import { Flex } from "./Flex"
import { panelStyles } from "./Panel"

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
})

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
})

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
})

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
})

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = styled(DropdownMenuPrimitive.Content, menuCss, panelStyles, {
  minWidth: 220,
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "400ms",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    animationFillMode: "forwards",
    willChange: "transform, opacity",
    '&[data-state="open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
})
export const DropdownMenuSeparator = styled(DropdownMenuPrimitive.Separator, separatorCss)
export const DropdownMenuItem = styled(DropdownMenuPrimitive.Item, itemCss)

const StyledDropdownMenuRadioItem = styled(DropdownMenuPrimitive.RadioItem, itemCss)

type DialogMenuRadioItemPrimitiveProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>
type DialogMenuRadioItemProps = DialogMenuRadioItemPrimitiveProps & { css?: CSS } & BaseMenuItemVariants

export const DropdownMenuTriggerItem = styled(DropdownMenuPrimitive.TriggerItem, {
  '&[data-state="open"]': {
    backgroundColor: "$blue7",
    // color: "white",
  },
  ...itemCss,
})

export const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof StyledDropdownMenuRadioItem>,
  DialogMenuRadioItemProps
>(({ children, ...props }, forwardedRef) => (
  <StyledDropdownMenuRadioItem {...props} ref={forwardedRef}>
    <Box as='span' css={{ position: "absolute", left: "$1" }}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Flex css={{ width: "$3", height: "$3", alignItems: "center", justifyContent: "center" }}>
          <Box
            css={{
              width: "$1",
              height: "$1",
              backgroundColor: "currentColor",
              borderRadius: "$round",
            }}
          />
        </Flex>
      </DropdownMenuPrimitive.ItemIndicator>
    </Box>
    {children}
  </StyledDropdownMenuRadioItem>
))

const StyledDropdownMenuCheckboxItem = styled(DropdownMenuPrimitive.CheckboxItem, itemCss)

type DialogMenuCheckboxItemPrimitiveProps = React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>
type DialogMenuCheckboxItemProps = DialogMenuCheckboxItemPrimitiveProps & { css?: CSS } & BaseMenuItemVariants

export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof StyledDropdownMenuCheckboxItem>,
  DialogMenuCheckboxItemProps
>(({ children, ...props }, forwardedRef) => (
  <StyledDropdownMenuCheckboxItem {...props} ref={forwardedRef}>
    <Box as='span' css={{ position: "absolute", left: "$1" }}>
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon />
      </DropdownMenuPrimitive.ItemIndicator>
    </Box>
    {children}
  </StyledDropdownMenuCheckboxItem>
))

export const DropdownMenuLabel = styled(DropdownMenuPrimitive.Label, labelCss)
export const DropdownMenuRadioGroup = styled(DropdownMenuPrimitive.RadioGroup, {})
export const DropdownMenuGroup = styled(DropdownMenuPrimitive.Group, {})

export const DropdownMenuRightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 20,
  color: "$slate11",
  ":focus > &": { color: "white" },
  "[data-disabled] &": { color: "$slate9" },
})
