import type { ParticleConfig } from '@/lib/particle-config'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Upload, ImagePlus, X } from 'lucide-react'

type ControlPanelProps = {
  config: ParticleConfig
  onChange: (config: ParticleConfig) => void
  backgroundColor: string
  onBackgroundChange: (color: string) => void
  backgroundTextureUrl: string | null
  onBackgroundTextureChange: (url: string | null) => void
  resolution: [number, number]
  setResolution: (value: [number, number]) => void
  backgroundScale: number
  setBackgroundScale: (value: number) => void
}

const ControlPanel = ({
  config,
  onChange,
  backgroundColor,
  onBackgroundChange,
  backgroundTextureUrl,
  onBackgroundTextureChange,
  resolution,
  setResolution,
  backgroundScale,
  setBackgroundScale
}: ControlPanelProps) => {
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
          onBackgroundTextureChange(dataUrl)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

    const handleClearTexture = () => {
      onBackgroundTextureChange(null)
    }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="px-4 pt-4 flex flex-row justify-between">
        <h2 className="text-lg font-semibold text-foreground mb-3">Particle Editor</h2>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={()=>{}} className="gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Load
          </Button>
          <Button size="sm" variant="outline" onClick={()=>{}} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['particle', 'advanced', 'emitter', 'stage']} className="space-y-2">
            {/* Particle Properties */}
            <AccordionItem value="particle" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Particle Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
              </AccordionContent>
            </AccordionItem>

            {/* Emitter Properties */}
            <AccordionItem value="advanced" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Advanced Particle Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
              </AccordionContent>
            </AccordionItem>

            {/* Emitter Properties */}
            <AccordionItem value="emitter" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Emitter Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
              </AccordionContent>
            </AccordionItem>

            {/* Stage Properties */}
            <AccordionItem value="stage" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Stage Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <div className="flex flex-col gap-3">
                  <Label className="text-xs">Resolution:</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-3">
                      <Label className="text-xs">W:</Label>
                      <Input
                        type="number"
                        className="flex-1 h-8 p-0.5 cursor-pointer"
                        value={resolution[0]}
                        onChange={(e)=> setResolution([parseInt(e.target.value, 10), resolution[1]])}
                      />
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <Label className="text-xs">H:</Label>
                      <Input
                        type="number"
                        className="flex-1 h-8 p-0.5 cursor-pointer"
                        value={resolution[1]}
                        onChange={(e)=> setResolution([resolution[0], parseInt(e.target.value, 10)])}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs">Background:</Label>
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => onBackgroundChange(e.target.value)}
                    className="w-10 h-8 p-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">{backgroundColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Label className="text-xs">Background Texture:</Label>
                  {backgroundTextureUrl ? (
                    <div className="space-y-3">
                      <div className="relative w-full aspect-square max-w-[120px] bg-secondary/50 rounded-lg overflow-hidden border border-border">
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
                <div className="flex items-center gap-3">
                  <Label className="text-xs">Background Scale:</Label>
                  <Input
                    type="number"
                    step={0.05}
                    className="flex-1 h-8 p-0.5 cursor-pointer"
                    value={backgroundScale}
                    onChange={(e)=> setBackgroundScale(parseFloat(e.target.value))}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ControlPanel
