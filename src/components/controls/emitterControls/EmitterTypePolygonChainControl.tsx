import type { BasicPoint } from '@/types/particle/particleConfig'
import type { EmitterTypeSpawnControlProps } from './EmitterTypeControl'
import type {
  EmitterSpawnType,
  ParticleConfigUI,
} from '@/types/particleConfigUIData'
import { Button } from '@/components/ui/button'
import { Trash2, SquarePen, SquareCheckBig, SquarePlus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import usePolygonChainEditStore from '@/stores/PolygonChainEditStore'

const polygonToText = (points: BasicPoint[]): string => {
  return points.map((p) => `${p.x}, ${p.y}`).join('\n')
}

const textToPolygon = (text: string): BasicPoint[] => {
  if (text.trim() == '') {
    return []
  }
  const lines = text.split('\n')

  return lines.map((rawLine, index) => {
    const lineNumber = index + 1
    const line = rawLine.trim()

    if (line.length === 0) {
      throw new Error(`Line ${lineNumber} is empty`)
    }

    const parts = line.split(',')

    if (parts.length !== 2) {
      throw new Error(
        `Line ${lineNumber} must contain exactly one comma: "${rawLine}"`,
      )
    }

    const [xStr, yStr] = parts.map((p) => p.trim())

    if (xStr === '' || yStr === '') {
      throw new Error(
        `Line ${lineNumber} must have both x and y values: "${rawLine}"`,
      )
    }

    const x = Number(xStr)
    const y = Number(yStr)

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(
        `Line ${lineNumber} contains invalid number(s): "${rawLine}"`,
      )
    }

    return { x, y }
  })
}

type PolygonChainEditorProps = {
  index: number
  data: BasicPoint[]
  isEdit: boolean
  setConfigUI: (fn: (configUI: ParticleConfigUI) => ParticleConfigUI) => void
  onEditButtonPressed: (index: number) => void
  onDelete: (index: number) => void
}

const PolygonChainEditor = ({
  index,
  data,
  isEdit,
  setConfigUI,
  onEditButtonPressed,
  onDelete,
}: PolygonChainEditorProps) => {
  const [text, setText] = useState(polygonToText(data))

  useEffect(() => {
    setText(polygonToText(data))
  }, [data])

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
      setText(e.target.value)
      try {
        const polygon = textToPolygon(e.target.value)
        setConfigUI((configUI) => {
          const newEmitterType: EmitterSpawnType = { ...configUI.emitterType }
          if (newEmitterType.type === 'polygonalChain') {
            newEmitterType.spawnPolygon[index] = polygon
            return {
              ...configUI,
              emitterType: newEmitterType,
            }
          } else {
            throw new Error(
              "EmitterTypePolygonChainControl should only handle spawnType 'polygonalChain'.",
            )
          }
        })
      } catch {
        // ignore err
      }
    },
    [index, setConfigUI],
  )
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onEditButtonPressed(index)}
        className={`text-muted-foreground ${isEdit && 'text-blue-500'} ${isEdit ? 'hover:text-green-500' : 'hover:text-blue-500'}`}
      >
        {isEdit && <SquareCheckBig className="h-4 w-4" />}
        {!isEdit && <SquarePen className="h-4 w-4" />}
      </Button>
      <Textarea
        value={text}
        minLength={100}
        onChange={onChange}
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(index)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export const EmitterTypePolygonChainControl = ({
  emitterType,
  setConfigUI,
}: EmitterTypeSpawnControlProps) => {
  const [editIndex, isEdit, setEdit] = usePolygonChainEditStore(
    useShallow((state) => [state.index, state.isEdit, state.setEdit]),
  )
  const polygons = useMemo(() => {
    if (emitterType.type === 'polygonalChain') {
      return emitterType.spawnPolygon
    } else {
      throw new Error(
        "EmitterTypePolygonChainControl should only handle spawnType 'polygonalChain'.",
      )
    }
  }, [emitterType])

  const onAdd = useCallback(() => {
    setConfigUI((configUI) => {
      const newEmitterType: EmitterSpawnType = { ...configUI.emitterType }
      if (newEmitterType.type === 'polygonalChain') {
        const newPolygons = [...newEmitterType.spawnPolygon]
        newPolygons.push([])
        newEmitterType.spawnPolygon = newPolygons
        return {
          ...configUI,
          emitterType: newEmitterType,
        }
      } else {
        throw new Error(
          "EmitterTypePolygonChainControl should only handle spawnType 'polygonalChain'.",
        )
      }
    })
  }, [setConfigUI])

  const onEditButtonPressed = useCallback(
    (index: number) => {
      setEdit((state) => {
        if (state.isEdit) {
          if (state.index === index) {
            return {
              isEdit: false,
              index: undefined,
            }
          } else {
            return {
              index,
            }
          }
        } else {
          return {
            isEdit: true,
            index,
          }
        }
      })
    },
    [setEdit],
  )

  const onDelete = useCallback(
    (index: number) => {
      setConfigUI((configUI) => {
        const newEmitterType = { ...configUI.emitterType }
        if (newEmitterType.type === 'polygonalChain') {
          const newPolygons = [...newEmitterType.spawnPolygon]
          newPolygons.splice(index, 1)
          newEmitterType.spawnPolygon = newPolygons

          return {
            ...configUI,
            emitterType: newEmitterType,
          }
        } else {
          throw new Error(
            "EmitterTypePolygonChainControl should only handle spawnType 'polygonalChain'.",
          )
        }
      })
      setEdit((state) => {
        if (state.isEdit && state.index === index) {
          return {
            isEdit: false,
            index: undefined,
          }
        }
        return state
      })
    },
    [setConfigUI, setEdit],
  )

  return (
    <div className="flex flex-col gap-3">
      {polygons.map((data, index) => (
        <PolygonChainEditor
          key={`${index}-${JSON.stringify(data)}`}
          index={index}
          data={data}
          setConfigUI={setConfigUI}
          onDelete={onDelete}
          onEditButtonPressed={onEditButtonPressed}
          isEdit={isEdit && index === editIndex}
        />
      ))}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onAdd}
        className="text-muted-foreground hover:text-green-500 w-full"
      >
        <SquarePlus className="h-4 w-4" /> Add
      </Button>
    </div>
  )
}
