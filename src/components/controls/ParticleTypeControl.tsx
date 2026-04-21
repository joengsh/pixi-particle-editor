import useParticleConfigStore from '@/stores/ParticleConfigStore'
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from '../ui/select'
import { useShallow } from 'zustand/shallow'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Separator } from '../ui/separator'
import type {
  AnimationParticleArtData,
  ParticleTypeData,
} from '@/types/particleConfigUIData'
import { MultiSelect } from '../MultiSelect'
import useTextureStore from '@/stores/TextureStore'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import { SquarePlus } from 'lucide-react'

const particleTypes = ['basic', 'animated']

const ParticleBasicTypeControl = () => {
  const textureData = useTextureStore((state) => state.textureData)
  const particleType = useParticleConfigStore(
    useShallow((state) => state.configUI.particleType),
  )
  const setConfigUI = useParticleConfigStore(
    useShallow((state) => state.setConfigUI),
  )
  const options = useMemo(
    () =>
      Object.keys(textureData).map((textureName) => ({
        value: textureName,
        label: textureName,
      })),
    [textureData],
  )
  const [values, setValue] = useState<string[]>(particleType.art as string[])

  useEffect(() => {
    setConfigUI((configUI) => ({
      ...configUI,
      particleType: {
        type: 'basic',
        art: values,
        orderedArt: false,
      },
    }))
  }, [values, setConfigUI])

  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Textures:</Label>
      <MultiSelect
        defaultValue={values}
        options={options}
        value={values}
        onValueChange={setValue}
        placeholder="Choose textures..."
      />
    </div>
  )
}

