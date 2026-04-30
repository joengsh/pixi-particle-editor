import type {
  ParticleEmitterChainNodeData,
  ParticleEmitterChainSettings,
  ParticleEmitterPoolSettings,
} from '@/pixiComponents/ParticleEmitterChain'
import { configToEmitterConfig, DEFAULT_CONFIG } from './particle-config'
import type { ProjectData } from '@/stores/ProjectStore'

export const DEFAULT_CHAIN_CONFIG: Omit<
  ParticleEmitterChainSettings,
  'textureInstances'
> = {
  pools: {
    particle: {
      count: 1,
      emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
      textureConfig: ['particle'],
    },
  },
  nodes: [
    {
      id: 'particle',
      onParticleAdded: [],
      onParticleRemoved: [],
      trail: [],
    },
  ],
  emit: true,
}

function getPoolsFromNode(
  node: ParticleEmitterChainNodeData,
  poolSet: Set<string>,
) {
  if (!poolSet.has(node.id)) {
    poolSet.add(node.id)
  }
  if (node.onParticleAdded) {
    for (const childNode of node.onParticleAdded) {
      getPoolsFromNode(childNode, poolSet)
    }
  }
  if (node.onParticleRemoved) {
    for (const childNode of node.onParticleRemoved) {
      getPoolsFromNode(childNode, poolSet)
    }
  }
  if (node.trail) {
    for (const childNode of node.trail) {
      getPoolsFromNode(childNode, poolSet)
    }
  }
}

export function getPoolsFromNodes(
  nodes: ParticleEmitterChainNodeData[],
): string[] {
  const poolSet = new Set<string>()
  for (const node of nodes) {
    getPoolsFromNode(node, poolSet)
  }
  return Array.from(poolSet)
}

export function mapPoolsData(
  pools: string[],
  particleProjects: Record<string, ProjectData>,
): Record<string, Omit<ParticleEmitterPoolSettings, 'textureInstances'>> {
  return pools.reduce(
    (result, particleId) => {
      const particleProject = Object.values(particleProjects).filter(
        (project) => project.name === particleId,
      )[0]
      if (!particleProject) {
        throw new Error(
          `No corresponding particle project with name ${particleId} in the workspace`,
        )
      }
      result[particleId] = {
        count: 1,
        emitterConfig: particleProject.emitterConfig,
        textureConfig: particleProject.textureConfig,
      }
      return result
    },
    {} as Record<string, Omit<ParticleEmitterPoolSettings, 'textureInstances'>>,
  )
}
