import useParticleConfigStore from '@/stores/ParticleConfigStore'
import { useShallow } from 'zustand/shallow'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'

export const FrequencyControl = () => {
  const [frequency, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.frequency, state.setConfigUI]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Frequency:</Label>
      <Input
        type="number"
        step={0.001}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={frequency}
        min={0}
        onChange={(e) =>
          setConfigUI({
            frequency: parseFloat(e.target.value),
          })
        }
      />
    </div>
  )
}

export const MaxParticlesControl = () => {
  const [maxParticles, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.maxParticles, state.setConfigUI]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Max Particle:</Label>
      <Input
        type="number"
        step={1}
        className="flex-1 h-8 p-0.5 cursor-pointer"
        value={maxParticles}
        min={0}
        onChange={(e) =>
          setConfigUI({
            maxParticles: parseInt(e.target.value, 10),
          })
        }
      />
    </div>
  )
}

export const AddAtBackControl = () => {
  const [addAtBack, setConfigUI] = useParticleConfigStore(
    useShallow((state) => [state.configUI.addAtBack, state.setConfigUI]),
  )
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Add at back:</Label>
      <Switch
        defaultChecked={addAtBack}
        className="h-8 p-0.5 cursor-pointer"
        checked={addAtBack}
        onCheckedChange={(checked) =>
          setConfigUI({
            addAtBack: checked,
          })
        }
      />
    </div>
  )
}
