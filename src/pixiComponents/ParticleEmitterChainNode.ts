/* eslint-disable @typescript-eslint/no-explicit-any */
import type ObjectPool from './ObjectPool'
import type ParticleEmitterChain from './ParticleEmitterChain'
import type ParticleEmitterExtended from './ParticleEmitterExtended'

/**
 * Convert HSL to hex colour
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  return [f(0), f(8), f(4)]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}

export interface MinMaxProps {
  min: number
  max: number
}

export interface ParticleVariants {
  scale?: MinMaxProps
  hue?: MinMaxProps
  saturation?: MinMaxProps
  lightness?: MinMaxProps
}

export interface EmitterVariants {
  maxFrequencyMultiplier?: number
  minParticlesPerWaveMultiplier?: number
  minSpawnChanceMultiplier?: number
  minLifetimeMultiplier?: number
}

export interface ParticleProps {
  scale?: number
  hue?: number
  saturation?: number
  lightness?: number
  rotationOffset?: number
}

export interface ParticleEmitterChainNodeSettings {
  id?: string
  props?: ParticleProps
  particleVariants?: ParticleVariants
  emitterVariants?: EmitterVariants
  onParticleAdded?: ParticleEmitterChainNodeSettings[]
  onParticleRemoved?: ParticleEmitterChainNodeSettings[]
  trail?: ParticleEmitterChainNodeSettings[]
}

class ParticleEmitterChainNode {
  private _settings: ParticleEmitterChainNodeSettings
  private _props: ParticleProps

  private _pool: ObjectPool<ParticleEmitterExtended>
  private _chain: ParticleEmitterChain

  private _nodesOnParticleAdded: ParticleEmitterChainNode[] = []
  private _nodesOnParticleRemoved: ParticleEmitterChainNode[] = []
  private _nodesTrail: ParticleEmitterChainNode[] = []

  private _parentProps: ParticleProps = {}

  constructor(
    chain: ParticleEmitterChain,
    settings: ParticleEmitterChainNodeSettings,
  ) {
    this._settings = settings

    this._props = this._settings.props ?? {}
    this._pool = chain.pools[settings.id!]
    this._chain = chain

    if (this._settings.onParticleAdded) {
      for (const nodeData of this._settings.onParticleAdded) {
        if (!nodeData.id) continue
        this._nodesOnParticleAdded.push(
          new ParticleEmitterChainNode(chain, nodeData),
        )
      }
    }

    if (this._settings.onParticleRemoved) {
      for (const nodeData of this._settings.onParticleRemoved) {
        if (!nodeData.id) continue
        this._nodesOnParticleRemoved.push(
          new ParticleEmitterChainNode(chain, nodeData),
        )
      }
    }

    if (this._settings.trail) {
      for (const nodeData of this._settings.trail) {
        if (!nodeData.id) continue
        this._nodesTrail.push(new ParticleEmitterChainNode(chain, nodeData))
      }
    }
  }

  getNewEmitter(): ParticleEmitterExtended {
    const emitter = this._pool.allocate()
    if (!emitter.parent) this._chain.addChild(emitter)
    emitter.visible = true
    emitter.emitter.autoUpdate = false

    const emitterConfig: any = {}

    // scale
    if (this._parentProps.scale) {
      emitter.scale.set(this._parentProps.scale)
    }

    // colour
    if (
      typeof this._parentProps.hue === 'number' &&
      typeof this._parentProps.saturation === 'number' &&
      typeof this._parentProps.lightness === 'number'
    ) {
      const hex = hslToHex(
        this._parentProps.hue,
        this._parentProps.saturation,
        this._parentProps.lightness,
      )

      emitterConfig.color = {
        list: [
          { value: hex, time: 0 },
          { value: hex, time: 1 },
        ],
        isStepped: false,
      }
    }

    // rotation
    let rotationOffset = 0
    if (this._parentProps.rotationOffset) {
      rotationOffset = (this._parentProps.rotationOffset * 180) / Math.PI
    }

    // emitter variants
    const variants = this._settings.emitterVariants

    if (variants?.maxFrequencyMultiplier) {
      const rand = 1 + Math.random() * (variants.maxFrequencyMultiplier - 1)
      emitterConfig.frequency = emitter.emitter.frequency * rand
    }

    if (variants?.minParticlesPerWaveMultiplier) {
      const rand =
        1 - Math.random() * (1 - variants.minParticlesPerWaveMultiplier)
      emitterConfig.particlesPerWave = emitter.emitter.particlesPerWave * rand
    }

    if (variants?.minSpawnChanceMultiplier) {
      const rand = 1 - Math.random() * (1 - variants.minSpawnChanceMultiplier)
      emitterConfig.spawnChance = emitter.emitter.spawnChance * rand
    }

    if (variants?.minLifetimeMultiplier) {
      const rand = 1 - Math.random() * (1 - variants.minLifetimeMultiplier)
      emitterConfig.lifetime = {
        min: emitter.emitter.minLifetime * rand,
        max: emitter.emitter.maxLifetime * rand,
      }
    }

    emitter.updateConfig(emitterConfig, rotationOffset)

    emitter.eb.on('particleAdded', this._onParticleAdded, this)
    emitter.eb.on('particleRemoved', this._onParticleRemoved, this)

    this._chain.addActiveEmitter(emitter)
    return emitter
  }

  releaseEmitter(emitter: ParticleEmitterExtended): void {
    emitter.emitter.autoUpdate = false
    emitter.emitter.emit = false
    emitter.emitter.cleanup()

    // reset emitter config
    emitter.updateConfig()

    emitter.eb.off('particleAdded', this._onParticleAdded, this)
    emitter.eb.off('particleRemoved', this._onParticleRemoved, this)

    emitter.visible = false
    this._chain.removeActiveEmitter(emitter)
    this._pool.free(emitter, false)
  }

  setParentProps(props?: ParticleProps): void {
    this._parentProps = props ?? {}
  }

  private _onParticleAdded(payload: any): void {
    const { particle, container } = payload

    if (!particle.extraData) {
      particle.extraData = {}
    }
    particle.extraData.trails = []

    // generate per-particle random props
    const props: ParticleProps = {}
    if (this._settings.particleVariants) {
      for (const [key, variant] of Object.entries(
        this._settings.particleVariants,
      )) {
        props[key as keyof ParticleProps] =
          variant.min + Math.random() * (variant.max - variant.min)
      }
    }

    particle.extraData.props = Object.assign({}, this._parentProps, props)

    for (const node of this._nodesOnParticleAdded) {
      node.setParentProps({
        ...particle.extraData.props,
        rotationOffset: particle.rotation,
      })

      const emitter = node.getNewEmitter()
      const globalPos = container.toGlobal(particle.position)
      const localPos = this._chain.toLocal(globalPos)

      emitter.position.set(localPos.x, localPos.y)
      emitter.emitPromise(false).then(() => {
        node.releaseEmitter(emitter)
      })
    }

    for (const node of this._nodesTrail) {
      node.setParentProps({
        ...particle.extraData.props,
        rotationOffset: particle.rotation,
      })

      const emitter = node.getNewEmitter()
      particle.extraData.trails.push(emitter)

      emitter.emitPromise(false).then(() => {
        node.releaseEmitter(emitter)
      })

      emitter.follow(particle)
    }
  }

  private _onParticleRemoved(payload: any): void {
    const { particle, container } = payload

    if (particle.extraData?.trails) {
      for (const trail of particle.extraData.trails) {
        trail.cancelFollow()
        trail.emitter.emit = false
      }
    }

    for (const node of this._nodesOnParticleRemoved) {
      node.setParentProps({
        ...particle.extraData.props,
        rotationOffset: particle.rotation,
      })

      const emitter = node.getNewEmitter()
      const globalPos = container.toGlobal(particle.position)
      const localPos = this._chain.toLocal(globalPos)

      emitter.position.set(localPos.x, localPos.y)
      emitter.emitPromise(false).then(() => {
        node.releaseEmitter(emitter)
      })
    }
  }
}

export default ParticleEmitterChainNode
