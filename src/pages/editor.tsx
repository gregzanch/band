import { SidePanel } from "@/components/dom/SidePanel"
import Editor from "@/components/canvas/Editor/Editor"
import MenuBar from "@/components/dom/MenuBar"
import { MainMenu } from "@/components/dom/MainMenu"
import { Box } from "@/components/shared/Box"
import { useEffect } from "react"
import { darkTheme, theme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"
import shallow from "zustand/shallow"

export default function EditorPage() {
  const currTheme = useTheme((state) => state.theme)

  useEffect(() => {
    Object.assign(window, { useTheme })
    document.body.classList.remove(theme, darkTheme)
    document.body.classList.add(currTheme)
  }, [currTheme])

  return (
    <>
      <Box
        css={{
          position: "absolute",
          zIndex: 500,
          margin: "$2",
        }}
      >
        <MainMenu />
      </Box>
      <SidePanel />
      <Editor />
    </>
  )
}
