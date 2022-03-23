import styled from "styled-components"
import { useEffect, useRef, useState, Fragment } from "react"
import { useFloating, autoUpdate } from "@floating-ui/react-dom"
import { offset, flip } from "@floating-ui/dom"
import { getScrollParents } from "@/helpers/dom/getScrollParents"
import { Middleware } from "@floating-ui/core"
import Button from "@/components/dom/MenuBar/Button"
import MenuListItem from "@/components/dom/MenuBar/MenuListItem"
import MenuDivider from "@/components/dom/MenuBar/MenuDivider"
import { Box } from "@/components/shared/Box"
import { nanoid } from "nanoid"
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

const Floating = styled.ul`
  /* display: none; */
  opacity: 0;
  position: absolute;
  box-shadow: var(--leva-shadows-level2);
  /* background: var(--leva-colors-elevation2); */
  min-width: 200px;
  color: white;
  font-weight: bold;
  /* padding: 5px; */
  border-radius: 4px;
  font-size: 90%;
  /* pointer-events: none; */
`

type MenuItem = {
  label: string
  id: string
  children?: Array<MenuItem | { type: "divider"; id: string }>
}

const MenuBarConfig: MenuItem[] = [
  {
    label: "File",
    id: "file",
    children: [
      { label: "New", id: "new" },
      { label: "Open", id: "open" },
      { label: "Save", id: "save" },
      { type: "divider", id: nanoid(10) },
      { label: "Import", id: "import" },
    ],
  },
  {
    label: "Edit",
    id: "edit",
    children: [
      { label: "Undo", id: "undo" },
      { label: "Redo", id: "redo" },
      { type: "divider", id: nanoid(10) },
      { label: "Duplicate", id: "duplicate" },
      { type: "divider", id: nanoid(10) },
      { label: "Cut", id: "cut" },
      { label: "Copy", id: "copy" },
      { label: "Paste", id: "paste" },
    ],
  },
  {
    label: "Add",
    id: "add",
    children: [
      { label: "Source", id: "source" },
      { label: "Receiver", id: "receiver" },
    ],
  },
  {
    label: "View",
    id: "view",
    children: [
      { label: "Show/hide UI", id: "show-hide-ui" },
      { label: "Debug", id: "debug" },
    ],
  },
  {
    label: "Help",
    id: "help",
    children: [{ label: "Documentation", id: "documentation" }],
  },
]

function MenuItemButton({ label, id, menu }) {
  const [middleware, setMiddleware] = useState<Middleware[]>([offset(5)])
  const { x, y, reference, floating, update, refs } = useFloating({
    placement: "bottom-start",
    middleware,
  })

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return
    }
    console.log(refs)

    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, update)
  }, [refs.reference, refs.floating, update])

  useEffect(() => {
    //@ts-ignore
    if (!refs.reference.current || !refs.floating.current) {
      return
    }
    //@ts-ignore
    const nodes = [...getScrollParents(refs.reference.current), ...getScrollParents(refs.floating.current)]

    nodes.forEach((node) => {
      node.addEventListener("scroll", update)
      node.addEventListener("resize", update)
    })

    function show(e) {
      //@ts-ignore
      refs.floating.current.style.opacity = 1
      //@ts-ignore
      refs.floating.current.style.zIndex = 500
      //@ts-ignore
      Array.from(refs.floating.current.querySelectorAll("a")).forEach((elt) => elt.setAttribute("tabindex", "0"))
    }

    function hide(e) {
      //@ts-ignore
      refs.floating.current.style.opacity = 0
      //@ts-ignore
      refs.floating.current.style.zIndex = -500
      // refs.floating.current.style.display = "none"
    }
    //@ts-ignore
    console.log(refs.reference.current)
    //@ts-ignore
    refs.reference.current.addEventListener("focus", show)
    //@ts-ignore
    Array.from(refs.floating.current.querySelectorAll("a")).forEach((elt) => {
      elt.addEventListener("focus", show)
      elt.addEventListener("blur", hide)
    })
    //@ts-ignore
    refs.reference.current.addEventListener("blur", hide)

    return () => {
      nodes.forEach((node) => {
        node.removeEventListener("scroll", update)
        node.removeEventListener("resize", update)
      })
      //@ts-ignore
      refs.reference.current.removeEventListener("focus", show)
      //@ts-ignore
      Array.from(refs.floating.current.querySelectorAll("a")).forEach((elt) => {
        elt.removeEventListener("focus", show)
        elt.removeEventListener("blur", hide)
      })
      //@ts-ignore
      refs.reference.current.removeEventListener("blur", hide)
    }
  }, [refs.floating, refs.reference, update])
  return (
    <>
      <li>
        <Button as='a' ref={reference} tabIndex={0}>
          {label}
        </Button>
      </li>
      <Floating
        as='li'
        ref={floating}
        style={{
          position: "absolute",
          left: x ?? "",
          top: y ?? "",
        }}
      >
        <ul>
          {menu.map((item) =>
            item.type === "divider" ? (
              <MenuDivider key={item.id} />
            ) : (
              <MenuListItem key={item.id}>
                <a tabIndex={-1}>{item.label}</a>
              </MenuListItem>
            )
          )}
        </ul>
      </Floating>
    </>
  )
}

function MenuBar() {
  return (
    <StyledMenuBar>
      {MenuBarConfig.map((item) => (
        <MenuItemButton key={item.id} label={item.label} id={item.id} menu={item.children} />
      ))}
    </StyledMenuBar>
  )
}

export default MenuBar
