/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StageConfigStore } from '@/stores/StageConfigStore'
import {
  ProjectStageDataSchema,
  type ProjectStageData,
} from '@/types/projectStageData'
import type JSZip from 'jszip'
import type { ProjectData } from '@/stores/ProjectStore'
import { convertParticleConfigToConfigUI } from './particle-config'
import type { ChainProjectData } from '@/stores/ChainProjectStore'
import { mapPoolsData } from './chain-config'

// Polyfill for showOpenFilePicker
async function showOpenFilePicker(options: any): Promise<File[]> {
  // If native API exists (Chromium browsers), use it
  if ((window as any).showOpenFilePicker) {
    const handles: FileSystemFileHandle[] = await (
      window as any
    ).showOpenFilePicker(options)
    const files: File[] = await Promise.all(
      handles.map((handle) => handle.getFile()),
    )
    return files
  }

  // Fallback for Firefox/Safari using <input type="file">
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'

    // Map options to <input> attributes
    if (options.multiple) input.multiple = true
    if (options.types && options.types.length > 0) {
      input.accept = options.types
        .map((type: any) =>
          type.accept ? Object.values(type.accept).flat().join(',') : '',
        )
        .join(',')
    }

    input.style.display = 'none'
    document.body.appendChild(input)

    input.addEventListener('change', () => {
      resolve(Array.from(input.files as FileList))
      document.body.removeChild(input)
    })

    input.click()
  })
}

// Polyfill for showSaveFilePicker
async function showSaveFilePicker(options: any) {
  // If native API exists (Chromium browsers), use it
  if ((window as any).showSaveFilePicker) {
    return await (window as any).showSaveFilePicker(options)
  }

  // Fallback for Firefox/Safari
  let fileName = options.suggestedName || 'export.zip'

  // Try to infer extension from options.types
  if (options.types && options.types.length > 0) {
    const accept = options.types[0].accept
    if (accept) {
      const exts = Object.values(accept).flat()
      if (exts.length > 0 && !fileName.endsWith(exts[0])) {
        fileName += exts[0]
      }
    }
  }

  // Return a mock file handle
  return {
    async createWritable() {
      let blob: Blob
      return {
        async write(data: Blob | string) {
          blob =
            typeof data === 'string'
              ? new Blob([data], { type: 'application/octet-stream' })
              : data
        },
        async close() {
          if (!blob) return

          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')

          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()

          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        },
      }
    },
  }
}

function addStageConfigToZip(zip: JSZip, stageConfigStore: StageConfigStore) {
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
  const json = JSON.stringify(projectStageData, null, 2)
  zip.file('project.json', json)
}

async function addTexturesToZip(
  zip: JSZip,
  textureData: Record<string, string>,
  filterList: string[] = [],
) {
  let textureNames = filterList
  if (filterList.length === 0) {
    textureNames = Object.keys(textureData)
  }
  for (const fileName of textureNames) {
    const response = await fetch(textureData[fileName])
    const blob = await response.blob()

    zip.file(`${fileName}.png`, blob)
  }
}

async function addParticleProjectToZip(zip: JSZip, project: ProjectData) {
  const outputFolder = zip.folder('outputs')
  const configFolder = zip.folder('configs')

  if (!outputFolder || !configFolder) {
    throw new Error('Cannot create folder in zip')
  }

  const particleData = {
    emitterConfig: project.emitterConfig,
    textureConfig: project.textureConfig,
    extraConfig: {
      containerPos: project.configUI.containerPos,
      fixSpawnPos: project.configUI.fixSpawnPos,
    },
  }
  const particleJson = JSON.stringify(particleData, null, 2)
  outputFolder.file(`${project.name}.json`, particleJson)

  const configJson = JSON.stringify(project.configUI, null, 2)
  configFolder.file(`${project.name}.json`, configJson)
}

