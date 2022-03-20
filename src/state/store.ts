import create from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(() => {
  return {
    router: null,
    dom: null,
  }
})

export default useStore
