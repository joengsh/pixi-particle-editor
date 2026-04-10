import z from 'zod'
import { AnimatedArtDataSchema, BasicPointSchema, RandNumberSchema, ValueListSchema } from './particle/particleConfig'

/**================ Particle Types ================*/ 

const BasicParticleTypeSchema = z.object({
  type: z.literal("basic"),
  art: z.array(z.string()),
  orderedArt: z.boolean(),
})

const AnimatedParticleTypeSchema = z.object({
  type: z.literal("animated"),
  art: z.array(AnimatedArtDataSchema)
})

const PathParticleTypeSchema = BasicParticleTypeSchema.extend({
  path: z.string()
})

/**================ Emitter Types ================*/
const RectEmitterTypeSchema = z.object({
  type: z.literal("rect"),
  spawnRect: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  })
})

const CircleEmitterTypeSchema = z.object({
  type: z.literal("circle"),
  spawnCircle: z.object({
    x: z.number(),
    y: z.number(),
    r: z.number(),
  })
})

const RingEmitterTypeSchema = z.object({
  type: z.literal("ring"),
  spawnCircle: z.object({
    x: z.number(),
    y: z.number(),
    r: z.number(),
    minR: z.number(),
  })
})

const BurstEmitterTypeSchema = z.object({
  type: z.literal("burst"),
  particleSpacing: z.number(),
  particlesPerWave: z.number(),
  angleStart: z.number(),
})

const PointEmitterTypeSchema = z.object({
  type: z.literal("point")
})

const PolygonalChainEmitterTypeSchema = z.object({
  type: z.literal("polygonalChain"),
  spawnPolygon: z.array(z.array(BasicPointSchema))
})

export const ParticleConfigUISchema = z.object({
  particleType: z.union([BasicParticleTypeSchema, AnimatedParticleTypeSchema, PathParticleTypeSchema]),
  emitterType: z.union([PointEmitterTypeSchema, RectEmitterTypeSchema, CircleEmitterTypeSchema, RingEmitterTypeSchema, BurstEmitterTypeSchema, PolygonalChainEmitterTypeSchema]),
  alpha: ValueListSchema(z.number()),
  speed: ValueListSchema(z.number()),
  minimumSpeedMultiplier: z.number(),
  maxSpeed: z.number(),
  acceleration: BasicPointSchema,
  scale: ValueListSchema(z.number()),
  minimumScaleMultiplier: z.number(),
  color: ValueListSchema(z.string()),
  startRotation: RandNumberSchema,
  noRotation: z.boolean().optional(),
  rotationSpeed: RandNumberSchema,
  rotationAcceleration: z.number(),
  lifetime: RandNumberSchema,
  blendMode: z.string(),
  extraData: z.any().optional(),
  frequency: z.number(),
  spawnChance: z.number(),
  emitterLifetime: z.number(),
  maxParticles: z.number(),
  addAtBack: z.boolean(),
  pos: BasicPointSchema,
  emit: z.boolean(),
})

export type ParticleConfigUI = z.infer<typeof ParticleConfigUISchema>