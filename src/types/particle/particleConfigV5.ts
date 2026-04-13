import z from 'zod'

const Vector2Schema = z.object({
  x: z.number(),
  y: z.number(),
})

const NumberKeyframeSchema = z.object({
  value: z.number(),
  time: z.number(),
})

const StringKeyframeSchema = z.object({
  value: z.string(),
  time: z.number(),
})

export const MoveAccelerationSchema = z.object({
  type: z.literal('moveAcceleration'),
  config: z.object({
    accel: Vector2Schema,
    minStart: z.number(),
    maxStart: z.number(),
    rotate: z.boolean(),
  }),
})

export const AlphaSchema = z.object({
  type: z.literal('alpha'),
  config: z.object({
    alpha: z.object({
      list: z.array(NumberKeyframeSchema).min(2),
    }),
  }),
})

export const BlendModeSchema = z.object({
  type: z.literal('blendMode'),
  config: z.object({
    blendMode: z.string(),
  }),
})

export const ColorSchema = z.object({
  type: z.literal('color'),
  config: z.object({
    color: z.object({
      list: z.array(StringKeyframeSchema).min(2),
    }),
  }),
})

export const NoRotationSchema = z.object({
  type: z.literal('noRotation'),
  config: z.object({
    rotation: z.number(),
  }),
})

export const RotationSchema = z.object({
  type: z.literal('rotation'),
  config: z.object({
    minStart: z.number(),
    maxStart: z.number(),
    minSpeed: z.number(),
    maxSpeed: z.number(),
    accel: z.number(),
  }),
})

export const ScaleSchema = z.object({
  type: z.literal('scale'),
  config: z.object({
    scale: z.object({
      list: z.array(NumberKeyframeSchema).min(2),
      isStepped: z.boolean(),
    }),
    minMult: z.number(),
  }),
})

export const MoveSpeedSchema = z.object({
  type: z.literal('moveSpeed'),
  config: z.object({
    scale: z.object({
      speed: z.array(NumberKeyframeSchema).min(2),
    }),
    minMult: z.number(),
  }),
})

export const AlphaStaticSchema = z.object({
  type: z.literal('alphaStatic'),
  config: z.object({
    alpha: z.number(),
  }),
})

export const ColorStaticSchema = z.object({
  type: z.literal('colorStatic'),
  config: z.object({
    color: z.string(),
  }),
})

export const RotationStaticSchema = z.object({
  type: z.literal('rotationStatic'),
  config: z.object({
    min: z.number(),
    max: z.number(),
  }),
})

export const ScaleStaticSchema = z.object({
  type: z.literal('scaleStatic'),
  config: z.object({
    min: z.number(),
    max: z.number(),
  }),
})

export const MoveSpeedStaticSchema = z.object({
  type: z.literal('moveSpeedStatic'),
  config: z.object({
    min: z.number(),
    max: z.number(),
  }),
})

// schema for v5.x particle emitter
import {
  AnimatedRandomSchema,
  AnimatedSingleSchema,
  TextureOrderedSchema,
  TextureRandomSchema,
} from './particleTextureConfigV5'

export const ParticleConfigSchema = z.object({
  lifetime: z.object({
    min: z.number,
    max: z.number,
  }),
  frequency: z.number(),
  emitterLifetime: z.number(),
  addAtBack: z.boolean(),
  maxParticles: z.number(),
  particlesPerWave: z.number().optional(),
  pos: z.object({
    x: z.number(),
    y: z.number(),
  }),
  behaviours: z.array(
    z.discriminatedUnion('type', [
      TextureRandomSchema,
      TextureOrderedSchema,
      AnimatedRandomSchema,
      AnimatedSingleSchema,
      MoveAccelerationSchema,
      AlphaSchema,
      BlendModeSchema,
      ColorSchema,
      NoRotationSchema,
      RotationSchema,
      ScaleSchema,
      MoveSpeedSchema,
      AlphaStaticSchema,
      ColorStaticSchema,
      RotationStaticSchema,
      ScaleStaticSchema,
      MoveSpeedStaticSchema,
    ]),
  ),
})

export type ParticleConfig = z.infer<typeof ParticleConfigSchema>
