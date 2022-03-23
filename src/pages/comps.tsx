import { DarkThemeButton } from "@/components/custom/DarkThemeButton"
import DropdownMenuDemo from "@/components/custom/DropdownMenuDemo"
import { MainMenu } from "@/components/custom/MainMenu"
import { Toolbar } from "@/components/custom/Toolbar"
import { Box } from "@/components/shared/Box"

const Comps = () => {
  return (
    <Box css={{ height: "100%", bc: "$canvas" }}>
      <Toolbar />
      <Box>
        <DropdownMenuDemo />
        <MainMenu />
      </Box>
    </Box>
  )
}

export default Comps
