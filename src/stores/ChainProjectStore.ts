import { create } from 'zustand'
import type { ParticleEmitterChainNodeData } from '@/pixiComponents/ParticleEmitterChain'
import { DEFAULT_CHAIN_CONFIG, getPoolsFromNodes } from '@/lib/chain-config'
import type { BasicPoint } from 'pixi-particles'

export type ChainProjectData = {
  id: string
  name: string
  pools: string[]
  nodes: ParticleEmitterChainNodeData[]
  containerPos: BasicPoint
  fixSpawnPos: boolean
}

export type ChainProjectStoreState = {
  projects: Record<string, ChainProjectData>
  currentProject: string
}

export type ChainProjectStoreAction = {
  renameProject: (id: string, newName: string) => void
  addNewProject: () => void
  addProjects: (
    projects: Omit<ChainProjectData, 'id'>[],
    clearAll: boolean,
  ) => void
  removeProject: (id: string) => void
  updateCurrentProjectConfig: (
    fn: (
      nodes: ParticleEmitterChainNodeData[],
    ) => ParticleEmitterChainNodeData[],
  ) => void
  selectProject: (id: string) => void
  updateCurrentProjectContainerPos: (point: BasicPoint) => void
  updateCurrentProjectFixSpawnPos: (value: boolean) => void
}

export type ChainProjectStore = ChainProjectStoreState & ChainProjectStoreAction

const updateProjectConfig = (
  state: ChainProjectStore,
  id: string,
  fn: (nodes: ParticleEmitterChainNodeData[]) => ParticleEmitterChainNodeData[],
) => {
  const newProjects = { ...state.projects }
  const project = newProjects[id]
  if (!project) {
    return state
  }
  const newNodes = fn(newProjects[id].nodes)
  const newProject = {
    ...project,
    nodes: newNodes,
    pools: getPoolsFromNodes(newNodes),
  }
  newProjects[id] = newProject
  return {
    projects: newProjects,
  }
}

const addProjects = (
  state: ChainProjectStore,
  projects: Pick<
    ChainProjectData,
    'name' | 'nodes' | 'containerPos' | 'fixSpawnPos'
  >[],
  clearAll: boolean,
) => {
  const projectNames = clearAll
    ? []
    : Object.values(state.projects).map((project) => project.name)
  const newProjects: Record<string, ChainProjectData> = {}
  let lastId = ''
  for (const project of projects) {
    let index = 0
    while (
      projectNames.includes(
        `${project ? project.name : 'particle'}${index ? `_${index}` : ''}`,
      )
    ) {
      index++
    }
    const projectName = `${project ? project.name : 'particle'}${index ? `_${index}` : ''}`
    const uuid = crypto.randomUUID()
    const nodes = project ? project.nodes : DEFAULT_CHAIN_CONFIG.nodes
    const pools = getPoolsFromNodes(nodes)
    const newProject = {
      id: uuid,
      name: projectName,
      nodes,
      pools,
      containerPos: project.containerPos,
      fixSpawnPos: project.fixSpawnPos,
    }
    newProjects[uuid] = newProject
    lastId = uuid
  }
  return {
    projects: {
      ...(clearAll ? {} : state.projects),
      ...newProjects,
    },
    currentProject: lastId,
  }
}

// Create your store, which includes both state and (optionally) actions
const useChainProjectStore = create<ChainProjectStore>((set) => ({
  projects: {
    default: {
      id: 'default',
      name: 'chain',
      ...DEFAULT_CHAIN_CONFIG,
      pools: ['particle'],
      containerPos: { x: 0, y: 0 },
      fixSpawnPos: false,
    },
  },
  currentProject: 'default',
  renameProject: (id, newName) => {
    set((state) => {
      const newProjects = { ...state.projects }
      const project = newProjects[id]
      newProjects[id] = {
        ...project,
        name: newName,
      }
      return {
        projects: newProjects,
      }
    })
  },
  addNewProject: () => {
    set((state) => {
      const projects = [
        {
          name: 'chain',
          ...DEFAULT_CHAIN_CONFIG,
          containerPos: { x: 0, y: 0 },
          fixSpawnPos: false,
        },
      ]
      return addProjects(state, projects, false)
    })
  },
  addProjects: (projects, clearAll) => {
    set((state) => {
      return addProjects(state, projects, clearAll)
    })
  },
  removeProject: (id) => {
    set((state) => {
      const newProjects = { ...state.projects }
      if (newProjects[id]) {
        delete newProjects[id]
      }
      return {
        projects: newProjects,
        currentProject:
          state.currentProject === id
            ? Object.keys(newProjects)[0]
            : state.currentProject,
      }
    })
  },
  selectProject: (id) => {
    set((state) => {
      if (!state.projects[id]) {
        return state
      }
      return {
        currentProject: id,
      }
    })
  },
  updateCurrentProjectConfig: (fn) => {
    set((state) => updateProjectConfig(state, state.currentProject, fn))
  },
  updateCurrentProjectContainerPos: (point: BasicPoint) => {
    set((state) => {
      const newProjects = { ...state.projects }
      const project = newProjects[state.currentProject]
      newProjects[state.currentProject] = {
        ...project,
        containerPos: point,
      }
      return {
        projects: newProjects,
      }
    })
  },
  updateCurrentProjectFixSpawnPos: (value: boolean) => {
    set((state) => {
      const newProjects = { ...state.projects }
      const project = newProjects[state.currentProject]
      newProjects[state.currentProject] = {
        ...project,
        fixSpawnPos: value,
      }
      return {
        projects: newProjects,
      }
    })
  },
}))

export default useChainProjectStore
