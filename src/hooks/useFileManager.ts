/* eslint-disable @typescript-eslint/no-explicit-any */
import JSZip from 'jszip'
import useStageConfigStore from '@/stores/StageConfigStore'
import { useCallback } from 'react'
import { ProjectDataSchema, type ProjectData } from '@/types/projectData'
import { showOpenFilePicker, showSaveFilePicker } from '@/lib/file'
import useTextureStore from '@/stores/TextureStore'
import { useShallow } from 'zustand/shallow'
import useParticleConfigStore from '@/stores/ParticleConfigStore'

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

  const saveProject = useCallback(async () => {
    const {
      backgroundColor,
      backgroundScale,
      backgroundTextureUrl,
      resolution,
      tickerSpeed,
    } = stageConfigStore
    const data: ProjectData = {
      backgroundColor,
      backgroundScale,
      backgroundTextureUrl,
      resolution,
      tickerSpeed,
    }
    const projectData = ProjectDataSchema.parse(data)
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

      const json = JSON.stringify(projectData, null, 2)
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
      const projectData = ProjectDataSchema.parse(data)

      // set stage config
      setBackgroundColor(projectData.backgroundColor)
      setBackgroundScale(projectData.backgroundScale)
      if (projectData.backgroundTextureUrl) {
        setBackgroundTextureUrl(projectData.backgroundTextureUrl)
      }
      setResolution(projectData.resolution)
      setTickerSpeed(projectData.tickerSpeed)

      const configJsonText = await zip.files['config.json'].async('string')
      const configData = JSON.parse(configJsonText)
      setConfigUI(configData)
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

  return {
    saveProject,
    loadProject,
  }
}

export default useFileManager
