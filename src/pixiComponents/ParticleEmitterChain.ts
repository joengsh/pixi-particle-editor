import * as PIXI from 'pixi.js'
import ParticleEmitterExtended, {
  type ParticleEmitterExtendedSettings,
} from './ParticleEmitterExtended'
import ObjectPool from './ObjectPool'
import ParticleEmitterChainNode from './ParticleEmitterChainNode'
import type { MinMaxValue } from '@/types/particle/particleConfig'

export interface ParticleEmitterPoolSettings extends ParticleEmitterExtendedSettings {
  count: number
}

export interface ParticleEmitterChainNodeData {
  id?: string
  zIndex?: number
  hasParticleVariants?: boolean
  particleVariants?: {
    scale: MinMaxValue
    hue: MinMaxValue
    saturation: MinMaxValue
    lightness: MinMaxValue
  }
  hasEmitterVariants?: boolean
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
    this._activeEmitters = []
    if (this._settings.emit) {
      this.startPromise()
    }

    this._updateEmitters = this._updateEmitters.bind(this)
    const ticker = PIXI.Ticker.system
    ticker.add(this._updateEmitters)
  }

  get pools(): Record<string, ObjectPool<ParticleEmitterExtended>> {
    return this._pools
  }

  get particleCount(): number {
    let count = 0
    for (const emitterExtended of this._activeEmitters) {
      count += emitterExtended.children.length
    }
    return count
  }

  get isEmitting(): boolean {
    return this._activeEmitters.length > 0
  }

  destroy() {
    this.stop()
    for (const emitter of this._activeEmitters) {
      emitter.emitter.destroy()
    }
    for (const pool of Object.values(this._pools)) {
      pool.destroy()
    }
    const ticker = PIXI.Ticker.system
    ticker.remove(this._updateEmitters)
    super.destroy()
  }

  updateSpawnPos(x: number, y: number) {
    for (const emitter of this._emitters) {
      emitter.emitter.updateSpawnPos(x, y)
    }
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

      emitter.emitPromise(false).then(() => {
        node.releaseEmitter(emitter)
      })

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
    }

    return this._promise ?? Promise.resolve()
  }

  private _initPools(): void {
    const data = this._settings.pools

    for (const [key, value] of Object.entries(data)) {
      this._pools[key] = new ObjectPool<ParticleEmitterExtended>(
        ParticleEmitterExtended,
        {
          amount: value.count,
          args: [
            key,
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
      if (!nodeData.id) continue
      const node = new ParticleEmitterChainNode(this, nodeData)
      this._nodes.push(node)
    }
  }

  private _updateEmitters(dt: number) {
    for (const emitter of this._activeEmitters) {
      emitter.emitter.update(dt / 60)
    }
  }
}

export default ParticleEmitterChain
