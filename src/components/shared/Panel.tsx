import { css, styled } from "@/styles/stitches.config"

export const panelStyles = css({
  backgroundColor: "$slate3",
  borderRadius: "$3",
  boxShadow: "$colors$shadowLight 0px 10px 38px -10px, $colors$shadowDark 0px 10px 20px -15px",
  variants: {
    outline: {
      true: {
        boxShadow:
          "$colors$shadowLight 0px 10px 38px -10px, $colors$shadowDark 0px 10px 20px -15px, 0px 0px 1px 1px $colors$highlight1",
      },
    },
  },
})

export const Panel = styled("div", panelStyles)
