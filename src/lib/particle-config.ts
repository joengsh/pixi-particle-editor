import type {
  AnimatedArtConfig,
  EmitterConfig,
  ParticleArtConfig,
} from '@/types/particle/particleConfig'
import type {
  EmitterSpawnType,
  ExtraData,
  ParticleConfigUI,
  ParticleTypeData,
} from '@/types/particleConfigUIData'

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
  minimumScaleMultiplier: 0,
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
  minimumSpeedMultiplier: 0,
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
  particlesPerWave: 1,
  containerPos: { x: 0, y: 0 },
  fixSpawnPos: false,
}

/***************** convert ui config to emitterConfig and textureConfig *******************/

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
    rotationAcceleration: config.rotationAcceleration,
    rotationSpeed: config.rotationSpeed,
    lifetime: config.lifetime,
    blendMode: config.blendMode,
    frequency: config.frequency,
    emitterLifetime: config.emitterLifetime,
    maxParticles: config.maxParticles,
    pos: config.pos,
    addAtBack: config.addAtBack,
    spawnChance: config.spawnChance,
    particlesPerWave: config.particlesPerWave,
  }
  emitterConfig.spawnType = config.emitterType.type
  switch (config.emitterType.type) {
    case 'burst':
      emitterConfig.particleSpacing = config.emitterType.particleSpacing
      emitterConfig.angleStart = config.emitterType.angleStart
      break
    case 'circle':
    case 'ring':
      emitterConfig.spawnCircle = config.emitterType.spawnCircle
      break
    case 'polygonalChain':
      emitterConfig.spawnPolygon = config.emitterType.spawnPolygon.filter(
        (polygon) => polygon.length >= 2,
      )
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
  const output: string[] | { texture: string; count: number }[] = []
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
    const withCount = ranges.match(/(\d+){(\d+)}/) !== null
    for (const range of indexRanges) {
      const splits = range.split('-')
      if (splits.length > 1) {
        const indices = splits.map((str) => parseInt(str, 10))
        const isAscending = indices[1] >= indices[0]
        for (
          let i = indices[0];
          isAscending ? i <= indices[1] : i >= indices[1];
          isAscending ? i++ : i--
        ) {
          const texture = findTexture(i)
          if (texture) {
            if (withCount) {
              ;(output as { texture: string; count: number }[]).push({
                texture,
                count: 1,
              })
            } else {
              ;(output as string[]).push(texture)
            }
          }
        }
      } else {
        const match = range.match(/(\d+){(\d+)}/)
        if (match) {
          const index = match[1]
          const count = match[2]
          const texture = findTexture(index)
          if (texture) {
            ;(output as { texture: string; count: number }[]).push({
              texture,
              count: parseInt(count, 10),
            })
          }
        } else {
          const texture = findTexture(range)
          if (texture) {
            if (withCount) {
              ;(output as { texture: string; count: number }[]).push({
                texture,
                count: 1,
              })
            } else {
              ;(output as string[]).push(texture)
            }
          }
        }
      }
    }
  }
  return output
}

/***************** convert emitterConfig and textureConfig back to ui *******************/

export function convertParticleConfigToConfigUI(
  emitterConfig: EmitterConfig,
  textureConfig: ParticleArtConfig,
  extraData: ExtraData,
): ParticleConfigUI {
  const config: ParticleConfigUI = {
    alpha: emitterConfig.alpha!,
    scale: emitterConfig.scale!,
    minimumScaleMultiplier: emitterConfig.minimumScaleMultiplier || 0,
    color: emitterConfig.color!,
    speed: emitterConfig.speed!,
    minimumSpeedMultiplier: emitterConfig.minimumSpeedMultiplier || 0,
    acceleration: emitterConfig.acceleration!,
    maxSpeed: emitterConfig.maxSpeed || 0,
    startRotation: emitterConfig.startRotation!,
    noRotation: emitterConfig.noRotation,
    rotationAcceleration: emitterConfig.rotationAcceleration!,
    rotationSpeed: emitterConfig.rotationSpeed!,
    lifetime: emitterConfig.lifetime,
    blendMode: emitterConfig.blendMode!,
    frequency: emitterConfig.frequency,
    emitterLifetime: emitterConfig.emitterLifetime!,
    maxParticles: emitterConfig.maxParticles!,
    addAtBack: emitterConfig.addAtBack || false,
    spawnChance: emitterConfig.spawnChance || 1,
    particlesPerWave: emitterConfig.particlesPerWave || 1,
    emitterType: convertEmitterTypeToUI(emitterConfig),
    particleType: convertParticleTypeToUI(textureConfig, emitterConfig),
    emit: true,
    pos: { x: 0, y: 0 },
    containerPos: extraData?.containerPos ?? { x: 0, y: 0 },
    fixSpawnPos: extraData?.fixSpawnPos ?? false,
  }

  return config
}

