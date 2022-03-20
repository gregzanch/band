// example Box.js
import styled from "styled-components"
import { space, color, layout, flexbox, SpaceProps, ColorProps, LayoutProps, FlexProps } from "styled-system"

export const Box = styled.div.attrs((props) => {
  return {
    ...props,
  } as SpaceProps & ColorProps & LayoutProps & FlexProps
})`
  ${space}
  ${color}
  ${layout}
  ${flexbox}
`

export default Box
