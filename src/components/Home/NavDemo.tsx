import React from "react"
import { styled, keyframes } from "@/styles/stitches.config"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { violet, mauve, indigo, purple, blackA, amber } from "@radix-ui/colors"
import { Button } from "../shared/Button"
import { Box } from "../shared/Box"

const enterFromRight = keyframes({
  from: { transform: "translateX(200px)", opacity: 0 },
  to: { transform: "translateX(0)", opacity: 1 },
})

const enterFromLeft = keyframes({
  from: { transform: "translateX(-200px)", opacity: 0 },
  to: { transform: "translateX(0)", opacity: 1 },
})

const exitToRight = keyframes({
  from: { transform: "translateX(0)", opacity: 1 },
  to: { transform: "translateX(200px)", opacity: 0 },
})

const exitToLeft = keyframes({
  from: { transform: "translateX(0)", opacity: 1 },
  to: { transform: "translateX(-200px)", opacity: 0 },
})

const scaleIn = keyframes({
  from: { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
  to: { transform: "rotateX(0deg) scale(1)", opacity: 1 },
})

const scaleOut = keyframes({
  from: { transform: "rotateX(0deg) scale(1)", opacity: 1 },
  to: { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
})

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
})

const StyledMenu = styled(NavigationMenuPrimitive.Root, {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  width: "100vw",
  zIndex: 1,
})

const StyledList = styled(NavigationMenuPrimitive.List, {
  all: "unset",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "$elevation2",
  padding: 4,
  borderRadius: "$pill",
  listStyle: "none",
  // gap: "$3",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
})

const itemStyles = {
  padding: "8px 12px",
  outline: "none",
  userSelect: "none",
  fontWeight: 500,
  lineHeight: 1,
  borderRadius: "$pill",
  fontSize: 15,
  color: "$hiContrast",
  "&:focus": { position: "relative", boxShadow: `0 0 0 2px $colors$yellow11` },
  "&:hover": { backgroundColor: "$elevation3" },
}

const StyledMenuItem = styled(NavigationMenuPrimitive.Item, {
  borderRadius: "$pill",
  variants: {
    filled: {
      true: {
        background: "$orange11",
        "&:hover": {
          background: "$orange9",
        },
      },
    },
  },
})

const StyledTrigger = styled(NavigationMenuPrimitive.Trigger, {
  all: "unset",
  ...itemStyles,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
})

const StyledCaret = styled(CaretDownIcon, {
  position: "relative",
  color: "$yellow11",
  top: 1,
  "[data-state=open] &": { transform: "rotate(-180deg)" },
  "@media (prefers-reduced-motion: no-preference)": {
    transition: "transform 250ms ease",
  },
})

const StyledTriggerWithCaret = React.forwardRef<
  React.ElementRef<typeof StyledTrigger>,
  NavigationMenuPrimitive.NavigationMenuTriggerProps
>(({ children, ...props }, forwardedRef) => (
  <StyledTrigger {...props} ref={forwardedRef}>
    {children}
    <StyledCaret aria-hidden />
  </StyledTrigger>
))

const StyledLink = styled(NavigationMenuPrimitive.Link, {
  ...itemStyles,
  display: "block",
  textDecoration: "none",
  fontSize: 15,
  lineHeight: 1,
  variants: {
    filled: {
      true: {
        // marginLeft: "$4",
        background: "$orange9",
        "&:hover": {
          background: "$orange10",
        },
        textShadow: "0px 0px 2px $colors$orange8",
      },
    },
  },
})

const StyledButton = styled(Button, {
  ...itemStyles,
  // display: "block",
  // textDecoration: "none",
  // fontSize: 15,
  // lineHeight: 1,
})

const StyledContent = styled(NavigationMenuPrimitive.Content, {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  "@media only screen and (min-width: 600px)": { width: "auto" },
  "@media (prefers-reduced-motion: no-preference)": {
    animationDuration: "250ms",
    animationTimingFunction: "ease",
    '&[data-motion="from-start"]': { animationName: enterFromLeft },
    '&[data-motion="from-end"]': { animationName: enterFromRight },
    '&[data-motion="to-start"]': { animationName: exitToLeft },
    '&[data-motion="to-end"]': { animationName: exitToRight },
  },
})

const StyledIndicator = styled(NavigationMenuPrimitive.Indicator, {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  height: 10,
  top: "100%",
  overflow: "hidden",
  zIndex: 1,

  "@media (prefers-reduced-motion: no-preference)": {
    transition: "width, transform 250ms ease",
    '&[data-state="visible"]': { animation: `${fadeIn} 200ms ease` },
    '&[data-state="hidden"]': { animation: `${fadeOut} 200ms ease` },
  },
})

const StyledArrow = styled("div", {
  position: "relative",
  top: "70%",
  backgroundColor: "white",
  width: 10,
  height: 10,
  transform: "rotate(45deg)",
  borderTopLeftRadius: 2,
})

const StyledIndicatorWithArrow = React.forwardRef<
  React.ElementRef<typeof StyledIndicator>,
  NavigationMenuPrimitive.NavigationMenuIndicatorProps
>((props, forwardedRef) => (
  <StyledIndicator {...props} ref={forwardedRef}>
    <StyledArrow />
  </StyledIndicator>
))

