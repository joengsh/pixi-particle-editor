import type { ValueStepData } from '@/types/particle/particleConfig'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { SquarePlus, Trash2 } from 'lucide-react'
import { useCallback } from 'react'

type ControlType = 'color' | 'number'

type ValueByType = {
  color: string
  number: number
}

type ListPropertyControlItemProps<T extends ControlType> = {
  index: number
  type: T
  data: ValueStepData<ValueByType[T]>
  onChange: (index: number, data: ValueStepData<ValueByType[T]>) => void
  onRemove: (index: number) => void
  disableRemove: boolean
}

export const ListPropertyControlItem = <T extends ControlType>({
  index,
  type,
  data,
  onChange,
  onRemove,
  disableRemove,
}: ListPropertyControlItemProps<T>) => {
  return (
    <div className="flex items-center gap-3">
      <Input
        type={type}
        step={1}
        value={data.value}
        onChange={(e) => {
          let value: ValueByType[T]
          if (type === 'number') {
            value = parseFloat(e.target.value) as ValueByType[T]
          } else {
            value = e.target.value as ValueByType[T]
          }
          onChange(index, {
            value: value,
            time: data.time,
          })
        }}
        className="flex-2 h-8 p-0.5 cursor-pointer"
      />
      <Input
        type="number"
        step={1}
        value={data.time}
        onChange={(e) => {
          onChange(index, {
            value: data.value,
            time: parseFloat(e.target.value),
          })
        }}
        className="flex-1 h-8 p-0.5 cursor-pointer"
      />
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={disableRemove}
        onClick={() => onRemove(index)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

type ListPropertyControlProps<T extends ControlType> = {
  type: T
  list: ValueStepData<ValueByType[T]>[]
  onChange: (
    fn: (
      list: ValueStepData<ValueByType[T]>[],
    ) => ValueStepData<ValueByType[T]>[],
  ) => void
}

export const ListPropertyControl = <T extends ControlType>({
  type,
  list,
  onChange,
}: ListPropertyControlProps<T>) => {
  const onItemChange = useCallback(
    (index: number, data: ValueStepData<ValueByType[T]>) => {
      onChange((list) => {
        const newList = [...list]
        newList[index] = data
        return newList
      })
    },
    [onChange],
  )

  const onItemRemove = useCallback(
    (index: number) => {
      onChange((list) => {
        const newList = [...list]
        newList.splice(index, 1)
        return newList
      })
    },
    [onChange],
  )

  const onAdd = useCallback(() => {
    onChange((list) => {
      const newList = [...list]
      const newItem = { ...list[list.length - 1] }
      newItem.time = (newItem.time + list[list.length - 2].time) * 0.5
      newList.splice(list.length - 1, 0, newItem)
      return newList
    })
  }, [onChange])

  return (
    <div className="relative space-y-3">
      {list.map((data, index) => (
        <ListPropertyControlItem
          key={index}
          index={index}
          type={type}
          data={data}
          onChange={onItemChange}
          onRemove={onItemRemove}
          disableRemove={index === 0 || index === list.length - 1}
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
