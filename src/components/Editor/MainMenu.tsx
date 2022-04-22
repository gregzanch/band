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
import { darkTheme, lightTheme } from "@/styles/stitches.config"
import useEditor, { getSignals } from "@/components/Editor/State/useEditor"
import { Source } from "@/components/Editor/Objects/Source/Source"
import { Receiver } from "@/components/Editor/Objects/Receiver/Receiver"
import { AddObjectCommand } from "./State/Commands"

enum MenuAction {
  NEW = "new",
  OPEN = "open",
  SAVE = "save",
  RAYTRACE = "raytrace",
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

export const MenuHotkeys = {
  [MenuAction.NEW]: "alt+n",
  [MenuAction.OPEN]: "command+o",
  [MenuAction.SAVE]: "command+s",
  [MenuAction.IMPORT]: "command+i",
  [MenuAction.UNDO]: "command+z",
  [MenuAction.REDO]: "shift+command+z",
  [MenuAction.DUPLICATE]: "command+d",
  [MenuAction.CUT]: "command+x",
  [MenuAction.COPY]: "command+c",
  [MenuAction.PASTE]: "command+v",
  [MenuAction.ADD_SOURCE]: "alt+s",
  [MenuAction.ADD_RECEIVER]: "alt+r",
  [MenuAction.RAYTRACE]: "shift+alt+r",
  [MenuAction.TOGGLE_THEME]: "shift+command+d",
  [MenuAction.DEBUG]: "shift+command+i",
};

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
  type: MenuType.MENU_ITEM;
  title: string;
  disabled?: boolean;
  key?: string;
  action: MenuAction;
  id: string;
};

type MenuCheckboxItem = {
  type: MenuType.MENU_CHECKBOX_ITEM;
  title: string;
  checked: boolean;
  disabled?: boolean;
  key?: string;
  action: MenuAction;
  id: string;
};

type MenuRadioItem = {
  type: MenuType.MENU_RADIO_ITEM;
  title: string;
  value: string;
  disabled?: boolean;
  key?: string;
  action: MenuAction;
  id: string;
};

type MenuRadioGroup = {
  type: MenuType.MENU_RADIO_GROUP;
  title: string;
  value: string;
  options: MenuRadioItem[];
  id: string;
};

type MenuItemTrigger = {
  type: MenuType.MENU_ITEM_TRIGGER;
  title: string;
  disabled?: boolean;
  id: string;
};

type MenuDivider = {
  type: MenuType.MENU_DIVIDER;
  id: string;
};

type MenuLabel = {
  type: MenuType.MENU_LABEL;
  value: string;
  id: string;
};

type GenericMenuItem = MenuItem | MenuCheckboxItem | MenuRadioGroup | MenuDivider | MenuLabel | Menu;

type Menu = {
  type: MenuType.MENU;
  trigger: MenuItemTrigger;
  items: Array<GenericMenuItem>;
  id: string;
};

enum ControlKeys {
  COMMAND = "command",
  SHIFT = "shift",
  ALT = "alt",
  CONTROL = "ctrl",
}

const KeyMap = {
  [ControlKeys.COMMAND]: "⌘",
  [ControlKeys.SHIFT]: "⇧",
  [ControlKeys.ALT]: "⌥",
  [ControlKeys.CONTROL]: "⌃",
};

function formatKeyboardShortcut(keyCombination: string) {
  const entries = Object.entries(ControlKeys);
  for (const [id, key] of entries) {
    keyCombination = keyCombination.replaceAll(new RegExp(key, "gim"), KeyMap[key]).toUpperCase();
  }
  return keyCombination.split("+");
}

function menuHasItemState(items: GenericMenuItem[]) {
  return items.some((item) => [MenuType.MENU_CHECKBOX_ITEM, MenuType.MENU_RADIO_GROUP].includes(item.type));
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
  );
}

type ActionFunction = (item?: GenericMenuItem | MenuCheckboxItem, checked?: boolean) => Promise<boolean>;

