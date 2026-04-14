import { Button } from '@/components/ui/button'
import useFileManager from '@/hooks/useFileManager'
import { Upload, Save } from 'lucide-react'

export const SaveButton = () => {
  const { saveProject } = useFileManager()
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={saveProject}
      className="gap-1.5"
    >
      <Save className="w-3.5 h-3.5" />
      Save
    </Button>
  )
}

export const LoadButton = () => {
  const { loadProject } = useFileManager()
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={loadProject}
      className="gap-1.5"
    >
      <Upload className="w-3.5 h-3.5" />
      Load
    </Button>
  )
}
