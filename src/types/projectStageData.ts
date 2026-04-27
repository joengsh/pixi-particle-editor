import z from 'zod'

export const ProjectStageDataSchema = z.object({
  backgroundColor: z.string(),
  backgroundScale: z.number(),
  backgroundTextureUrl: z.string().nullable(),
  resolution: z.tuple([z.number(), z.number()]),
  tickerSpeed: z.number(),
  containerPos: z.tuple([z.number(), z.number()]).default([0, 0]),
  fixSpawnPos: z.boolean().default(false),
})

export type ProjectStageData = z.infer<typeof ProjectStageDataSchema>
