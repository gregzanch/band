import React from "react"
import { styled, keyframes } from "@/styles/stitches.config";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { overlayStyles } from "./Overlay";
import { panelStyles } from "./Panel";

type AlertDialogProps = React.ComponentProps<typeof AlertDialogPrimitive.Root> & {
  children: React.ReactNode;
};

const overlayShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const contentShow = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

const StyledOverlay = styled(AlertDialogPrimitive.Overlay, overlayStyles, {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export function AlertDialog({ children, ...props }: AlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root {...props}>
      <StyledOverlay />
      {children}
    </AlertDialogPrimitive.Root>
  );
}

export const AlertDialogContent = styled(AlertDialogPrimitive.Content, panelStyles, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 200,
  maxHeight: "85vh",
  padding: "$2",
  marginTop: "-5vh",
  zIndex: "$max",
  "@media (prefers-reduced-motion: no-preference)": {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  "&:focus": { outline: "none" },
});

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogTitle = styled(AlertDialogPrimitive.Title, {
  color: "$hiContrast",
  fontWeight: 400,
  display: "inherit",
  fontFamily: "$untitled",
  fontSize: "$4",
  fontVariantNumeric: "tabular-nums",
  cursor: "default",
  whiteSpace: "nowrap",
});

export const AlertDialogDescription = styled(AlertDialogPrimitive.Description, {
  color: "$highlight2",
  fontWeight: 400,
  display: "block",
  fontFamily: "$untitled",
  fontSize: "$2",
  fontVariantNumeric: "tabular-nums",
  cursor: "default",
  whiteSpace: "break-spaces",
});
export const AlertDialogAction = AlertDialogPrimitive.Action
export const AlertDialogCancel = AlertDialogPrimitive.Cancel
