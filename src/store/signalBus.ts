/**
 * Runtime signal bus — отдельно от сериализуемого состояния патча.
 *
 * Нода пишет: signalBus.publish(nodeId, socketName, value)
 * Нода читает: signalBus.read(sourceNodeId, socketName)
 *
 * Значения хранятся по ключу "нодaId::socketName".
 * Для видео это HTMLVideoElement или HTMLCanvasElement.
 * Для чисел — number, для триггера — boolean.
 */

export type SignalValue = HTMLVideoElement | HTMLCanvasElement | number | boolean | null

type Listener = (value: SignalValue) => void

class SignalBus {
  private values = new Map<string, SignalValue>()
  private listeners = new Map<string, Set<Listener>>()

  private key(nodeId: string, socket: string) {
    return `${nodeId}::${socket}`
  }

  /** Нода-источник записывает значение */
  publish(nodeId: string, socket: string, value: SignalValue) {
    const k = this.key(nodeId, socket)
    this.values.set(k, value)
    this.listeners.get(k)?.forEach((fn) => fn(value))
  }

  /** Нода-потребитель читает последнее значение */
  read(nodeId: string, socket: string): SignalValue {
    return this.values.get(this.key(nodeId, socket)) ?? null
  }

  /** Подписка на изменения конкретного выхода источника */
  subscribe(nodeId: string, socket: string, fn: Listener): () => void {
    const k = this.key(nodeId, socket)
    if (!this.listeners.has(k)) this.listeners.set(k, new Set())
    this.listeners.get(k)!.add(fn)
    return () => this.listeners.get(k)?.delete(fn)
  }

  /** Удалить все значения ноды (destroy) */
  clear(nodeId: string) {
    for (const k of this.values.keys()) {
      if (k.startsWith(`${nodeId}::`)) this.values.delete(k)
    }
  }
}

// Глобальный синглтон — один на всё приложение
export const signalBus = new SignalBus()
