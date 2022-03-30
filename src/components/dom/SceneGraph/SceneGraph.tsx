//@ts-nocheck
import useEditor from "@/state/editor"
import useStore from "@/state/store"
import { Leva } from "@/components/dom/leva"
import { useEffect, useRef, useState } from "react"
import { Receiver, Source, ObjectType } from "@/state/types"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import { SourceIcon, ReceiverIcon, MeshIcon, GroupIcon } from "@/components/svg/Icons"
// import styled from "styled-components"
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
  backgroundColor: "$elevation1",
  color: "$highlight2",
  fontFamily: "$mono",
  "&:hover": {
    backgroundColor: "$elevation2",
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
  const Icon = IconMap[item.userData.type]
  const selectedObject = useEditor((state) => state.selectedObject)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SceneGraphItemContainer
        css={getIndent(level)}
        selected={selected}
        onClick={() => {
          const { scene } = useEditor.getState()
          const itemRef = scene.getObjectByProperty("uuid", item.userData.id)
          if (itemRef) {
            useEditor.setState({ selectedObject: { current: itemRef } })
          }
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
          }}
        >
          {item.userData.name}
        </Text>
      </SceneGraphItemContainer>
      <CollapsibleContent>
        {item.children.map((child) => (
          <SceneGraphItem
            level={level + 1}
            key={child.uuid}
            item={child}
            selected={selectedObject?.current?.userData?.id === child.userData?.id}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function SceneGraphItem({ item, selected, level = 1 }: SceneGraphItemProps) {
  const Icon = IconMap[item.userData.type]

  const Item =
    item.userData.type === ObjectType.GROUP ? (
      <SceneGraphGroupContainer item={item} selected={selected} level={level} />
    ) : (
      <SceneGraphItemContainer
        css={getIndent(level)}
        selected={selected}
        onClick={() => {
          const { scene } = useEditor.getState()
          const itemRef = scene.getObjectByProperty("uuid", item.userData.id)
          if (itemRef) {
            useEditor.setState({ selectedObject: { current: itemRef } })
          }
        }}
      >
        {/* <Box
          css={{
            width: "15px",
            height: "15px",
          }}
        /> */}
        <Icon size={15} />
        <Text
          size='1'
          as='a'
          css={{
            cursor: "pointer",
            color: "inherit",
            fontFamily: "inherit",
          }}
        >
          {item.userData.name}
        </Text>
      </SceneGraphItemContainer>
    )

  return (
    <ContextMenu>
      <ContextMenuTrigger>{Item}</ContextMenuTrigger>
      <ContextMenuContent sideOffset={5} dir='ltr' outline>
        <ContextMenuItem
          onClick={() => {
            const { scene } = useEditor.getState()
            const itemRef = scene.getObjectByProperty("uuid", item.userData.id)
            if (itemRef) {
              console.groupCollapsed(`(${item.userData.type}) "${item.userData.name}"`)
              console.group("State Data")
              console.log(item)
              console.groupEnd()
              console.group("Three Data")
              console.log(itemRef)
              console.groupEnd()
              console.groupEnd()
            }
          }}
        >
          Show in Console
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default function SceneGraph() {
  const sources = useEditor((state) => state.sources)
  const receivers = useEditor((state) => state.receivers)
  const meshes = useEditor((state) => state.meshes)
  const selectedObject = useEditor((state) => state.selectedObject)

  return (
    <div className='h-full'>
      {Object.entries(sources).map(([id, source]) => (
        <SceneGraphItem key={id} item={source} selected={selectedObject?.current?.userData?.id === id} />
      ))}
      {Object.entries(receivers).map(([id, receiver]) => (
        <SceneGraphItem key={id} item={receiver} selected={selectedObject?.current?.userData?.id === id} />
      ))}
      {Object.entries(meshes).map(([id, receiver]) => (
        <SceneGraphItem key={id} item={receiver} selected={selectedObject?.current?.userData?.id === id} />
      ))}
    </div>
  )
}
