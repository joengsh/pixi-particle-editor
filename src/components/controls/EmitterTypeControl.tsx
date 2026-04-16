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
  const spawnCircle = useMemo(() => {
    if (emitterType.type === 'circle' || emitterType.type === 'ring') {
      return emitterType.spawnCircle
    } else {
      throw new Error(
        "EmitterTypeCircleControl should only handle spawnType 'circle' or 'ring'.",
      )
    }
  }, [emitterType])

  const updateSpawnCircle = useCallback(
    (x: number, y: number, r: number, minR?: number) => {
      setConfigUI((configUI) => {
        const type = configUI.emitterType.type
        let newEmitterType: EmitterSpawnType
        switch (type) {
          case 'circle':
            newEmitterType = {
              type: 'circle',
              spawnCircle: {
                x,
                y,
                r,
              },
            }
            break
          case 'ring':
            newEmitterType = {
              type: 'ring',
              spawnCircle: {
                x,
                y,
                r,
                minR: minR!,
              },
            }
            break
          default:
            throw new Error(
              "EmitterTypeCircleControl should only handle spawnType 'circle' or 'ring'.",
            )
        }
        return {
          ...configUI,
          emitterType: newEmitterType,
        }
      })
    },
    [setConfigUI],
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">X:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnCircle.x}
            onChange={(e) =>
              updateSpawnCircle(
                parseFloat(e.target.value),
                spawnCircle.y,
                spawnCircle.r,
                spawnCircle.minR,
              )
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Y:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnCircle.y}
            onChange={(e) =>
              updateSpawnCircle(
                spawnCircle.x,
                parseFloat(e.target.value),
                spawnCircle.r,
                spawnCircle.minR,
              )
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {emitterType.type === 'ring' && (
          <div className="flex flex-1 items-center gap-3">
            <Label className="text-xs">minR:</Label>
            <Input
              type="number"
              className="flex-1 h-8 p-0.5 cursor-pointer"
              value={spawnCircle.minR}
              onChange={(e) =>
                updateSpawnCircle(
                  spawnCircle.x,
                  spawnCircle.y,
                  spawnCircle.r,
                  parseFloat(e.target.value),
                )
              }
            />
          </div>
        )}
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">R:</Label>
          <Input
            type="number"
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={spawnCircle.r}
            onChange={(e) =>
              updateSpawnCircle(
                spawnCircle.x,
                spawnCircle.y,
                parseFloat(e.target.value),
                spawnCircle.minR,
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export const EmitterTypeBurstControl = ({
  emitterType,
  setConfigUI,
}: EmitterTypeSpawnControlProps) => {
  const { particleSpacing, particlesPerWave, angleStart } = useMemo(() => {
    if (emitterType.type === 'burst') {
      return {
        particleSpacing: emitterType.particleSpacing,
        particlesPerWave: emitterType.particlesPerWave,
        angleStart: emitterType.angleStart,
      }
    } else {
      throw new Error(
        "EmitterTypeBurstControl should only handle spawnType 'burst'.",
      )
    }
  }, [emitterType])

  const updateSpawnBurst = useCallback(
    (particleSpacing: number, particlesPerWave: number, angleStart: number) => {
      const newEmitterType: EmitterSpawnType = {
        type: 'burst',
        particleSpacing,
        particlesPerWave,
        angleStart,
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
      <div className="flex flex-1 items-center gap-3">
        <Label className="text-xs">Particle Spacing:</Label>
        <Input
          type="number"
          className="flex-1 h-8 p-0.5 cursor-pointer"
          value={particleSpacing}
          onChange={(e) =>
            updateSpawnBurst(
              parseFloat(e.target.value),
              particlesPerWave,
              angleStart,
            )
          }
        />
      </div>
      <div className="flex flex-1 items-center gap-3">
        <Label className="text-xs">Particles Per Wave:</Label>
        <Input
          type="number"
          className="flex-1 h-8 p-0.5 cursor-pointer"
          value={particlesPerWave}
          onChange={(e) =>
            updateSpawnBurst(
              particleSpacing,
              parseFloat(e.target.value),
              angleStart,
            )
          }
        />
      </div>
      <div className="flex flex-1 items-center gap-3">
        <Label className="text-xs">Start Angle:</Label>
        <Input
          type="number"
          className="flex-1 h-8 p-0.5 cursor-pointer"
          value={angleStart}
          onChange={(e) =>
            updateSpawnBurst(
              particleSpacing,
              particlesPerWave,
              parseFloat(e.target.value),
            )
          }
        />
      </div>
    </div>
  )
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
              w: 200,
              h: 200,
            },
          }
          break
        case 'circle':
        case 'ring':
          newEmitterType = {
            type,
            spawnCircle: {
              x: 0,
              y: 0,
              r: 200,
              minR: 200,
            },
          }
          break
        case 'burst':
          newEmitterType = {
            type,
            particleSpacing: 0,
            particlesPerWave: 50,
            angleStart: 0,
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
      {(emitterType.type === 'circle' || emitterType.type === 'ring') && (
        <EmitterTypeCircleControl
          emitterType={emitterType}
          setConfigUI={setConfigUI}
        />
      )}
      {emitterType.type === 'burst' && (
        <EmitterTypeBurstControl
          emitterType={emitterType}
          setConfigUI={setConfigUI}
        />
      )}
    </div>
  )
}
