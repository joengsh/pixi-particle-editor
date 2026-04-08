import type { ParticleConfig } from '@/lib/particle-config'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BackgroundColorControl,
  BackgroundScaleControl,
  BackgroundTextureControl,
  ResolutionControl,
} from './StageControl'
import { ExportButton, LoadButton, SaveButton } from './GeneralControl'
import TextureList from '../TextureList'
import { TextureUpload } from './TextureControl'

type ControlPanelProps = {
  config: ParticleConfig
  onChange: (config: ParticleConfig) => void
}

const ControlPanel = ({ config, onChange }: ControlPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-card items-stretch">
      <div className="px-4 pt-4 flex flex-row justify-between md:flex-col md:justify-start">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Particle Editor
        </h2>
        <div className="flex flex-wrap gap-2 justify-end md:justify-start">
          <SaveButton />
          <LoadButton />
          <ExportButton />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-hidden [&>div>div]:block!">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={[
              'texture',
              'particle',
              'advanced',
              'emitter',
              'stage',
            ]}
            className="space-y-2"
          >
            {/* Texture Management */}
            <AccordionItem
              value="texture"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Textures
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
                <TextureUpload />
                <TextureList />
              </AccordionContent>
            </AccordionItem>

            {/* Particle Properties */}
            <AccordionItem
              value="particle"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Particle Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5"></AccordionContent>
            </AccordionItem>

            {/* Emitter Properties */}
            <AccordionItem
              value="advanced"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Advanced Particle Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5"></AccordionContent>
            </AccordionItem>

            {/* Emitter Properties */}
            <AccordionItem
              value="emitter"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Emitter Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5"></AccordionContent>
            </AccordionItem>

            {/* Stage Properties */}
            <AccordionItem
              value="stage"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Stage Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-4">
                <ResolutionControl />
                <BackgroundColorControl />
                <BackgroundTextureControl />
                <BackgroundScaleControl />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ControlPanel
