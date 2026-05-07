import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Trash2,
  Plus,
  Sparkles,
  Pencil,
  Check,
  X,
  Menu,
  Save,
  FolderOpen,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import useFileManager from '@/hooks/useFileManager'
import useChainProjectStore, {
  type ChainProjectData,
} from '@/stores/ChainProjectStore'

export default function ChainProjectList() {
  const [
    projects,
    currentProject,
    addNewProject,
    selectProject,
    renameProject,
    removeProject,
  ] = useChainProjectStore(
    useShallow((state) => [
      state.projects,
      state.currentProject,
      state.addNewProject,
      state.selectProject,
      state.renameProject,
      state.removeProject,
    ]),
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const { loadWorkspace, saveWorkspace } = useFileManager()

  const projectArray = useMemo(() => Object.values(projects), [projects])

  const startEditing = useCallback(
    (project: ChainProjectData) => {
      setEditingId(project.id)
      setEditName(project.name)
    },
    [setEditName, setEditingId],
  )

  const saveEdit = useCallback(() => {
    if (editingId && editName.trim()) {
      renameProject(editingId, editName.trim())
    }
    setEditingId(null)
    setEditName('')
  }, [editingId, editName, setEditName, setEditingId, renameProject])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditName('')
  }, [setEditName, setEditingId])

  return (
    <div className="flex flex-col flex-1 bg-card border-r border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-secondary/30">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Projects
        </span>
        <span className="text-xs text-muted-foreground">
          {projectArray.length}
        </span>
      </div>

      {/* Project List */}
      <ScrollArea className="flex-1 overflow-hidden [&>div>div]:block!">
        <div className="p-2 space-y-1">
          {projectArray.map((project) => (
            <div
              key={project.id}
              className={`
                group relative flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors
                ${
                  currentProject === project.id
                    ? 'bg-primary/20 text-foreground'
                    : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                }
              `}
              onClick={() =>
                editingId !== project.id && selectProject(project.id)
              }
            >
              <div className="w-3 h-3 rounded-sm flex-shrink-0" />

              {/* Project name or edit input */}
              {editingId === project.id ? (
                <div
                  className="flex items-center gap-1 flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-6 text-xs px-1.5 py-0"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-5 h-5"
                    onClick={saveEdit}
                  >
                    <Check className="w-3 h-3 text-green-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-5 h-5"
                    onClick={cancelEdit}
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 opacity-50" />
                    <span className="text-xs font-medium truncate">
                      {project.name}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-5 h-5 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(project)
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-5 h-5 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeProject(project.id)
                      }}
                      disabled={projectArray.length <= 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Actions Menu */}
      <div className="p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              <Menu className="w-3.5 h-3.5" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={saveWorkspace} className="gap-2 text-xs">
              <Save className="w-3.5 h-3.5" />
              Save Workspace
            </DropdownMenuItem>
            <DropdownMenuItem onClick={loadWorkspace} className="gap-2 text-xs">
              <FolderOpen className="w-3.5 h-3.5" />
              Load Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={addNewProject} className="gap-2 text-xs">
              <Plus className="w-3.5 h-3.5" />
              Add Chain
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
