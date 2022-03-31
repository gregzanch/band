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
    <IconButton onClick={() => set({ theme: currTheme === theme ? darkTheme : theme })}>
      {currTheme === "theme-default" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}

const OpenEditorButton = () => {
  return (
    <button className='btn btn-blue'>
      <Link href={"/editor"} passHref>
        <a>Open Editor</a>
      </Link>
    </button>
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
          paddingTop: "calc(4 * $4)",
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
            variant='yellow'
            gradient
            css={{
              width: "fit-content",
              fontFamily: "$sans",
              textAlign: "center",
              whiteSpace: "break-spaces",
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
        <OpenEditorButton />
        <DarkThemeButton />
        <Text
          css={{
            whiteSpace: "break-spaces",
          }}
          size={7}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        </Text>
      </Box>
    </>
  )
}

export default Landing
