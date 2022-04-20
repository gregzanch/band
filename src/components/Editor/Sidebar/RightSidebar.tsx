import { Box } from "@/components/shared/Box"
import CameraProperties from "@/components/Editor/Properties/CameraProperties"
import ObjectProperties from "@/components/Editor/Properties/ObjectProperties"
import HistoryPanel from "@/components/Editor/HistoryPanel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/Accordion"
import { ResizeBar } from "./ResizeBar"
import { SidebarPanel } from "./SidebarPanel"
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/shared/ScrollArea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/Tabs"
import { Button } from "@/components/shared/Button";
import useEditor from "../State/useEditor";

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

        <Box css={{ mb: "$2" }}>
          <Tabs defaultValue='object'>
            <TabsList aria-label='Control panel'>
              <TabsTrigger value='object'>Object</TabsTrigger>
              <TabsTrigger value='scene'>Scene</TabsTrigger>
              <TabsTrigger value='project'>Project</TabsTrigger>
            </TabsList>
            <TabsContent value='object'>
              <ObjectProperties />
            </TabsContent>
            <TabsContent value='scene'>
              <CameraProperties />
            </TabsContent>
            <TabsContent value='project'>
              <HistoryPanel />
            </TabsContent>
          </Tabs>
        </Box>
      </Box>
    </SidebarPanel>
  );
}
