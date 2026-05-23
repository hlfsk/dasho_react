import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './node.css'

const PRESETS = ['Sunset', 'Ocean', 'Forest', 'Neon', 'Dusk', 'Aurora']

export default function GradientNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Gradient'

  return (
    <div className="dasho-node">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">🌈</span>
        <span className="dasho-node__title">{label}</span>
      </div>
      <div className="dasho-node__body">
        <div className="dasho-node__param">
          <label>Preset</label>
          <select className="dasho-node__select">
            {PRESETS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="dasho-node__param">
          <label>Speed</label>
          <input type="range" min={0} max={1} step={0.01} defaultValue={0.5} />
        </div>
      </div>
      {/* Output: video */}
      <Handle
        type="source"
        position={Position.Right}
        id="video"
        style={{ background: SOCKET_COLORS.video }}
      />
    </div>
  )
}
