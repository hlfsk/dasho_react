import { useEffect, useRef } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { signalBus } from '../store/signalBus'
import { SOCKET_COLORS } from '../types'
import './node.css'

/**
 * MappingNode — переводит входящее число в другой диапазон.
 *
 * Вход:  number (Значение)
 * Выход: number (Результат)
 *
 * Параметры:
 *   inMin / inMax  — диапазон входящего сигнала
 *   outMin / outMax — диапазон исходящего
 *   invert — инвертировать выход
 *   clamp  — запретить выход за диапазон
 */

function mapValue(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  invert: boolean,
  clamp: boolean,
): number {
  if (inMax === inMin) return outMin
  let t = (value - inMin) / (inMax - inMin)
  if (clamp) t = Math.min(1, Math.max(0, t))
  if (invert) t = 1 - t
  return outMin + t * (outMax - outMin)
}

export default function MappingNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Маппинг'

  // Параметры — читаем из data или ставим дефолты
  const inMin  = typeof data.inMin  === 'number' ? data.inMin  : 0
  const inMax  = typeof data.inMax  === 'number' ? data.inMax  : 1
  const outMin = typeof data.outMin === 'number' ? data.outMin : 0
  const outMax = typeof data.outMax === 'number' ? data.outMax : 100
  const invert = typeof data.invert === 'boolean' ? data.invert : false
  const clamp  = typeof data.clamp  === 'boolean' ? data.clamp  : true

  const edges = useEdges()
  const rafRef = useRef<number>(0)

  // Найти источник подключённый к входу 'value'
  const sourceEdge = edges.find(
    (e) => e.target === id && e.targetHandle === 'value'
  )

  useEffect(() => {
    if (!sourceEdge) {
      signalBus.publish(id, 'result', null)
      return
    }

    const { source, sourceHandle } = sourceEdge

    const tick = () => {
      const raw = signalBus.read(source, sourceHandle ?? 'value')
      if (typeof raw === 'number') {
        const mapped = mapValue(raw, inMin, inMax, outMin, outMax, invert, clamp)
        signalBus.publish(id, 'result', mapped)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [id, sourceEdge, inMin, inMax, outMin, outMax, invert, clamp])

  return (
    <div className="dasho-node">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">⇄</span>
        <span className="dasho-node__title">{label}</span>
      </div>

      <div className="dasho-node__body">
        {/* Диапазон входа */}
        <div className="dasho-node__row">
          <span className="dasho-node__label">Вход</span>
          <span className="dasho-node__value">{inMin} → {inMax}</span>
        </div>

        {/* Диапазон выхода */}
        <div className="dasho-node__row">
          <span className="dasho-node__label">Выход</span>
          <span className="dasho-node__value">{outMin} → {outMax}</span>
        </div>

        {/* Инверт */}
        <div className="dasho-node__row">
          <span className="dasho-node__label">Инверт</span>
          <span className="dasho-node__value">{invert ? 'вкл' : 'выкл'}</span>
        </div>

        {/* Зажать */}
        <div className="dasho-node__row">
          <span className="dasho-node__label">Зажать</span>
          <span className="dasho-node__value">{clamp ? 'вкл' : 'выкл'}</span>
        </div>
      </div>

      {/* Вход: Значение */}
      <Handle
        type="target"
        position={Position.Left}
        id="value"
        style={{ background: SOCKET_COLORS.number }}
      />

      {/* Выход: Результат */}
      <Handle
        type="source"
        position={Position.Right}
        id="result"
        style={{ background: SOCKET_COLORS.number }}
      />
    </div>
  )
}
