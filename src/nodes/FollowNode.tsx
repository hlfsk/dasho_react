import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'

/**
 * Нода Следовать (FollowNode).
 * Берет координаты из определенной физической точки (например, нос) 
 * и преобразует их в осмысленное числовое значение, которое можно 
 * использовать как интенсивность, масштаб или смещение.
 */
export default function FollowNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Следовать (y)'

  return (
    <div className="dasho-node dasho-node--transform">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(124,92,252,0.15)', color: 'var(--cat-ai)' }}>📍</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          {/* Трансформация координат в управляющий сигнал */}
          <div className="dasho-node__cat" style={{ color: 'var(--cat-control)' }}>трансформация</div> 
        </div>
      </div>

      {/* BODY - Point selection controls (Mock UI) */}
      <div className="dasho-node__body">
        <div className="param-row"> {/* Wrapped body content in a single parent div to fix TS issues */}
          <span className='dasho-node__label'>Точка</span>
          <select className="dasho-node__select" defaultValue="правый_нос">
            <option value="левой_нос">Левый Нос</options> 
            <option value="правый_нос">Правый Нос</option>
            <option value="верхняя_ладонь">Верхняя Ладонь</options>
          </select>
        </div>

        {/* Select Axis */}
        <div className="param-row">
          <span className='dasho-node__label'>Ось</span>
          <select className="dasho-node__select" defaultValue="y">
            <option value="x">X (горизонталь)</option> 
            <option value="y">Y (вертикаль)</option>
          </select>
        </div>

        {/* Display output range control */}
        <div className="dasho-node__param" style={{display: 'flex', alignItems: 'center'}}><span className='dasho-node__label'>Выход 0..1</span> <input type="range" min={0} max={1} step={0.01} defaultValue={0.5} className="dasho-range"/></div>
      </div>

      {/* SOCKETS - INPUT (Point) */}
      <div className="dasho-node__socket-row">
        <Handle type="target" position={Position.Left} id="pointinput"
          style={{ background: 'rgba(192,132,252,0.2)', borderColor: 'var(--wire-point)' }} />
        <span className="dasho-node__socket-label">Точка</span>
      </div>

      {/* SOCKETS - OUTPUT (Number) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}> 
        {/* Выходной порт для числового значения, требуемого эффектом */}
        <Handle type="source" position={Position.Right} id="outputvalue"
          style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
      </div > 

    </div > 

  )
}