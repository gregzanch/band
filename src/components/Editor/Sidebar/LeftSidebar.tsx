import { ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { useIsomorphicLayoutEffect } from "@/hooks"
import { styled } from "@/styles/stitches.config"
import { Box } from "@/components/shared/Box"
import { Text } from "@/components/shared/Text"
import CameraProperties from "@/components/Editor/Properties/CameraProperties"
import ObjectProperties from "@/components/Editor/Properties/ObjectProperties"
import SceneGraph from "@/components/Editor/SceneGraph/SceneGraph"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/Accordion"
import useEditor from "@/components/Editor/State/useEditor"
import { ResizeBar } from "./ResizeBar"
import { SidebarPanel } from "./SidebarPanel"

import { MainMenu } from "../MainMenu"
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "@/components/shared/ScrollArea"

export function LeftSidebar() {
  return (
    <SidebarPanel
      side='left'
      role='menubar'
      aria-orientation='vertical'
      dir='ltr'
      aria-label='Left panel'
      data-orientation='vertical'
    >
      <Box
        css={{
          position: "relative",
          pointerEvents: "all",
        }}
      >
        <ResizeBar
          side='right'
          onResize={(width) => {
            useEditor.setState({ orientationHelperMarginX: 80 + width })
          }}
        />

        <Box css={{ mb: "$2" }}>
          <Accordion type='single' collapsible={false} defaultValue='scene_graph'>
            <AccordionItem
              value='scene_graph'
              css={{
                height: "calc(100vh - $2 - $2)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AccordionTrigger hideChevron>
                <Box
                  css={{
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
                    Scene Graph
                  </Text>
                  <MainMenu />
                </Box>
              </AccordionTrigger>
              <AccordionContent css={{ flex: "1" }}>
                <ScrollArea css={{ width: "100%" }}>
                  <ScrollAreaViewport>
                    <SceneGraph />
                  </ScrollAreaViewport>
                  <ScrollAreaScrollbar orientation='vertical'>
                    <ScrollAreaThumb />
                  </ScrollAreaScrollbar>
                  <ScrollAreaScrollbar orientation='horizontal'>
                    <ScrollAreaThumb />
                  </ScrollAreaScrollbar>
                  <ScrollAreaCorner />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </SidebarPanel>
  )
}