const StyledViewport = styled(NavigationMenuPrimitive.Viewport, {
  position: "relative",
  transformOrigin: "top center",
  marginTop: 10,
  width: "100%",
  backgroundColor: "white",
  borderRadius: 6,
  overflow: "hidden",
  boxShadow: "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
  height: "var(--radix-navigation-menu-viewport-height)",

  "@media only screen and (min-width: 600px)": {
    width: "var(--radix-navigation-menu-viewport-width)",
  },
  "@media (prefers-reduced-motion: no-preference)": {
    transition: "width, height, 300ms ease",
    '&[data-state="open"]': { animation: `${scaleIn} 200ms ease` },
    '&[data-state="closed"]': { animation: `${scaleOut} 200ms ease` },
  },
})

// Exports
const NavigationMenu = StyledMenu
const NavigationMenuList = StyledList
const NavigationMenuItem = StyledMenuItem
const NavigationMenuTrigger = StyledTriggerWithCaret
const NavigationMenuLink = StyledLink
const NavigationMenuContent = StyledContent
const NavigationMenuViewport = StyledViewport
const NavigationMenuIndicator = StyledIndicatorWithArrow

// Your app...
const ContentList = styled("ul", {
  display: "grid",
  padding: 22,
  margin: 0,
  columnGap: 10,
  listStyle: "none",

  variants: {
    layout: {
      one: {
        "@media only screen and (min-width: 600px)": {
          width: 500,
          gridTemplateColumns: ".75fr 1fr",
        },
      },
      two: {
        "@media only screen and (min-width: 600px)": {
          width: 600,
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(3, 1fr)",
        },
      },
    },
  },
})

const ListItem = styled("li", {})

const LinkTitle = styled("div", {
  fontWeight: 500,
  lineHeight: 1.2,
  marginBottom: 5,
  color: "$highlight1",
})

const LinkText = styled("p", {
  all: "unset",
  color: "$highlight2",
  lineHeight: 1.4,
  fontWeight: "initial",
})

const ContentListItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuLink>,
  NavigationMenuPrimitive.NavigationMenuLinkProps
>(({ children, title, ...props }, forwardedRef) => (
  <ListItem>
    <NavigationMenuLink
      {...props}
      ref={forwardedRef}
      css={{
        padding: 12,
        borderRadius: 6,
        "&:hover": { backgroundColor: mauve.mauve3 },
      }}
    >
      <LinkTitle>{title}</LinkTitle>
      <LinkText>{children}</LinkText>
    </NavigationMenuLink>
  </ListItem>
))

const ContentListItemCallout = React.forwardRef<
  React.ElementRef<typeof NavigationMenuLink>,
  NavigationMenuPrimitive.NavigationMenuLinkProps
>(({ children, ...props }, forwardedRef) => (
  <ListItem css={{ gridRow: "span 3" }}>
    <NavigationMenuLink
      {...props}
      href='/'
      ref={forwardedRef}
      css={{
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${purple.purple9} 0%, ${indigo.indigo9} 100%);`,
        borderRadius: 6,
        padding: 25,
      }}
    >
      <svg aria-hidden width='38' height='38' viewBox='0 0 25 25' fill='white'>
        <path d='M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z'></path>
        <path d='M12 0H4V8H12V0Z'></path>
        <path d='M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z'></path>
      </svg>
      <LinkTitle
        css={{
          fontSize: 18,
          color: "white",
          marginTop: 16,
          marginBottom: 7,
        }}
      >
        Radix Primitives
      </LinkTitle>
      <LinkText
        css={{
          fontSize: 14,
          color: mauve.mauve4,
          lineHeight: 1.3,
        }}
      >
        Unstyled, accessible components for React.
      </LinkText>
    </NavigationMenuLink>
  </ListItem>
))

const ViewportPosition = styled("div", {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  width: "calc(100% - $8 - $8)",
  top: "100%",
  left: "$8",
  right: "$8",
  perspective: "2000px",
})

export const NavDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ContentList layout='one'>
              {/* <ContentListItemCallout /> */}
              <ContentListItem href='https://stitches.dev/' title='3D Editor'>
                Interactive 3D model editor
              </ContentListItem>
              <ContentListItem href='https://stitches.dev/' title='Solvers'>
                Diverse set of solvers
              </ContentListItem>
              <ContentListItem href='https://stitches.dev/' title='Materials'>
                Comprehensive material library
              </ContentListItem>
              <ContentListItem href='https://stitches.dev/' title='Projects'>
                Automatic project saving
              </ContentListItem>
              <ContentListItem href='https://stitches.dev/' title='Results'>
                Result visualization, auralization, and data export
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ContentList layout='two'>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
              <ContentListItem title='Resource' href='#'>
                Cool link desc here
              </ContentListItem>
            </ContentList>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href='#'>Docs</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href='https://github.com/gregzanch/band'>Github</NavigationMenuLink>
        </NavigationMenuItem>

        <Box css={{ width: "$2" }} />

        <NavigationMenuItem>
          <NavigationMenuLink filled href='/editor'>
            Open App
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuIndicator />
      </NavigationMenuList>

      <ViewportPosition>
        <NavigationMenuViewport />
      </ViewportPosition>
    </NavigationMenu>
  )
}

export default NavDemo
