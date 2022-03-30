import { SidePanel } from "@/components/dom/SidePanel"
import Editor from "@/components/canvas/Editor/Editor"
import MenuBar from "@/components/dom/MenuBar"
import { MainMenu } from "@/components/custom/MainMenu"
import { Box } from "@/components/shared/Box"
import { useEffect } from "react"
import { darkTheme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"
import shallow from "zustand/shallow"

export default function EditorPage() {
  const mode = useTheme((state) => state.mode)

  useEffect(() => {
    Object.assign(window, { useTheme })
    document.body.classList.remove("theme-default", darkTheme)
    document.body.classList.add(mode)
  }, [mode])

  return (
    <>
      <Box
        css={{
          position: "absolute",
          zIndex: 500,
          margin: "$1",
        }}
      >
        <MainMenu />
      </Box>
      <SidePanel />
      <Editor />
    </>
  )
}
