import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks"
import { styled } from "@/styles/stitches.config"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import CameraProperties from "@/components/dom/Properties/CameraProperties"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"
import SceneGraph from "@/components/dom/SceneGraph/SceneGraph"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/Accordion"
import useEditor from "@/state/editor"
import { ResizeBar } from "./ResizeBar"
import { SidebarPanel } from "./SidebarPanel"

const HeaderContainer = styled(Box, {
  color: "$highlight2",
  "&:hover": {
    backgroundColor: "$elevation3",
    color: "#e0e0e0",
  },
  cursor: "pointer",
  display: "flex",
})

function SidePanelSectionHeader({ title, expanded, onExpand, id }) {
  return (
    <HeaderContainer
      css={{
        width: "100%",
      }}
      onClick={() => onExpand(id, !expanded)}
    >
      <Box
        css={{
          mx: "8px",
          my: "4px",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          as='a'
          size='2'
          css={{
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {title}
        </Text>
        <Text
          as='a'
          size='2'
          css={{
            cursor: "pointer",
            color: "inherit",
          }}
        >
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
    <Box
      css={{
        width: "100%",
      }}
    >
      <SidePanelSectionHeader title={title} expanded={expanded} onExpand={onExpand} id={id} />
      {expanded && <Box>{children}</Box>}
    </Box>
  )
}

const Divider = styled("hr", {
  borderTop: "1px solid rgba(0, 0, 0, 30%)",
})

export function RightSidebar() {
  // const [expanded, setExpanded] = useState(["scene_graph", "camera_properties", "object_properties"])
  // const selectedObject = useEditor((state) => state.selectedObject)

  return (
    <SidebarPanel
      side='right'
      role='menubar'
      aria-orientation='vertical'
      dir='ltr'
      aria-label='right panel'
      data-orientation='vertical'
    >
      <Box
        css={{
          position: "relative",
          pointerEvents: "all",
        }}
      >
        <ResizeBar side='left' />
        <Box
          css={{
            mb: "$2",
          }}
        >
          <Accordion type='single' collapsible={false} defaultValue='object_properties'>
            <AccordionItem value='object_properties'>
              <AccordionTrigger hideChevron>Object Properties</AccordionTrigger>
              <AccordionContent>
                <ObjectProperties />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>

        <Accordion type='single' defaultValue='camera_properties' collapsible>
          <AccordionItem value='camera_properties'>
            <AccordionTrigger>Camera Properties</AccordionTrigger>
            <AccordionContent>
              <CameraProperties />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Box>
    </SidebarPanel>
  )
}
