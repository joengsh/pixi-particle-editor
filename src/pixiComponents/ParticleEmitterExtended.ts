/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type */
import * as PIXI from 'pixi.js'
import * as particles from '@/lib/pixi-particles'
import EventBus, { type EventPayload } from './EventBus'
import { Easing } from '@/lib/easing'
import type { EasingName } from '@/types/Easing'
import type {
  EmitterConfig,
  ParticleArtConfig,
} from '@/types/particle/particleConfig'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ParticleEmitterEventAdded extends EventPayload {
  particle: particles.Particle
  container: PIXI.Container
  count: number
}

export interface ParticleEmitterEventRemoved extends ParticleEmitterEventAdded {}

export interface ParticleEmitterExtendedSettings {
  textureInstances: Record<string, PIXI.Texture>
  emitterConfig: EmitterConfig
  textureConfig: ParticleArtConfig
}

/* -------------------------------------------------------------------------- */
/* Class                                                                      */
/* -------------------------------------------------------------------------- */

class ParticleEmitterExtended extends PIXI.Container {
  private _settings: ParticleEmitterExtendedSettings
  private _emitterConfig: any = null
  private _textureConfig: any = null
  private _emitter: particles.Emitter | null = null

  private _target: PIXI.DisplayObject | null = null
  private _offset: PIXI.Point = new PIXI.Point(0, 0)

  private _eb: EventBus

  private _particleAddedPayload: ParticleEmitterEventAdded
  private _particleRemovedPayload: ParticleEmitterEventRemoved

  constructor(name: string, settings: ParticleEmitterExtendedSettings) {
    super()

    this._settings = settings

    this._createParticleEmitterFromData(this._settings)

    this.on('childAdded', this._onParticleAdded, this)
    this.on('childRemoved', this._onParticleRemoved, this)

    this._eb = new EventBus('particleEmitterExtended', {
      events: {
        particleAdded: {
          properties: ['particle', 'container', 'count'],
          log: false,
        },
        particleRemoved: {
          properties: ['particle', 'container', 'count'],
          log: false,
        },
        completed: {
          properties: [],
          log: false,
        },
      },
    })

    this._particleAddedPayload = this._eb.getPayloadTemplate(
      'particleAdded',
    ) as ParticleEmitterEventAdded
    this._particleRemovedPayload = this._eb.getPayloadTemplate(
      'particleRemoved',
    ) as ParticleEmitterEventRemoved
  }

  /* ---------------------------------------------------------------------- */
  /* Getters / Setters                                                       */
  /* ---------------------------------------------------------------------- */

  get eb(): EventBus {
    return this._eb
  }

  get emitter(): particles.Emitter {
    return this._emitter!
  }

  get offset(): PIXI.Point {
    return this._offset
  }

  set offset(value: PIXI.Point) {
    this._offset = value
  }

  /* ---------------------------------------------------------------------- */
  /* Public API                                                             */
  /* ---------------------------------------------------------------------- */

  updateConfig(emitterConfig?: EmitterConfig, rotationOffset = 0): void {
    if (!this._emitter) return

    const mergedEmitterConfig = Object.assign(
      {},
      this._emitterConfig,
      {
        pos: {
          x: this._emitter.spawnPos.x,
          y: this._emitter.spawnPos.y,
        },
        startRotation: {
          min: this._emitterConfig.startRotation.min + rotationOffset,
          max: this._emitterConfig.startRotation.max + rotationOffset,
        },
      },
      emitterConfig,
    )

    this._emitter.init(this._textureConfig, mergedEmitterConfig)
  }

  async emitPromise(autoUpdate = true): Promise<void> {
    if (!this._emitter) return

    this._emitter.autoUpdate = autoUpdate
    this._emitter.emit = true

    let resolveFn!: () => void

    const promise = new Promise<void>((resolve) => {
      resolveFn = resolve
    })

    const onParticleRemoved = (
      particle: particles.Particle,
      parent: PIXI.Container,
    ): void => {
      if (parent.children.length === 0 && !this._emitter!.emit) {
        this.off('childRemoved', onParticleRemoved, this)
        resolveFn()
      }
    }

    this.on('childRemoved', onParticleRemoved, this)
    return promise
  }

  follow(displayObject: PIXI.DisplayObject): void {
    this._target = displayObject
    PIXI.Ticker.system.add(this._updateFollow, this)
    this._updateFollow()
  }

  cancelFollow(): void {
    PIXI.Ticker.system.remove(this._updateFollow, this)
    this._target = null
  }

