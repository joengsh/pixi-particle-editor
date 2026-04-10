import type { OldEmitterConfig } from '@/types/particle/particleConfig'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import type { EmitterConfig } from 'pixi-particles'

export const DEFAULT_CONFIG: ParticleConfigUI = {
  alpha: {
    list: [
      { value: 1, time: 0 },
      { value: 0, time: 1 },
    ],
    isStepped: false,
  },
  scale: {
    list: [
      { value: 1, time: 0 },
      { value: 0.3, time: 1 },
    ],
    isStepped: false,
  },
  minimumScaleMultiplier: 1,
  color: {
    list: [
      { value: 'ffffff', time: 0 },
      { value: 'ff8800', time: 1 },
    ],
    isStepped: false,
  },
  speed: {
    list: [
      { value: 200, time: 0 },
      { value: 100, time: 1 },
    ],
    isStepped: false,
  },
  minimumSpeedMultiplier: 1,
  acceleration: {
    x: 0,
    y: 0,
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 360,
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 0,
  },
  lifetime: {
    min: 0.5,
    max: 1.5,
  },
  blendMode: 'normal',
  frequency: 0.008,
  emitterLifetime: -1,
  maxParticles: 1000,
  pos: {
    x: 0,
    y: 0,
  },
  addAtBack: false,
  particleType: {
    type: 'basic',
    art: [],
    orderedArt: false,
  },
  emitterType: {
    type: 'point',
  },
  rotationAcceleration: 0,
  spawnChance: 1,
  emit: true,
}

export function configToEmitterConfig(config: ParticleConfigUI): EmitterConfig {
  const emitterConfig: EmitterConfig = {
    alpha: config.alpha,
    scale: config.scale,
    minimumScaleMultiplier: config.minimumScaleMultiplier,
    color: config.color,
    speed: config.speed,
    minimumSpeedMultiplier: config.minimumSpeedMultiplier,
    acceleration: config.acceleration,
    maxSpeed: config.maxSpeed,
    startRotation: config.startRotation,
    noRotation: config.noRotation,
    rotationSpeed: config.rotationSpeed,
    lifetime: config.lifetime,
    blendMode: config.blendMode,
    frequency: config.frequency,
    emitterLifetime: config.emitterLifetime,
    maxParticles: config.maxParticles,
    pos: config.pos,
    addAtBack: config.addAtBack,
  }

  switch (config.emitterType.type) {
    case 'burst':
      emitterConfig.particlesPerWave = config.emitterType.particlesPerWave
      emitterConfig.particleSpacing = config.emitterType.particleSpacing
      emitterConfig.angleStart = config.emitterType.angleStart
      break
    case 'circle':
    case 'ring':
      emitterConfig.spawnCircle = config.emitterType.spawnCircle
      break
    case 'polygonalChain':
      // TODO
      break
    case 'rect':
      emitterConfig.spawnRect = config.emitterType.spawnRect
      break
    case 'point':
    default:
      break
  }

  switch (config.particleType.type) {
    case 'animated':
      break
    case 'basic':
      emitterConfig.orderedArt = config.particleType.orderedArt
      break
    default:
      break
  }

  return emitterConfig
}

export function oldEmitterConfigToEmitterConfig(
  config: OldEmitterConfig,
): EmitterConfig {
  const emitterConfig: EmitterConfig = {
    alpha: {
      list: [
        { value: config.alpha!.start, time: 0 },
        { value: config.alpha!.end, time: 1 },
      ],
    },
    scale: {
      list: [
        { value: config.scale!.start, time: 0 },
        { value: config.scale!.end, time: 1 },
      ],
    },
    minimumScaleMultiplier: config.scale!.minimumScaleMultiplier,
    color: {
      list: [
        { value: config.color!.start.replace('#', ''), time: 0 },
        { value: config.color!.end.replace('#', ''), time: 1 },
      ],
    },
    speed: {
      list: [
        { value: config.speed!.start, time: 0 },
        { value: config.speed!.end, time: 1 },
      ],
    },
    minimumSpeedMultiplier: config.speed!.minimumSpeedMultiplier,
    acceleration: config.acceleration,
    maxSpeed: config.maxSpeed,
    startRotation: config.startRotation,
    noRotation: config.noRotation,
    rotationSpeed: config.rotationSpeed,
    lifetime: config.lifetime,
    blendMode: config.blendMode,
    frequency: config.frequency,
    emitterLifetime: config.emitterLifetime,
    maxParticles: config.maxParticles,
    pos: config.pos,
    addAtBack: config.addAtBack,
    spawnType: config.spawnType,
  }

  if (config.spawnType === 'rect' && config.spawnRect) {
    emitterConfig.spawnRect = config.spawnRect
  }
  if (
    (config.spawnType === 'circle' || config.spawnType === 'ring') &&
    config.spawnCircle
  ) {
    emitterConfig.spawnCircle = config.spawnCircle
  }
  if (config.spawnType === 'burst') {
    emitterConfig.particlesPerWave = config.particlesPerWave
    emitterConfig.particleSpacing = config.particleSpacing
    emitterConfig.angleStart = config.angleStart
  }

  return emitterConfig
}
