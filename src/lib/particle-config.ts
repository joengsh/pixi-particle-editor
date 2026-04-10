import type { OldEmitterConfig } from '@/types/particle/particleConfig'
import type { EmitterConfig } from 'pixi-particles'

export const DEFAULT_CONFIG: OldEmitterConfig = {
  alpha: {
    start: 1,
    end: 0,
  },
  scale: {
    start: 1,
    end: 0.3,
    minimumScaleMultiplier: 1,
  },
  color: {
    start: '#ffffff',
    end: '#ff8800',
  },
  speed: {
    start: 200,
    end: 100,
    minimumSpeedMultiplier: 1,
  },
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
  spawnType: 'point',
  spawnRect: {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
  },
  spawnCircle: {
    x: 0,
    y: 0,
    r: 50,
    minR: 0,
  },
  particlesPerWave: 10,
  particleSpacing: 0,
  angleStart: 0,
}

export const PRESETS: Record<string, Partial<OldEmitterConfig>> = {
  fire: {
    alpha: { start: 1, end: 0 },
    scale: { start: 0.5, end: 0.1, minimumScaleMultiplier: 1 },
    color: { start: '#ffff00', end: '#ff0000' },
    speed: { start: 300, end: 50, minimumSpeedMultiplier: 1 },
    acceleration: { x: 0, y: -100 },
    startRotation: { min: 260, max: 280 },
    lifetime: { min: 0.5, max: 1 },
    blendMode: 'add',
    frequency: 0.004,
    maxParticles: 500,
  },
  snow: {
    alpha: { start: 1, end: 0.5 },
    scale: { start: 0.3, end: 0.3, minimumScaleMultiplier: 0.5 },
    color: { start: '#ffffff', end: '#ffffff' },
    speed: { start: 50, end: 50, minimumSpeedMultiplier: 0.7 },
    acceleration: { x: 0, y: 50 },
    startRotation: { min: 70, max: 110 },
    rotationSpeed: { min: 50, max: 100 },
    lifetime: { min: 3, max: 5 },
    blendMode: 'normal',
    frequency: 0.05,
    maxParticles: 200,
    spawnType: 'rect',
    spawnRect: { x: -200, y: -100, w: 400, h: 50 },
  },
  explosion: {
    alpha: { start: 1, end: 0 },
    scale: { start: 0.8, end: 0.2, minimumScaleMultiplier: 1 },
    color: { start: '#ffffff', end: '#ff6600' },
    speed: { start: 500, end: 100, minimumSpeedMultiplier: 1 },
    acceleration: { x: 0, y: 0 },
    startRotation: { min: 0, max: 360 },
    lifetime: { min: 0.3, max: 0.8 },
    blendMode: 'add',
    frequency: 0.001,
    emitterLifetime: 0.1,
    maxParticles: 100,
    spawnType: 'burst',
    particlesPerWave: 50,
  },
  bubbles: {
    alpha: { start: 0.7, end: 0 },
    scale: { start: 0.2, end: 0.5, minimumScaleMultiplier: 0.5 },
    color: { start: '#88ccff', end: '#88ccff' },
    speed: { start: 100, end: 100, minimumSpeedMultiplier: 0.8 },
    acceleration: { x: 0, y: -50 },
    startRotation: { min: 250, max: 290 },
    rotationSpeed: { min: 0, max: 0 },
    lifetime: { min: 2, max: 4 },
    blendMode: 'normal',
    frequency: 0.1,
    maxParticles: 100,
    spawnType: 'rect',
    spawnRect: { x: -100, y: 50, w: 200, h: 20 },
  },
  sparkle: {
    alpha: { start: 1, end: 0 },
    scale: { start: 0.5, end: 0, minimumScaleMultiplier: 0.5 },
    color: { start: '#ffff88', end: '#ffffff' },
    speed: { start: 0, end: 0, minimumSpeedMultiplier: 1 },
    acceleration: { x: 0, y: 0 },
    startRotation: { min: 0, max: 360 },
    rotationSpeed: { min: 0, max: 200 },
    lifetime: { min: 0.3, max: 0.6 },
    blendMode: 'add',
    frequency: 0.02,
    maxParticles: 300,
    spawnType: 'circle',
    spawnCircle: { x: 0, y: 0, r: 100 },
  },
}

export function configToEmitterConfig(config: OldEmitterConfig): EmitterConfig {
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
