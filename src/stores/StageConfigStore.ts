import { create } from 'zustand'

export type StageConfigStoreState = {
  backgroundColor: string
  backgroundTextureUrl: string | null
  resolution: [number, number]
  backgroundScale: number
}

export type StageConfigStoreAction = {
  setBackgroundColor: (color: string) => void
  setBackgroundTextureUrl: (url: string | null) => void
  setResolution: (value: [number, number]) => void
  setBackgroundScale: (value: number) => void
}

export type StageConfigStore = StageConfigStoreState & StageConfigStoreAction

// Create your store, which includes both state and (optionally) actions
const useStageConfigStore = create<StageConfigStore>((set) => ({
  backgroundColor: '#1a1a2e',
  backgroundTextureUrl: null,
  resolution: [1920, 1080],
  backgroundScale: 1,
  setBackgroundColor: (color) => set(() => ({ backgroundColor: color })),
  setBackgroundTextureUrl: (url) => set(() => ({ backgroundTextureUrl: url })),
  setResolution: (value: [number, number]) =>
    set(() => ({ resolution: value })),
  setBackgroundScale: (value: number) =>
    set(() => ({ backgroundScale: value })),
}))

export default useStageConfigStore