type ParticleAnimatedTypeConfigItemProps = {
  index?: number
  animationList: string[]
  mode: 'add' | 'remove'
  onAdd?: (
    animationName: string,
    ranges: string,
    framerate: 'matchLife' | string,
    loop: boolean,
  ) => void
  onRemove?: (index: number) => void
  onChange: (
    animationName: string,
    ranges: string,
    framerate: 'matchLife' | string,
    loop: boolean,
    index?: number,
  ) => void
  animationName?: string
  ranges: string
  framerate: 'matchLife' | string
  loop: boolean
}
const ParticleAnimatedTypeConfigItem = ({
  index,
  animationList,
  mode,
  onAdd,
  onRemove,
  onChange,
  animationName,
  ranges,
  framerate,
  loop,
}: ParticleAnimatedTypeConfigItemProps) => {
  return (
    <div className="relative space-y-3">
      {index !== undefined && (
        <Label className="text-xs">[Animation {index}]</Label>
      )}
      {index === undefined && (
        <Label className="text-xs">[New Animation]</Label>
      )}
      <div className="flex items-center gap-3">
        <Label className="text-xs">Name:</Label>
        <Select
          value={animationName}
          onValueChange={(value) =>
            onChange(value, ranges, framerate, loop, index)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {animationList.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-xs">Ranges:</Label>
        <Input
          type="text"
          className="flex-1 h-8 p-0.5 cursor-pointer"
          value={ranges}
          onChange={(e) =>
            onChange(animationName!, e.target.value, framerate, loop, index)
          }
        />
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-xs">Frame Rate:</Label>
        <Input
          type="text"
          className="flex-1 h-8 p-0.5 cursor-pointer"
          value={framerate}
          onChange={(e) =>
            onChange(animationName!, ranges, e.target.value, loop, index)
          }
        />
      </div>
      <div className="flex items-center gap-3">
        <Label className="text-xs">Loop:</Label>
        <Switch
          defaultChecked={loop}
          className="h-8 p-0.5 cursor-pointer"
          checked={loop}
          onCheckedChange={(checked) =>
            onChange(animationName!, ranges, framerate, checked, index)
          }
        />
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={mode === 'add' ? !animationName : false}
        onClick={() =>
          mode === 'add'
            ? onAdd?.(animationName!, ranges, framerate, loop)
            : onRemove?.(index!)
        }
        className={`absolute top-0 right-1 text-muted-foreground ${mode === 'add' ? 'hover:text-green-500' : 'hover:text-destructive'}`}
      >
        {mode === 'add' ? (
          <SquarePlus className="h-4 w-4" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

const ParticleAnimatedTypeControl = () => {
  const animationList = useTextureStore((state) => state.animationList)
  const particleType = useParticleConfigStore(
    useShallow((state) => state.configUI.particleType),
  )
  const setConfigUI = useParticleConfigStore(
    useShallow((state) => state.setConfigUI),
  )

  const [animationName, setAnimationName] = useState<string>()
  const [ranges, setRanges] = useState('')
  const [framerate, setFrameRate] = useState('matchLife')
  const [loop, setLoop] = useState(false)

  const onAdd = useCallback(
    (
      animationName: string,
      ranges: string,
      framerate: 'matchLife' | string,
      loop: boolean,
    ) => {
      setConfigUI((configUI) => {
        const data: AnimationParticleArtData = {
          animationName,
          ranges,
          framerate,
          loop,
        }
        const newArts = [
          ...configUI.particleType.art,
        ] as AnimationParticleArtData[]
        newArts.push(data)
        const newParticleType: ParticleTypeData = {
          type: 'animated',
          art: newArts,
        }
        return {
          ...configUI,
          particleType: newParticleType,
        }
      })
      setRanges('')
      setFrameRate('matchLife')
      setLoop(false)
    },
    [setConfigUI, setRanges, setFrameRate, setLoop],
  )

  const onRemove = useCallback(
    (index: number) => {
      setConfigUI((configUI) => {
        const newArts = [
          ...configUI.particleType.art,
        ] as AnimationParticleArtData[]
        newArts.splice(index, 1)
        const newParticleType: ParticleTypeData = {
          type: 'animated',
          art: newArts,
        }
        return {
          ...configUI,
          particleType: newParticleType,
        }
      })
    },
    [setConfigUI],
  )

  const onChange = useCallback(
    (
      animationName: string,
      ranges: string,
      framerate: 'matchLife' | string,
      loop: boolean,
      index?: number,
    ) => {
      if (index !== undefined) {
        setConfigUI((configUI) => {
          const data: AnimationParticleArtData = {
            animationName,
            ranges,
            framerate,
            loop,
          }
          const newArts = [
            ...configUI.particleType.art,
          ] as AnimationParticleArtData[]
          newArts[index] = data
          const newParticleType: ParticleTypeData = {
            type: 'animated',
            art: newArts,
          }
          return {
            ...configUI,
            particleType: newParticleType,
          }
        })
      } else {
        setAnimationName(animationName)
        setRanges(ranges)
        setFrameRate(framerate)
        setLoop(loop)
      }
    },
    [setConfigUI, setAnimationName, setRanges, setFrameRate, setLoop],
  )

  return (
    <>
      {particleType.art.map((data, index) => (
        <ParticleAnimatedTypeConfigItem
          key={index}
          index={index}
          animationList={animationList}
          mode="remove"
          onRemove={onRemove}
          onChange={onChange}
          animationName={(data as AnimationParticleArtData).animationName}
          ranges={(data as AnimationParticleArtData).ranges}
          framerate={(data as AnimationParticleArtData).framerate.toString()}
          loop={(data as AnimationParticleArtData).loop}
        />
      ))}
      <Separator />
      <ParticleAnimatedTypeConfigItem
        animationList={animationList}
        mode="add"
        onAdd={onAdd}
        onChange={onChange}
        animationName={animationName}
        ranges={ranges}
        framerate={framerate}
        loop={loop}
      />
    </>
  )
}

const ParticleTypeControl = () => {
  const particleTypeConfig = useParticleConfigStore(
    useShallow((state) => state.configUI.particleType),
  )
  const setConfigUI = useParticleConfigStore(
    useShallow((state) => state.setConfigUI),
  )
  const onTypeChange = useCallback(
    (value: string) => {
      setConfigUI((configUI) => {
        let particleTypeData: ParticleTypeData
        switch (value) {
          case 'animated':
            particleTypeData = {
              type: 'animated',
              art: [],
            }
            break
          case 'basic':
          default:
            particleTypeData = {
              type: 'basic',
              art: ['particle'],
              orderedArt: false,
            }
            break
        }
        return {
          ...configUI,
          particleType: particleTypeData,
        }
      })
    },
    [setConfigUI],
  )
  return (
    <>
      <div className="flex items-center gap-3">
        <Label className="text-xs">Type:</Label>
        <Select value={particleTypeConfig.type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {particleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      {particleTypeConfig.type === 'basic' ? (
        <ParticleBasicTypeControl />
      ) : (
        <ParticleAnimatedTypeControl />
      )}
    </>
  )
}

export default ParticleTypeControl
