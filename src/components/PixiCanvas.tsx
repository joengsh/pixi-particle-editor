import * as PIXI from 'pixi.js'
import * as particles from 'pixi-particles'
import { useEffect, useRef } from 'react'
import {
  type ParticleConfig,
  configToEmitterConfig,
} from '@/lib/particle-config'

type PixiCanvasProp = {
  config: ParticleConfig
  backgroundColor: string
  backgroundTextureUrl: string | null
  onStatsUpdate?: (fps: number, particleCount: number) => void
}

const PixiCanvas = ({
  config,
  backgroundColor,
  backgroundTextureUrl,
  onStatsUpdate,
}: PixiCanvasProp) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pixiAppRef = useRef<PIXI.Application>(null)
  const emitterRef = useRef<particles.Emitter>(null)
  const elapsedRef = useRef(0)
  const particleCountRef = useRef(0)
  const backgroundSpriteRef = useRef<PIXI.Sprite>(null)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    let mounted = true
    const animationFrameId: number | null = null

    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

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

    const emitterContainer = new PIXI.Container()
    emitterContainer.name = 'emitterContainer'
    app.stage.addChild(emitterContainer)

    const graphics = new PIXI.Graphics()
    graphics.beginFill(0xffffff)
    graphics.drawCircle(32, 32, 32)
    graphics.endFill()

    const texture = app.renderer.generateTexture(
      graphics,
      PIXI.SCALE_MODES.LINEAR,
      2,
    )

    const emitterConfig = configToEmitterConfig({
      ...config,
      pos: { x: width / 2, y: height / 2 },
    })

    const emitter = new particles.Emitter(
      emitterContainer,
      [texture],
      emitterConfig,
    )
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

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      app.renderer.resize(newWidth, newHeight)
      emitter.updateSpawnPos(newWidth / 2, newHeight / 2)
      emitter.updateOwnerPos(0, 0)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.width / 2
      const y = e.clientY - rect.height / 2
      emitter.updateOwnerPos(x, y)
    }

    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      mounted = false
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', handleMouseMove)

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (ticker && updateFn) {
        ticker.remove(updateFn)
      }
      const app = pixiAppRef.current as {
        destroy: (removeView: boolean) => void
      } | null
      if (app) {
        app.destroy(true)
        pixiAppRef.current = null
      }
      const emitter = emitterRef.current as { destroy: () => void } | null
      if (emitter) {
        emitter.destroy()
        emitterRef.current = null
      }
    }
  }, [])

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
      const bgSprite = backgroundSpriteRef.current
      if (bgSprite ) {
        bgSprite.parent.removeChild(bgSprite);
        bgSprite.destroy({
          texture: true,
          baseTexture: true,
        })
        backgroundSpriteRef.current = null
      }

      if (backgroundTextureUrl) {
        const texture = PIXI.Texture.from(backgroundTextureUrl)
        const sprite = new PIXI.Sprite(texture)
        sprite.zIndex = -1;
        sprite.anchor.set(0.5)
        sprite.position.set(app.renderer.width / 2, app.renderer.height / 2)
        app.stage.addChildAt(sprite, 0)
        backgroundSpriteRef.current = sprite
      }
    }
  }, [backgroundTextureUrl])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  )
}

export default PixiCanvas
