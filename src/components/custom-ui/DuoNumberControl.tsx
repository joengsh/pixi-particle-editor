import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useShallow } from 'zustand/shallow'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type DuoNumberControlProps = {
  labelName: string
  propName: keyof ParticleConfigUI
  tooltip?: string
  step?: number
  subLabelName: [string, string]
  subPropName: [string, string]
}

export const DuoNumberControl = ({
  labelName,
  propName,
  tooltip,
  step,
  subLabelName,
  subPropName,
}: DuoNumberControlProps) => {
  const [prop, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI[propName], state.setConfigUI]),
  )
  return (
    <div className="flex flex-col gap-3">
      {tooltip && (
        <Tooltip>
          <TooltipTrigger>
            <Label className="text-xs">{labelName}:</Label>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
      {!tooltip && <Label className="text-xs">{labelName}:</Label>}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">{subLabelName[0]}:</Label>
          <Input
            type="number"
            step={step ?? 0.5}
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={prop[subPropName[0]]}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                [propName]: {
                  [subPropName[0]]: parseFloat(e.target.value),
                  [subPropName[1]]: configUI[propName][subPropName[1]],
                },
              }))
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">{subLabelName[1]}:</Label>
          <Input
            type="number"
            step={step ?? 0.5}
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={prop[subPropName[1]]}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                [propName]: {
                  [subPropName[0]]: configUI[propName][subPropName[0]],
                  [subPropName[1]]: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  )
}
