import { create } from 'zustand'
import * as PIXI from 'pixi.js'
import { DEFAULT_PARTICLE_IMAGE_URL } from '@/lib/particle-config'

export type TextureStoreState = {
  textureData: Record<string, string>
  textureInstances: Record<string, PIXI.Texture>
  animationList: string[]
}

export type TextureStoreAction = {
  addTexture: (textureName: string, textureUrl: string) => void
  removeTexture: (textureName: string) => void
  addTextures: (textures: { textureName: string; textureUrl: string }[]) => void
  removeAllTexture: () => void
}

export type TextureStore = TextureStoreState & TextureStoreAction

// Create your store, which includes both state and (optionally) actions
const useTextureStore = create<TextureStore>((set) => ({
  textureData: {
    particle: DEFAULT_PARTICLE_IMAGE_URL,
  },
  textureInstances: {
    particle: PIXI.Texture.from(DEFAULT_PARTICLE_IMAGE_URL),
  },
  animationList: [],
  addTexture: (textureName, textureUrl) => {
    set((state) => {
      // check existance of the texture
      if (Object.keys(state.textureData).includes(textureName)) {
        const texture = state.textureInstances[textureName]
        if (texture) {
          texture.destroy(true)
        }
      }
      // create new texture instance
      const texture = PIXI.Texture.from(textureUrl)
      const newTextureData = { ...state.textureData }
      const newTextureInstances = { ...state.textureInstances }
      newTextureData[textureName] = textureUrl
      newTextureInstances[textureName] = texture

      // update animationList
      const textureNames = Object.keys(newTextureData)
      const regex = new RegExp(/(.+)(-|_)([0]*\d+)/)
      const temp = textureNames
        .filter((textureName) => textureName.match(regex) !== null)
        .map((textureName) => textureName.match(regex)?.[1] as string)
      const newAnimationList = [...new Set(temp)]
      return {
        textureData: newTextureData,
        textureInstances: newTextureInstances,
        animationList: newAnimationList,
      }
    })
  },
  removeTexture: (textureName) => {
    set((state) => {
      // check existance of the texture
      if (!Object.keys(state.textureData).includes(textureName)) {
        return state
      }
      // release texture
      const texture = state.textureInstances[textureName]
      if (texture) {
        texture.destroy(true)
      }

      const newTextureData = { ...state.textureData }
      delete newTextureData[textureName]
      const newTextureInstances = { ...state.textureInstances }
      delete newTextureInstances[textureName]

      // update animationList
      const textureNames = Object.keys(newTextureData)
      const regex = new RegExp(/(.+)(-|_)([0]*\d+)/)
      const temp = textureNames
        .filter((textureName) => textureName.match(regex) !== null)
        .map((textureName) => textureName.match(regex)?.[1] as string)
      const newAnimationList = [...new Set(temp)]

      return {
        textureData: newTextureData,
        textureInstances: newTextureInstances,
        animationList: newAnimationList,
      }
    })
  },
  addTextures: (textures) => {
    set((state) => {
      const newTextureData = { ...state.textureData }
      const newTextureInstances = { ...state.textureInstances }
      for (const textureData of textures) {
        const { textureName, textureUrl } = textureData
        // check existance of the texture
        if (Object.keys(state.textureData).includes(textureName)) {
          const texture = state.textureInstances[textureName]
          if (texture) {
            texture.destroy(true)
          }
        }
        // create new texture instance
        const texture = PIXI.Texture.from(textureUrl)
        newTextureData[textureName] = textureUrl
        newTextureInstances[textureName] = texture
      }

      // update animationList
      const textureNames = Object.keys(newTextureData)
      const regex = new RegExp(/(.+)(-|_)([0]*\d+)/)
      const temp = textureNames
        .filter((textureName) => textureName.match(regex) !== null)
        .map((textureName) => textureName.match(regex)?.[1] as string)
      const newAnimationList = [...new Set(temp)]

      return {
        textureData: newTextureData,
        textureInstances: newTextureInstances,
        animationList: newAnimationList,
      }
    })
  },
  removeAllTexture: () => {
    set((state) => {
      for (const textureName of Object.keys(state.textureInstances)) {
        // release texture
        const texture = state.textureInstances[textureName]
        if (texture) {
          texture.destroy(true)
        }
      }
      return {
        textureData: {},
        textureInstances: {},
        animationList: [],
      }
    })
  },
}))

export default useTextureStore
