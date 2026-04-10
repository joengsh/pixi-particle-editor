import z from 'zod'

const BasicPointSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const RandNumberSchema = z.object({
  max: z.number(),
  min: z.number(),
})

const ValueStepSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema,
    time: z.number(),
  })

const ValueListSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    list: ValueStepSchema(valueSchema),
    isStepped: z.boolean(),
    ease: z
      .function({
        input: [z.number()],
        output: z.number(),
      })
      .optional(),
  })

export const EmitterConfigSchema = z.object({
  alpha: ValueListSchema(z.number()).optional(),
  speed: ValueListSchema(z.number()).optional(),
  minimumSpeedMultiplier: z.number().optional(),
  maxSpeed: z.number().optional(),
  acceleration: BasicPointSchema.optional(),
  scale: ValueListSchema(z.number()).optional(),
  minimumScaleMultiplier: z.number().optional(),
  color: ValueListSchema(z.string()).optional(),
  startRotation: RandNumberSchema.optional(),
  noRotation: z.boolean().optional(),
  rotationSpeed: RandNumberSchema.optional(),
  rotationAcceleration: z.number().optional(),
  lifetime: RandNumberSchema,
  blendMode: z.string().optional(),
  ease: z
    .function({
      input: [z.number()],
      output: z.number(),
    })
    .optional(),
  extraData: z.any().optional(),
  particlesPerWave: z.number().optional(),
  spawnType: z
    .enum(['rect', 'circle', 'ring', 'burst', 'point', 'polygonalChain'])
    .optional(),
  spawnRect: z
    .object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    })
    .optional(),
  spawnCircle: z
    .object({
      x: z.number(),
      y: z.number(),
      r: z.number(),
      minR: z.number(),
    })
    .optional(),
  particleSpacing: z.number().optional(),
  angleStart: z.number().optional(),
  spawnPolygon: z
    .union([z.array(BasicPointSchema), z.array(z.array(BasicPointSchema))])
    .optional(),
  frequency: z.number(),
  spawnChance: z.number().optional(),
  emitterLifetime: z.number().optional(),
  maxParticles: z.number().optional(),
  addAtBack: z.boolean().optional(),
  pos: BasicPointSchema,
  emit: z.boolean().optional(),
  autoUpdate: z.boolean().optional(),
  orderedArt: z.boolean().optional(),
})

export type EmitterConfig = z.infer<typeof EmitterConfigSchema>

const BasicTweenableSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    start: valueSchema,
    end: valueSchema,
  })

export const OldEmitterConfigSchema = z.object({
  alpha: BasicTweenableSchema(z.number()).optional(),
  speed: BasicTweenableSchema(z.number())
    .extend({
      minimumSpeedMultiplier: z.number().optional(),
    })
    .optional(),
  maxSpeed: z.number().optional(),
  acceleration: BasicPointSchema.optional(),
  scale: BasicTweenableSchema(z.number())
    .extend({
      minimumScaleMultiplier: z.number().optional(),
    })
    .optional(),
  color: BasicTweenableSchema(z.string()).optional(),
  startRotation: RandNumberSchema.optional(),
  noRotation: z.boolean().optional(),
  rotationSpeed: RandNumberSchema.optional(),
  rotationAcceleration: z.number().optional(),
  lifetime: RandNumberSchema,
  blendMode: z.string().optional(),
  ease: z
    .function({
      input: [z.number()],
      output: z.number(),
    })
    .optional(),
  extraData: z.any().optional(),
  particlesPerWave: z.number().optional(),
  spawnType: z
    .enum(['rect', 'circle', 'ring', 'burst', 'point', 'polygonalChain'])
    .optional(),
  spawnRect: z
    .object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    })
    .optional(),
  spawnCircle: z
    .object({
      x: z.number(),
      y: z.number(),
      r: z.number(),
      minR: z.number(),
    })
    .optional(),
  particleSpacing: z.number().optional(),
  angleStart: z.number().optional(),
  spawnPolygon: z
    .union([z.array(BasicPointSchema), z.array(z.array(BasicPointSchema))])
    .optional(),
  frequency: z.number(),
  spawnChance: z.number().optional(),
  emitterLifetime: z.number().optional(),
  maxParticles: z.number().optional(),
  addAtBack: z.boolean().optional(),
  pos: BasicPointSchema,
  emit: z.boolean().optional(),
  autoUpdate: z.boolean().optional(),
  orderedArt: z.boolean().optional(),
})

export type OldEmitterConfig = z.infer<typeof OldEmitterConfigSchema>

const AnimatedArtDataSchema = z.object({
  framerate: z.union([z.literal('matchLife'), z.number()]),
  loop: z.boolean().default(false),
  textures: z.union([
    z.array(z.string()),
    z.array(
      z.object({
        texture: z.string(),
        count: z.number(),
      }),
    ),
  ]),
})

const BasicParticleArtDataSchema = z.array(z.string())
const AnimatedParticleArtDataSchema = z.object({
  art: z.union([AnimatedArtDataSchema, z.array(AnimatedArtDataSchema)]),
})

export const ParticleArtDataSchema = z.union([
  BasicParticleArtDataSchema,
  AnimatedParticleArtDataSchema,
])

export type ParticleArtData = z.infer<typeof ParticleArtDataSchema>

// schema for v5.x particle emitter
// import {
//   AnimatedRandomSchema,
//   AnimatedSingleSchema,
//   TextureOrderedSchema,
//   TextureRandomSchema,
// } from './particleTextureConfig'
// import {
//   AlphaSchema,
//   AlphaStaticSchema,
//   BlendModeSchema,
//   ColorSchema,
//   ColorStaticSchema,
//   MoveAccelerationSchema,
//   MoveSpeedSchema,
//   MoveSpeedStaticSchema,
//   NoRotationSchema,
//   RotationSchema,
//   RotationStaticSchema,
//   ScaleSchema,
//   ScaleStaticSchema,
// } from './particleGeneralConfig'

// export const ParticleConfigSchema = z.object({
//   lifetime: z.object({
//     min: z.number,
//     max: z.number,
//   }),
//   frequency: z.number(),
//   emitterLifetime: z.number(),
//   addAtBack: z.boolean(),
//   maxParticles: z.number(),
//   particlesPerWave: z.number().optional(),
//   pos: z.object({
//     x: z.number(),
//     y: z.number(),
//   }),
//   behaviours: z.array(
//     z.discriminatedUnion('type', [
//       TextureRandomSchema,
//       TextureOrderedSchema,
//       AnimatedRandomSchema,
//       AnimatedSingleSchema,
//       MoveAccelerationSchema,
//       AlphaSchema,
//       BlendModeSchema,
//       ColorSchema,
//       NoRotationSchema,
//       RotationSchema,
//       ScaleSchema,
//       MoveSpeedSchema,
//       AlphaStaticSchema,
//       ColorStaticSchema,
//       RotationStaticSchema,
//       ScaleStaticSchema,
//       MoveSpeedStaticSchema,
//     ]),
//   ),
// })

// export type ParticleConfig = z.infer<typeof ParticleConfigSchema>
