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
import { ColorControl } from './ParticleControl'
import { Separator } from '../ui/separator'
import { EmitterTypeControl } from './emitterControls/EmitterTypeControl'
import { NumberControl } from '../custom-ui/NumberControl'
import { SelectControl } from '../custom-ui/SelectControl'
import { SwitchControl } from '../custom-ui/SwitchControl'
import { memo } from 'react'
import { DuoNumberControl } from '../custom-ui/DuoNumberControl'
import { NumberListControl } from '../custom-ui/NumberListControl'

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
                <DuoNumberControl
                  labelName="Lifetime"
                  propName="lifetime"
                  subLabelName={['Min', 'Max']}
                  subPropName={['min', 'max']}
                />
                <Separator />
                <NumberListControl labelName="Alpha" propName="alpha" />
                <Separator />
                <NumberListControl labelName="Speed" propName="speed" />
                <NumberControl
                  labelName="Minimum Speed Multiplier"
                  propName="minimumSpeedMultiplier"
                  step={0.05}
                  tooltip="A value between minimum speed multipler and 1 is randomly generated and multiplied with start speed and end speed to provide the actual start speed and end speed for each particle."
                />
                <DuoNumberControl
                  labelName="Acceleration"
                  propName="acceleration"
                  subLabelName={['X', 'Y']}
                  subPropName={['x', 'y']}
                  tooltip="Acceleration of particles. Prevents using end speed. Without a rotation speed defined, particles will rotate to match movement direction"
                />
                <NumberControl
                  labelName="Max Speed"
                  propName="maxSpeed"
                  tooltip="The maximum speed allowed on accelerating particles. If particles are not using Acceleration, use Start Speed and End Speed instead."
                />
                <Separator />
                <NumberListControl labelName="Scale" propName="scale" />
                <NumberControl
                  labelName="Minimum Scale Multiplier"
                  propName="minimumScaleMultiplier"
                  step={0.05}
                  tooltip="A value between minimum scale multipler and 1 is randomly generated and multiplied with start scale and end scale to provide the actual start scale and end scale for each particle."
                />
                <Separator />
                <ColorControl />
                <Separator />
                <DuoNumberControl
                  labelName="Start Rotation"
                  propName="startRotation"
                  subLabelName={['Min', 'Max']}
                  subPropName={['min', 'max']}
                  tooltip="Angle at which particles are are pointed when emitted in degrees - 0 is to the right, 90 is down. This is ignored in 'arc' and 'burst' emission types"
                />
                <DuoNumberControl
                  labelName="Rotation Speed"
                  propName="rotationSpeed"
                  subLabelName={['Min', 'Max']}
                  subPropName={['min', 'max']}
                  tooltip="Speed in degrees per second that particles rotate - Positive numbers are clockwise"
                />
                <NumberControl
                  labelName="Rotation Acceleration"
                  propName="rotationAcceleration"
                  tooltip="Rotation acceleration of particles. Prevents using end speed."
                />
                <SwitchControl
                  labelName="No Rotation"
                  propName="noRotation"
                  tooltip="If particles should never rotate. A non-zero rotation speed will override this."
                />
                <Separator />
                <SelectControl
                  propName="blendMode"
                  labelName="Blend Mode"
                  placeholder="Select blend mode"
                  list={['normal', 'add', 'multiply', 'screen']}
                />
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
                <NumberControl
                  labelName="Frequency"
                  propName="frequency"
                  step={0.001}
                  tooltip="Seconds between each particle being spawned"
                />
                <NumberControl
                  labelName="Max Particle"
                  propName="maxParticles"
                  step={100}
                  tooltip="Maximum number of particles that can exist at once"
                />
                <NumberControl
                  labelName="Emitter Lifetime"
                  propName="emitterLifetime"
                  step={0.1}
                  tooltip="Lifetime of the emitter in seconds before it disables itself. Values of 0 or -1 are infinite"
                />
                <NumberControl
                  labelName="Particles Per Wave"
                  propName="particlesPerWave"
                  step={1}
                  tooltip="Number of particles to spawn in each burst wave"
                />
                <SwitchControl
                  labelName="Add at back"
                  propName="addAtBack"
                  tooltip="If particles should be added to the back of the display list instead of the top"
                />
                <NumberControl
                  labelName="Spawn Chance"
                  propName="spawnChance"
                  step={0.05}
                  tooltip="Chance whether the particle does actually spawn, range between 0 to 1"
                />
                <EmitterTypeControl />
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

export default memo(ControlPanel)
