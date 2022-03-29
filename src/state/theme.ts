import create, { SetState, GetState, Mutate, StoreApi } from "zustand"
import { persist, subscribeWithSelector } from "zustand/middleware"
import { darkTheme } from "@/styles/stitches.config"

export type Mode = "theme-default" | "dark-theme"

type ThemeState = {
  mode: Mode
}

type ThemeReducers = {
  setMode: (mode: Mode) => void
}

type ThemeStore = ThemeState & ThemeReducers

const initialState: ThemeState = {
  mode: "dark-theme",
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
      }),
      {
        name: "band.theme",
        partialize: (state) => ({
          mode: state.mode,
        }),
      }
    )
  )
)

export default useTheme
