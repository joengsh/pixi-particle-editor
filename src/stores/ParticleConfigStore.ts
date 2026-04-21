import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { create } from 'zustand'
import type {
  EmitterConfig,
  ParticleArtConfig,
} from '@/types/particle/particleConfig'
import {
  configToArtConfig,
  configToEmitterConfig,
  DEFAULT_CONFIG,
} from '@/lib/particle-config'
import useTextureStore from './TextureStore'

export type ParticleConfigStoreState = {
  configUI: ParticleConfigUI
  emitterConfig: EmitterConfig
  textureConfig: ParticleArtConfig
}

export type ParticleConfigStoreAction = {
  setConfigUI: (fn: (configUI: ParticleConfigUI) => ParticleConfigUI) => void
}

export type ParticleConfigStore = ParticleConfigStoreState &
  ParticleConfigStoreAction

// Create your store, which includes both state and (optionally) actions
const useParticleConfigStore = create<ParticleConfigStore>((set) => ({
  configUI: DEFAULT_CONFIG,
  emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
  textureConfig: configToArtConfig(
    DEFAULT_CONFIG,
    Object.keys(useTextureStore.getState().textureData),
  ),
  setConfigUI: (fn) => {
    set((state) => {
      const newConfigUI = fn(state.configUI)
      const newEmitterConfig = configToEmitterConfig(newConfigUI)
      const newTextureConfig = configToArtConfig(
        newConfigUI,
        Object.keys(useTextureStore.getState().textureData),
      )
      return {
        configUI: newConfigUI,
        emitterConfig: newEmitterConfig,
        textureConfig: newTextureConfig,
      }
    })
  },
}))

export default useParticleConfigStore