  setSpawnPosGlobal(point: PIXI.Point): void {
    const localPos = this.toLocal(point)
    this._emitter?.updateSpawnPos(localPos.x, localPos.y)
  }

  /* ---------------------------------------------------------------------- */
  /* Internal construction                                                  */
  /* ---------------------------------------------------------------------- */

  private _createParticleEmitterFromData(
    settings: ParticleEmitterExtendedSettings,
  ): void {
    const { emit, autoUpdate } = settings.emitterConfig ?? {}

    const particleData = {
      emitterConfig: this._settings.emitterConfig,
      textureConfig: this._settings.textureConfig,
    }

    this._textureConfig = this._mappedTextureData(particleData.textureConfig)

    this._emitterConfig = this._mappedEmitterConfigData(
      particleData.emitterConfig,
    )

    const emitter = new particles.Emitter(
      this,
      this._textureConfig,
      this._emitterConfig,
    )

    emitter.particleConstructor =
      this._textureConfig.length > 0 &&
      !(this._textureConfig[0] instanceof PIXI.Texture)
        ? particles.AnimatedParticle
        : particles.Particle

    this._emitter = emitter

    if (emit !== undefined) emitter.emit = emit
    if (autoUpdate !== undefined) emitter.autoUpdate = autoUpdate
  }

  /* ---------------------------------------------------------------------- */
  /* Helpers                                                                */
  /* ---------------------------------------------------------------------- */

  private _textureNameToPixiTexture(name: string): PIXI.Texture {
    const texture = this._settings.textureInstances[name]
    if (!texture) {
      console.error(`ParticleEmitterExtended: Texture not found ${name}`)
      return PIXI.Texture.EMPTY
    }
    return texture
  }

  private _mapAnimatedArtTextures(config: any): any {
    return {
      ...config,
      textures: config.textures
        .map((data: any) => {
          if (typeof data === 'string') {
            return this._textureNameToPixiTexture(data)
          }
          return {
            ...data,
            texture: this._textureNameToPixiTexture(data.texture),
          }
        })
        .filter(Boolean),
    }
  }

  private _mappedTextureData(textureConfig: any[]): any[] {
    return textureConfig
      .map((data) =>
        typeof data === 'string'
          ? this._textureNameToPixiTexture(data)
          : this._mapAnimatedArtTextures(data),
      )
      .filter(Boolean)
  }

  private _mappedEmitterConfigData(emitterConfig: any): any {
    const mapEase = (block: any) =>
      block?.ease ? Easing[block.ease as EasingName]() : undefined

    return {
      ...emitterConfig,
      alpha: { ...emitterConfig.alpha, ease: mapEase(emitterConfig.alpha) },
      scale: { ...emitterConfig.scale, ease: mapEase(emitterConfig.scale) },
      color: { ...emitterConfig.color, ease: mapEase(emitterConfig.color) },
      speed: { ...emitterConfig.speed, ease: mapEase(emitterConfig.speed) },
    }
  }

  private _updateFollow(): void {
    if (!this._target || !this._emitter) return

    const globalPos = this._target.toGlobal(this._offset)
    this.setSpawnPosGlobal(globalPos)

    const wt = this._target.worldTransform
    const rotationDeg = Math.atan2(wt.b, wt.a) * (180 / Math.PI)

    this._emitter.minStartRotation =
      this._emitterConfig.startRotation.min + rotationDeg
    this._emitter.maxStartRotation =
      this._emitterConfig.startRotation.max + rotationDeg
  }

  /* ---------------------------------------------------------------------- */
  /* Events                                                                 */
  /* ---------------------------------------------------------------------- */

  private _onParticleAdded(
    particle: particles.Particle,
    parent: PIXI.Container,
  ): void {
    this._particleAddedPayload.particle = particle
    this._particleAddedPayload.container = parent
    this._particleAddedPayload.count = parent.children.length
    this._eb.emit('particleAdded', this._particleAddedPayload)
  }

  private _onParticleRemoved(
    particle: particles.Particle,
    parent: PIXI.Container,
  ): void {
    this._particleRemovedPayload.particle = particle
    this._particleRemovedPayload.container = parent
    this._particleRemovedPayload.count = parent.children.length

    this._eb.emit('particleRemoved', this._particleRemovedPayload)

    if (parent.children.length === 0 && !this._emitter?.emit) {
      this._eb.emit('completed')
    }
  }
}

export default ParticleEmitterExtended
