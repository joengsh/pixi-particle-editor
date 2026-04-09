/* eslint-disable @typescript-eslint/no-explicit-any */

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

export { showOpenFilePicker, showSaveFilePicker }
