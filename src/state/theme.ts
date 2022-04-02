import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { darkTheme, lightTheme } from "@/styles/stitches.config"

export type Mode = "dark-theme" | "light-theme"

type ThemeState = {
  mode: Mode
  theme: typeof lightTheme | typeof darkTheme
}

type ThemeReducers = {
  setMode: (mode: Mode) => void
  set: SetState<ThemeStore>
}

type ThemeStore = ThemeState & ThemeReducers

const initialState: ThemeState = {
  mode: "dark-theme",
  theme: darkTheme,
}

export const useTheme = create<
  ThemeStore,
  SetState<ThemeStore>,
  GetState<ThemeStore>,
  Mutate<StoreApi<ThemeStore>, [["zustand/subscribeWithSelector", never]]> &
    Mutate<StoreApi<ThemeStore>, [["zustand/persist", Partial<ThemeStore>]]>
>(
  subscribeWithSelector(
    persist(
      (set, get, api) => ({
        ...initialState,
        setMode: (mode: Mode) => {
          set((prev) => ({ ...prev, mode }), true)
        },
        set,
      }),
      {
        name: "band.theme",
        deserialize: (str) => {
          const parsed = JSON.parse(str)
          switch (parsed.state.theme) {
            case lightTheme.toString():
              {
                parsed.state.theme = lightTheme
              }
              break
            case darkTheme.toString():
              {
                parsed.state.theme = darkTheme
              }
              break
            default:
              {
                parsed.state = initialState
              }
              break
          }
          return parsed
        },
        serialize: (state) => {
          return JSON.stringify({
            state: {
              mode: state.state.mode,
              //@ts-ignore
              theme: state.state.theme.toString(),
            },
            version: state.version,
          })
        },
        partialize: (state) => ({
          mode: state.mode,
          theme: state.theme,
        }),
      }
    )
  )
)

export default useTheme
