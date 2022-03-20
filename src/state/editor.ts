import create from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  cameraMatrix: [
    0.8242150329508605, 0, -0.5662769458999827, 0, -0.2699522486780919, 0.8790583556703647, -0.39291499177271955, 0,
    0.49779048091687483, 0.47671417781110165, 0.7245331115845789, 0, 2.4889524045843774, 2.383570889055511,
    3.6226655579228995, 1,
  ],
  orbitControlDisabled: false,
  selectedObject: null,
}

export const useEditor = create(
  persist(
    (set, get) => ({
      ...initialState,
      method: () => {},
    }),
    {
      name: 'band.editor',
      partialize: (state) => ({
        cameraMatrix: state.cameraMatrix,
      }),
    }
  )
)

export default useEditor
