/**
// single or multiple random texture
{
  "type": "textureRandom",
  "config": {
    "textures": [
      "images/smokeparticle.png",
      "images/particle.png"
    ]
  }
}

// ordered texture
{
  "type": "textureOrdered",
  "config": {
    "textures": [
      "weaponPod",
      "leftWing",
      "rightEngine",
      "hullFront",
      "weaponPod",
      "rightWing",
      "hullRear",
      "leftEngine"
    ]
  }
}

// multiple random animation
{
  "type": "animatedRandom",
  "config": {
    "anims": [
      {
        "framerate": 20,
        "loop": true,
        "textures": [
          "gold_1.png",
          "gold_2.png",
          "gold_3.png",
          "gold_4.png",
          "gold_5.png",
          "gold_6.png"
        ]
      },
      {
        "framerate": 20,
        "loop": true,
        "textures": [
          "gold_6.png",
          "gold_5.png",
          "gold_4.png",
          "gold_3.png",
          "gold_2.png",
          "gold_1.png"
        ]
      }
    ]
  }
}

// animated single
{
  "type": "animatedSingle",
  "config": {
    "anim": {
      "framerate": -1,
      "textures": [
        {
          "texture": "Bubbles99.png",
          "count": 40
        },
        {
          "texture": "Pop1.png",
          "count": 1
        },
        {
          "texture": "Pop2.png",
          "count": 1
        },
        {
          "texture": "Pop3.png",
          "count": 1
        }
      ]
    }
  }
}
 */
import z from 'zod'

const TextureArray = z.array(z.string()).min(1)

const AnimationTextureArray = z
  .array(
    z.union([
      z.string(),
      z.object({
        texture: z.string(),
        count: z.number(),
      }),
    ]),
  )
  .min(1)

const AnimationBase = z.object({
  framerate: z.number(),
  loop: z.boolean().optional(), // optional because animatedSingle doesn't use it
})

/* ---------- textureRandom ---------- */

export const TextureRandomSchema = z.object({
  type: z.literal('textureRandom'),
  config: z.object({
    textures: TextureArray,
  }),
})

/* ---------- textureOrdered ---------- */

export const TextureOrderedSchema = z.object({
  type: z.literal('textureOrdered'),
  config: z.object({
    textures: TextureArray,
  }),
})

/* ---------- animatedRandom ---------- */

const AnimSchema = AnimationBase.extend({
  textures: AnimationTextureArray,
})

export const AnimatedRandomSchema = z.object({
  type: z.literal('animatedRandom'),
  config: z.object({
    anims: z.array(AnimSchema).min(1),
  }),
})

/* ---------- animatedSingle ---------- */

export const AnimatedSingleSchema = z.object({
  type: z.literal('animatedSingle'),
  config: z.object({
    anim: AnimSchema,
  }),
})
