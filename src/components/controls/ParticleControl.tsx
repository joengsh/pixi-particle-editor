import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import { ListPropertyControl } from './ListPropertyControl'
import { useCallback, useMemo } from 'react'
import type { ValueStepData } from '@/types/particle/particleConfig'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { EasingControl } from '../custom-ui/NumberListControl'
import type { EasingName } from '@/types/Easing'

export const ColorControl = () => {
  const [color, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.color, state.setConfigUI]),
  )

  const colorList = useMemo(
    () => color.list.map((data) => ({ ...data, value: `#${data.value}` })),
    [color.list],
  )

  const onChange = useCallback(
    (fn: (list: ValueStepData<string>[]) => ValueStepData<string>[]) => {
      setConfigUI((configUI) => ({
        ...configUI,
        color: {
          ...configUI.color,
          list: fn(configUI.color.list).map((data) => ({
            ...data,
            value: data.value.replace('#', ''),
          })),
        },
      }))
    },
    [setConfigUI],
  )

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Color:</Label>
      <div className="flex items-center gap-3">
        <Label className="text-xs">IsStepped:</Label>
        <Switch
          defaultChecked={color.isStepped}
          className="h-8 p-0.5 cursor-pointer"
          checked={color.isStepped}
          onCheckedChange={(checked) =>
            setConfigUI((configUI) => ({
              ...configUI,
              color: { ...configUI.color, isStepped: checked },
            }))
          }
        />
      </div>
      <EasingControl
        value={color.ease || ''}
        onChange={(value) =>
          setConfigUI((configUI) => ({
            ...configUI,
            color: { ...configUI.color, ease: value as EasingName },
          }))
        }
      />
      <ListPropertyControl type="color" list={colorList} onChange={onChange} />
    </div>
  )
}
