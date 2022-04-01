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

import { MainMenu } from "../MainMenu"

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
        <ResizeBar side='right' />
        <Box
          css={{
            mb: "$2",
          }}
        >
          <Accordion type='single' collapsible={false} defaultValue='scene_graph'>
            <AccordionItem value='scene_graph'>
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
              <AccordionContent>
                <SceneGraph />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Box>
      </Box>
    </SidebarPanel>
  )
}
