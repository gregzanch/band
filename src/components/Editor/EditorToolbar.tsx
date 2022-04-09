import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarButton,
} from "../shared/Toolbar"

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
import useEditor from "./State/useEditor"

export function EditorToolbar() {
  const transformType = useEditor((state) => state.transformType)

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
      <Toolbar aria-label='Editor toolbar'>
        <ToolbarToggleGroup
          type='single'
          aria-label='Transform type'
          value={transformType}
          onValueChange={(val: "translate" | "rotate" | "scale") => {
            useEditor.setState({ transformType: val })
          }}
        >
          <ToolbarToggleItem value='translate' aria-label='Translate'>
            <MoveIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='rotate' aria-label='Rotate'>
            <SymbolIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='scale' aria-label='Scale'>
            <SizeIcon />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    </Box>
  )
}
