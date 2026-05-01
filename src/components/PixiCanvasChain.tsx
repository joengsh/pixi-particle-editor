import * as PIXI from 'pixi.js'
import { memo, useEffect, useMemo, useRef } from 'react'
import useStageConfigStore from '@/stores/StageConfigStore'
import { useShallow } from 'zustand/shallow'
import useTextureStore from '@/stores/TextureStore'
import ParticleEmitterChain from '@/pixiComponents/ParticleEmitterChain'
import useChainProjectStore from '@/stores/ChainProjectStore'
import useProjectStore from '@/stores/ProjectStore'
import { mapPoolsData } from '@/lib/chain-config'

type PixiCanvasProp = {
  onStatsUpdate?: (fps: number, particleCount: number) => void
}

const PixiCanvasChain = ({ onStatsUpdate }: PixiCanvasProp) => {
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
  const containerPos = useChainProjectStore(
    useShallow((state) => state.projects[state.currentProject].containerPos),
  )

  const fixSpawnPos = useChainProjectStore(
    useShallow((state) => state.projects[state.currentProject].fixSpawnPos),
  )

  const [pools, nodes] = useChainProjectStore(
    useShallow((state) => [
      state.projects[state.currentProject].pools,
      state.projects[state.currentProject].nodes,
    ]),
  )
  const particleProjects = useProjectStore(
    useShallow((state) => state.projects),
  )
  const mappedPools = useMemo(
    () => mapPoolsData(pools, particleProjects),
    [pools, particleProjects],
  )

  const textureInstances = useTextureStore(
    useShallow((state) => state.textureInstances),
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const pixiAppRef = useRef<PIXI.Application>(null)
  const chainRef = useRef<ParticleEmitterChain>(null)
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
    ;(globalThis as any).__PIXI_APP__ = app // eslint-disable-line @typescript-eslint/no-explicit-any

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

    const chain = new ParticleEmitterChain('chain', {
      textureInstances,
      pools: mappedPools,
      nodes,
      emit: true,
    })
    emitterContainer.addChild(chain)
    chainRef.current = chain

    const ticker = app.ticker
    const updateFn = (delta: number) => {
      const deltaTime = delta / 60
      elapsedRef.current += deltaTime

      particleCountRef.current = chainRef.current!.particleCount

      if (onStatsUpdate) {
        onStatsUpdate(app.ticker.FPS, particleCountRef.current)
      }
    }

    ticker.add(updateFn)

    return () => {
      if (pixiAppRef.current === app && ticker && updateFn) {
        ticker.remove(updateFn)
      }
      const chain = chainRef.current
      if (chain) {
        chain.destroy()
        emitterContainer?.removeChildren()
        chainRef.current = null
      }
    }
  }, [nodes])

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
    const chain = chainRef.current
    const container = containerRef.current

    if (!app || !chain || !container) {
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
      chain.position.set(0, 0)

      const scaleX = newWidth / resolution[0]
      const scaleY = newHeight / resolution[1]
      const scale = Math.min(scaleX, scaleY)
      app.view.style.width = `${resolution[0] * scale}px`
      app.view.style.height = `${resolution[1] * scale}px`
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handleMouseMove = (e: MouseEvent) => {
      if (fixSpawnPos) {
        chain.updateSpawnPos(0, 0)
      } else {
        const rect = app.view.getBoundingClientRect()
        const scaleX = resolution[0] / rect.width
        const scaleY = resolution[1] / rect.height
        const scale = Math.max(scaleX, scaleY)

        const x = (e.clientX - rect.left) * scale - resolution[0] / 2
        const y = (e.clientY - rect.top) * scale - resolution[1] / 2
        chain.updateSpawnPos(x, y)
      }
    }
    const handleClick = () => {
      if (!chain.isEmitting) {
        chain.startPromise()
      }
    }

    app.view.addEventListener('click', handleClick)

    app.view.addEventListener('mousemove', handleMouseMove)

    handleResize()
    return () => {
      resizeObserver.disconnect()
      if (pixiAppRef.current === app) {
        app.view.removeEventListener('click', handleClick)
        app.view.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [resolution, nodes, fixSpawnPos])

  useEffect(() => {
    const app = pixiAppRef.current
    if (app) {
      app.ticker.speed = tickerSpeed
    }
  }, [tickerSpeed])

  useEffect(() => {
    const container = emitterContainerRef.current
    if (container) {
      container.x = containerPos.x
      container.y = containerPos.y
    }
  }, [containerPos])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex justify-center items-center`}
      style={{ touchAction: 'none' }}
    />
  )
}

export default memo(PixiCanvasChain)
