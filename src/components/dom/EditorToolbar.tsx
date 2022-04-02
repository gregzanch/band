import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarButton,
} from "@/components/shared/Toolbar"

import {
  MoveIcon,
  SymbolIcon,
  SizeIcon,
  GroupIcon,
  HandIcon,
  PlusIcon,
  CubeIcon,
  TrashIcon,
  TargetIcon,
  CopyIcon,
} from "@radix-ui/react-icons"
import { Box } from "../shared/Box"

export function EditorToolbar() {
  console.log("render")
  return (
    <Box
      css={{
        position: "absolute",
        // width: "100%",
        mt: "$2",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "$max",
      }}
    >
      <Toolbar aria-label='Formatting options'>
        <ToolbarToggleGroup type='multiple' aria-label='Text formatting'>
          <ToolbarToggleItem value='bold' aria-label='Bold'>
            <MoveIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='italic' aria-label='Italic'>
            <SymbolIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='strikethrough' aria-label='Strike through'>
            <SizeIcon />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup type='single' defaultValue='center' aria-label='Text alignment'>
          <ToolbarToggleItem value='left' aria-label='Left aligned'>
            <TargetIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='center' aria-label='Center aligned'>
            <CopyIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='right' aria-label='Right aligned'>
            <TrashIcon />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    </Box>
  )
}
