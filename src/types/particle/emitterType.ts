export const emitterTypes = [
  'point',
  'rect',
  'circle',
  'ring',
  'burst',
  'polygonalChain',
] as const

export type EmitterType = (typeof emitterTypes)[number]
