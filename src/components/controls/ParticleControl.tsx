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

export const MinimumScaleMultiplierControl = () => {
  const [minimumScaleMultiplier, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [
      state.configUI.minimumScaleMultiplier,
      state.setConfigUI,
    ]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Minimum Scale Multiplier:</Label>
      <Input
        type="number"
        step={0.05}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={minimumScaleMultiplier}
        onChange={(e) =>
          setConfigUI((configUI) => ({
            ...configUI,
            minimumScaleMultiplier: parseFloat(e.target.value) ?? 0,
          }))
        }
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

export const MinimumSpeedMultiplierControl = () => {
  const [minimumSpeedMultiplier, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [
      state.configUI.minimumSpeedMultiplier,
      state.setConfigUI,
    ]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Minimum Speed Multiplier:</Label>
      <Input
        type="number"
        step={0.05}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={minimumSpeedMultiplier}
        onChange={(e) =>
          setConfigUI((configUI) => ({
            ...configUI,
            minimumSpeedMultiplier: parseFloat(e.target.value) ?? 0,
          }))
        }
      />
    </div>
  )
}

export const LifetimeControl = () => {
  const [lifetime, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.lifetime, state.setConfigUI]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Lifttime:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Min:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={lifetime.min}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                lifetime: {
                  min: parseFloat(e.target.value),
                  max: configUI.lifetime.max,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Max:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={lifetime.max}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                lifetime: {
                  min: configUI.lifetime.min,
                  max: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>
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

export const AccelerationControl = () => {
  const [acceleration, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.acceleration, state.setConfigUI]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Acceleration:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">X:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={acceleration.x}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                acceleration: {
                  x: parseFloat(e.target.value),
                  y: configUI.acceleration.y,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Y:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={acceleration.y}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                acceleration: {
                  x: configUI.acceleration.x,
                  y: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export const BlendModeControl = () => {
  const [blendMode, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.blendMode, state.setConfigUI]),
  )

  const onChange = useCallback(
    (value: string) => {
      setConfigUI((configUI) => ({
        ...configUI,
        blendMode: value,
      }))
    },
    [setConfigUI],
  )

  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Blend Mode:</Label>
      <Select value={blendMode} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select blend mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {['normal', 'add', 'multiply', 'screen'].map((name) => (
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

export const RotationSpeedControl = () => {
  const [rotationSpeed, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.rotationSpeed, state.setConfigUI]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Rotation Speed:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Min:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={rotationSpeed.min}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                rotationSpeed: {
                  min: parseFloat(e.target.value),
                  max: configUI.rotationSpeed.max,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Max:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={rotationSpeed.max}
            onChange={(e) =>
              setConfigUI((configUI) => ({
                ...configUI,
                rotationSpeed: {
                  min: configUI.rotationSpeed.min,
                  max: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  )
}

export const RotationAccelerationControl = () => {
  const [rotationAcceleration, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [
      state.configUI.rotationAcceleration,
      state.setConfigUI,
    ]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Rotation Acceleration:</Label>
      <Input
        type="number"
        step={0.5}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={rotationAcceleration}
        onChange={(e) =>
          setConfigUI((configUI) => ({
            ...configUI,
            rotationAcceleration: parseFloat(e.target.value) ?? 0,
          }))
        }
      />
    </div>
  )
}

export const NoRotationControl = () => {
  const [noRotation, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.noRotation, state.setConfigUI]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">No Rotation:</Label>
      <Switch
        defaultChecked={noRotation}
        className="h-8 p-0.5 cursor-pointer"
        checked={noRotation}
        onCheckedChange={(checked) =>
          setConfigUI((configUI) => ({
            ...configUI,
            noRotation: checked,
          }))
        }
      />
    </div>
  )
}
