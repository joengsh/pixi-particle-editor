import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useStageConfigStore from '@/stores/StageConfigStore'
import { useShallow } from 'zustand/shallow'
import { ImagePlus, X } from 'lucide-react'

export const ResolutionControl = () => {
  const [resolution, setResolution] = useStageConfigStore(
    useShallow((state) => [state.resolution, state.setResolution]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Resolution:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">W:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={resolution[0]}
            onChange={(e) =>
              setResolution([parseInt(e.target.value, 10), resolution[1]])
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">H:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={resolution[1]}
            onChange={(e) =>
              setResolution([resolution[0], parseInt(e.target.value, 10)])
            }
          />
        </div>
      </div>
    </div>
  )
}

export const BackgroundScaleControl = () => {
  const [backgroundScale, setBackgroundScale] = useStageConfigStore(
    useShallow((state) => [state.backgroundScale, state.setBackgroundScale]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Background Scale:</Label>
      <Input
        type="number"
        step={0.05}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={backgroundScale}
        onChange={(e) => setBackgroundScale(parseFloat(e.target.value))}
      />
    </div>
  )
}

export const BackgroundColorControl = () => {
  const [backgroundColor, setBackgroundColor] = useStageConfigStore(
    useShallow((state) => [state.backgroundColor, state.setBackgroundColor]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Background:</Label>
      <Input
        type="color"
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
        className="w-10 h-8 p-0.5 cursor-pointer"
      />
      <span className="text-xs text-muted-foreground">{backgroundColor}</span>
    </div>
  )
}

export const BackgroundTextureControl = () => {
  const [backgroundTextureUrl, setBackgroundTextureUrl] = useStageConfigStore(
    useShallow((state) => [
      state.backgroundTextureUrl,
      state.setBackgroundTextureUrl,
    ]),
  )

  const handleBackgroundTextureUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          setBackgroundTextureUrl(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleClearTexture = () => {
    setBackgroundTextureUrl(null)
  }

  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Background Texture:</Label>
      {backgroundTextureUrl ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-square max-w-30 bg-secondary/50 rounded-lg overflow-hidden border border-border">
            <img
              src={backgroundTextureUrl}
              alt="Particle texture"
              className="w-full h-full object-contain"
            />
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 w-6 h-6"
              onClick={handleClearTexture}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleBackgroundTextureUpload}
          >
            <ImagePlus className="w-4 h-4" />
            Upload
          </Button>
        </div>
      )}
    </div>
  )
}

export const TickerSpeedControl = () => {
  const [tickerSpeed, setTickerSpeed] = useStageConfigStore(
    useShallow((state) => [state.tickerSpeed, state.setTickerSpeed]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Ticker Speed:</Label>
      <Input
        type="number"
        step={0.1}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={tickerSpeed}
        min={0}
        onChange={(e) => setTickerSpeed(parseFloat(e.target.value))}
      />
    </div>
  )
}

export const ContainerPosControl = () => {
  const [containerPos, setContainerPos] = useStageConfigStore(
    useShallow((state) => [state.containerPos, state.setContainerPos]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Container Pos:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">X:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={containerPos[0]}
            onChange={(e) =>
              setContainerPos([parseInt(e.target.value, 10), containerPos[1]])
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Y:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={containerPos[1]}
            onChange={(e) =>
              setContainerPos([containerPos[0], parseInt(e.target.value, 10)])
            }
          />
        </div>
      </div>
    </div>
  )
}
