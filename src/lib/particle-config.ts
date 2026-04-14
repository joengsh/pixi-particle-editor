import type {
  AnimatedArtConfig,
  OldEmitterConfig,
  ParticleArtConfig,
} from '@/types/particle/particleConfig'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import type { EmitterConfig } from 'pixi-particles'

export const DEFAULT_PARTICLE_IMAGE_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAQAAAC0jZKKAAACPElEQVR4AbXXcW/TMBAF8EtCypa1LCDB9/98ILG1dKNNCOZZT8h6N4562eZTzH8/ni6dfWns4kqtvbMOT2tmv+0XasG/F1aTLFxd5lDcCS8o0tyX58K9bVA9WZe40LNNqLkevrJr1HvrC1vgQoM820/UqQZubQBKWDKjDJjP+wg41/J/eAOQsGb2rWDlvKzMTyEMaJvBIHNpBdswOfhoZ4VL2h3Irc+srSiJPYv9B1Mr3IHcCS2ZJTFf2+RZ1NEWD5PF7mmQ/nfs85I9klb4KrNCa2YkZitcXmVZpwL3zFtwpYH6l3cWtqDMPP+Fb+zWPthW6BvUIJmZuOTN7APqKOjB9vZAuAM6ArvFE9CSeI5Y1B7PPfAFMPKMKMWVZmbCzKusoveoKcODjQDzgx3c6GnUFnADOAFGV5V16B7PI2BkBRjgmf4IWBbYu8I6lPuhSa2w4xP8k7CF/l5Q7HuiZW9ST+wpjgKLvP9ed6gAJXztWcG/2CaAJ/tKlJSnm7RTTHHATQAnwAFKWCn/H3y2eH2L2ZfDIf06rXD8m768l//cAvzN/kBe709a8cPFQ4jXFA8hHpvVh1D9scmrqfbYrD/oO0s5caYrDvraqwlwW3811V6mvXUrLtOq6x+NYCt0vIqv/2hgcUPWqoFFRixlB9tEIxZHWKHJLmuGQraifijUMTbIq63QzDLGrh+8wVYO3rI6nzdohc+81H3cDHiijxvNfAJ9Wv855hJL5nnlB2Tw8ojzC7UelrXqk/cPn233eGpGsfAAAAAASUVORK5CYII='

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
    art: ['particle'],
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

export function configToArtConfig(
  config: ParticleConfigUI,
  textureList: string[],
): ParticleArtConfig {
  if (config.particleType.type === 'basic') {
    return config.particleType.art
  } else {
    const result: AnimatedArtConfig[] = []
    for (const data of config.particleType.art) {
      const textures = getTextureListFromAnimationName(
        data.animationName,
        data.ranges,
        textureList,
      )
      const config: AnimatedArtConfig = {
        loop: data.loop,
        framerate:
          (data.framerate === 'matchLife'
            ? data.framerate
            : parseInt(data.framerate, 10)) || 24,
        textures,
      }
      result.push(config)
    }
    return result
  }
}

/**
 * convert animationName and range to list of textures
 * @param {string} animationName - animation name
 * @param {string} ranges - string of indices separated by ",", e.g. "1,2,6-10,12", "1-20", "20-1"
 * @param {string[]} textureList - texture name list
 * @returns {string[]}
 */
export function getTextureListFromAnimationName(
  animationName: string,
  ranges = '',
  textureList: string[],
) {
  const indexRanges = ranges.replace(/\s/g, '').split(',')
  const output = []
  function findTexture(range: string | number) {
    const regex = new RegExp(`${animationName}(-|_)?([0]*${range})`)
    const result = textureList.filter((textureName) => textureName.match(regex))
    if (result.length > 0) {
      return result[0]
    }
    return null
  }
  if (ranges === '') {
    // return all textures in textureList with animationName
    const regex = new RegExp(`${animationName}(-|_)?([0]*\\d+)`)
    return textureList
      .filter((textureName) => textureName.match(regex))
      .sort((a, b) => {
        // get texture index
        const aMatch = a.match(regex)
        const bMatch = b.match(regex)
        if (!aMatch || !bMatch || !aMatch[2] || !bMatch[2]) return 0
        const aIndex = parseInt(aMatch[2], 10)
        const bIndex = parseInt(bMatch[2], 10)
        return aIndex - bIndex
      })
  } else {
    for (const range of indexRanges) {
      const indices = range.split('-').map((str) => parseInt(str, 10))
      if (indices.length > 1) {
        const isAscending = indices[1] >= indices[0]
        for (
          let i = indices[0];
          isAscending ? i <= indices[1] : i >= indices[1];
          isAscending ? i++ : i--
        ) {
          const texture = findTexture(i)
          if (texture) {
            output.push(texture)
          }
        }
      } else {
        const texture = findTexture(range)
        if (texture) {
          output.push(texture)
        }
      }
    }
  }
  return output
}

// TODO: use this function together with a new function importConfig(emitterConfig, artConfig) to import project
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
