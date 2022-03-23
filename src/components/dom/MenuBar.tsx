import styled, { keyframes } from "styled-components"
import { MenuButton as RMenuButton, MenuDivider, MenuItem, Menu as MenuInner, SubMenu } from "@szhsin/react-menu"
import { menuSelector, menuItemSelector, menuDividerSelector } from "@szhsin/react-menu/style-utils"
import "@szhsin/react-menu/dist/core.css"

const MenuButton = styled(RMenuButton)``

const StyledMenuBar = styled.ul.attrs((props) => {
  return {
    //@ts-ignore
    width: props.width,
  }
})`
  height: 40px;
  z-index: 50;
  left: 0px;
  top: 0px;
  position: absolute;
  margin: 0.5rem;
  display: flex;
  column-gap: 0.5rem;
`

const menuShow = keyframes`
  from {
    opacity: 0;
  }
`
const menuHide = keyframes`
  to {
    opacity: 0;
  }
`

const Menu = styled(MenuInner)`
  ${menuSelector.name} {
    font-size: 0.925rem;
    user-select: none;
    box-shadow: 1px 1px 20px 1px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 6px;
    min-width: 10rem;
  }

  ${menuSelector.stateOpening} {
    animation: ${menuShow} 0.15s ease-out;
  }

  // NOTE: animation-fill-mode: forwards is required to
  // prevent flickering with React 18 createRoot()
  ${menuSelector.stateClosing} {
    animation: ${menuHide} 0.2s ease-out forwards;
  }

  ${menuItemSelector.name} {
    border-radius: 6px;
    padding: 0.375rem 0.625rem;
  }

  ${menuItemSelector.hover} {
    color: #fff;
    background-color: #59a2ff;
  }

  ${menuDividerSelector.name} {
    margin: 0.5rem 0.625rem;
  }

  ${menuItemSelector.submenu} {
    position: relative;
    &::after {
      content: url("/icons/svg/chevron-right-solid.svg");
      position: absolute;
      width: 7px;
      right: 0.625rem;
    }
  }
`

export default function MenuBar() {
  return (
    <StyledMenuBar>
      <Menu transition menuButton={<MenuButton>Open menu</MenuButton>}>
        <MenuItem>New File</MenuItem>
        <MenuItem disabled>Save</MenuItem>
        <MenuItem>Print...</MenuItem>
        <MenuDivider />
        <SubMenu label='Edit' offsetY={-7}>
          <MenuItem>Cut</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Paste</MenuItem>
        </SubMenu>
        <SubMenu label='Find' offsetY={-7}>
          <MenuItem>Find...</MenuItem>
          <MenuItem>Replace...</MenuItem>
        </SubMenu>
      </Menu>
    </StyledMenuBar>
  )
}
