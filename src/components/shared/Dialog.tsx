import React from "react"
import { styled, CSS } from "@/styles/stitches.config"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross1Icon } from "@radix-ui/react-icons"
import { overlayStyles } from "./Overlay"
import { panelStyles } from "./Panel"
import { IconButton } from "./IconButton"

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  children: React.ReactNode
}

const StyledOverlay = styled(DialogPrimitive.Overlay, overlayStyles, {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
})

export function Dialog({ children, ...props }: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </DialogPrimitive.Root>
  )
}

const StyledContent = styled(DialogPrimitive.Content, panelStyles, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(calc(-50% + 0.5px), calc(-50% + 0.5px))",
  // transform: "translate(-50%, -50%)",
  // minWidth: 200,
  // width: "85vw",
  // maxHeight: "85vh",
  // height: "85vh",
  p: "$2",
  my: "auto",
  zIndex: "$max",
  willChange: "transform",
  "&:focus": {
    outline: "none",
  },
});

const StyledCloseButton = styled(DialogPrimitive.Close, {
  position: "absolute",
  top: "$2",
  right: "$2",
});

export const DialogContent = StyledContent;

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogCloseButton = StyledCloseButton;
export const DialogClose = DialogPrimitive.Close;

export const DialogTitle = styled(DialogPrimitive.Title, {
  color: "$hiContrast",
  fontWeight: 400,
  display: "inherit",
  fontFamily: "$untitled",
  fontSize: "$4",
  fontVariantNumeric: "tabular-nums",
  cursor: "default",
  whiteSpace: "nowrap",
});

export const DialogDescription = styled(DialogPrimitive.Description, {
  color: "$hiContrast",
});
export const DialogOverlay = StyledOverlay;