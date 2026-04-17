import { create } from 'zustand'

export type PolygonChainEditStoreState = {
  isEdit: boolean
  index?: number
}

export type PolygonChainEditStoreAction = {
  setEdit: (
    fn: (
      state: PolygonChainEditStoreState,
    ) => Partial<PolygonChainEditStoreState>,
  ) => void
}

export type PolygonChainEditStore = PolygonChainEditStoreState &
  PolygonChainEditStoreAction

// Create your store, which includes both state and (optionally) actions
const usePolygonChainEditStore = create<PolygonChainEditStore>((set) => ({
  isEdit: false,
  index: undefined,
  setEdit: (fn) =>
    set((state) => {
      return fn(state)
    }),
}))

export default usePolygonChainEditStore
