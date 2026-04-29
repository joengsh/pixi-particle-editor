import { useShallow } from 'zustand/shallow'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Switch } from '../ui/switch'
import useProjectStore from '@/stores/ProjectStore'

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
  const [prop, setConfigUI] = useProjectStore(
    useShallow((state) => [
      state.projects[state.currentProject].configUI[propName],
      state.updateCurrentProjectConfig,
    ]),
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
