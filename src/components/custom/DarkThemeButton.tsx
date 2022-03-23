import React from "react"
import { darkTheme } from "@/styles/stitches.config"
import { IconButton } from "@/components/shared/IconButton"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export function DarkThemeButton() {
  const [theme, setTheme] = React.useState("theme-default")

  React.useEffect(() => {
    document.body.classList.remove("theme-default", darkTheme)
    document.body.classList.add(theme)
  }, [theme])

  return (
    <IconButton onClick={() => setTheme(theme === "theme-default" ? darkTheme : "theme-default")}>
      {theme === "theme-default" ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}
