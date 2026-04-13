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
import { useCallback } from 'react'
import { Separator } from '../ui/separator'
import type { ParticleTypeData } from '@/types/particleConfigUIData'

const particleTypes = ['basic', 'animated']

const ParticleBasicTypeControl = () => {
  return null
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
