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
import { traverseUpUntil } from "@/helpers/dom/traverseUpUntil"

export const HandleBar = styled("div", {
  position: "absolute",
  // height: "calc(100% - 1rem - 8px)",
  height: "100%",
  width: "$1",

  borderRadius: ".5rem",
  zIndex: "50",
  background: "$accent2",
  opacity: "0",
  cursor: "ew-resize",
  "@media (prefers-reduced-motion: no-preference)": {
    transitionProperty: "opacity",
    transitionDuration: "200ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: "100ms",
  },
  "&:hover, &:focus, &:active": {
    opacity: "1",
  },

  variants: {
    side: {
      right: {
        pl: "$1",
        right: "-$2",
      },
      left: {
        pr: "$1",
        left: "-$2",
      },
    },
  },
})

type ResizeBarProps = {
  side: "right" | "left"
  minimumSize?: number
  maximumSize?: number
  onResize?: (width: number) => void
}

export function ResizeBar({ side = "right", minimumSize = 10, maximumSize = 850, onResize }: ResizeBarProps) {
  const downPoint = useRef<number>(null)
  const handleRef = useRef(null)
  const parent = useRef<HTMLElement | false>(null)
  useIsomorphicLayoutEffect(() => {
    if (parent.current === null) {
      if (handleRef.current) {
        const elt = traverseUpUntil(
          handleRef.current,
          (elt: HTMLElement) => elt.getAttribute && elt.getAttribute("role") === "menubar"
        )
        parent.current = (elt as HTMLElement) || false
      }
    }
    const element = parent.current
    if (element) {
      const resizer = handleRef.current
      let original_width = 0
      let original_height = 0
      let original_x = 0
      let original_y = 0
      let original_mouse_x = 0
      let original_mouse_y = 0

      const resize = (e) => {
        let width = original_width - (side === "right" ? original_mouse_x - e.pageX : e.pageX - original_mouse_x)
        if (width >= maximumSize) {
          width = maximumSize
        }
        if (width > minimumSize) {
          element.style.width = width + "px"
          onResize && onResize(width)
        }
      }

      const stopResize = () => {
        window.removeEventListener("mousemove", resize)
      }

      const mouseDownHandler = (e) => {
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
    }
  }, [minimumSize, maximumSize])
  return <HandleBar side={side} ref={handleRef} />
}
