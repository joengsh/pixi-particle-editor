/**
 * A single easing function.
 * Input: t in range [0, 1]
 * Output: eased value (usually [0, 1], may overshoot for elastic/back)
 */
export type EasingFunction = (t: number) => number

/**
 * Easing factory function.
 * Returns a new easing function instance.
 */
export type EasingFactory = (...args: number[]) => EasingFunction

export const Easing = {
  linear(): EasingFunction {
    return (t: number) => t
  },

  inQuad(): EasingFunction {
    return (t: number) => t * t
  },

  outQuad(): EasingFunction {
    return (t: number) => t * (2 - t)
  },

  inOutQuad(): EasingFunction {
    return (t: number) => {
      t *= 2
      if (t < 1) return 0.5 * t * t
      return -0.5 * (--t * (t - 2) - 1)
    }
  },

  inCubic(): EasingFunction {
    return (t: number) => t * t * t
  },

  outCubic(): EasingFunction {
    return (t: number) => --t * t * t + 1
  },

  inOutCubic(): EasingFunction {
    return (t: number) => {
      t *= 2
      if (t < 1) return 0.5 * t * t * t
      t -= 2
      return 0.5 * (t * t * t + 2)
    }
  },

  inQuart(): EasingFunction {
    return (t: number) => t * t * t * t
  },

  outQuart(): EasingFunction {
    return (t: number) => 1 - --t * t * t * t
  },

  inOutQuart(): EasingFunction {
    return (t: number) => {
      t *= 2
      if (t < 1) return 0.5 * t ** 4
      t -= 2
      return -0.5 * (t ** 4 - 2)
    }
  },

  inQuint(): EasingFunction {
    return (t: number) => t ** 5
  },

  outQuint(): EasingFunction {
    return (t: number) => (--t) ** 5 + 1
  },

  inOutQuint(): EasingFunction {
    return (t: number) => {
      t *= 2
      if (t < 1) return 0.5 * t ** 5
      t -= 2
      return 0.5 * (t ** 5 + 2)
    }
  },

  inSine(): EasingFunction {
    return (t: number) => 1 - Math.cos((t * Math.PI) / 2)
  },

  outSine(): EasingFunction {
    return (t: number) => Math.sin((t * Math.PI) / 2)
  },

  inOutSine(): EasingFunction {
    return (t: number) => 0.5 * (1 - Math.cos(Math.PI * t))
  },

  inExpo(): EasingFunction {
    return (t: number) => (t === 0 ? 0 : Math.pow(1024, t - 1))
  },

  outExpo(): EasingFunction {
    return (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
  },

  inOutExpo(): EasingFunction {
    return (t: number) => {
      if (t === 0) return 0
      if (t === 1) return 1

      t *= 2
      if (t < 1) return 0.5 * Math.pow(1024, t - 1)
      return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2)
    }
  },

  inCirc(): EasingFunction {
    return (t: number) => 1 - Math.sqrt(1 - t * t)
  },

  outCirc(): EasingFunction {
    return (t: number) => Math.sqrt(1 - --t * t)
  },

  inOutCirc(): EasingFunction {
    return (t: number) => {
      t *= 2
      if (t < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
      return 0.5 * (Math.sqrt(1 - (t - 2) * (t - 2)) + 1)
    }
  },

  inElastic(a = 0.1, p = 0.4): EasingFunction {
    return (t: number) => {
      if (t === 0) return 0
      if (t === 1) return 1

      let s: number
      if (!a || a < 1) {
        a = 1
        s = p / 4
      } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI)
      }

      return -(
        a *
        Math.pow(2, 10 * (t - 1)) *
        Math.sin(((t - 1 - s) * 2 * Math.PI) / p)
      )
    }
  },

  outElastic(a = 0.1, p = 0.4): EasingFunction {
    return (t: number) => {
      if (t === 0) return 0
      if (t === 1) return 1

      let s: number
      if (!a || a < 1) {
        a = 1
        s = p / 4
      } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI)
      }

      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t - s) * 2 * Math.PI) / p) + 1
      )
    }
  },

  inOutElastic(a = 0.1, p = 0.4): EasingFunction {
    return (t: number) => {
      if (t === 0) return 0
      if (t === 1) return 1

      let s: number
      if (!a || a < 1) {
        a = 1
        s = p / 4
      } else {
        s = (p * Math.asin(1 / a)) / (2 * Math.PI)
      }

      t *= 2
      if (t < 1) {
        return (
          -0.5 *
          a *
          Math.pow(2, 10 * (t - 1)) *
          Math.sin(((t - 1 - s) * 2 * Math.PI) / p)
        )
      }

      return (
        a *
          Math.pow(2, -10 * (t - 1)) *
          Math.sin(((t - 1 - s) * 2 * Math.PI) / p) *
          0.5 +
        1
      )
    }
  },

  inBack(v = 1.70158): EasingFunction {
    return (t: number) => {
      const s = v
      return t * t * ((s + 1) * t - s)
    }
  },

  outBack(v = 1.70158): EasingFunction {
    return (t: number) => {
      const s = v
      return --t * t * ((s + 1) * t + s) + 1
    }
  },

  inOutBack(v = 1.70158): EasingFunction {
    return (t: number) => {
      const s = v * 1.525
      t *= 2
      if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s))
      return 0.5 * ((t - 2) * (t - 2) * ((s + 1) * (t - 2) + s) + 2)
    }
  },

  inBounce(): EasingFunction {
    return (t: number) => 1 - Easing.outBounce()(1 - t)
  },

  outBounce(): EasingFunction {
    return (t: number) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t
      } else if (t < 2 / 2.75) {
        t -= 1.5 / 2.75
        return 7.5625 * t * t + 0.75
      } else if (t < 2.5 / 2.75) {
        t -= 2.25 / 2.75
        return 7.5625 * t * t + 0.9375
      }
      t -= 2.625 / 2.75
      return 7.5625 * t * t + 0.984375
    }
  },

  inOutBounce(): EasingFunction {
    return (t: number) => {
      if (t < 0.5) {
        return Easing.inBounce()(t * 2) * 0.5
      }
      return Easing.outBounce()(t * 2 - 1) * 0.5 + 0.5
    }
  },
} as const
