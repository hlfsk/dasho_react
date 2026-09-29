import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'

const PRESETS = ['Закат', 'Океан', 'Лес', 'Неон', 'Сумерки', 'Аврора']

export default function GradientNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Градиент'

  return (
    <div className="dasho-node dasho-node--source">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--cat-sources)' }}>🌈</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-sources)' }}>источник</div>
        </div>
      </div>
      <div className="dasho-node__body">
        <div className="dasho-node__param">
          <span className="dasho-node__label">Режим</span>
          <select className="dasho-node__select">
            {PRESETS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="dasho-node__param">
          <span className="dasho-node__label">Скорость</span>
          <input type="range" min={0} max={1} step={0.01} defaultValue={0.5}
            className="dasho-range" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="video"
        style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-video)' }} />
    </div>
  )
}