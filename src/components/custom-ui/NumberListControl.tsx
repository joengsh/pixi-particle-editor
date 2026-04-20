import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { easingNames, type EasingName } from '@/types/Easing'
import type { ValueStepData } from '@/types/particle/particleConfig'
import { useCallback } from 'react'
import { useShallow } from 'zustand/shallow'
import { ListPropertyControl } from '../controls/ListPropertyControl'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Switch } from '../ui/switch'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type EasingControlType = {
  value: string
  onChange: (value: string) => void
}

export const EasingControl = ({ value, onChange }: EasingControlType) => {
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Ease:</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a easing" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="null">None</SelectItem>
            {easingNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

type NumberListControlProps = {
  labelName: string
  propName: keyof ParticleConfigUI
  tooltip?: string
}

export const NumberListControl = ({
  labelName,
  propName,
  tooltip,
}: NumberListControlProps) => {
  const [prop, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI[propName], state.setConfigUI]),
  )

  const onChange = useCallback(
    (fn: (list: ValueStepData<number>[]) => ValueStepData<number>[]) => {
      setConfigUI((configUI) => ({
        ...configUI,
        [propName]: {
          ...configUI[propName],
          list: fn(configUI[propName].list),
        },
      }))
    },
    [propName, setConfigUI],
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
        <Label className="text-xs">IsStepped:</Label>
        <Switch
          defaultChecked={prop.isStepped}
          className="h-8 p-0.5 cursor-pointer"
          checked={prop.isStepped}
          onCheckedChange={(checked) =>
            setConfigUI((configUI) => ({
              ...configUI,
              [propName]: { ...configUI[propName], isStepped: checked },
            }))
          }
        />
      </div>
      <EasingControl
        value={prop.ease || ''}
        onChange={(value) =>
          setConfigUI((configUI) => ({
            ...configUI,
            [propName]: {
              ...configUI[propName],
              ease: value === 'null' ? undefined : (value as EasingName),
            },
          }))
        }
      />
      <ListPropertyControl type="number" list={prop.list} onChange={onChange} />
    </div>
  )
}
