import useTextureStore from '@/stores/TextureStore'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

type TextureListItemProps = {
  textureName: string
  textureUrl: string
  onRemove: (textureName: string) => void
}

const TextureListItem = ({
  textureName,
  textureUrl,
  onRemove,
}: TextureListItemProps) => {
  return (
    <li className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <img
              src={textureUrl}
              alt={textureName}
              className="h-full w-full object-cover"
            />
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-64 p-2">
          <div className="space-y-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <img
                src={textureUrl}
                alt={textureName}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-center">{textureName}</p>
          </div>
        </HoverCardContent>
      </HoverCard>

      <span className="flex-1 truncate font-medium">{textureName}</span>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onRemove?.(textureName)}
        aria-label={`Delete ${textureName}`}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}

const TextureList = () => {
  const { textureData, removeTexture } = useTextureStore()
  return (
    <div className="w-full space-y-2">
      {Object.keys(textureData).length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No textures available
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border bg-card">
          {Object.entries(textureData).map(([textureName, textureUrl]) => (
            <TextureListItem
              key={textureName}
              textureName={textureName}
              textureUrl={textureUrl}
              onRemove={removeTexture}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
export default TextureList
