import React from "react"
import * as MenuPrimitive from "@radix-ui/react-menu"
import type * as Stitches from "@stitches/react"
import { CheckIcon } from "@radix-ui/react-icons"
import { styled, css, CSS } from "@/styles/stitches.config"
import { Box } from "./Box"
import { Flex } from "./Flex"
import { panelStyles } from "./Panel"

export const baseItemCss = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "$untitled",
  fontSize: "$1",
  fontVariantNumeric: "tabular-nums",
  lineHeight: "1",
  cursor: "default",
  userSelect: "none",
  whiteSpace: "nowrap",
  height: "$5",
  px: "$1",
  variants: {
    hasItemState: {
      true: {
        pl: "$5",
      },
    },
  },
})

export type BaseMenuItemVariants = Stitches.VariantProps<typeof baseItemCss>

export const itemCss = css(baseItemCss, {
  position: "relative",
  color: "$hiContrast",
  borderRadius: "$1",

  "&:focus": {
    outline: "none",
    backgroundColor: "$blue9",
    color: "white",
  },

  "&[data-disabled]": {
    pointerEvents: "none",
    color: "$slate9",
  },
})

export const labelCss = css(baseItemCss, {
  color: "$slate11",
})

export const menuCss = css({
  boxSizing: "border-box",
  minWidth: 120,
  p: "$1",
})

export const separatorCss = css({
  height: 1,
  my: "$1",
  backgroundColor: "$slate6",
})

export const Menu = styled(MenuPrimitive.Root, menuCss)
export const MenuContent = styled(MenuPrimitive.Content, panelStyles)

export const MenuSeparator = styled(MenuPrimitive.Separator, separatorCss)

export const MenuItem = styled(MenuPrimitive.Item, itemCss)

const StyledMenuRadioItem = styled(MenuPrimitive.RadioItem, itemCss)

type MenuRadioItemPrimitiveProps = React.ComponentProps<typeof MenuPrimitive.RadioItem>
type MenuRadioItemProps = MenuRadioItemPrimitiveProps & { css?: CSS }

export const MenuRadioItem = React.forwardRef<React.ElementRef<typeof StyledMenuRadioItem>, MenuRadioItemProps>(
  ({ children, ...props }, forwardedRef) => (
    <StyledMenuRadioItem {...props} ref={forwardedRef}>
      <Box as='span' css={{ position: "absolute", left: "$1" }}>
        <MenuPrimitive.ItemIndicator>
          <Flex css={{ width: "$3", height: "$3", alignItems: "center", justifyContent: "center" }}>
            <Box
              css={{
                width: "$1",
                height: "$1",
                backgroundColor: "currentColor",
                borderRadius: "$round",
              }}
            ></Box>
          </Flex>
        </MenuPrimitive.ItemIndicator>
      </Box>
      {children}
    </StyledMenuRadioItem>
  )
)

const StyledMenuCheckboxItem = styled(MenuPrimitive.CheckboxItem, itemCss)

type MenuCheckboxItemPrimitiveProps = React.ComponentProps<typeof MenuPrimitive.CheckboxItem>
type MenuCheckboxItemProps = MenuCheckboxItemPrimitiveProps & { css?: CSS }

export const MenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof StyledMenuCheckboxItem>,
  MenuCheckboxItemProps
>(({ children, ...props }, forwardedRef) => (
  <StyledMenuCheckboxItem {...props} ref={forwardedRef}>
    <Box as='span' css={{ position: "absolute", left: "$1" }}>
      <MenuPrimitive.ItemIndicator>
        <CheckIcon />
      </MenuPrimitive.ItemIndicator>
    </Box>
    {children}
  </StyledMenuCheckboxItem>
))

export const MenuLabel = styled(MenuPrimitive.Label, labelCss)
export const MenuRadioGroup = styled(MenuPrimitive.RadioGroup, {})
export const MenuGroup = styled(MenuPrimitive.Group, {})
