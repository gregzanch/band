import styled from "styled-components"
import { color, typography, ColorProps, TypographyProps } from "styled-system"

export const Text = styled.p.attrs((props) => {
  return {
    ...props,
  } as ColorProps & TypographyProps
})`
  ${color}
  ${typography}
  font-family: var(--leva-fonts-mono);
  /* color: var(--leva-colors-highlight2); */
`

export default Text
