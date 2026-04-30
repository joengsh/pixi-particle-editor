/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
/**
 * Constructor type for pooled objects
 */
type PoolConstructor<T> = new (...args: any[]) => T

/**
 * Optional destroyable interface
 */
interface Destroyable {
  destroy?: (...args: any[]) => void
}

/**
 * ObjectPool settings
 */
interface ObjectPoolSettings {
  amount?: number
  args?: any[]
  destroyArgs?: any[]
  strict?: boolean
}

/**
 * Generic Object Pool
 */
class ObjectPool<T extends Destroyable> {
  private _ctor: PoolConstructor<T>
  private _settings: Required<ObjectPoolSettings>
  private _objects: T[] = []
  private _preAllocated = 0

  constructor(ctor: PoolConstructor<T>, settings: ObjectPoolSettings = {}) {
    this._ctor = ctor
    this._settings = {
      amount: settings.amount ?? 1,
      args: settings.args ?? [],
      destroyArgs: settings.destroyArgs ?? [],
      strict: settings.strict ?? false,
    }

    this.generate(this._settings.amount)
  }

  /**
   * Destroys the pool and its contents
   */
  destroy(): void {
    this.empty(true)
  }

  /**
   * Allocate an object from the pool
   */
  allocate(): T {
    if (!this._objects.length && this._settings.strict) {
      console.error(
        'Client_Core.ObjectPool - Trying to allocate another object when the pool has run out',
      )
    }

    return this._objects.length ? (this._objects.pop() as T) : this._createObj()
  }

  /**
   * Return an object back to the pool
   */
  free(obj: T, destroy = true): void {
    if (destroy && typeof obj.destroy === 'function') {
      obj.destroy!.apply(obj, this._settings.destroyArgs)
    }
    this._objects.unshift(obj)
  }

  /**
   * Empty the pool
   */
  empty(destroy = true): void {
    for (const obj of this._objects) {
      if (destroy && typeof obj.destroy === 'function') {
        obj.destroy!()
      }
    }
    this._objects.length = 0
  }

  /**
   * Add objects to the pool
   */
  generate(amount: number): void {
    for (let i = 0; i < amount; i++) {
      this._objects.push(this._createObj())
    }
    this._preAllocated += amount
  }

  /**
   * Current pool size
   */
  get length(): number {
    return this._objects.length
  }

  /**
   * Create a new pooled object
   */
  private _createObj(): T {
    const { args } = this._settings

    if (!args.length) {
      return new this._ctor()
    }

    try {
      return new this._ctor(...args)
    } catch {
      return this._newObjHack()
    }
  }

  /**
   * Safari fallback constructor hack
   */
  private _newObjHack(): T {
    let ev = "Function('obj',"
    let fn = '"return new obj('

    for (let i = 0; i < this._settings.args.length; i++) {
      ev += `'a${i}',`
      fn += `a${i}`
      if (i !== this._settings.args.length - 1) {
        fn += ','
      }
    }

    fn += ')"'
    ev += fn + ')'

    return (eval(ev) as Function).apply(this, [
      this._ctor,
      ...this._settings.args,
    ]) as T
  }
}

export default ObjectPool
