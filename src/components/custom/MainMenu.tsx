import useTheme from "@/state/theme"
import { HamburgerMenuIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { nanoid } from "nanoid"
import { Fragment, useEffect, useState } from "react"
import { Button } from "../shared/Button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
  DropdownMenuRightSlot,
} from "../shared/DropdownMenu"
import { Flex } from "../shared/Flex"
import { IconButton } from "../shared/IconButton"
import { Text } from "../shared/Text"
import { darkThemeMode } from "@/styles/stitches.config"

enum MenuAction {
  NEW = "new",
  OPEN = "open",
  SAVE = "save",
  IMPORT = "import",
  UNDO = "undo",
  REDO = "redo",
  DUPLICATE = "duplicate",
  CUT = "cut",
  COPY = "copy",
  PASTE = "paste",
  ADD_SOURCE = "add-source",
  ADD_RECEIVER = "add-receiver",
  TOGGLE_UI = "toggle-ui",
  DEBUG = "debug",
  TOGGLE_THEME = "toggle-theme",
  OPEN_DOCUMENTATION = "open-documentation",
}

enum MenuType {
  MENU_ITEM = "menu-item",
  MENU_CHECKBOX_ITEM = "menu-checkbox-item",
  MENU_RADIO_ITEM = "menu-radio-item",
  MENU_RADIO_GROUP = "menu-radio-group",
  MENU_ITEM_TRIGGER = "menu-item-trigger",
  MENU_DIVIDER = "menu-divider",
  MENU_LABEL = "menu-label",
  MENU = "menu",
}

type MenuItem = {
  type: MenuType.MENU_ITEM
  title: string
  disabled?: boolean
  key?: string
  action: MenuAction
  id: string
}

type MenuCheckboxItem = {
  type: MenuType.MENU_CHECKBOX_ITEM
  title: string
  checked: boolean
  disabled?: boolean
  key?: string
  action: MenuAction
  id: string
}
type MenuCheckboxItemGenerator = {
  get: () => MenuCheckboxItem
  set: (checked: boolean) => void
  // type: MenuType.MENU_CHECKBOX_ITEM
  // title: string
  // checked: boolean
  // disabled?: boolean
  // key?: string
  // action: MenuAction
  // id: string
}

type MenuRadioItem = {
  type: MenuType.MENU_RADIO_ITEM
  title: string
  value: string
  disabled?: boolean
  key?: string
  action: MenuAction
  id: string
}

type MenuRadioGroup = {
  type: MenuType.MENU_RADIO_GROUP
  title: string
  value: string
  options: MenuRadioItem[]
  id: string
}

type MenuItemTrigger = {
  type: MenuType.MENU_ITEM_TRIGGER
  title: string
  disabled?: boolean
  id: string
}

type MenuDivider = {
  type: MenuType.MENU_DIVIDER
  id: string
}

type MenuLabel = {
  type: MenuType.MENU_LABEL
  value: string
  id: string
}

type GenericMenuItem = MenuItem | MenuCheckboxItem | MenuRadioGroup | MenuDivider | MenuLabel | Menu

type Menu = {
  type: MenuType.MENU
  trigger: MenuItemTrigger
  items: Array<GenericMenuItem>
  id: string
}

enum ControlKeys {
  COMMAND = "cmd",
  SHIFT = "shift",
  ALT = "alt",
  CONTROL = "ctrl",
}

const KeyMap = {
  [ControlKeys.COMMAND]: "⌘",
  [ControlKeys.SHIFT]: "⇧",
  [ControlKeys.ALT]: "⌥",
  [ControlKeys.CONTROL]: "⌃",
}

function formatKeyboardShortcut(keyCombination: string) {
  const entries = Object.entries(ControlKeys)
  for (const [id, key] of entries) {
    keyCombination = keyCombination.replaceAll(new RegExp(key, "gim"), KeyMap[key]).toUpperCase()
  }
  return keyCombination.split("+")
}

