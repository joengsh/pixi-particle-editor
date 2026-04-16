import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import { memo, useEffect, useMemo, useRef } from 'react'
import useStageConfigStore from '@/stores/StageConfigStore'
import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import useTextureStore from '@/stores/TextureStore'
import type { AnimatedArtConfig } from '@/types/particle/particleConfig'

const mapAnimatedArtTextures = (
  config: AnimatedArtConfig,
  textureInstances: Record<string, PIXI.Texture>,
) => {
  return {
    ...config,
    textures: config.textures
      .map((data) => {
        if (typeof data === 'string') {
          return textureInstances[data]
        } else {
          return {
            ...data,
            texture: textureInstances[data.texture],
          }
        }
      })
      .filter((texture) => !!texture),
  }
}

type PixiCanvasProp = {
  onStatsUpdate?: (fps: number, particleCount: number) => void
}

const PixiCanvas = ({ onStatsUpdate }: PixiCanvasProp) => {
  const resolution = useStageConfigStore(
    useShallow((state) => state.resolution),
  )
  const backgroundScale = useStageConfigStore(
    useShallow((state) => state.backgroundScale),
  )
  const backgroundColor = useStageConfigStore(
    useShallow((state) => state.backgroundColor),
  )
  const backgroundTextureUrl = useStageConfigStore(
    useShallow((state) => state.backgroundTextureUrl),
  )
  const tickerSpeed = useStageConfigStore(
    useShallow((state) => state.tickerSpeed),
  )

  const [emitterConfig, textureConfig] = useParticleConfigStore(
    useShallow((state) => [state.emitterConfig, state.textureConfig]),
  )
  const textureInstances = useTextureStore(
    useShallow((state) => state.textureInstances),
  )
  const mappedTextureData = useMemo(() => {
    // map all the texture names to texture instance
    return textureConfig
      .map((data) => {
        if (typeof data === 'string') {
          return textureInstances[data]
        } else {
          return mapAnimatedArtTextures(data, textureInstances)
        }
      })
      .filter((texture) => !!texture)
  }, [textureInstances, textureConfig])

  const containerRef = useRef<HTMLDivElement>(null)
  const pixiAppRef = useRef<PIXI.Application>(null)
  const emitterRef = useRef<particles.Emitter>(null)
  const elapsedRef = useRef(0)
  const particleCountRef = useRef(0)
  const gameContainerRef = useRef<PIXI.Container>(null)
  const emitterContainerRef = useRef<PIXI.Container>(null)
  const backgroundSpriteRef = useRef<PIXI.Sprite>(null)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    let mounted = true
    const animationFrameId: number | null = null

    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const width = resolution[0]
    const height = resolution[1]

    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: parseInt(backgroundColor.replace('#', ''), 16),
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })
    globalThis.__PIXI_APP__ = app

    container.appendChild(app.view as HTMLCanvasElement)
    pixiAppRef.current = app

    const rootContainer = new PIXI.Container()
    rootContainer.name = 'gameContainer'
    rootContainer.x = width / 2
    rootContainer.y = height / 2
    app.stage.addChild(rootContainer)
    gameContainerRef.current = rootContainer

    const emitterContainer = new PIXI.Container()
    emitterContainer.name = 'emitterContainer'
    rootContainer.addChild(emitterContainer)
    emitterContainerRef.current = emitterContainer

    return () => {
      mounted = false

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      const app = pixiAppRef.current
      if (app) {
        app.destroy(true)
        pixiAppRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const app = pixiAppRef.current!
    const emitterContainer = emitterContainerRef.current!

    const emitter = new particles.Emitter(
      emitterContainer,
      mappedTextureData,
      emitterConfig,
    )
    if (
      mappedTextureData.length > 0 &&
      !(mappedTextureData[0] instanceof PIXI.Texture)
    ) {
      emitter.particleConstructor = particles.AnimatedParticle
    } else {
      emitter.particleConstructor = particles.Particle
    }

    emitter.emit = true
    emitterRef.current = emitter

    const ticker = app.ticker
    const updateFn = (delta: number) => {
      const deltaTime = delta / 60
      elapsedRef.current += deltaTime
      emitter.update(deltaTime)
      particleCountRef.current = emitterContainer.children.length

      if (onStatsUpdate) {
        onStatsUpdate(app.ticker.FPS, particleCountRef.current)
      }
    }

    ticker.add(updateFn)

    return () => {
      if (pixiAppRef.current === app && ticker && updateFn) {
        ticker.remove(updateFn)
      }
      const emitter = emitterRef.current
      if (emitter) {
        emitter.destroy()
        emitterContainer?.removeChildren()
        emitterRef.current = null
      }
    }
  }, [mappedTextureData])

  useEffect(() => {
    const app = pixiAppRef.current

    if (app) {
      app.renderer.backgroundColor = parseInt(
        backgroundColor.replace('#', ''),
        16,
      )
    }
  }, [backgroundColor])

  useEffect(() => {
    const app = pixiAppRef.current
    if (app) {
      const rootContainer = gameContainerRef.current!

      const bgSprite = backgroundSpriteRef.current
      if (bgSprite) {
        bgSprite.parent.removeChild(bgSprite)
        bgSprite.destroy({
          texture: true,
          baseTexture: true,
        })
        backgroundSpriteRef.current = null
      }

      if (backgroundTextureUrl) {
        const texture = PIXI.Texture.from(backgroundTextureUrl)
        const sprite = new PIXI.Sprite(texture)
        sprite.zIndex = -1
        sprite.anchor.set(0.5)
        sprite.scale.set(backgroundScale)
        rootContainer.addChildAt(sprite, 0)
        backgroundSpriteRef.current = sprite
      }
    }
  }, [backgroundTextureUrl, backgroundScale])

  useEffect(() => {
    const app = pixiAppRef.current
    const emitter = emitterRef.current
    const container = containerRef.current

    if (!app || !emitter || !container) {
      return
    }

    const rootContainer = gameContainerRef.current!

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      app.renderer.resize(resolution[0], resolution[1])
      rootContainer.x = resolution[0] / 2
      rootContainer.y = resolution[1] / 2
      emitter.updateOwnerPos(0, 0)

      const scaleX = newWidth / resolution[0]
      const scaleY = newHeight / resolution[1]
      const scale = Math.min(scaleX, scaleY)
      app.view.style.width = `${resolution[0] * scale}px`
      app.view.style.height = `${resolution[1] * scale}px`
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = app.view.getBoundingClientRect()
      const scaleX = resolution[0] / rect.width
      const scaleY = resolution[1] / rect.height
      const scale = Math.max(scaleX, scaleY)

      const x = (e.clientX - rect.left) * scale - resolution[0] / 2
      const y = (e.clientY - rect.top) * scale - resolution[1] / 2
      emitter.updateOwnerPos(x, y)
    }

    app.view.addEventListener('mousemove', handleMouseMove)

    handleResize()
    return () => {
      resizeObserver.disconnect()
      if (pixiAppRef.current === app) {
        app.view.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [resolution, mappedTextureData])

  useEffect(() => {
    const app = pixiAppRef.current
    if (app) {
      app.ticker.speed = tickerSpeed
    }
  }, [tickerSpeed])
  useEffect(() => {
    const emitter = emitterRef.current
    if (!emitter) return

    emitter.init(mappedTextureData, emitterConfig)
  }, [emitterConfig])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-center"
      style={{ touchAction: 'none' }}
    />
  )
}

export default memo(PixiCanvas)
