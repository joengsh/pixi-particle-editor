import type { ParticleConfig } from '@/lib/particle-config'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Upload } from 'lucide-react'

type ControlPanelProps = {
  config: ParticleConfig
  onChange: (config: ParticleConfig) => void
  backgroundColor: string
  onBackgroundChange: (color: string) => void
}

const ControlPanel = ({
  config,
  onChange,
  backgroundColor,
  onBackgroundChange,
}: ControlPanelProps) => {
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
      <ScrollArea className="flex-1 overflow-scroll">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['particle', 'emitter', 'stage']} className="space-y-2">
            {/* Particle Properties */}
            <AccordionItem value="particle" className="border border-border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Particle Properties
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ControlPanel
