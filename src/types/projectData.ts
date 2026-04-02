import z from 'zod'

export const ProjectDataSchema = z.object({
  backgroundColor: z.string(),
  backgroundScale: z.number(),
  backgroundTextureUrl: z.string().nullable(),
  resolution: z.tuple([z.number(), z.number()]),
})

export type ProjectData = z.infer<typeof ProjectDataSchema>
