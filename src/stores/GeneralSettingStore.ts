import { create } from 'zustand'

export type GeneralSettingStoreState = {
  showExplorer: boolean
}

export type GeneralSettingStoreAction = {
  setShowExplorer: (value: boolean) => void
}

export type GeneralSettingStore = GeneralSettingStoreState &
  GeneralSettingStoreAction

// Create your store, which includes both state and (optionally) actions
const useGeneralSettingStore = create<GeneralSettingStore>((set) => ({
  showExplorer: true,
  setShowExplorer: (value: boolean) => set(() => ({ showExplorer: value })),
}))

export default useGeneralSettingStore
