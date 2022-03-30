import { ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { styled } from "@/styles/stitches.config"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import CameraProperties from "@/components/dom/Properties/CameraProperties"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"
import SceneGraph from "@/components/dom/SceneGraph/SceneGraph"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/Accordion"
import useEditor from "@/state/editor"

const HandleBar = styled("div", {
  position: "absolute",
  height: "calc(100% - 1rem - 8px)",
  width: "2px",
  zIndex: "50",
  marginTop: "16px",
  marginBottom: "16px",
  background: "transparent",
  cursor: "ew-resize",
})

function ResizeBar({ minimumSize = 200, maximumSize = 850 }) {
  const downPoint = useRef<number>(null)
  const handleRef = useRef(null)
  useLayoutEffect(() => {
    const element = document.getElementById("side-panel")
    const resizer = handleRef.current
    let original_width = 0
    let original_height = 0
    let original_x = 0
    let original_y = 0
    let original_mouse_x = 0
    let original_mouse_y = 0

    function resize(e) {
      let width = original_width - (e.pageX - original_mouse_x)
      if (width >= maximumSize) {
        width = maximumSize
      }
      if (width > minimumSize) {
        element.style.width = width + "px"
      }
    }

    function stopResize() {
      window.removeEventListener("mousemove", resize)
    }

    function mouseDownHandler(e) {
      e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue("width").replace("px", ""))
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue("height").replace("px", ""))
      original_x = element.getBoundingClientRect().left
      original_y = element.getBoundingClientRect().top
      original_mouse_x = e.pageX
      original_mouse_y = e.pageY
      window.addEventListener("mousemove", resize)
      window.addEventListener("mouseup", stopResize)
    }

    resizer.addEventListener("mousedown", mouseDownHandler)
    return () => {
      resizer.removeEventListener("mousedown", mouseDownHandler)
    }
  }, [minimumSize, maximumSize])
  return <HandleBar ref={handleRef} />
}

const StyledPanel = styled("div", {
  backgroundColor: "transparent",
  margin: "$2",
  zIndex: "50",
  right: "0px",
  position: "absolute",
  width: "300px",
  overflowY: "scroll",
  maxHeight: "calc(100vh - $2 - $2)",
  // height: "100%",
  // pointerEvents: "none",
})

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

export function SidePanel() {
  // const [expanded, setExpanded] = useState(["scene_graph", "camera_properties", "object_properties"])
  // const selectedObject = useEditor((state) => state.selectedObject)

  return (
    <StyledPanel id='side-panel'>
      <Box
        css={{
          position: "relative",
          pointerEvents: "all",
        }}
      >
        <ResizeBar />
        <Box
          css={{
            mb: "$2",
          }}
        >
          <Accordion type='single' collapsible={false} defaultValue='scene_graph'>
            <AccordionItem value='scene_graph'>
              <AccordionTrigger hideChevron>Scene Graph</AccordionTrigger>
              <AccordionContent>
                <SceneGraph />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>
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
    </StyledPanel>
  )
}
