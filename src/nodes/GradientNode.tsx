import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './node.css'

const PRESETS = ['Закат', 'Океан', 'Лес', 'Неон', 'Сумерки', 'Аврора']

export default function GradientNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Градиент'

  return (
    <div className="dasho-node dasho-node--source">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">🌈</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">Источник</span>
      </div>
      <div className="dasho-node__body">
        <div className="dasho-node__param">
          <label>Режим</label>
          <select className="dasho-node__select">
            {PRESETS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="dasho-node__param">
          <label>Скорость</label>
          <input type="range" min={0} max={1} step={0.01} defaultValue={0.5}
            className="dasho-range" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="video"
        style={{ background: SOCKET_COLORS.video }} />
    </div>
  )
}
