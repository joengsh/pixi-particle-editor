import type { ParticleEmitterChainSettings } from '@/pixiComponents/ParticleEmitterChain'
import { configToEmitterConfig, DEFAULT_CONFIG } from './particle-config'

export const DEFAULT_CHAIN_CONFIG: Omit<
  ParticleEmitterChainSettings,
  'textureInstances'
> = {
  pools: {
    particle: {
      count: 1,
      emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
      textureConfig: ['particle'],
    },
  },
  nodes: [
    {
      id: 'particle',
      onParticleAdded: [],
      onParticleRemoved: [],
      trail: [],
    },
  ],
  emit: true,
}
