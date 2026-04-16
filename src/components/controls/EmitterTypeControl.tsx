import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { Label } from '../ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../ui/select'
import { useShallow } from 'zustand/shallow'
import { emitterTypes, type EmitterType } from '@/types/particle/emitterType'
import type {
  EmitterSpawnType,
  ParticleConfigUI,
} from '@/types/particleConfigUIData'
import { Input } from '../ui/input'
import { useCallback, useMemo } from 'react'

type EmitterTypeSpawnControlProps = {
  emitterType: EmitterSpawnType
  setConfigUI: (fn: (configUI: ParticleConfigUI) => ParticleConfigUI) => void
}

export const EmitterTypeRectControl = ({
  emitterType,
  setConfigUI,
}: EmitterTypeSpawnControlProps) => {
  const spawnRect = useMemo(() => {
    if (emitterType.type === 'rect') {
      return emitterType.spawnRect
    } else {
      throw new Error(
        "EmitterTypeRectControl should only handle spawnType 'Rect'.",
      )
    }
  }, [emitterType])

  const updateSpawnRect = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const newEmitterType: EmitterSpawnType = {
        type: 'rect',
        spawnRect: {
          x,
          y,
          w,
          h,
        },
      }
      setConfigUI((configUI) => ({
        ...configUI,
        emitterType: newEmitterType,
      }))
    },
    [setConfigUI],
  )
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs">Rectangle:</Label>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">X:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnRect.x}
            onChange={(e) =>
              updateSpawnRect(
                parseFloat(e.target.value),
                spawnRect.y,
                spawnRect.w,
                spawnRect.h,
              )
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Y:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnRect.y}
            onChange={(e) =>
              updateSpawnRect(
                spawnRect.x,
                parseFloat(e.target.value),
                spawnRect.w,
                spawnRect.h,
              )
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">W:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnRect.w}
            onChange={(e) =>
              updateSpawnRect(
                spawnRect.x,
                spawnRect.y,
                parseFloat(e.target.value),
                spawnRect.h,
              )
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">H:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnRect.h}
            onChange={(e) =>
              updateSpawnRect(
                spawnRect.x,
                spawnRect.y,
                spawnRect.w,
                parseFloat(e.target.value),
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export const EmitterTypeCircleControl = ({
  emitterType,
  setConfigUI,
}: EmitterTypeSpawnControlProps) => {
  return null
}

export const EmitterTypeControl = () => {
  const [emitterType, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.emitterType, state.setConfigUI]),
  )

  const updateSpawnType = useCallback(
    (type: EmitterType) => {
      let newEmitterType: EmitterSpawnType
      switch (type) {
        case 'point':
          newEmitterType = {
            type: 'point',
          }
          break
        case 'rect':
          newEmitterType = {
            type: 'rect',
            spawnRect: {
              x: 0,
              y: 0,
              w: 100,
              h: 100,
            },
          }
          break
      }
      setConfigUI((configUI) => ({
        ...configUI,
        emitterType: newEmitterType,
      }))
    },
    [setConfigUI],
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Label className="text-xs">Spawn Type:</Label>
        <Select
          value={emitterType.type}
          onValueChange={(value) => updateSpawnType(value as EmitterType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a easing" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {emitterTypes.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {emitterType.type === 'rect' && (
        <EmitterTypeRectControl
          emitterType={emitterType}
          setConfigUI={setConfigUI}
        />
      )}
      {emitterType.type === 'circle' && (
        <EmitterTypeCircleControl
          emitterType={emitterType}
          setConfigUI={setConfigUI}
        />
      )}
    </div>
  )
}
