import { Button } from '@/components/ui/button'
import useGeneralSettingStore from '@/stores/GeneralSettingStore'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import ParticleProjectList from './ParticleProjectList'
import ChainProjectList from './ChainProjectList'
import { X } from 'lucide-react'

export default function ProjectExplorer() {
  const { mode, setMode, setShowExplorer } = useGeneralSettingStore()

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30">
        <Tabs
          defaultValue={mode}
          value={mode}
          onValueChange={(value) => setMode(value as 'particle' | 'chain')}
        >
          <TabsList>
            <TabsTrigger value="particle">Particle</TabsTrigger>
            <TabsTrigger value="chain">Chain</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          size="icon"
          variant="ghost"
          className="w-5 h-5"
          onClick={() => setShowExplorer(false)}
        >
          <X className="w-3 h-3 text-destructive" />
        </Button>
      </div>
      {mode === 'particle' && <ParticleProjectList />}
      {mode === 'chain' && <ChainProjectList />}
    </div>
  )
}