function convertEmitterTypeToUI(
  emitterConfig: EmitterConfig,
): EmitterSpawnType {
  const type = emitterConfig.spawnType

  switch (type) {
    case 'burst':
      return {
        type: 'burst',
        particleSpacing: emitterConfig.particleSpacing ?? 0,
        angleStart: emitterConfig.angleStart ?? 0,
      } as EmitterSpawnType

    case 'circle':
    case 'ring':
      return {
        type,
        spawnCircle: emitterConfig.spawnCircle,
      } as EmitterSpawnType

    case 'polygonalChain':
      return {
        type: 'polygonalChain',
        spawnPolygon: emitterConfig.spawnPolygon ?? [],
      } as EmitterSpawnType

    case 'rect':
      return {
        type: 'rect',
        spawnRect: emitterConfig.spawnRect,
      } as EmitterSpawnType

    case 'point':
    default:
      return {
        type: 'point',
      } as EmitterSpawnType
  }
}

function convertParticleTypeToUI(
  textureConfig: ParticleArtConfig,
  emitterConfig: EmitterConfig,
): ParticleTypeData {
  // basic particle
  if (Array.isArray(textureConfig) === false) {
    return {
      type: 'basic',
      art: textureConfig as string[],
      orderedArt: emitterConfig.orderedArt ?? false,
    }
  }

  // animated particle
  return {
    type: 'animated',
    art: (textureConfig as AnimatedArtConfig[]).map((entry) => {
      // get texture list
      const textures = getTextureListFromTextureConfigArtData(entry.textures)
      return {
        animationName: inferAnimationName(textures),
        ranges: inferRanges(textures),

        loop: entry.loop,
        framerate:
          typeof entry.framerate === 'number'
            ? String(entry.framerate)
            : 'matchLife',
      }
    }),
  }
}

export function getTextureListFromTextureConfigArtData(
  textures: string[] | { texture: string; count: number }[],
): string[] {
  if (textures.length === 0) return []

  if (typeof textures[0] === 'string') {
    return textures as string[]
  } else {
    return (textures as { texture: string; count: number }[]).reduce(
      (result, data) => [
        ...result,
        ...new Array(data.count).fill(null).map(() => data.texture),
      ],
      [] as string[],
    )
  }
}

function inferAnimationName(textures: string[]): string {
  if (textures.length === 0) return ''

  // Strip trailing index: explosion_001 → explosion
  const match = textures[0].match(/^(.*?)([-_]?0*\d+)$/)
  return match ? match[1] : textures[0]
}

export function inferRanges(textures: string[]): string {
  if (textures.length === 0) return ''

  // Matches: prefix_001, prefix-12, prefix3
  const indexRegex = /^(.*?)(?:[-_]?)(\d+)$/

  // Extract indices (in original order)
  const indices: number[] = []

  for (const texture of textures) {
    const match = texture.match(indexRegex)
    if (!match) {
      throw new Error(`Invalid texture format: ${texture}`)
    }
    indices.push(parseInt(match[2], 10))
  }

  const ranges: string[] = []

  let i = 0
  while (i < indices.length) {
    const start = indices[i]

    // 1️⃣ Count repeated textures (same index)
    let repeatCount = 1
    while (
      i + repeatCount < indices.length &&
      indices[i + repeatCount] === start
    ) {
      repeatCount++
    }

    if (repeatCount > 1) {
      ranges.push(`${start}{${repeatCount}}`)
      i += repeatCount
      continue
    }

    // 2️⃣ Detect ascending range
    let end = start
    let j = i + 1

    while (j < indices.length && indices[j] === end + 1) {
      end = indices[j]
      j++
    }

    if (end > start) {
      ranges.push(`${start}-${end}`)
      i = j
    } else {
      // 3️⃣ Single index
      ranges.push(String(start))
      i++
    }
  }

  return ranges.join(',')
}
