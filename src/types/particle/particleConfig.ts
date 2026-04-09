import z from 'zod'
import {
  AnimatedRandomSchema,
  AnimatedSingleSchema,
  TextureOrderedSchema,
  TextureRandomSchema,
} from './particleTextureConfig'
import {
  AlphaSchema,
  AlphaStaticSchema,
  BlendModeSchema,
  ColorSchema,
  ColorStaticSchema,
  MoveAccelerationSchema,
  MoveSpeedSchema,
  MoveSpeedStaticSchema,
  NoRotationSchema,
  RotationSchema,
  RotationStaticSchema,
  ScaleSchema,
  ScaleStaticSchema,
} from './particleGeneralConfig'

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
