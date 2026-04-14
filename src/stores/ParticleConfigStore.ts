import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { create } from 'zustand'
import type { EmitterConfig } from 'pixi-particles'
import type { ParticleArtConfig } from '@/types/particle/particleConfig'
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
  setConfigUI: (data: Partial<ParticleConfigUI>) => void
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
  textureConfig: configToArtConfig(
    DEFAULT_CONFIG,
    Object.keys(useTextureStore.getState().textureData),
  ),
  setConfigUI: (data) => {
    set((state) => {
      const newConfigUI = { ...state.configUI, ...data }
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
  importData: (emitterConfig, textureConfig) => {
    // TODO
  },
}))

export default useParticleConfigStore
