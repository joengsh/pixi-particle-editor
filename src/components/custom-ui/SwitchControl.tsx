import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Switch } from '../ui/switch'

type SwitchControlProps = {
  labelName: string
  propName: keyof ParticleConfigUI
  tooltip?: string
}

export const SwitchControl = ({
  labelName,
  propName,
  tooltip,
}: SwitchControlProps) => {
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
      <Switch
        defaultChecked={prop}
        className="h-8 p-0.5 cursor-pointer"
        checked={prop}
        onCheckedChange={(checked) =>
          setConfigUI((configUI) => ({
            ...configUI,
            [propName]: checked,
          }))
        }
      />
    </div>
  )
}
