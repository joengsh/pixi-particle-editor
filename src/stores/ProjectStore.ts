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

type ProjectData = {
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
  renameProject: (project: ProjectData, newName: string) => void
  addProject: () => void
  removeProject: (projectName: string) => void
  updateProjectConfig: (
    name: string,
    fn: (configUI: ParticleConfigUI) => ParticleConfigUI,
  ) => void
}

export type ProjectStore = ProjectStoreState & ProjectStoreAction

// Create your store, which includes both state and (optionally) actions
const useProjectStore = create<ProjectStore>((set) => ({
  projects: {
    particle: {
      name: 'particle',
      configUI: DEFAULT_CONFIG,
      emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
      textureConfig: configToArtConfig(
        DEFAULT_CONFIG,
        Object.keys(useTextureStore.getState().textureData),
      ),
    },
  },
  currentProject: 'particle',
  renameProject: (project, newName) => {
    const oldName = project.name
    set((state) => {
      const newProjects = { ...state.projects }
      if (newProjects[oldName]) {
        delete newProjects[oldName]
      }
      newProjects[newName] = {
        ...project,
        name: newName,
      }
      return {
        projects: newProjects,
        currentProject:
          state.currentProject === oldName ? newName : state.currentProject,
      }
    })
  },
  addProject: () => {
    set((state) => {
      let index = 0
      while (state.projects[`particle${index ? `_${index}` : ''}`]) {
        index++
      }
      const projectName = `particle${index ? `_${index}` : ''}`
      return {
        projects: {
          ...state.projects,
          [projectName]: {
            name: projectName,
            configUI: DEFAULT_CONFIG,
            emitterConfig: configToEmitterConfig(DEFAULT_CONFIG),
            textureConfig: configToArtConfig(
              DEFAULT_CONFIG,
              Object.keys(useTextureStore.getState().textureData),
            ),
          },
        },
      }
    })
  },
  removeProject: (name) => {
    set((state) => {
      const newProjects = { ...state.projects }
      if (newProjects[name]) {
        delete newProjects[name]
      }
      return {
        projects: newProjects,
        currentProject:
          state.currentProject === name
            ? Object.keys(newProjects)[0]
            : state.currentProject,
      }
    })
  },
  updateProjectConfig: (name, fn) => {
    set((state) => {
      const newProjects = { ...state.projects }
      if (!newProjects[name]) {
        return state
      }
      const newConfigUI = fn(newProjects[name].configUI)
      const newEmitterConfig = configToEmitterConfig(newConfigUI)
      const newTextureConfig = configToArtConfig(
        newConfigUI,
        Object.keys(useTextureStore.getState().textureData),
      )
      const newProject = {
        name: name,
        configUI: newConfigUI,
        emitterConfig: newEmitterConfig,
        textureConfig: newTextureConfig,
      }
      newProjects[name] = newProject
      return {
        projects: newProjects,
      }
    })
  },
}))

export default useProjectStore
