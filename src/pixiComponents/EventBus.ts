/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from 'eventemitter3'

/**
 * Event options definition
 */
export interface EventOptions {
  properties?: string[]
  validateProperties?: boolean
  log?: boolean
  templatePayload?: Record<string, unknown>
}

/**
 * EventBus constructor settings
 */
export interface EventBusSettings {
  events: Record<string, EventOptions>
  allowAdding?: boolean
}

/**
 * Payload object
 */
export type EventPayload = Record<string, unknown>

/**
 * EventBus
 */
class EventBus {
  private _parentName: string
  private _ee: EventEmitter
  private _allowAdding: boolean
  private _events: Record<string, EventOptions>
  private _allMessages: Record<string, EventOptions>
  private _emptyObject: Readonly<Record<string, never>>

  constructor(parentName: string, settings: EventBusSettings) {
    this._parentName = parentName

    this._ee = new EventEmitter()

    this._allowAdding = settings.allowAdding ?? false
    this._events = settings.events ?? {}
    this._allMessages = {}

    this._emptyObject = {}
    Object.freeze(this._emptyObject)

    this._setupEvents()
  }

  /**
   * Destroys the EventBus
   */
  destroy(): void {
    this._ee.removeAllListeners()
  }

  on(
    message: string,
    callback: (...args: any[]) => void,
    context?: unknown,
  ): void {
    // @if DEBUG=true
    this._checkMessageName(message)
    // @endif
    this._ee.on(message, callback, context)
  }

  once(
    message: string,
    callback: (...args: any[]) => void,
    context?: unknown,
  ): void {
    // @if DEBUG=true
    this._checkMessageName(message)
    // @endif
    this._ee.once(message, callback, context)
  }

  oncePromise(message: string): Promise<EventPayload> {
    // @if DEBUG=true
    this._checkMessageName(message)
    // @endif
    return new Promise((resolve) => this._ee.once(message, resolve))
  }

  off(
    message: string,
    callback: (...args: any[]) => void,
    context?: unknown,
  ): void {
    // @if DEBUG=true
    this._checkMessageName(message)
    // @endif

    if (!callback) {
      console.error("Client_Core.EventBus - 'off' called with no callback")
    }

    this._ee.off(message, callback, context)
  }

  emit(message: string, payload?: EventPayload): boolean {
    if (!payload) {
      payload = this._emptyObject
    }

    // @if DEBUG=true
    this._checkMessageName(message)
    this._checkPayload(message, payload)
    // @endif

    // @if BUILD_TYPE='developer'
    payload = Object.assign({}, payload)
    Object.freeze(payload)
    // @endif

    return this._ee.emit(message, payload)
  }

  getPayloadTemplate(message: string): EventPayload {
    // @if DEBUG=true
    this._checkMessageName(message)
    // @endif

    if (this._allMessages[message]?.templatePayload) {
      return Object.assign({}, this._allMessages[message].templatePayload)
    }

    return {}
  }

  addEvent(messageName: string, message: EventOptions = {}): void {
    // @if DEBUG=true
    if (!this._allowAdding) {
      console.error(
        "Client_Core.EventBus - 'allowAdding' flag needs to be set to allow dynamic adding of events",
      )
    }
    // @endif

    this._events[messageName] = message
    this._setupMessage(messageName, message)
  }

  private _setupProperties(messages: Record<string, EventOptions>): void {
    for (const messageName in messages) {
      const message = messages[messageName]
      if (message) {
        this._setupMessage(messageName, message)
      }
    }
  }

  private _setupMessage(messageName: string, message: EventOptions): void {
    message.log ??= true
    message.validateProperties ??= true

    message.templatePayload = {}

    if (Array.isArray(message.properties)) {
      for (const property of message.properties) {
        Object.defineProperty(message.templatePayload, property, {
          value: null,
          configurable: false,
          writable: false,
          enumerable: true,
        })
      }
    }

    this._allMessages[messageName] = message
  }

  private _setupEvents(): void {
    this._setupProperties(this._events)
  }

  private _checkMessageName(message: string): void {
    if (!this._allowAdding && !this._allMessages[message]) {
      console.error(
        `Client_Core.EventBus - Message name [${message}] does not exist`,
      )
    }
  }

  private _checkPayload(message: string, payload: EventPayload): void {
    this._logMessage(message, payload)

    const messageObj = this._allMessages[message]

    if (messageObj.validateProperties) {
      // required props
      for (const prop in messageObj.templatePayload) {
        if ((payload as any)[prop] === undefined) {
          console.error(
            `Client_Core.EventBus - Property [${prop}] missing from payload for message [${message}]`,
          )
        }
      }

      // extra props
      for (const prop in payload) {
        if ((messageObj.templatePayload as any)[prop] === undefined) {
          console.warn(
            `Client_Core.EventBus - Property [${prop}] is included in the payload but was not defined in settings for message [${message}]`,
          )
        }
      }
    }
  }

  private _logMessage(message: string, payload?: EventPayload): void {
    if (this._allMessages[message].log) {
      let payloadString: string | undefined

      if (payload) {
        try {
          payloadString = JSON.stringify(payload, null, 2)
        } catch {
          payloadString = 'Unable to stringify'
        }
      }

      console.info(
        `Client_Core.EventBus - ${this._parentName}: ${message}${
          payload ? ' - payload: ' + payloadString : ''
        }`,
      )
    }
  }
}

export default EventBus
