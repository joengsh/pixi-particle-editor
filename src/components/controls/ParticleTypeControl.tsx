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
import type { ParticleTypeData } from '@/types/particleConfigUIData'
import { MultiSelect } from '../MultiSelect'
import useTextureStore from '@/stores/TextureStore'

const particleTypes = ['basic', 'animated']

const ParticleBasicTypeControl = () => {
  const textureData = useTextureStore(state=>state.textureData)
  const particleType = useParticleConfigStore(useShallow(state=>state.configUI.particleType))
  const setConfigUI = useParticleConfigStore(useShallow(state=>state.setConfigUI))
  const options = useMemo(()=>Object.keys(textureData).map(textureName => ({value: textureName, label: textureName})), [textureData])
  const [values, setValue] = useState<string[]>(particleType.art as string[])

  useEffect(()=>{
    setConfigUI({
      particleType: {
        type: 'basic',
        art: values,
        orderedArt: false
      }
    })
  }, [values])

  return (
    <>
      <MultiSelect
        defaultValue={values}
        options={options}
        value={values}
        onValueChange={setValue}
        placeholder="Choose textures..."
      />
    </>
  )
}

const ParticleAnimatedTypeControl = () => {
  return null
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
      let particleTypeData: ParticleTypeData
      switch (value) {
        case 'animated':
          particleTypeData = {
            type: 'animated',
            art: [
              {
                framerate: 10,
                textures: ['particle'],
                loop: true,
              },
            ],
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
      setConfigUI({
        particleType: particleTypeData,
      })
    },
    [setConfigUI],
  )
  return (
    <>
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
