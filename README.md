# Pixi Particle Editor

A browser-based particle effect editor built with vite, Pixi.js, and TypeScript. Create, preview, and export particle configurations in real-time.

## Features

- **Real-time Preview**: See particle effects update instantly as you adjust parameters
- **Comprehensive Controls**: Fine-tune lifetime, spawn rate, alpha, scale, speed, color, rotation, and more
- **Multiple Spawn Shapes**: Point, rectangle, circle, ring, burst, and polygonalChain spawn types
- **Multiple Particle Type Support**: Support Basic and animated particle
- **Blend Modes**: Normal, Add, Multiply, and Screen blending
- **JSON Import/Export**: Save and load particle configurations as JSON files

## Tech Stack

- **Framework**: Vite + TS
- **Rendering**: Pixi.js v6 with pixi-particles@4.3.0
- **State Management**: Zustand
- **Validation**: Zod
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui

## Getting Started

```bash
# Install dependencies
npm install

# Run project
npm run dev

```

## Supported Configs

- [x] textures upload
- [x] canvas resolution setting
- [x] canvas background colour setting
- [x] canvas background texture
- [x] add particle emitter settings
  - [x] BurstSpawn
  - [x] PointSpawn
  - [x] RectSpawn
  - [x] CircleSpawn
  - [x] RingSpawn
  - [x] PolygonalChainSpawn
  - [x] min max Lifetime
  - [x] max Particles
  - [x] emitterLifetime
  - [x] particlesPerWave
  - [x] spawnChance
  - [x] addAtBack
  - [x] frequency
- [*] add basic particle settings
  - [x] Acceleration
  - [x] Alpha
  - [x] BlendMode
  - [x] Color
  - [x] NoRotation
  - [x] RotationSpeed
  - [x] RotationAcceleration
  - [x] startRotation
  - [x] Scale
  - [x] Speed
  - [x] minimumSpeedMultiplier
  - [x] minimumScaleMultiplier
  - [] customEase
- [*] add particle texture settings
  - [] OrderedTexture
  - [x] range index count
  - [x] RandomTexture
  - [x] RandomAnimatedTexture
  - [x] SingleTexture
  - [x] SingleAnimatedTexture
- [] add path particle settings
  - [] Path
