import { HamburgerMenuIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { nanoid } from "nanoid"
import { Fragment } from "react"
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
      return (
        <DropdownMenuCheckboxItem
          hasItemState={hasItemState}
          disabled={item.disabled}
          onClick={() => console.log(item.action)}
          checked={item.checked}
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

const MainMenuConfig: Array<GenericMenuItem> = [
  {
    id: nanoid(10),
    type: MenuType.MENU,
    trigger: {
      type: MenuType.MENU_ITEM_TRIGGER,
      title: "File",
      disabled: false,
      id: nanoid(10),
    },
    items: [
      {
        type: MenuType.MENU_ITEM,
        title: "New",
        key: "cmd+n",
        disabled: false,
        action: MenuAction.NEW,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Open",
        key: "cmd+o",
        disabled: false,
        action: MenuAction.OPEN,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Save",
        key: "cmd+s",
        disabled: false,
        action: MenuAction.SAVE,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_DIVIDER,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Import",
        key: "cmd+i",
        disabled: false,
        action: MenuAction.IMPORT,
        id: nanoid(10),
      },
    ],
  },
  {
    id: nanoid(10),
    type: MenuType.MENU,
    trigger: {
      type: MenuType.MENU_ITEM_TRIGGER,
      title: "Edit",
      disabled: false,
      id: nanoid(10),
    },
    items: [
      {
        type: MenuType.MENU_ITEM,
        title: "Undo",
        key: "cmd+z",
        disabled: false,
        action: MenuAction.UNDO,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Redo",
        key: "cmd+shift+z",
        disabled: false,
        action: MenuAction.REDO,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_DIVIDER,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Duplicate",
        key: "cmd+d",
        disabled: false,
        action: MenuAction.DUPLICATE,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_DIVIDER,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Cut",
        key: "cmd+x",
        disabled: false,
        action: MenuAction.CUT,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Copy",
        key: "cmd+c",
        disabled: false,
        action: MenuAction.COPY,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Paste",
        key: "cmd+v",
        disabled: false,
        action: MenuAction.PASTE,
        id: nanoid(10),
      },
    ],
  },
  {
    id: nanoid(10),
    type: MenuType.MENU,
    trigger: {
      type: MenuType.MENU_ITEM_TRIGGER,
      title: "Add",
      disabled: false,
      id: nanoid(10),
    },
    items: [
      {
        type: MenuType.MENU_ITEM,
        title: "Source",
        // key: "cmd+z",
        disabled: false,
        action: MenuAction.ADD_SOURCE,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Receiver",
        // key: "cmd+z",
        disabled: false,
        action: MenuAction.ADD_RECEIVER,
        id: nanoid(10),
      },
    ],
  },
  {
    id: nanoid(10),
    type: MenuType.MENU,
    trigger: {
      type: MenuType.MENU_ITEM_TRIGGER,
      title: "View",
      disabled: false,
      id: nanoid(10),
    },
    items: [
      {
        type: MenuType.MENU_CHECKBOX_ITEM,
        title: "Show UI",
        checked: true,
        key: "cmd+\\",
        disabled: false,
        action: MenuAction.TOGGLE_UI,
        id: nanoid(10),
      },
      {
        type: MenuType.MENU_ITEM,
        title: "Debug",
        // key: "cmd+z",
        disabled: false,
        action: MenuAction.DEBUG,
        id: nanoid(10),
      },
    ],
  },
  {
    id: nanoid(10),
    type: MenuType.MENU,
    trigger: {
      type: MenuType.MENU_ITEM_TRIGGER,
      title: "Help",
      disabled: false,
      id: nanoid(10),
    },
    items: [
      {
        type: MenuType.MENU_ITEM,
        title: "Documentation",
        // key: "cmd+z",
        disabled: false,
        action: MenuAction.OPEN_DOCUMENTATION,
        id: nanoid(10),
      },
    ],
  },
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
