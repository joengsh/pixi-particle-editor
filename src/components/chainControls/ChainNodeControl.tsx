'use client'

import * as React from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { MinMaxValue } from '@/types/particle/particleConfig'
import type {
  ParticleEmitterChainNodeData,
} from '@/pixiComponents/ParticleEmitterChain'
import { createDefaultNode } from '@/lib/chain-config'
import useChainProjectStore from '@/stores/ChainProjectStore'
import { useShallow } from 'zustand/shallow'
import useProjectStore from '@/stores/ProjectStore'
import { useCallback, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

// ============================================================================
// MinMaxControl - Edits a MinMaxValue
// ============================================================================
interface MinMaxControlProps {
  label: string
  value: MinMaxValue
  onChange: (value: MinMaxValue) => void
  minBound?: number
  maxBound?: number
  step?: number
}

function MinMaxControl({
  label,
  value,
  onChange,
  minBound = 0,
  maxBound = 100,
  step = 0.1,
}: MinMaxControlProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground">
            Min
          </span>
          <Input
            type="number"
            value={value.min}
            min={minBound}
            max={value.max}
            step={step}
            onChange={(e) =>
              onChange({ ...value, min: parseFloat(e.target.value) || 0 })
            }
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-muted-foreground">
            Max
          </span>
          <Input
            type="number"
            value={value.max}
            min={value.min}
            max={maxBound}
            step={step}
            onChange={(e) =>
              onChange({ ...value, max: parseFloat(e.target.value) || 0 })
            }
            className="h-8 text-xs"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// NumberControl - Edits a single number value
// ============================================================================
interface NumberControlProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function NumberControl({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
}: NumberControlProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="h-8 text-xs"
      />
    </div>
  )
}

// ============================================================================
// CollapsibleSection - Wrapper for collapsible sections
// ============================================================================
interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: number
  className?: string
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  badge,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          {isOpen ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          <span className="flex-1 text-left">{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
              {badge}
            </span>
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

// ============================================================================
// ParticleVariantsControl - Edits particleVariants
// ============================================================================
interface ParticleVariantsControlProps {
  value: NonNullable<ParticleEmitterChainNodeData['particleVariants']>
  onChange: (
    value: NonNullable<ParticleEmitterChainNodeData['particleVariants']>,
  ) => void
}

function ParticleVariantsControl({
  value,
  onChange,
}: ParticleVariantsControlProps) {
  return (
    <CollapsibleSection title="Particle Variants" defaultOpen>
      <div className="space-y-3 pl-4">
        <MinMaxControl
          label="Scale"
          value={value.scale}
          onChange={(scale) => onChange({ ...value, scale })}
          minBound={0}
          maxBound={10}
          step={0.1}
        />
        <MinMaxControl
          label="Hue"
          value={value.hue}
          onChange={(hue) => onChange({ ...value, hue })}
          minBound={0}
          maxBound={360}
          step={1}
        />
        <MinMaxControl
          label="Saturation"
          value={value.saturation}
          onChange={(saturation) => onChange({ ...value, saturation })}
          minBound={0}
          maxBound={100}
          step={1}
        />
        <MinMaxControl
          label="Lightness"
          value={value.lightness}
          onChange={(lightness) => onChange({ ...value, lightness })}
          minBound={0}
          maxBound={100}
          step={1}
        />
      </div>
    </CollapsibleSection>
  )
}

// ============================================================================
// EmitterVariantsControl - Edits emitterVariants
// ============================================================================
interface EmitterVariantsControlProps {
  value: NonNullable<ParticleEmitterChainNodeData['emitterVariants']>
  onChange: (
    value: NonNullable<ParticleEmitterChainNodeData['emitterVariants']>,
  ) => void
}

function EmitterVariantsControl({
  value,
  onChange,
}: EmitterVariantsControlProps) {
  return (
    <CollapsibleSection title="Emitter Variants" defaultOpen>
      <div className="space-y-3 pl-4">
        <NumberControl
          label="Max Frequency Multiplier"
          value={value.maxFrequencyMultiplier}
          onChange={(maxFrequencyMultiplier) =>
            onChange({ ...value, maxFrequencyMultiplier })
          }
        />
        <NumberControl
          label="Min Particles Per Wave Multiplier"
          value={value.minParticlesPerWaveMultiplier}
          onChange={(minParticlesPerWaveMultiplier) =>
            onChange({ ...value, minParticlesPerWaveMultiplier })
          }
        />
        <NumberControl
          label="Min Spawn Chance Multiplier"
          value={value.minSpawnChanceMultiplier}
          onChange={(minSpawnChanceMultiplier) =>
            onChange({ ...value, minSpawnChanceMultiplier })
          }
        />
        <NumberControl
          label="Min Lifetime Multiplier"
          value={value.minLifetimeMultiplier}
          onChange={(minLifetimeMultiplier) =>
            onChange({ ...value, minLifetimeMultiplier })
          }
        />
      </div>
    </CollapsibleSection>
  )
}

// ============================================================================
// NodeArraySection - Recursive section for node arrays
// ============================================================================
interface NodeArraySectionProps {
  title: string
  nodes: ParticleEmitterChainNodeData[]
  onChange: (nodes: ParticleEmitterChainNodeData[]) => void
  depth: number
  isTrail?: boolean
}

function NodeArraySection({
  title,
  nodes,
  onChange,
  depth,
  isTrail,
}: NodeArraySectionProps) {
  const addNode = useCallback(() => {
    onChange([...nodes, createDefaultNode()])
  }, [nodes, onChange])

  const updateNode = useCallback(
    (index: number, node: ParticleEmitterChainNodeData) => {
      const newNodes = [...nodes]
      newNodes[index] = node
      onChange(newNodes)
    },
    [nodes, onChange],
  )

  const removeNode = useCallback(
    (index: number) => {
      onChange(nodes.filter((_, i) => i !== index))
    },
    [nodes, onChange],
  )

  return (
    <CollapsibleSection title={title} badge={nodes.length}>
      <div className="space-y-2 pl-4">
        {nodes.map((node, index) => (
          <NodeControl
            key={node.id}
            node={node}
            onChange={(updatedNode) => updateNode(index, updatedNode)}
            onRemove={() => removeNode(index)}
            depth={depth + 1}
            index={index}
            isTrail={isTrail}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNode}
          className="w-full"
        >
          <Plus className="mr-2 size-4" />
          Add Node
        </Button>
      </div>
    </CollapsibleSection>
  )
}

// ============================================================================
// NodeControl - Recursive control for a single node
// ============================================================================
interface NodeControlProps {
  node: ParticleEmitterChainNodeData
  onChange: (node: ParticleEmitterChainNodeData) => void
  onRemove?: () => void
  depth: number
  index: number
  isTrail?: boolean
}

const depthColors = [
  'border-l-blue-500',
  'border-l-green-500',
  'border-l-amber-500',
  'border-l-purple-500',
  'border-l-pink-500',
]

function NodeControl({
  node,
  onChange,
  onRemove,
  depth,
  index,
  isTrail,
}: NodeControlProps) {
  const [isOpen, setIsOpen] = React.useState(depth === 0)
  const projects = useProjectStore(useShallow((state) => state.projects))

  const particleIds = useMemo(
    () => Object.values(projects).map((project) => project.name),
    [projects],
  )
  const finiteParticleIds = useMemo(
    () =>
      Object.values(projects)
        .filter((project) => project.configUI.emitterLifetime > 0)
        .map((project) => project.name),
    [projects],
  )

  const particleSelections = useMemo(
    () => (depth === 0 || isTrail ? particleIds : finiteParticleIds),
    [depth, isTrail, particleIds, finiteParticleIds],
  )

  const borderColor = useMemo(
    () => depthColors[depth % depthColors.length],
    [depth],
  )

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn('rounded-md border border-l-4 bg-card', borderColor)}>
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50">
            <button
              type="button"
              className="text-sm font-medium transition-colors hover:bg-muted/50"
            >
              {isOpen ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>

            <span className="flex-1 text-left">Node {index + 1}</span>
            {onRemove && (
              <span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                  }}
                >
                  <Trash2 className="size-3" />
                  <span className="sr-only">Remove node</span>
                </Button>
              </span>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 px-3 pb-3">
            {/* Particle ID */}
            <div className="flex items-center gap-3">
              <Label className="text-xs">Particle ID:</Label>
              <Select
                value={node.id}
                onValueChange={(value) => onChange({ ...node, id: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a particle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {particleSelections.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Particle Variants */}
            {node.hasParticleVariants && node.particleVariants && (
              <ParticleVariantsControl
                value={node.particleVariants}
                onChange={(particleVariants) =>
                  onChange({ ...node, particleVariants })
                }
              />
            )}

            {/* Emitter Variants */}
            {node.hasEmitterVariants && node.emitterVariants && (
              <EmitterVariantsControl
                value={node.emitterVariants}
                onChange={(emitterVariants) =>
                  onChange({ ...node, emitterVariants })
                }
              />
            )}

            {/* Recursive Node Arrays */}
            <NodeArraySection
              title="On Particle Removed"
              nodes={node.onParticleRemoved ?? []}
              onChange={(onParticleRemoved) =>
                onChange({ ...node, onParticleRemoved })
              }
              depth={depth}
            />

            <NodeArraySection
              title="On Particle Added"
              nodes={node.onParticleAdded ?? []}
              onChange={(onParticleAdded) =>
                onChange({ ...node, onParticleAdded })
              }
              depth={depth}
            />

            <NodeArraySection
              title="Trail"
              nodes={node.trail ?? []}
              onChange={(trail) => onChange({ ...node, trail })}
              depth={depth}
              isTrail={true}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ============================================================================
// ParticleEmitterControl - Main control component
// ============================================================================
interface ParticleEmitterControlProps {
  className?: string
}

export function ParticleEmitterControl({
  className,
}: ParticleEmitterControlProps) {
  const [nodes, updateCurrentProjectConfig] = useChainProjectStore(
    useShallow((state) => [
      state.projects[state.currentProject].nodes,
      state.updateCurrentProjectConfig,
    ]),
  )

  const addRootNode = useCallback(() => {
    updateCurrentProjectConfig((nodes) => [...nodes, createDefaultNode()])
  }, [updateCurrentProjectConfig])

  const updateNode = useCallback(
    (index: number, node: ParticleEmitterChainNodeData) => {
      updateCurrentProjectConfig((nodes) => {
        const newNodes = [...nodes]
        newNodes[index] = node
        return newNodes
      })
    },
    [updateCurrentProjectConfig],
  )

  const removeNode = useCallback(
    (index: number) => {
      updateCurrentProjectConfig((nodes) => [
        ...nodes.filter((_, i) => i !== index),
      ])
    },
    [updateCurrentProjectConfig],
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Particle Emitter Chain</h2>
        <span className="text-sm text-muted-foreground">
          {nodes.length} root node{nodes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {nodes.length === 0 ? (
          <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No root nodes yet. Add one to get started.
            </p>
          </div>
        ) : (
          nodes.map((node, index) => (
            <NodeControl
              key={index}
              node={node}
              onChange={(updatedNode) => updateNode(index, updatedNode)}
              onRemove={() => removeNode(index)}
              depth={0}
              index={index}
            />
          ))
        )}
      </div>

      <Button type="button" variant="outline" onClick={addRootNode}>
        <Plus className="mr-2 size-4" />
        Add Root Node
      </Button>
    </div>
  )
}
