import create, { SetState } from "zustand";
import createContext from "zustand/context";

export type MaterialViewStore = {
  query: string;
  setQuery: (newQuery: string) => void;
  selectedMaterial: any;
  setSelectedMaterial: (mat: any) => void;
  materials: any[];
  set: SetState<MaterialViewStore>;
  searchResultsVisible: boolean;
};

export const { Provider: MaterialProvider, useStore: useMaterialView } = createContext<MaterialViewStore>();

export const createMaterialStore = () =>
  create<MaterialViewStore>(
    (set) =>
      ({
        query: "",
        setQuery: (newQuery: string) => set({ query: newQuery }),
        selectedMaterial: null,
        setSelectedMaterial: (mat: any) => set({ selectedMaterial: mat }),
        materials: [],
        set,
        searchResultsVisible: false,
      } as MaterialViewStore)
  );
