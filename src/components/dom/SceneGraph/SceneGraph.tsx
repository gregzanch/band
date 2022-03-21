import useEditor from "@/state/editor"
import useStore from "@/state/store"
import { Leva } from "@/components/dom/leva"
import { useEffect, useRef } from "react"
import { Receiver, Source, ObjectType } from "@/state/types"
import Box from "@/components/shared/Box"
import Text from "@/components/shared/Text"
import { SourceIcon, ReceiverIcon } from "@/components/svg/Icons"
import styled from "styled-components"

const SceneGraphItemContainer = styled(Box)`
  background-color: ${(props) => (props.selected ? "#1A4884" : "var(--leva-colors-elevation2)")};
  color: ${(props) => (props.selected ? "#e0e0e0" : "var(--leva-colors-highlight2)")};
  &:hover {
    background-color: #1e2228;
    /* border: 1px solid var(--leva-colors-accent1); */
  }
  cursor: pointer;
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 8px 8px;
  gap: 8px;
  align-items: flex-start;
  /* height: 24px; */
`

type IconProps = {
  color?: string
  size?: number
}

const IconMap = {
  [ObjectType.SOURCE]: ({ color, size = 24 }: IconProps) => <SourceIcon color={color} size={size} />,
  [ObjectType.RECEIVER]: ({ color, size = 24 }: IconProps) => <ReceiverIcon color={color} size={size} />,
}

type SceneGraphItemProps = {
  item: Source | Receiver
  selected: boolean
}

function SceneGraphItem({ item, selected }: SceneGraphItemProps) {
  const Icon = IconMap[item.userData.type]
  return (
    <SceneGraphItemContainer selected={selected}>
      <Icon size={18} />
      <Box mt='2px'>
        <Text color='inherit' fontSize='12px'>
          {item.userData.name}
        </Text>
      </Box>
    </SceneGraphItemContainer>
  )
}

export default function SceneGraph() {
  const sources = useEditor((state) => state.sources)
  const receivers = useEditor((state) => state.receivers)
  const selectedObject = useEditor((state) => state.selectedObject)
  console.log(selectedObject)
  return (
    <div className='h-full'>
      {Object.entries(sources).map(([id, source]) => (
        <SceneGraphItem key={id} item={source} selected={selectedObject?.current?.userData?.id === id} />
      ))}
      {Object.entries(receivers).map(([id, receiver]) => (
        <SceneGraphItem key={id} item={receiver} selected={selectedObject?.current?.userData?.id === id} />
      ))}
    </div>
  )
}
