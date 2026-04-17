import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type NumberControlProps = {
  labelName: string
  propName: keyof ParticleConfigUI
  tooltip?: string
  step?: number
}

export const NumberControl = ({
  labelName,
  propName,
  tooltip,
  step,
}: NumberControlProps) => {
  const [prop, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI[propName], state.setConfigUI]),
  )
  return (
    <div className="flex items-center gap-3">
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
      <Input
        type="number"
        step={step ?? 0.5}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={prop}
        onChange={(e) =>
          setConfigUI((configUI) => ({
            ...configUI,
            [propName]: parseFloat(e.target.value) ?? 0,
          }))
        }
      />
    </div>
  )
}
