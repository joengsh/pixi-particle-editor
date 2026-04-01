import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Activity, Layers } from 'lucide-react'
import PixiCanvas from './components/PixiCanvas'
import { DEFAULT_CONFIG, type ParticleConfig } from './lib/particle-config'
import ControlPanel from './components/ControlPanel'

function App() {
  const [config, setConfig] = useState<ParticleConfig>(DEFAULT_CONFIG)
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e')
  const [backgroundTextureUrl, setBackgroundTextureUrl] = useState<string | null>(null)
  const [backgroundScale, setBackgroundScale] = useState<number>(1)
  const [resolution, setResolution] = useState<[number, number]>([1920, 1080])
  const [fps, setFps] = useState(0)
  const [particleCount, setParticleCount] = useState(0)
  const canvasRef = useRef<{
    restart: () => void
    getParticleCount: () => number
  }>(null)

  const handleStatsUpdate = (newFps: number, newParticleCount: number) => {
    setFps(newFps)
    setParticleCount(newParticleCount)
  }

  return (
    <>
      <div className={`h-screen flex flex-col md:flex-row bg-background overflow-hidden`}>
        {/* Canvas Area */}
        <div className={`relative flex-1 items-stretch overflow-hidden`}>
          {/* Stats Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-linear-to-b from-background/90 to-transparent">
            <h1 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Pixi Particle Editor
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{fps.toFixed(1)} FPS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <span className="font-mono">
                  {particleCount.toLocaleString()} particles
                </span>
              </div>
            </div>
          </div>
          {/* Pixi Canvas */}
          <div className="w-full h-full">
            <PixiCanvas
              config={config}
              backgroundColor={backgroundColor}
              backgroundTextureUrl={backgroundTextureUrl}
              resolution={resolution}
              backgroundScale={backgroundScale}
              onStatsUpdate={handleStatsUpdate}
            />
          </div>
        </div>
        {/* Control Panel */}
        <div
          className={`relative h-[45vh] w-full border-t md:h-full md:w-90 md:border-l md:border-t-0 border-border bg-card basis-[45vh] md:basis-90 flex-0 shrink-0 grow-0`}
        >
          <ControlPanel
            config={config}
            onChange={setConfig}
            backgroundColor={backgroundColor}
            onBackgroundChange={setBackgroundColor}
            backgroundTextureUrl={backgroundTextureUrl}
            onBackgroundTextureChange={setBackgroundTextureUrl}
            resolution={resolution}
            setResolution={setResolution}
            backgroundScale={backgroundScale}
            setBackgroundScale={setBackgroundScale}
          />
        </div>
      </div>
    </>
  )
}

export default App
