/* eslint-disable @typescript-eslint/no-explicit-any */
import JSZip from 'jszip'
import useStageConfigStore from '@/stores/StageConfigStore'
import { useCallback } from 'react'
import {
  ProjectStageDataSchema,
  type ProjectStageData,
} from '@/types/projectStageData'
import {
  addParticleProjectToZip,
  addChainProjectToZip,
  addStageConfigToZip,
  addTexturesToZip,
  loadProjects,
  loadTextureData,
  showOpenFilePicker,
  showSaveFilePicker,
  loadChainProjects,
} from '@/lib/file'
import useTextureStore from '@/stores/TextureStore'
import { useShallow } from 'zustand/shallow'
import useParticleConfigStore from '@/stores/ParticleConfigStore'
import useProjectStore from '@/stores/ProjectStore'
import { getTextureListFromTextureConfigArtData } from '@/lib/particle-config'
import type { AnimatedArtConfig } from '@/types/particle/particleConfig'
import useChainProjectStore from '@/stores/ChainProjectStore'

const useFileManager = () => {
  const stageConfigStore = useStageConfigStore()
  const {
    setBackgroundColor,
    setBackgroundScale,
    setBackgroundTextureUrl,
    setResolution,
    setTickerSpeed,
  } = stageConfigStore
  const textureData = useTextureStore(useShallow((state) => state.textureData))
  const addTextures = useTextureStore(useShallow((state) => state.addTextures))
  const [configUI, emitterConfig, textureConfig] = useParticleConfigStore(
    useShallow((state) => [
      state.configUI,
      state.emitterConfig,
      state.textureConfig,
    ]),
  )
  const setConfigUI = useParticleConfigStore(
    useShallow((state) => state.setConfigUI),
  )
  const removeAllTexture = useTextureStore(
    useShallow((state) => state.removeAllTexture),
  )
  const [projects, currentProject, addProjects] = useProjectStore(
    useShallow((state) => [
      state.projects,
      state.projects[state.currentProject],
      state.addProjects,
    ]),
  )

  const [chainProjects, addChainProjects] = useChainProjectStore(
    useShallow((state) => [state.projects, state.addProjects]),
  )

  const saveProject = useCallback(async () => {
    const {
      backgroundColor,
      backgroundScale,
      backgroundTextureUrl,
      resolution,
      tickerSpeed,
    } = stageConfigStore
    const data: ProjectStageData = {
      backgroundColor,
      backgroundScale,
      backgroundTextureUrl,
      resolution,
      tickerSpeed,
    }
    const projectStageData = ProjectStageDataSchema.parse(data)
    const particleData = {
      emitterConfig,
      textureConfig,
    }
    try {
      const zip = new JSZip()

      for (const [fileName, blobUrl] of Object.entries(textureData)) {
        const response = await fetch(blobUrl)
        const blob = await response.blob()

        zip.file(`${fileName}.png`, blob)
      }

      const json = JSON.stringify(projectStageData, null, 2)
      zip.file('project.json', json)

      const particleJson = JSON.stringify(particleData, null, 2)
      zip.file('particle.json', particleJson)

      const configJson = JSON.stringify(configUI, null, 2)
      zip.file('config.json', configJson)

      const zipBlob = await zip.generateAsync({ type: 'blob' })

      const fileHandle = await showSaveFilePicker({
        suggestedName: 'export.zip',
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(zipBlob)
      await writable.close()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled save dialog.')
      } else {
        console.error('Error saving project:', err)
      }
    }
  }, [stageConfigStore, textureData, configUI, emitterConfig, textureConfig])

  const loadProject = useCallback(async () => {
    try {
      const files = await showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const file = files[0]
      const zip = await JSZip.loadAsync(file)
      const textureMap: {
        textureName: string
        textureUrl: string
      }[] = []

      const entries = Object.values(zip.files).filter(
        (f) => !f.dir && !f.name.endsWith('.json'),
      )

      await Promise.all(
        entries.map(async (entry) => {
          const blob = await entry.async('blob')
          const blobUrl = URL.createObjectURL(blob)
          const lastDotIndex = entry.name.lastIndexOf('.')
          const textureName =
            lastDotIndex <= 0
              ? entry.name
              : entry.name.substring(0, lastDotIndex)
          textureMap.push({
            textureName,
            textureUrl: blobUrl,
          })
        }),
      )

      removeAllTexture()
      addTextures(textureMap)

      const jsonText = await zip.files['project.json'].async('string')
      const data = JSON.parse(jsonText)
      const projectStageData = ProjectStageDataSchema.parse(data)

      // set stage config
      setBackgroundColor(projectStageData.backgroundColor)
      setBackgroundScale(projectStageData.backgroundScale)
      if (projectStageData.backgroundTextureUrl) {
        setBackgroundTextureUrl(projectStageData.backgroundTextureUrl)
      } else {
        setBackgroundTextureUrl(null)
      }
      setResolution(projectStageData.resolution)
      setTickerSpeed(projectStageData.tickerSpeed)

      const configJsonText = await zip.files['config.json'].async('string')
      const configData = JSON.parse(configJsonText)
      setConfigUI(() => configData)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled open dialog.')
        return null
      }
      console.error('Error loading project:', err)
      return null
    }
  }, [
    setBackgroundScale,
    setBackgroundColor,
    setBackgroundTextureUrl,
    setResolution,
    setTickerSpeed,
    addTextures,
    removeAllTexture,
    setConfigUI,
  ])

  // save everything, all particle system project, all chains, all textures, stage config
  const saveWorkspace = useCallback(async () => {
    try {
      const zip = new JSZip()

      addStageConfigToZip(zip, stageConfigStore)
      for (const project of Object.values(projects)) {
        addParticleProjectToZip(zip, project)

        const textureConfig = project.textureConfig

        if (textureConfig.length > 0) {
          if (typeof textureConfig[0] === 'string') {
            await addTexturesToZip(zip, textureData, textureConfig as string[])
          } else {
            for (const data of textureConfig) {
              const textures = getTextureListFromTextureConfigArtData(
                (data as AnimatedArtConfig).textures,
              )
              await addTexturesToZip(zip, textureData, textures as string[])
            }
          }
        }
      }

      for (const project of Object.values(chainProjects)) {
        await addChainProjectToZip(zip, project, projects)
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })

      const fileHandle = await showSaveFilePicker({
        suggestedName: 'workspace.zip',
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(zipBlob)
      await writable.close()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled save dialog.')
      } else {
        console.error('Error saving workspace:', err)
      }
    }
  }, [projects, chainProjects, stageConfigStore, textureData])

  // load everything, all particle system project, all chains, all textures, stage config
  const loadWorkspace = useCallback(async () => {
    try {
      const files = await showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const file = files[0]
      const zip = await JSZip.loadAsync(file)

      const jsonText = await zip.files['project.json'].async('string')
      const data = JSON.parse(jsonText)
      const projectStageData = ProjectStageDataSchema.parse(data)

      // set stage config
      setBackgroundColor(projectStageData.backgroundColor)
      setBackgroundScale(projectStageData.backgroundScale)
      if (projectStageData.backgroundTextureUrl) {
        setBackgroundTextureUrl(projectStageData.backgroundTextureUrl)
      } else {
        setBackgroundTextureUrl(null)
      }
      setResolution(projectStageData.resolution)
      setTickerSpeed(projectStageData.tickerSpeed)

      // load textures
      const textureMap = await loadTextureData(zip)
      addTextures(textureMap)

      // add the project
      const projects = await loadProjects(zip)
      addProjects(projects, true)

      const chainProjects = await loadChainProjects(zip)
      addChainProjects(chainProjects, true)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled open dialog.')
        return null
      }
      console.error('Error loading project:', err)
      return null
    }
  }, [
    addTextures,
    addProjects,
    addChainProjects,
    setBackgroundScale,
    setBackgroundColor,
    setBackgroundTextureUrl,
    setResolution,
    setTickerSpeed,
  ])

  // export only the current particle system project
  const exportCurrentProject = useCallback(async () => {
    try {
      const zip = new JSZip()

      addStageConfigToZip(zip, stageConfigStore)
      addParticleProjectToZip(zip, currentProject)
      const textureConfig = currentProject.textureConfig

      if (textureConfig.length > 0) {
        if (typeof textureConfig[0] === 'string') {
          await addTexturesToZip(zip, textureData, textureConfig as string[])
        } else {
          for (const data of textureConfig) {
            const textures = getTextureListFromTextureConfigArtData(
              (data as AnimatedArtConfig).textures,
            )
            await addTexturesToZip(zip, textureData, textures as string[])
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })

      const fileHandle = await showSaveFilePicker({
        suggestedName: `${currentProject.name}.zip`,
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(zipBlob)
      await writable.close()
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled save dialog.')
      } else {
        console.error('Error saving project:', err)
      }
    }
  }, [currentProject, stageConfigStore, textureData])

  // import particle system project into workspace
  const importProject = useCallback(async () => {
    try {
      const files = await showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: 'ZIP archive',
            accept: { 'application/zip': ['.zip'] },
          },
        ],
      })

      const file = files[0]
      const zip = await JSZip.loadAsync(file)

      // load textures
      const textureMap = await loadTextureData(zip)
      addTextures(textureMap)

      // add the project
      const projects = await loadProjects(zip)
      addProjects(projects, false)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User cancelled open dialog.')
        return null
      }
      console.error('Error loading project:', err)
      return null
    }
  }, [addTextures, addProjects])

  return {
    saveProject,
    loadProject,
    exportCurrentProject,
    importProject,
    loadWorkspace,
    saveWorkspace,
  }
}

export default useFileManager
