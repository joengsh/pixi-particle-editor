/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StageConfigStore } from '@/stores/StageConfigStore'
import {
  ProjectStageDataSchema,
  type ProjectStageData,
} from '@/types/projectStageData'
import type JSZip from 'jszip'
import type { ProjectData } from '@/stores/ProjectStore'

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

export {
  showOpenFilePicker,
  showSaveFilePicker,
  addTexturesToZip,
  addStageConfigToZip,
  addParticleProjectToZip,
  loadTextureData,
}
