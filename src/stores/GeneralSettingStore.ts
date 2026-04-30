import { create } from 'zustand'

export type GeneralSettingStoreState = {
  showExplorer: boolean
  mode: 'particle' | 'chain'
}

export type GeneralSettingStoreAction = {
  setShowExplorer: (value: boolean) => void
  setMode: (mode: 'particle' | 'chain') => void
}

export type GeneralSettingStore = GeneralSettingStoreState &
  GeneralSettingStoreAction

// Create your store, which includes both state and (optionally) actions
const useGeneralSettingStore = create<GeneralSettingStore>((set) => ({
  showExplorer: true,
  mode: 'particle',
  setShowExplorer: (value: boolean) => set(() => ({ showExplorer: value })),
  setMode: (mode: 'particle' | 'chain') => set(() => ({ mode })),
}))

export default useGeneralSettingStore
