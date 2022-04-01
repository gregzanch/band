import { styled } from "@/styles/stitches.config"

export const Box = styled("div", {
  // Reset
  boxSizing: "border-box",
  variants: {
    fillHeight: {
      true: {
        height: "100%",
      },
    },
    fillWidth: {
      true: {
        width: "100%",
      },
    },
  },
})
