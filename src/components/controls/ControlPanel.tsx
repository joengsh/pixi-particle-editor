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
  TickerSpeedControl,
} from './StageControl'
import { LoadButton, SaveButton } from './GeneralControl'
import TextureList from '../TextureList'
import { TextureUpload } from './TextureControl'
import ParticleTypeControl from './ParticleTypeControl'
import {
  AddAtBackControl,
  FrequencyControl,
  MaxParticlesControl,
} from './EmitterControl'
import {
  AccelerationControl,
  AlphaControl,
  ColorControl,
  LifetimeControl,
  MinimumScaleMultiplierControl,
  MinimumSpeedMultiplierControl,
  ScaleControl,
  SpeedControl,
} from './ParticleControl'
import { Separator } from '../ui/separator'

const ControlPanel = () => {
  return (
    <div className="h-full flex flex-col bg-card items-stretch">
      <div className="px-4 pt-4 flex flex-row justify-between md:flex-col md:justify-start">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Particle Editor
        </h2>
        <div className="flex flex-wrap gap-2 justify-end md:justify-start">
          <SaveButton />
          <LoadButton />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-hidden [&>div>div]:block!">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={[
              'texture',
              'particle',
              'typeConfig',
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
              <AccordionContent className="p-4 space-y-5">
                <LifetimeControl />
                <Separator />
                <AlphaControl />
                <Separator />
                <SpeedControl />
                <AccelerationControl />
                <MinimumSpeedMultiplierControl />
                <Separator />
                <ScaleControl />
                <MinimumScaleMultiplierControl />
                <Separator />
                <ColorControl />
              </AccordionContent>
            </AccordionItem>

            {/* Particle Type Config */}
            <AccordionItem
              value="typeConfig"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Particle Type Config
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
                <ParticleTypeControl />
              </AccordionContent>
            </AccordionItem>

            {/* Emitter Properties */}
            <AccordionItem
              value="emitter"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Emitter Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
                <FrequencyControl />
                <MaxParticlesControl />
                <AddAtBackControl />
              </AccordionContent>
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
                <TickerSpeedControl />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ControlPanel
