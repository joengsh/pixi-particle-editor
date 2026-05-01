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
} from '../controls/StageControl'
import { memo } from 'react'
import {
  ChainContainerPosControl,
  ChainFixSpawnPosControl,
} from './ChainControls'

const ChainControlPanel = () => {
  return (
    <div className="h-full flex flex-col bg-card items-stretch">
      <div className="px-4 pt-4 flex flex-row justify-between md:flex-col md:justify-start">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Chain Editor
        </h2>
      </div>
      <ScrollArea className="flex-1 overflow-hidden [&>div>div]:block!">
        <div className="p-4">
          <Accordion
            type="multiple"
            defaultValue={['emitter', 'stage']}
            className="space-y-2"
          >
            {/* Emitter Properties */}
            <AccordionItem
              value="emitter"
              className="border border-border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-secondary/50 hover:bg-secondary/70 text-sm font-medium">
                Emitter Properties
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-5">
                <ChainContainerPosControl />
                <ChainFixSpawnPosControl />
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

export default memo(ChainControlPanel)
