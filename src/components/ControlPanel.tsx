import type { ParticleConfig } from '@/lib/particle-config'

type ControlPanelProps = {
  config: ParticleConfig
  onChange: (config: ParticleConfig) => void
  backgroundColor: string
  onBackgroundChange: (color: string) => void
}

const ControlPanel = ({
  config,
  onChange,
  backgroundColor,
  onBackgroundChange,
}: ControlPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-card">
    </div>
  )
}

export default ControlPanel
