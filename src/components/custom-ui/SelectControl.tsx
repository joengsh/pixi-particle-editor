import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { Label } from '../ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

type SelectControlProps = {
  labelName: string
  propName: keyof ParticleConfigUI
  list: string[]
  placeholder: string
  tooltip?: string
}

export const SelectControl = ({
  labelName,
  propName,
  placeholder,
  tooltip,
  list,
}: SelectControlProps) => {
  const [prop, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI[propName], state.setConfigUI]),
  )

  const onChange = useCallback(
    (value: string) => {
      setConfigUI((configUI) => ({
        ...configUI,
        [propName]: value,
      }))
    },
    [propName, setConfigUI],
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
      <Select value={prop} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {list.map((name) => (
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
