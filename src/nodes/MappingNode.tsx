import { useEffect, useRef } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { signalBus } from '../store/signalBus'
import { SOCKET_COLORS } from '../types'
import './node.css'

/**
 * RangeNode (внутри ещё называется MappingNode пока не переименуем файл)
 * Переводит входящее число из одного диапазона в другой.
 *
 * Вход:  number «Значение»
 * Выход: number «Результат»
 */

function mapValue(
  value: number,
  inMin: number, inMax: number,
  outMin: number, outMax: number,
  invert: boolean, clamp: boolean,
): number {
  if (inMax === inMin) return outMin
  let t = (value - inMin) / (inMax - inMin)
  if (clamp) t = Math.min(1, Math.max(0, t))
  if (invert) t = 1 - t
  return outMin + t * (outMax - outMin)
}

export default function MappingNode({ id, data }: NodeProps) {
  const label  = typeof data.label  === 'string'  ? data.label  : 'Диапазон'
  const inMin  = typeof data.inMin  === 'number'  ? data.inMin  : 0
  const inMax  = typeof data.inMax  === 'number'  ? data.inMax  : 1
  const outMin = typeof data.outMin === 'number'  ? data.outMin : 0
  const outMax = typeof data.outMax === 'number'  ? data.outMax : 100
  const invert = typeof data.invert === 'boolean' ? data.invert : false
  const clamp  = typeof data.clamp  === 'boolean' ? data.clamp  : true

  const edges  = useEdges()
  const rafRef = useRef<number>(0)

  const sourceEdge = edges.find(e => e.target === id && e.targetHandle === 'value')

  useEffect(() => {
    if (!sourceEdge) { signalBus.publish(id, 'result', null); return }
    const { source, sourceHandle } = sourceEdge
    const tick = () => {
      const raw = signalBus.read(source, sourceHandle ?? 'value')
      if (typeof raw === 'number') {
        signalBus.publish(id, 'result', mapValue(raw, inMin, inMax, outMin, outMax, invert, clamp))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [id, sourceEdge, inMin, inMax, outMin, outMax, invert, clamp])

  return (
    <div className="dasho-node dasho-node--control">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">⇄</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">Управление</span>
      </div>

      <div className="dasho-node__body">
        {/* Вход */}
        <div className="dasho-node__socket-row">
          <span className="dasho-node__socket-dot dasho-node__socket-dot--number" />
          <span>Значение</span>
        </div>

        <div className="dasho-node__divider" />

        <div className="dasho-node__param">
          <label>Вход</label>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 11, color: 'var(--text-primary)' }}>
            {inMin} → {inMax}
          </span>
        </div>
        <div className="dasho-node__param">
          <label>Выход</label>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 11, color: 'var(--text-primary)' }}>
            {outMin} → {outMax}
          </span>
        </div>

        <div className="dasho-node__divider" />

        <div className="dasho-node__param">
          <label>Инверт</label>
          <label className="dasho-toggle">
            <input type="checkbox" defaultChecked={invert} />
            <span>{invert ? 'вкл' : 'выкл'}</span>
          </label>
        </div>
        <div className="dasho-node__param">
          <label>Зажать</label>
          <label className="dasho-toggle">
            <input type="checkbox" defaultChecked={clamp} />
            <span>{clamp ? 'вкл' : 'выкл'}</span>
          </label>
        </div>

        <div className="dasho-node__divider" />

        {/* Выход */}
        <div className="dasho-node__socket-row" style={{ justifyContent: 'flex-end' }}>
          <span>Результат</span>
          <span className="dasho-node__socket-dot dasho-node__socket-dot--number" />
        </div>
      </div>

      <Handle type="target" position={Position.Left}  id="value"
        style={{ background: SOCKET_COLORS.number }} />
      <Handle type="source" position={Position.Right} id="result"
        style={{ background: SOCKET_COLORS.number }} />
    </div>
  )
}