export const ActionMap: Record<MenuAction, ActionFunction> = {
  [MenuAction.NEW]: async (item?: MenuItem) => {
    useEditor.getState().initialize();
    return Promise.resolve(true);
  },
  [MenuAction.OPEN]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.SAVE]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.RAYTRACE]: async (item?: MenuItem) => {
    console.log("raytrace");
    useEditor.setState({ raytracerSolverAlertOpen: true });
    return Promise.resolve(true);
  },
  [MenuAction.IMPORT]: async (item?: MenuItem) => {
    const { uploadFile } = useEditor.getState();
    await uploadFile();
    return Promise.resolve(true);
  },
  [MenuAction.UNDO]: async (item?: MenuItem) => {
    useEditor.getState().history.undo();
    return Promise.resolve(true);
  },
  [MenuAction.REDO]: async (item?: MenuItem) => {
    useEditor.getState().history.redo();
    return Promise.resolve(true);
  },
  [MenuAction.DUPLICATE]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.CUT]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.COPY]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.PASTE]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
  [MenuAction.ADD_SOURCE]: async (item?: MenuItem) => {
    const { history } = useEditor.getState();
    history.execute(
      new AddObjectCommand(useEditor, new Source("New Source", [0, 2, 0], 0x44a273).addToDefaultScene(useEditor))
    );
    return Promise.resolve(true);
  },
  [MenuAction.ADD_RECEIVER]: async (item?: MenuItem) => {
    const { history } = useEditor.getState();
    history.execute(
      new AddObjectCommand(useEditor, new Receiver("New Receiver", [0, 2, 0], 0xe5732a).addToDefaultScene(useEditor))
    );

    return Promise.resolve(true);
  },

  [MenuAction.TOGGLE_UI]: async (item?: MenuCheckboxItem, checked?: boolean) => {
    return Promise.resolve(true);
  },
  [MenuAction.DEBUG]: async (item?: MenuCheckboxItem, checked?: boolean) => {
    useEditor.setState((prev) => ({
      debug: !prev.debug,
    }));
    return Promise.resolve(true);
  },
  [MenuAction.TOGGLE_THEME]: async (item?: MenuCheckboxItem, checked?: boolean) => {
    const { theme: currTheme, set } = useTheme.getState();
    set({ theme: currTheme === darkTheme ? lightTheme : darkTheme });
    return Promise.resolve(true);
  },

  [MenuAction.OPEN_DOCUMENTATION]: async (item?: MenuItem) => {
    return Promise.resolve(true);
  },
};

function ConnectedMenuCheckboxItemComponent({ item, hasItemState }: { item: MenuCheckboxItem; hasItemState: boolean }) {
  const [checked, setChecked] = useState(item.checked);

  useEffect(() => {
    switch (item.id) {
      case "view.dark_mode": {
        const unsub = useTheme.subscribe(
          (store) => store.theme,
          (theme) => {
            setChecked(theme === darkTheme);
          },
          {
            fireImmediately: true,
          }
        );
        return () => {
          unsub();
        };
      }

      case "view.debug": {
        const unsub = useEditor.subscribe(
          (store) => store.debug,
          (debug) => {
            setChecked(debug);
          },
          {
            fireImmediately: true,
          }
        );
        return () => {
          unsub();
        };
      }
    }
  }, [item.id]);

  return (
    <DropdownMenuCheckboxItem
      hasItemState={hasItemState}
      disabled={item.disabled}
      onClick={() => ActionMap[item.action](item, !checked)}
      checked={checked}
    >
      {item.title}
      {item.key && (
        <DropdownMenuRightSlot>
          <Flex>{formatKeyboardShortcut(item.key)}</Flex>
        </DropdownMenuRightSlot>
      )}
    </DropdownMenuCheckboxItem>
  );
}

