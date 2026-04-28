import type { ParticleConfigUI } from '@/types/particleConfigUIData'
import { create } from 'zustand'
import type {
  EmitterConfig,
  ParticleArtConfig,
} from '@/types/particle/particleConfig'
import {
  configToArtConfig,
  configToEmitterConfig,
  DEFAULT_CONFIG,
} from '@/lib/particle-config'
import useTextureStore from './TextureStore'

export type ProjectData = {
  id: string
  name: string
  configUI: ParticleConfigUI
  emitterConfig: EmitterConfig
  textureConfig: ParticleArtConfig
}

export type ProjectStoreState = {
  projects: Record<string, ProjectData>
  currentProject: string
}

export type ProjectStoreAction = {
  renameProject: (id: string, newName: string) => void
  addProject: (project: Omit<ProjectData, 'id'> | undefined) => void
  removeProject: (id: string) => void
  updateProjectConfig: (
    id: string,
    fn: (configUI: ParticleConfigUI) => ParticleConfigUI,
  ) => void
  selectProject: (id: string) => void
}

export type ProjectStore = ProjectStoreState & ProjectStoreAction

// Create your store, which includes both state and (optionally) actions
const useProjectStore = create<ProjectStore>((set) => ({
  projects: {
    default: {
      id: 'default',
      name: 'particle',
      configUI: DEFAULT_CONFIG,
      emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
      textureConfig: configToArtConfig(
        DEFAULT_CONFIG,
        Object.keys(useTextureStore.getState().textureData),
      ),
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
  addProject: (project) => {
    set((state) => {
      let index = 0
      const projectNames = Object.values(state.projects).map(
        (project) => project.name,
      )
      while (
        projectNames.includes(
          `${project ? project.name : 'particle'}${index ? `_${index}` : ''}`,
        )
      ) {
        index++
      }
      const projectName = `particle${index ? `_${index}` : ''}`
      const uuid = crypto.randomUUID()
      const newProject = {
        id: uuid,
        name: projectName,
        configUI: DEFAULT_CONFIG,
        emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
        textureConfig: configToArtConfig(
          DEFAULT_CONFIG,
          Object.keys(useTextureStore.getState().textureData),
        ),
        ...project,
      }
      return {
        projects: {
          ...state.projects,
          [uuid]: newProject,
        },
      }
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
  updateProjectConfig: (id, fn) => {
    set((state) => {
      const newProjects = { ...state.projects }
      const project = newProjects[id]
      if (!project) {
        return state
      }
      const newConfigUI = fn(newProjects[id].configUI)
      const newEmitterConfig = configToEmitterConfig(newConfigUI)
      const newTextureConfig = configToArtConfig(
        newConfigUI,
        Object.keys(useTextureStore.getState().textureData),
      )
      const newProject = {
        ...project,
        configUI: newConfigUI,
        emitterConfig: newEmitterConfig,
        textureConfig: newTextureConfig,
      }
      newProjects[id] = newProject
      return {
        projects: newProjects,
      }
    })
  },
}))

export default useProjectStore
