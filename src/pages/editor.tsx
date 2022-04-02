import { RightSidebar } from "@/components/Editor/Sidebar/RightSidebar"
import { EditorToolbar } from "@/components/Editor/EditorToolbar"
import { LeftSidebar } from "@/components/Editor/Sidebar/LeftSidebar"
import Editor from "@/components/Editor/Editor"

import { MainMenu } from "@/components/Editor/MainMenu"
import { Box } from "@/components/Shared/Box"
import { useEffect } from "react"
import { globalCss, darkTheme, lightTheme } from "@/styles/stitches.config"
import useTheme from "@/state/theme"

const globalStyles = globalCss({
  html: { width: "100%", height: "100%", margin: 0, padding: 0 },
  body: { width: "100%", height: "100%", margin: 0, padding: 0 },
  "#__next": { width: "100%", height: "100%", margin: 0, padding: 0 },
  ".csr-container": { width: "100%", height: "100%", margin: 0, padding: 0 },
})

export default function EditorPage() {
  const currTheme = useTheme((state) => state.theme)

  useEffect(() => {
    Object.assign(window, { useTheme })
    document.body.classList.remove(lightTheme, darkTheme)
    document.body.classList.add(currTheme)
  }, [currTheme])

  globalStyles()

  return (
    <>
      {/* <Box
        css={{
          position: "absolute",
          zIndex: 500,
          margin: "$2",
        }}
      >
        <MainMenu />
      </Box> */}

      <EditorToolbar />
      <LeftSidebar />
      <RightSidebar />
      <Editor />
    </>
  )
}
