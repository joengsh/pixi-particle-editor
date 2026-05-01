import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useShallow } from 'zustand/shallow'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import useChainProjectStore from '@/stores/ChainProjectStore'
import { Switch } from '../ui/switch'

export const ChainContainerPosControl = () => {
  const [containerPos, updateCurrentProjectContainerPos] = useChainProjectStore(
    useShallow((state) => [
      state.projects[state.currentProject].containerPos,
      state.updateCurrentProjectContainerPos,
    ]),
  )
  return (
    <div className="flex flex-col gap-3">
      <Tooltip>
        <TooltipTrigger>
          <Label className="text-xs">Container Position:</Label>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Particle container position. Won't be exported to game</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">X:</Label>
          <Input
            type="number"
            step={0.5}
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={containerPos.x}
            onChange={(e) =>
              updateCurrentProjectContainerPos({
                x: parseFloat(e.target.value),
                y: containerPos.y,
              })
            }
          />
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Label className="text-xs">Y:</Label>
          <Input
            type="number"
            step={0.5}
            className="flex-1 h-8 p-0.5 cursor-pointer"
            value={containerPos.y}
            onChange={(e) =>
              updateCurrentProjectContainerPos({
                y: parseFloat(e.target.value),
                x: containerPos.x,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

export const ChainFixSpawnPosControl = () => {
  const [fixSpawnPos, updateCurrentProjectFixSpawnPos] = useChainProjectStore(
    useShallow((state) => [
      state.projects[state.currentProject].fixSpawnPos,
      state.updateCurrentProjectFixSpawnPos,
    ]),
  )
  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger>
          <Label className="text-xs">Fix SpawnPos:</Label>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Particle won't follow mouse position when set to true</p>
        </TooltipContent>
      </Tooltip>
      <Switch
        defaultChecked={fixSpawnPos}
        className="h-8 p-0.5 cursor-pointer"
        checked={fixSpawnPos}
        onCheckedChange={updateCurrentProjectFixSpawnPos}
      />
    </div>
  )
}