function MenuItemComponent({ item, hasItemState }: { item: GenericMenuItem; hasItemState: boolean }) {
  switch (item.type) {
    case MenuType.MENU: {
      return <MenuComponent menu={item} hasItemState={hasItemState} />;
    }
    case MenuType.MENU_ITEM: {
      return (
        <DropdownMenuItem
          disabled={item.disabled}
          onClick={() => ActionMap[item.action](item)}
          hasItemState={hasItemState}
        >
          {item.title}
          {item.key && (
            <DropdownMenuRightSlot>
              <Flex>{formatKeyboardShortcut(item.key)}</Flex>
            </DropdownMenuRightSlot>
          )}
        </DropdownMenuItem>
      );
    }
    case MenuType.MENU_CHECKBOX_ITEM: {
      return <ConnectedMenuCheckboxItemComponent item={item} hasItemState={hasItemState} />;
    }
    case MenuType.MENU_RADIO_GROUP: {
      return (
        <DropdownMenuRadioGroup value={item.value}>
          {item.options.map((option) => {
            return (
              <DropdownMenuRadioItem key={option.id} hasItemState value={option.title} disabled={option.disabled}>
                {option.title}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      );
    }
    case MenuType.MENU_DIVIDER: {
      return <DropdownMenuSeparator />;
    }
    case MenuType.MENU_LABEL: {
      return <DropdownMenuLabel>{item.value}</DropdownMenuLabel>;
    }
    default:
      return null;
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
});

const menuItem = (id: string, title: string, action: MenuAction, key?: string, disabled = false): MenuItem => ({
  type: MenuType.MENU_ITEM,
  title,
  key,
  disabled,
  action,
  id,
});

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
});

const menuDivider = (id: string): MenuDivider => ({
  type: MenuType.MENU_DIVIDER,
  id,
});

const MainMenuConfig: Array<GenericMenuItem> = [
  menu("file", "File", [
    menuItem("file.new", "New", MenuAction.NEW, MenuHotkeys[MenuAction.NEW]),
    menuItem("file.open", "Open", MenuAction.OPEN, MenuHotkeys[MenuAction.OPEN]),
    menuItem("file.save", "Save", MenuAction.SAVE, MenuHotkeys[MenuAction.SAVE]),
    menuDivider("file.divider.1"),
    menuItem("file.import", "Import", MenuAction.IMPORT, MenuHotkeys[MenuAction.IMPORT]),
  ]),

  menu("edit", "Edit", [
    menuItem("edit.undo", "Undo", MenuAction.UNDO, MenuHotkeys[MenuAction.UNDO]),
    menuItem("edit.redo", "Redo", MenuAction.REDO, MenuHotkeys[MenuAction.REDO]),
    menuDivider("edit.divider.1"),
    menuItem("edit.duplicate", "Duplicate", MenuAction.DUPLICATE, MenuHotkeys[MenuAction.DUPLICATE]),
    menuDivider("edit.divider.2"),
    menuItem("edit.cut", "Cut", MenuAction.CUT, MenuHotkeys[MenuAction.CUT]),
    menuItem("edit.copy", "Copy", MenuAction.COPY, MenuHotkeys[MenuAction.COPY]),
    menuItem("edit.paste", "Paste", MenuAction.PASTE, MenuHotkeys[MenuAction.PASTE]),
  ]),

  menu("add", "Add", [
    menuItem("add.source", "Source", MenuAction.ADD_SOURCE, MenuHotkeys[MenuAction.ADD_SOURCE]),
    menuItem("add.receiver", "Receiver", MenuAction.ADD_RECEIVER, MenuHotkeys[MenuAction.ADD_RECEIVER]),
  ]),

  menu("solve", "Solve", [
    menuItem("solve.raytrace", "Raytrace", MenuAction.RAYTRACE, MenuHotkeys[MenuAction.RAYTRACE]),
  ]),

  menu("view", "View", [
    menuCheckboxItem("view.dark_mode", "Dark Mode", MenuAction.TOGGLE_THEME, MenuHotkeys[MenuAction.TOGGLE_THEME]),
    menuCheckboxItem("view.debug", "Debug", MenuAction.DEBUG, MenuHotkeys[MenuAction.DEBUG]),
  ]),

  menu("help", "Help", [menuItem("help.documentation", "Documentation", MenuAction.OPEN_DOCUMENTATION)]),
];

export function MainMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton>
          <HamburgerMenuIcon />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' side='right'>
        {MainMenuConfig.map((item, index) => (
          <MenuItemComponent item={item} key={item.id} hasItemState={menuHasItemState(MainMenuConfig)} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
