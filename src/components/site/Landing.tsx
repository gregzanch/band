import Logo from "@/components/svg/Logo"
import Link from "next/link"
import Head from "next/link"
import { Box } from "@/components/shared/Box"
import { Container } from "@/components/shared/Container"

import { Text } from "@/components/shared/Text"

import React from "react"
import { darkTheme, theme, styled } from "@/styles/stitches.config"
import { IconButton } from "@/components/shared/IconButton"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import useTheme from "@/state/theme"

import { NavDemo } from "@/components/site/NavDemo"

export function DarkThemeButton() {
  const currTheme = useTheme((state) => state.theme)
  const set = useTheme((state) => state.set)

  React.useEffect(() => {
    document.body.classList.remove(theme, darkTheme)
    document.body.classList.add(currTheme)
  }, [currTheme])

  return (
    <Box
      css={{
        position: "fixed",
        bottom: "$2",
        left: "$2",
      }}
    >
      <IconButton onClick={() => set({ theme: currTheme === theme ? darkTheme : theme })}>
        {currTheme === theme ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </Box>
  )
}

const StickyContainer = styled(Box, {
  // border: "1px solid white",
  my: "$4",
  position: "fixed",
  top: 0,
})

function Landing() {
  return (
    <>
      <StickyContainer>
        <NavDemo />
      </StickyContainer>
      <Box
        css={{
          paddingTop: "calc(8 * $4)",
          overflow: "auto",
        }}
      >
        <Container
          size={2}
          css={{
            display: "flex",
            justifyContent: "center",
            fd: "column",
            ai: "center",
          }}
        >
          <Text
            size={9}
            css={{
              // width: "fit-content",
              fontFamily: "$sans",
              textAlign: "center",
              // whiteSpace: "break-spaces",

              color: "$orange10",
            }}
          >
            Band
          </Text>
          <Text
            size={8}
            variant='contrast'
            css={{
              fontWeight: 300,
              width: "fit-content",
              fontFamily: "$sans",
              textAlign: "center",
              whiteSpace: "break-spaces",
            }}
          >
            a modern acoustic simulator
          </Text>
        </Container>
        <Logo />
      </Box>
      <DarkThemeButton />
    </>
  )
}

export default Landing
