import { styled } from "@/styles/stitches.config"

export const SidebarPanel = styled("div", {
  backgroundColor: "transparent",
  mt: "$2",
  mb: "$2",

  variants: {
    side: {
      left: {
        pr: "$2",
        mr: "0px",
        ml: "$2",
        left: "0px",
      },
      right: {
        pl: "$2",
        ml: "0px",
        mr: "$2",
        right: "0px",
      },
    },
  },

  zIndex: "50",
  position: "absolute",
  width: "300px",
  // overflowY: "scroll",
  maxHeight: "calc(100vh - $2 - $2)",
  // height: "100%",
  // pointerEvents: "none",
})
