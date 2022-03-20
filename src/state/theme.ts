import create from "zustand"

const useTheme = create(() => {
  return {
    darkMode: false,
  }
})

export default useTheme
