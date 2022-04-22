import React from "react"
import { styled } from "@/styles/stitches.config"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Box } from "./Box"
import { Text } from "./Text"

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root> &
  React.ComponentProps<typeof TooltipPrimitive.Content> & {
    children: React.ReactElement
    content: React.ReactNode
    multiline?: boolean
  }

const Content = styled(TooltipPrimitive.Content, {
  backgroundColor: "$toolTipBackground",
  color: "$toolTipText",
  borderRadius: "$1",
  padding: "$1 $2",

  variants: {
    multiline: {
      true: {
        maxWidth: 250,
        pb: 7,
      },
    },
  },
});

export function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  multiline,
  delayDuration,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      // open={open}
      open={open}
      defaultOpen
      // defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <Content side='left' align='end' sideOffset={5} {...props} multiline={multiline}>
        <Text
          size='1'
          as='p'
          wrap={multiline}
          css={{
            color: "$toolTipText",
            lineHeight: multiline ? "20px" : (undefined as any),
          }}
        >
          {content}
        </Text>
        <Box css={{ color: "$toolTipBackground" }}>
          <TooltipPrimitive.Arrow
            offset={5}
            width={11}
            height={5}
            style={{
              fill: "currentColor",
            }}
          />
        </Box>
      </Content>
    </TooltipPrimitive.Root>
  );
}
