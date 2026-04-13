import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { create } from 'zustand'
import type { EmitterConfig } from 'pixi-particles'
import type { ParticleArtConfig } from '@/types/particle/particleConfig'
import {
  configToArtConfig,
  configToEmitterConfig,
  DEFAULT_CONFIG,
} from '@/lib/particle-config'

export type ParticleConfigStoreState = {
  configUI: ParticleConfigUI
  emitterConfig: EmitterConfig
  textureConfig: ParticleArtConfig
}

export type ParticleConfigStoreAction = {
  setConfigUI: (configUI: ParticleConfigUI) => void
  importData: (
    emitterConfig: EmitterConfig,
    textureConfig: ParticleArtConfig,
  ) => void
}

export type ParticleConfigStore = ParticleConfigStoreState &
  ParticleConfigStoreAction

// Create your store, which includes both state and (optionally) actions
const useParticleConfigStore = create<ParticleConfigStore>((set) => ({
  configUI: DEFAULT_CONFIG,
  emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
  textureConfig: configToArtConfig(DEFAULT_CONFIG),
  setConfigUI: (configUI) => set(() => ({ configUI })),
  importData: (emitterConfig, textureConfig) => {
    // TODO
  },
}))

export default useParticleConfigStore
