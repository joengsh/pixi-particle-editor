import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import { ListPropertyControl } from './ListPropertyControl'
import { useCallback, useMemo } from 'react'
import type { ValueStepData } from '@/types/particle/particleConfig'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Input } from '../ui/input'
import { easingNames, type EasingName } from '@/types/Easing'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../ui/select'

type EasingControlType = {
  value: string
  onChange: (value: string) => void
}

const EasingControl = ({ value, onChange }: EasingControlType) => {
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

export const AlphaControl = () => {
  const [alpha, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.alpha, state.setConfigUI]),
  )

  const onChange = useCallback(
    (fn: (list: ValueStepData<number>[]) => ValueStepData<number>[]) => {
      setConfigUI((configUI) => ({
        ...configUI,
        alpha: { ...configUI.alpha, list: fn(configUI.alpha.list) },
      }))
    },
    [setConfigUI],
  )

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Alpha:</Label>
      <div className="flex items-center gap-3">
        <Label className="text-xs">IsStepped:</Label>
        <Switch
          defaultChecked={alpha.isStepped}
          className="h-8 p-0.5 cursor-pointer"
          checked={alpha.isStepped}
          onCheckedChange={(checked) =>
            setConfigUI((configUI) => ({
              ...configUI,
              alpha: { ...configUI.alpha, isStepped: checked },
            }))
          }
        />
      </div>
      <EasingControl
        value={alpha.ease || ''}
        onChange={(value) =>
          setConfigUI((configUI) => ({
            ...configUI,
            alpha: {
              ...configUI.alpha,
              ease: value === 'null' ? undefined : (value as EasingName),
            },
          }))
        }
      />
      <ListPropertyControl
        type="number"
        list={alpha.list}
        onChange={onChange}
      />
    </div>
  )
}

export const ScaleControl = () => {
  const [scale, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.scale, state.setConfigUI]),
  )

  const onChange = useCallback(
    (fn: (list: ValueStepData<number>[]) => ValueStepData<number>[]) => {
      setConfigUI((configUI) => ({
        ...configUI,
        scale: { ...configUI.scale, list: fn(configUI.scale.list) },
      }))
    },
    [setConfigUI],
  )

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Scale:</Label>
      <div className="flex items-center gap-3">
        <Label className="text-xs">IsStepped:</Label>
        <Switch
          defaultChecked={scale.isStepped}
          className="h-8 p-0.5 cursor-pointer"
          checked={scale.isStepped}
          onCheckedChange={(checked) =>
            setConfigUI((configUI) => ({
              ...configUI,
              scale: { ...configUI.scale, isStepped: checked },
            }))
          }
        />
      </div>
      <EasingControl
        value={scale.ease || ''}
        onChange={(value) =>
          setConfigUI((configUI) => ({
            ...configUI,
            scale: {
              ...configUI.scale,
              ease: value === 'null' ? undefined : (value as EasingName),
            },
          }))
        }
      />
      <ListPropertyControl
        type="number"
        list={scale.list}
        onChange={onChange}
      />
    </div>
  )
}

export const SpeedControl = () => {
  const [speed, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.speed, state.setConfigUI]),
  )

  const onChange = useCallback(
    (fn: (list: ValueStepData<number>[]) => ValueStepData<number>[]) => {
      setConfigUI((configUI) => ({
        ...configUI,
        speed: { ...configUI.speed, list: fn(configUI.speed.list) },
      }))
    },
    [setConfigUI],
  )

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Speed:</Label>
      <div className="flex items-center gap-3">
        <Label className="text-xs">IsStepped:</Label>
        <Switch
          defaultChecked={speed.isStepped}
          className="h-8 p-0.5 cursor-pointer"
          checked={speed.isStepped}
          onCheckedChange={(checked) =>
            setConfigUI((configUI) => ({
              ...configUI,
              speed: { ...configUI.speed, isStepped: checked },
            }))
          }
        />
      </div>
      <EasingControl
        value={speed.ease || ''}
        onChange={(value) =>
          setConfigUI((configUI) => ({
            ...configUI,
            speed: {
              ...configUI.speed,
              ease: value === 'null' ? undefined : (value as EasingName),
            },
          }))
        }
      />
      <ListPropertyControl
        type="number"
        list={speed.list}
        onChange={onChange}
      />
    </div>
  )
}

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
