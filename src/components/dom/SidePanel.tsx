import { ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import CameraProperties from "@/components/dom/Properties/CameraProperties"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"
import SceneGraph from "@/components/dom/SceneGraph/SceneGraph"
import { ResizeTopLeftIcon } from "../svg/Icons"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/dom/Accordian"
import useEditor from "@/state/editor"
import CollapsibleDemo from "./CollapsibleDemo"

const Handle = styled.div`
  cursor: ew-resize;
  color: var(--leva-colors-highlight2);
  &:hover,
  &:focus,
  &:active {
    color: white;
  }
  width: 8px;
  height: 8px;
  display: contents;
`

function ResizeHandle({ minimumSize = 200, maximumSize = 600 }) {
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
    resizer.addEventListener("mousedown", function (e) {
      console.log(e)
      e.preventDefault()
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue("width").replace("px", ""))
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue("height").replace("px", ""))
      original_x = element.getBoundingClientRect().left
      original_y = element.getBoundingClientRect().top
      original_mouse_x = e.pageX
      original_mouse_y = e.pageY
      window.addEventListener("mousemove", resize)
      window.addEventListener("mouseup", stopResize)
    })

    function resize(e) {
      let width = original_width - (e.pageX - original_mouse_x)
      if (width >= maximumSize) {
        width = maximumSize
      }
      if (width > minimumSize) {
        element.style.width = width + "px"
        // element.style.right = "0px"
        // element.style.left = original_x + (e.pageX - original_mouse_x) + "px"
      }
    }

    function stopResize() {
      window.removeEventListener("mousemove", resize)
    }
  }, [minimumSize, maximumSize])
  return (
    <Handle ref={handleRef}>
      <ResizeTopLeftIcon />
    </Handle>
  )
}

const HandleBar = styled.div`
  position: absolute;
  height: calc(100% - 1rem - 8px);
  width: 2px;
  z-index: 50;
  margin-top: 16px;
  margin-bottom: 16px;
  /* background: var(--leva-colors-elevation3); */
  background: transparent;
  cursor: ew-resize;
`

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

const StyledPanel = styled.div.attrs((props) => {
  return {
    //@ts-ignore
    width: props.width,
  }
})`
  background-color: var(--leva-colors-elevation1);
  margin: 0.5rem;
  height: calc(100% - 1rem);
  border-radius: var(--leva-space-md);
  z-index: 50;
  right: 0px;
  position: absolute;
  box-shadow: var(--leva-shadows-level1);
  /* width: 300px; */
  width: ${(props) => props.width || 300}px;
  /* padding-top: 18px; */
`

const HeaderContainer = styled(Box)`
  color: var(--leva-colors-highlight2);
  &:hover {
    background-color: var(--leva-colors-elevation3);
    color: #e0e0e0;
  }
  cursor: pointer;
  display: flex;
`

function SidePanelSectionHeader({ title, expanded, onExpand, id }) {
  return (
    //@ts-ignore
    <HeaderContainer width='100%' onClick={() => onExpand(id, !expanded)}>
      {/* @ts-ignore */}
      <Box mx='8px' my='4px' display='flex' justifyContent='space-between' width='100%'>
        {/* @ts-ignore */}
        <Text as='a' fontSize='12px' cursor='pointer' color='inherit'>
          {title}
        </Text>
        {/* @ts-ignore */}
        <Text as='a' fontSize='12px' color='inherit'>
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
    //@ts-ignore
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
  const selectedObject = useEditor((state) => state.selectedObject)

  // const objPropRef = useRef(null)
  // const objectPropertiesStyle = {}
  // if (objPropRef.current) {
  //   const content = objPropRef.current.querySelector("#object-properties")
  //   if (content) {
  //     const contentRect = content.getBoundingClientRect()
  //     const height = contentRect.height
  //     objectPropertiesStyle["--radix-collapsible-content-height"] = `${height}px !important`
  //     console.log(objectPropertiesStyle)
  //   }
  // }

  return (
    <StyledPanel id='side-panel'>
      <ResizeBar />
      <Accordion type='multiple' value={expanded} onValueChange={setExpanded}>
        <AccordionItem value='scene_graph'>
          <AccordionTrigger>Scene Graph</AccordionTrigger>
          <AccordionContent>
            <SceneGraph />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='camera_properties'>
          <AccordionTrigger>Camera Properties</AccordionTrigger>
          <AccordionContent>
            <CameraProperties />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type='single' collapsible={false} defaultValue='object_properties'>
        <AccordionItem value='object_properties'>
          <AccordionTrigger hideChevron>Object Properties</AccordionTrigger>
          <AccordionContent>
            {/* <RandContent /> */}
            <ObjectProperties />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </StyledPanel>
  )
}
