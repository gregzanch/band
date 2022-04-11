//@ts-nocheck
import useEditor from "@/components/Editor/State/useEditor"
import { useEffect, useRef, useState } from "react"
import { Receiver, Source, ObjectType } from "@/components/Editor/Objects/types"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import { SourceIcon, ReceiverIcon, MeshIcon, GroupIcon } from "@/components/shared/Icons"

import { styled } from "@/styles/stitches.config"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
} from "@/components/shared/ContextMenu"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/shared/Collapsible"
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons"
const SceneGraphItemContainer = styled(Box, {
  cursor: "pointer",
  display: "flex",
  width: "100%",
  flexDirection: "row",

  paddingLeft: "$2",
  paddingRight: "$2",
  paddingTop: "$1",
  paddingBottom: "$1",
  gap: "8px",
  alignItems: "flex-start",
  backgroundColor: "$slate2",
  color: "$highlight2",
  fontFamily: "$mono",
  "&:hover": {
    backgroundColor: "$slate3",
    color: "$hiContrast",
  },
  variants: {
    selected: {
      true: {
        backgroundColor: "$blue9",
        color: "$hiContrast",
        "&:hover": {
          backgroundColor: "$blue9",
          color: "$hiContrast",
        },
      },
    },
  },
})

type IconProps = {
  color?: string
  size?: number
}

const IconMap = {
  [ObjectType.SOURCE]: ({ color, size = 24 }: IconProps) => <SourceIcon color={color} size={size} />,
  [ObjectType.RECEIVER]: ({ color, size = 24 }: IconProps) => <ReceiverIcon color={color} size={size} />,
  [ObjectType.MESH]: ({ color, size = 24 }: IconProps) => <MeshIcon color={color} size={size} />,
  [ObjectType.GROUP]: ({ color, size = 24 }: IconProps) => <GroupIcon color={color} size={size} />,
}

const StyledCollapsibleTrigger = styled(CollapsibleTrigger, {
  'svg[name="scene-graph-collapse-icon"]': {
    transition: "transform 175ms cubic-bezier(0.65, 0, 0.35, 1)",
  },
  '&[data-state="open"]': {
    'svg[name="scene-graph-collapse-icon"]': {
      transform: "rotate(90deg)",
    },
  },
})

type SceneGraphItemProps<T = Source | Receiver | Mesh | Group> = {
  item: T
  selected: boolean
  level: number
}

function getIndent(level: number) {
  const multiplier = level === 1 ? 1 : 2
  return {
    paddingLeft: `calc(${multiplier} * ${level} * $2)`,
  }
}

function SceneGraphGroupContainer({ item, selected, level = 1 }: SceneGraphItemProps<Group>) {
  const [open, setOpen] = useState(true)
  const Icon = IconMap[item.type]
  const selection = useEditor((state) => state.selection)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SceneGraphItemContainer
        css={getIndent(level)}
        selected={selected}
        onClick={(e) => {
          useEditor.getState().signals.objectSelected.dispatch(item, {
            meta: e.metaKey,
            shift: e.shiftKey,
          })
        }}
      >
        <StyledCollapsibleTrigger>
          <ChevronRightIcon name='scene-graph-collapse-icon' />
        </StyledCollapsibleTrigger>
        <Icon size={15} />
        <Text
          size='1'
          as='a'
          css={{
            cursor: "pointer",
            color: "inherit",
            fontFamily: "inherit",
            userSelect: "none",
          }}
        >
          {item.name}
        </Text>
      </SceneGraphItemContainer>
      <CollapsibleContent>
        {item.children.map((child) => (
          <SceneGraphItem level={level + 1} key={child.uuid} item={child} selected={selection.includes(child)} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function SceneGraphItem({ item, selected, level = 1 }: SceneGraphItemProps) {
  const Icon = IconMap[item.type]

  const Item =
    item.type === ObjectType.GROUP ? (
      <SceneGraphGroupContainer item={item} selected={selected} level={level} />
    ) : (
      <SceneGraphItemContainer
        css={getIndent(level)}
        selected={selected}
        onClick={(e) => {
          useEditor.getState().signals.objectSelected.dispatch(item, {
            meta: e.metaKey,
            shift: e.shiftKey,
          })
        }}
      >
        <Icon size={15} />
        <Text
          size='1'
          as='a'
          css={{
            cursor: "pointer",
            color: "inherit",
            fontFamily: "inherit",
            userSelect: "none",
          }}
        >
          {item.name}
        </Text>
      </SceneGraphItemContainer>
    )

  return (
    <ContextMenu>
      <ContextMenuTrigger>{Item}</ContextMenuTrigger>
      <ContextMenuContent sideOffset={5} dir='ltr' outline>
        <ContextMenuItem
          onClick={() => {
            console.log(item)
          }}
        >
          Show in Console
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function SceneGraph() {
  const objects = useEditor((state) => state.objects)
  const selection = useEditor((state) => state.selection)

  return (
    <Box fillHeight>
      {Object.entries(objects).map(([id, object]) => (
        <SceneGraphItem key={id} item={object} selected={selection.includes(object)} />
      ))}
    </Box>
  )
}
