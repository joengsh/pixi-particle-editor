import * as PIXI from 'pixi.js'
import ParticleEmitterExtended, {
  type ParticleEmitterExtendedSettings,
} from './ParticleEmitterExtended'
import ObjectPool from './ObjectPool'
import ParticleEmitterChainNode from './ParticleEmitterChainNode'
import type { MinMaxValue } from '@/types/particle/particleConfig'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ParticleEmitterPoolSettings extends ParticleEmitterExtendedSettings {
  count: number
}

export interface ParticleEmitterChainNodeData {
  id: string
  particleVariants?: {
    scale: MinMaxValue
    hue: MinMaxValue
    saturation: MinMaxValue
    lightness: MinMaxValue
  }
  emitterVariants?: {
    maxFrequencyMultiplier: number
    minParticlesPerWaveMultiplier: number
    minSpawnChanceMultiplier: number
    minLifetimeMultiplier: number
  }
  onParticleRemoved?: ParticleEmitterChainNodeData[]
  onParticleAdded?: ParticleEmitterChainNodeData[]
  trail?: ParticleEmitterChainNodeData[]
}

export interface ParticleEmitterChainSettings {
  textureInstances: Record<string, PIXI.Texture>
  pools: Record<string, Omit<ParticleEmitterPoolSettings, 'textureInstances'>>
  nodes: ParticleEmitterChainNodeData[]
  emit?: boolean
}

/* -------------------------------------------------------------------------- */
/* Class                                                                      */
/* -------------------------------------------------------------------------- */

class ParticleEmitterChain extends PIXI.Container {
  private _promise: Promise<void> | null = null
  private _resolve: (() => void) | null = null

  private _settings: ParticleEmitterChainSettings
  private _pools: Record<string, ObjectPool<ParticleEmitterExtended>> = {}
  private _nodes: ParticleEmitterChainNode[] = []
  private _emitters: ParticleEmitterExtended[] = []
  private _activeEmitters: ParticleEmitterExtended[] = []

  constructor(name: string, settings: ParticleEmitterChainSettings) {
    super()
    this.name = name
    this._settings = settings

    this._initPools()
    this._setupNodes()

    if (this._settings.emit) {
      this.startPromise()
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Public API                                                             */
  /* ---------------------------------------------------------------------- */

  get pools(): Record<string, ObjectPool<ParticleEmitterExtended>> {
    return this._pools
  }

  addActiveEmitter(emitter: ParticleEmitterExtended): void {
    this._activeEmitters.push(emitter)
  }

  removeActiveEmitter(emitter: ParticleEmitterExtended): void {
    const index = this._activeEmitters.indexOf(emitter)
    if (index !== -1) {
      this._activeEmitters.splice(index, 1)
    }

    if (this._activeEmitters.length === 0 && this._resolve) {
      const resolve = this._resolve
      this._resolve = null
      this._promise = null
      resolve()
    }
  }

  /**
   * Start root emitters and resolve when all emissions are completed
   */
  async startPromise(): Promise<void> {
    // Resolve any previous promise
    if (this._resolve) {
      const resolve = this._resolve
      this._resolve = null
      this._promise = null
      resolve()
    }

    for (const node of this._nodes) {
      const emitter = node.getNewEmitter()

      emitter.emitPromise().then(() => {
        emitter.emitter.autoUpdate = false
        node.releaseEmitter(emitter)
      })

      this.addActiveEmitter(emitter)
      this._emitters.push(emitter)
    }

    this._promise = new Promise<void>((resolve) => {
      this._resolve = resolve
    })

    return this._promise
  }

  /**
   * Stop all emitters
   */
  stop(): Promise<void> {
    for (const emitter of this._emitters) {
      emitter.emitter.emit = false
      this.removeActiveEmitter(emitter)
    }

    return this._promise ?? Promise.resolve()
  }

  /* ---------------------------------------------------------------------- */
  /* Internal setup                                                         */
  /* ---------------------------------------------------------------------- */

  private _initPools(): void {
    const data = this._settings.pools

    for (const [key, value] of Object.entries(data)) {
      this._pools[key] = new ObjectPool<ParticleEmitterExtended>(
        ParticleEmitterExtended,
        {
          amount: value.count,
          args: [
            'emitterExtended',
            {
              ...value,
              textureInstances: this._settings.textureInstances,
            },
          ],
        },
      )
    }
  }

  private _setupNodes(): void {
    for (const nodeData of this._settings.nodes) {
      const node = new ParticleEmitterChainNode(this, nodeData)
      this._nodes.push(node)
    }
  }
}

export default ParticleEmitterChain
