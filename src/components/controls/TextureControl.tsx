import { ImagePlus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useTextureStore from '@/stores/TextureStore'
import { useShallow } from 'zustand/shallow'

export const TextureUpload = () => {
  const addTextures = useTextureStore(useShallow((state) => state.addTextures))

  const handleTextureUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files

      if (!files || files.length === 0) return

      const readers: Promise<{ textureName: string; textureUrl: string }>[] =
        Array.from(files).map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader()
              reader.onload = () => {
                const lastDotIndex = file.name.lastIndexOf('.')
                const textureName =
                  lastDotIndex <= 0
                    ? file.name
                    : file.name.substring(0, lastDotIndex)
                resolve({
                  textureName: textureName,
                  textureUrl: reader.result as string,
                })
              }
              reader.readAsDataURL(file)
            }),
        )

      Promise.all(readers).then((textures) => {
        addTextures(textures)
      })
    }
    input.click()
  }

  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs">Textures:</Label>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleTextureUpload}
        >
          <ImagePlus className="w-4 h-4" />
          Upload
        </Button>
      </div>
    </div>
  )
}
