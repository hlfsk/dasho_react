/**
 * useInputSignal — хук для нод-потребителей.
 *
 * Принимает edges (список соединений), id своей ноды и имя входного сокета.
 * Возвращает текущее значение сигнала, автоматически обновляясь при изменениях.
 *
 * Пример:
 *   const videoFrame = useInputSignal(edges, id, 'video')
 */

import { useEffect, useState } from 'react'
import { type Edge } from '@xyflow/react'
import { signalBus, type SignalValue } from './signalBus'

export function useInputSignal(
  edges: Edge[],
  nodeId: string,
  inputSocket: string,
): SignalValue {
  // Находим ребро, подключённое к нашему входу
  const edge = edges.find(
    (e) => e.target === nodeId && e.targetHandle === inputSocket,
  )

  const sourceNodeId = edge?.source ?? null
  const sourceSocket = edge?.sourceHandle ?? null

  const [value, setValue] = useState<SignalValue>(() =>
    sourceNodeId && sourceSocket
      ? signalBus.read(sourceNodeId, sourceSocket)
      : null,
  )

  useEffect(() => {
    if (!sourceNodeId || !sourceSocket) {
      setValue(null)
      return
    }
    // Читаем текущее значение сразу
    setValue(signalBus.read(sourceNodeId, sourceSocket))
    // И подписываемся на обновления
    return signalBus.subscribe(sourceNodeId, sourceSocket, setValue)
  }, [sourceNodeId, sourceSocket])

  return value
}