async function addChainProjectToZip(
  zip: JSZip,
  project: ChainProjectData,
  particleProjects: Record<string, ProjectData>,
) {
  const outputFolder = zip.folder('chains')

  if (!outputFolder) {
    throw new Error('Cannot create folder in zip')
  }

  const chainData = {
    pools: project.pools.reduce((result, particleDataId) => {
      result[particleDataId] = {
        particleDataId,
        count: 1,
      }
      return result
    }, {} as any),
    nodes: project.nodes,
    extraConfig: {
      containerPos: project.containerPos,
      fixSpawnPos: project.fixSpawnPos,
    },
  }
  const chainJson = JSON.stringify(chainData, null, 2)
  outputFolder.file(`${project.name}.json`, chainJson)
}

async function loadTextureData(zip: JSZip): Promise<
  {
    textureName: string
    textureUrl: string
  }[]
> {
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
        lastDotIndex <= 0 ? entry.name : entry.name.substring(0, lastDotIndex)
      textureMap.push({
        textureName,
        textureUrl: blobUrl,
      })
    }),
  )

  return textureMap
}

async function loadProjects(
  zip: JSZip,
): Promise<Pick<ProjectData, 'name' | 'configUI'>[]> {
  const configFolderPath = 'configs/'
  const outputFolderPath = 'outputs/'

  const projects: Pick<ProjectData, 'name' | 'configUI'>[] = []

  for (const filePath of Object.keys(zip.files).filter((path) =>
    path.includes(outputFolderPath),
  )) {
    const lastSlashIndex = filePath.lastIndexOf('/')
    const filename =
      lastSlashIndex <= 0 ? filePath : filePath.substring(lastSlashIndex + 1)
    const lastDotIndex = filename.lastIndexOf('.')
    const particleName =
      lastDotIndex <= 0 ? filename : filename.substring(0, lastDotIndex)
    if (filename !== '') {
      if (zip.files[`${configFolderPath}${filename}`]) {
        const configJsonText =
          await zip.files[`${configFolderPath}${filename}`].async('string')
        const configData = JSON.parse(configJsonText)
        configData.containerPos = configData.containerPos ?? { x: 0, y: 0 }
        configData.fixSpawnPos = configData.fixSpawnPos ?? false
        projects.push({
          name: particleName,
          configUI: configData,
        })
      } else {
        const particleJsonText =
          await zip.files[`${outputFolderPath}${filename}`].async('string')
        const particleData = JSON.parse(particleJsonText)
        const configData = convertParticleConfigToConfigUI(
          particleData.emitterConfig,
          particleData.textureConfig,
          particleData.extraConfig,
        )
        projects.push({
          name: particleName,
          configUI: configData,
        })
      }
    }
  }

  return projects
}

async function loadChainProjects(
  zip: JSZip,
): Promise<
  Pick<ChainProjectData, 'name' | 'nodes' | 'containerPos' | 'fixSpawnPos'>[]
> {
  const outputFolderPath = 'chains/'

  const projects: Pick<
    ChainProjectData,
    'name' | 'nodes' | 'containerPos' | 'fixSpawnPos'
  >[] = []

  for (const filePath of Object.keys(zip.files).filter((path) =>
    path.includes(outputFolderPath),
  )) {
    const lastSlashIndex = filePath.lastIndexOf('/')
    const filename =
      lastSlashIndex <= 0 ? filePath : filePath.substring(lastSlashIndex + 1)
    const lastDotIndex = filename.lastIndexOf('.')
    const chainName =
      lastDotIndex <= 0 ? filename : filename.substring(0, lastDotIndex)
    if (filename !== '') {
      const chainJsonText =
        await zip.files[`${outputFolderPath}${filename}`].async('string')
      const chainData = JSON.parse(chainJsonText)

      projects.push({
        name: chainName,
        nodes: chainData.nodes,
        containerPos: chainData.extraConfig?.containerPos ?? { x: 0, y: 0 },
        fixSpawnPos: chainData.extraConfig?.fixSpawnPos ?? false,
      })
    }
  }

  return projects
}

export {
  showOpenFilePicker,
  showSaveFilePicker,
  addTexturesToZip,
  addStageConfigToZip,
  addParticleProjectToZip,
  addChainProjectToZip,
  loadChainProjects,
  loadTextureData,
  loadProjects,
}
