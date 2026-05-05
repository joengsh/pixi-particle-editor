import type {
  ParticleEmitterChainNodeData,
  ParticleEmitterChainSettings,
  ParticleEmitterPoolSettings,
} from '@/pixiComponents/ParticleEmitterChain'
import type { ProjectData } from '@/stores/ProjectStore'

export const DEFAULT_CHAIN_CONFIG: Omit<
  ParticleEmitterChainSettings,
  'textureInstances'
> = {
  pools: {},
  nodes: [],
  emit: true,
}

export function createDefaultNode(): ParticleEmitterChainNodeData {
  return {
    hasParticleVariants: false,
    particleVariants: {
      scale: { min: 1, max: 1 },
      hue: { min: 0, max: 360 },
      saturation: { min: 80, max: 100 },
      lightness: { min: 50, max: 50 },
    },
    hasEmitterVariants: false,
    emitterVariants: {
      minLifetimeMultiplier: 1,
      maxFrequencyMultiplier: 1,
      minSpawnChanceMultiplier: 1,
      minParticlesPerWaveMultiplier: 1,
    },
    onParticleRemoved: [],
    onParticleAdded: [],
    trail: [],
  }
}

function getPoolsFromNode(
  node: ParticleEmitterChainNodeData,
  poolSet: Set<string>,
) {
  if (!node.id) return
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
        (project) => project.id === particleId,
      )[0]
      if (!particleProject) {
        throw new Error(
          `No corresponding particle project with id ${particleId} in the workspace`,
        )
      }
      result[particleProject.name] = {
        count: 1,
        emitterConfig: particleProject.emitterConfig,
        textureConfig: particleProject.textureConfig,
      }
      return result
    },
    {} as Record<string, Omit<ParticleEmitterPoolSettings, 'textureInstances'>>,
  )
}

function convertIdToName(
  node: ParticleEmitterChainNodeData,
  particleProjects: Record<string, ProjectData>,
) {
  if (!node.id) return
  const particleName = particleProjects[node.id].name
  node.id = particleName
  if (node.onParticleAdded) {
    for (const childNode of node.onParticleAdded) {
      convertIdToName(childNode, particleProjects)
    }
  }
  if (node.onParticleRemoved) {
    for (const childNode of node.onParticleRemoved) {
      convertIdToName(childNode, particleProjects)
    }
  }
  if (node.trail) {
    for (const childNode of node.trail) {
      convertIdToName(childNode, particleProjects)
    }
  }
}

// the id in node is a unique uuid generated for the particle and use in this app only, it should be convert to particle name when export
export function convertIdsToNames(
  nodes: ParticleEmitterChainNodeData[],
  particleProjects: Record<string, ProjectData>,
) {
  for (const node of nodes) {
    convertIdToName(node, particleProjects)
  }
}

function convertNameToId(
  node: ParticleEmitterChainNodeData,
  particleProjects: Record<string, ProjectData>,
) {
  if (!node.id) return
  const particleName = node.id
  const particleProject = Object.values(particleProjects).find(
    (project) => project.name === particleName,
  )
  if (!particleProject) {
    throw new Error(`Missing particle with name: ${particleName}`)
  }
  node.id = particleProject.id
  if (node.onParticleAdded) {
    for (const childNode of node.onParticleAdded) {
      convertNameToId(childNode, particleProjects)
    }
  }
  if (node.onParticleRemoved) {
    for (const childNode of node.onParticleRemoved) {
      convertNameToId(childNode, particleProjects)
    }
  }
  if (node.trail) {
    for (const childNode of node.trail) {
      convertNameToId(childNode, particleProjects)
    }
  }
}

// the imported chain node contain id as the particle names, they should be convert to the uuid of the particle
export function convertNamesToIds(
  nodes: ParticleEmitterChainNodeData[],
  particleProjects: Record<string, ProjectData>,
) {
  for (const node of nodes) {
    convertNameToId(node, particleProjects)
  }
}

function addDefaultVariant(node: ParticleEmitterChainNodeData) {
  if (!node.id) return
  if (!node.emitterVariants) {
    node.emitterVariants = {
      minLifetimeMultiplier: 1,
      maxFrequencyMultiplier: 1,
      minSpawnChanceMultiplier: 1,
      minParticlesPerWaveMultiplier: 1,
    }
  }
  if (!node.particleVariants) {
    node.particleVariants = {
      scale: { min: 1, max: 1 },
      hue: { min: 0, max: 360 },
      saturation: { min: 80, max: 100 },
      lightness: { min: 50, max: 50 },
    }
  }
  if (node.onParticleAdded) {
    for (const childNode of node.onParticleAdded) {
      addDefaultVariant(childNode)
    }
  }
  if (node.onParticleRemoved) {
    for (const childNode of node.onParticleRemoved) {
      addDefaultVariant(childNode)
    }
  }
  if (node.trail) {
    for (const childNode of node.trail) {
      addDefaultVariant(childNode)
    }
  }
}

export function addDefaultVariants(nodes: ParticleEmitterChainNodeData[]) {
  for (const node of nodes) {
    addDefaultVariant(node)
  }
}

function filterVariant(node: ParticleEmitterChainNodeData) {
  if (!node.id) return
  if (!node.hasEmitterVariants) {
    delete node.emitterVariants
  }
  if (!node.hasParticleVariants) {
    delete node.particleVariants
  }
  if (node.onParticleAdded) {
    for (const childNode of node.onParticleAdded) {
      filterVariant(childNode)
    }
  }
  if (node.onParticleRemoved) {
    for (const childNode of node.onParticleRemoved) {
      filterVariant(childNode)
    }
  }
  if (node.trail) {
    for (const childNode of node.trail) {
      filterVariant(childNode)
    }
  }
}

export function filterVariants(nodes: ParticleEmitterChainNodeData[]) {
  for (const node of nodes) {
    filterVariant(node)
  }
}
