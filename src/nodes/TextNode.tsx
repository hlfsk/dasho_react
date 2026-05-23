import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './node.css'

export default function TextNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Текст'
  const text  = typeof data.text  === 'string' ? data.text  : 'Hello'

  return (
    <div className="dasho-node dasho-node--source">
      <div className="dasho-node__header">
        <span className="dasho-node__icon">🔤</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">Источник</span>
      </div>
      <div className="dasho-node__body">
        <div className="dasho-node__param">
          <label>Текст</label>
          <input type="text" defaultValue={text} className="dasho-node__input" />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="video"
        style={{ background: SOCKET_COLORS.video }} />
    </div>
  )
}
