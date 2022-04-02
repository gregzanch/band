import { Box } from "@/components/shared/Box"
import CameraProperties from "@/components/dom/Properties/CameraProperties"
import ObjectProperties from "@/components/dom/Properties/ObjectProperties"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/Accordion"
import { ResizeBar } from "./ResizeBar"
import { SidebarPanel } from "./SidebarPanel"

export function RightSidebar() {
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
