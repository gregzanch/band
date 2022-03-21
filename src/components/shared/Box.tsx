// example Box.js
import styled from "styled-components"
import {
  space,
  color,
  layout,
  flexbox,
  grid,
  SpaceProps,
  ColorProps,
  LayoutProps,
  FlexProps,
  GridProps,
} from "styled-system"

export const Box = styled.div.attrs((props) => {
  return {
    ...props,
  } as SpaceProps & ColorProps & LayoutProps & FlexProps & GridProps
})`
  ${space}
  ${color}
  ${layout}
  ${flexbox}
  ${grid}
`

export default Box
