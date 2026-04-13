import z from 'zod'

export const BasicPointSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const RandNumberSchema = z.object({
  max: z.number(),
  min: z.number(),
})

export const ValueStepSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema,
    time: z.number(),
  })

export const ValueListSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    list: z.array(ValueStepSchema(valueSchema)),
    isStepped: z.boolean().default(false),
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
      minR: z.number().optional(),
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
      minR: z.number().optional(),
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

export const AnimatedArtConfigSchema = z.object({
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

const BasicParticleArtConfigSchema = z.array(z.string())
const AnimatedParticleArtConfigSchema = z.array(AnimatedArtConfigSchema)

export const ParticleArtConfigSchema = z.union([
  BasicParticleArtConfigSchema,
  AnimatedParticleArtConfigSchema,
])

export type AnimatedArtConfig = z.infer<typeof AnimatedArtConfigSchema>
export type ParticleArtConfig = z.infer<typeof ParticleArtConfigSchema>
