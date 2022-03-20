import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import styled from "styled-components"
import Box from "@/components/shared/Box"
import Text from "@/components/shared/Text"
import CameraProperties from "@/components/dom/Properties/CameraProperties"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"
import SceneGraph from "@/components/dom/SceneGraph"

const StyledPanel = styled.div`
  background-color: var(--leva-colors-elevation1);
  margin: 0.5rem;
  height: calc(100% - 1rem);
  border-radius: var(--leva-space-md);
  z-index: 50;
  right: 0px;
  position: absolute;
  box-shadow: var(--leva-shadows-level1);
  width: 300px;
  padding-top: 18px;
`

const HeaderContainer = styled(Box)`
  &:hover {
    background-color: var(--leva-colors-elevation3);
  }
  cursor: pointer;
  display: flex;
`

function SidePanelSectionHeader({ title, expanded, onExpand, id }) {
  return (
    <HeaderContainer width='100%' onClick={() => onExpand(id, !expanded)}>
      <Box mx='8px' my='4px' display='flex' justifyContent='space-between' width='100%'>
        <Text as='a' fontSize='12px' cursor='pointer'>
          {title}
        </Text>
        <Text as='a' fontSize='12px'>
          {expanded ? "-" : "+"}
        </Text>
      </Box>
    </HeaderContainer>
  )
}

type SidePanelSectionProps = {
  title: string | ReactNode
  expanded?: boolean
  onExpand?: (key: string, expanded: boolean) => void
  children?: React.ReactChild | React.ReactChildren
  id: string
}

export function SidePanelSection({ title, expanded, onExpand, children, id }: SidePanelSectionProps) {
  return (
    <Box width='100%'>
      <SidePanelSectionHeader title={title} expanded={expanded} onExpand={onExpand} id={id} />
      {expanded && <Box>{children}</Box>}
    </Box>
  )
}

const Divider = styled.hr`
  border-top: 1px solid rgba(0, 0, 0, 30%);
`

export function SidePanel() {
  const [expanded, setExpanded] = useState(["scene_graph", "camera_properties", "object_properties"])

  const onExpand = useCallback((id, expanded) => {
    setExpanded((prev) => (expanded ? [...prev, id] : prev.filter((x) => x !== id)))
  }, [])

  return (
    <StyledPanel>
      <Divider />
      <SidePanelSection
        id='scene_graph'
        title='Scene Graph'
        expanded={expanded.includes("scene_graph")}
        onExpand={onExpand}
      >
        <SceneGraph />
      </SidePanelSection>
      <Divider />
      <SidePanelSection
        id='camera_properties'
        title='Camera Properties'
        expanded={expanded.includes("camera_properties")}
        onExpand={onExpand}
      >
        <CameraProperties />
      </SidePanelSection>
      <Divider />
      <SidePanelSection
        id='object_properties'
        title='Object Properties'
        expanded={expanded.includes("object_properties")}
        onExpand={onExpand}
      >
        <ObjectProperties />
      </SidePanelSection>
      <Divider />
    </StyledPanel>
  )
}