function menuHasItemState(items: GenericMenuItem[]) {
  return items.some((item) => [MenuType.MENU_CHECKBOX_ITEM, MenuType.MENU_RADIO_GROUP].includes(item.type))
}

function MenuComponent({ menu, hasItemState }: { menu: Menu; hasItemState: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTriggerItem hasItemState={hasItemState}>
        {menu.trigger.title}
        <DropdownMenuRightSlot>
          <ChevronRightIcon />
        </DropdownMenuRightSlot>
      </DropdownMenuTriggerItem>
      <DropdownMenuContent sideOffset={2} alignOffset={-5}>
        {menu.items.map((item, index) => (
          <MenuItemComponent item={item} key={item.id} hasItemState={menuHasItemState(menu.items)} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ActionFunction = (item: GenericMenuItem | MenuCheckboxItem, checked?: boolean) => void

const ActionMap: Record<MenuAction, ActionFunction> = {
  [MenuAction.NEW]: (item: MenuItem) => {},
  [MenuAction.OPEN]: (item: MenuItem) => {},
  [MenuAction.SAVE]: (item: MenuItem) => {},
  [MenuAction.IMPORT]: (item: MenuItem) => {},
  [MenuAction.UNDO]: (item: MenuItem) => {},
  [MenuAction.REDO]: (item: MenuItem) => {},
  [MenuAction.DUPLICATE]: (item: MenuItem) => {},
  [MenuAction.CUT]: (item: MenuItem) => {},
  [MenuAction.COPY]: (item: MenuItem) => {},
  [MenuAction.PASTE]: (item: MenuItem) => {},
  [MenuAction.ADD_SOURCE]: (item: MenuItem) => {},
  [MenuAction.ADD_RECEIVER]: (item: MenuItem) => {},

  [MenuAction.TOGGLE_UI]: (item: MenuCheckboxItem, checked: boolean) => {},
  [MenuAction.DEBUG]: (item: MenuCheckboxItem, checked: boolean) => {},
  [MenuAction.TOGGLE_THEME]: (item: MenuCheckboxItem, checked: boolean) => {
    const { mode, setMode } = useTheme.getState()
    setMode(mode === "theme-default" ? darkThemeMode : "theme-default")
  },

  [MenuAction.OPEN_DOCUMENTATION]: (item: MenuItem) => {},
}

function ConnectedMenuCheckboxItemComponent({ item, hasItemState }: { item: MenuCheckboxItem; hasItemState: boolean }) {
  const [checked, setChecked] = useState(item.checked)

  useEffect(() => {
    switch (item.id) {
      case "view.dark_mode": {
        const unsub = useTheme.subscribe(
          (store) => store.mode,
          (mode, prevMode) => {
            setChecked(mode === "dark-theme")
          },
          {
            fireImmediately: true,
          }
        )
        return () => {
          unsub()
        }
      }
    }
  }, [item.id])

  return (
    <DropdownMenuCheckboxItem
      hasItemState={hasItemState}
      disabled={item.disabled}
      onClick={() => ActionMap[item.action](item, checked)}
      checked={checked}
    >
      {item.title}
      {item.key && (
        <DropdownMenuRightSlot>
          <Flex>{formatKeyboardShortcut(item.key)}</Flex>
        </DropdownMenuRightSlot>
      )}
    </DropdownMenuCheckboxItem>
  )
}

function MenuItemComponent({ item, hasItemState }: { item: GenericMenuItem; hasItemState: boolean }) {
  switch (item.type) {
    case MenuType.MENU: {
      return <MenuComponent menu={item} hasItemState={hasItemState} />
    }
    case MenuType.MENU_ITEM: {
      return (
        <DropdownMenuItem disabled={item.disabled} onClick={() => console.log(item.action)} hasItemState={hasItemState}>
          {item.title}
          {item.key && (
            <DropdownMenuRightSlot>
              <Flex>{formatKeyboardShortcut(item.key)}</Flex>
            </DropdownMenuRightSlot>
          )}
        </DropdownMenuItem>
      )
    }
    case MenuType.MENU_CHECKBOX_ITEM: {
      return <ConnectedMenuCheckboxItemComponent item={item} hasItemState={hasItemState} />
      // return (
      //   <DropdownMenuCheckboxItem
      //     hasItemState={hasItemState}
      //     disabled={item.disabled}
      //     onClick={() => console.log(item.action)}
      //     checked={item.checked}
      //   >
      //     {item.title}
      //     {item.key && (
      //       <DropdownMenuRightSlot>
      //         <Flex>{formatKeyboardShortcut(item.key)}</Flex>
      //       </DropdownMenuRightSlot>
      //     )}
      //   </DropdownMenuCheckboxItem>
      // )
    }
    case MenuType.MENU_RADIO_GROUP: {
      return (
        <DropdownMenuRadioGroup value={item.value}>
          {item.options.map((option) => {
            return (
              <DropdownMenuRadioItem key={option.id} hasItemState value={option.title} disabled={option.disabled}>
                {option.title}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      )
    }
    case MenuType.MENU_DIVIDER: {
      return <DropdownMenuSeparator />
    }
    case MenuType.MENU_LABEL: {
      return <DropdownMenuLabel>{item.value}</DropdownMenuLabel>
    }
    default:
      return null
  }
}

const menu = (id: string, title: string, items: GenericMenuItem[], disabled = false): Menu => ({
  id,
  type: MenuType.MENU,
  trigger: {
    type: MenuType.MENU_ITEM_TRIGGER,
    title,
    disabled,
    id: `${id}::TRIGGER`,
  },
  items,
})

const menuItem = (id: string, title: string, action: MenuAction, key?: string, disabled = false): MenuItem => ({
  type: MenuType.MENU_ITEM,
  title,
  key,
  disabled,
  action,
  id,
})

const menuCheckboxItem = (
  id: string,
  title: string,
  action: MenuAction,
  key?: string,
  disabled = false,
  checked = false
): MenuCheckboxItem => ({
  type: MenuType.MENU_CHECKBOX_ITEM,
  title,
  key,
  disabled,
  action,
  id,
  checked,
})

const MainMenuConfig: Array<GenericMenuItem> = [
  menu("file", "File", [
    menuItem("file.new", "New", MenuAction.NEW, "cmd+n"),
    menuItem("file.open", "Open", MenuAction.OPEN, "cmd+o"),
    menuItem("file.save", "Save", MenuAction.SAVE, "cmd+s"),
    menuItem("file.import", "Import", MenuAction.IMPORT, "cmd+i"),
  ]),

  menu("edit", "Edit", [
    menuItem("edit.undo", "Undo", MenuAction.UNDO, "cmd+z"),
    menuItem("edit.redo", "Redo", MenuAction.REDO, "cmd+shift+z"),
    menuItem("edit.duplicate", "Duplicate", MenuAction.DUPLICATE, "cmd+d"),
    menuItem("edit.cut", "Cut", MenuAction.CUT, "cmd+x"),
    menuItem("edit.copy", "Copy", MenuAction.COPY, "cmd+c"),
    menuItem("edit.paste", "Paste", MenuAction.PASTE, "cmd+v"),
  ]),

  menu("add", "Add", [
    menuItem("add.source", "Source", MenuAction.ADD_SOURCE),
    menuItem("add.receiver", "Receiver", MenuAction.ADD_RECEIVER),
  ]),

  menu("view", "View", [menuCheckboxItem("view.dark_mode", "Dark Mode", MenuAction.TOGGLE_THEME)]),

  menu("help", "Help", [menuItem("help.documentation", "Documentation", MenuAction.OPEN_DOCUMENTATION)]),
]

export function MainMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton>
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {MainMenuConfig.map((item, index) => (
          <MenuItemComponent item={item} key={item.id} hasItemState={menuHasItemState(MainMenuConfig)} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
