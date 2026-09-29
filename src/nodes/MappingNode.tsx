import { useEffect, useRef } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { signalBus } from '../store/signalBus'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'; // <-- Changed import here!

/**
 * RangeNode (внутри ещё называется MappingNode пока не переименуем файл)
 * Переводит входящее число из одного диапазона в другой.
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
    <div className="dasho-node" style={{ width: 210 }}>
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--cat-control)' }}>🔲</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-control)' }}>проекция</div>
        </div>
      </div>

      <div className="dasho-node__body">
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Поверхности</div>
        
        {/* Mocked mapper grid from prototype */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
          <div style={{ aspectRatio: '1', background: 'rgba(124,92,252,0.15)', borderRadius: 6, border: '1.5px solid var(--cat-fx)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--cat-fx)' }}>A</div>
          <div style={{ aspectRatio: '1', background: 'var(--surface-3)', borderRadius: 6, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>B</div>
          <div style={{ aspectRatio: '1', background: 'var(--surface-3)', borderRadius: 6, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>C</div>
          <div style={{ aspectRatio: '1', background: 'var(--surface-3)', borderRadius: 6, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>D</div>
          <div style={{ aspectRatio: '1', background: 'var(--surface-3)', borderRadius: 6, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>E</div>
          <div style={{ aspectRatio: '1', background: 'var(--surface-3)', borderRadius: 6, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>+</div>
        </div>

        <div className="dasho-node__param">
          <span className="dasho-node__label">форма</span>
          <select className="dasho-node__select">
            <option>прямоугольник</option>
            <option>трапеция</option>
            <option>треугольник</option>
          </select>
        </div>
      </div>

      <div className="dasho-node__socket-row">
        <Handle type="target" position={Position.Left} id="value"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
        <span className="dasho-node__socket-label">видео</span>
      </div>
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        <span className="dasho-node__socket-label">поток</span>
        <Handle type="source" position={Position.Right} id="result"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
      </div>
    </div>
  )
}