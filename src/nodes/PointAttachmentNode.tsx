import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'

/**
 * Привязка (PointAttachmentNode).
 * Преобразует данные о физической точке (например, ладонь или нос) 
 * в дискретные числовые значения X и Y для управляющих сигналов.
 */
export default function PointAttachmentNode({ data }: NodeProps) {
  // Убедимся, что Label всегда задан, если используется не по умолчанию
  const label = typeof data.label === 'string' ? data.label : 'Привязка'

  return (
    <div className="dasho-node dasho-node--control">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(192,132,252,0.15)', color: 'var(--cat-ai)' }}>📍</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          {/* Поскольку это контроллерная нода, она относится к управлению */}
          <div className="dasho-node__cat" style={{ color: 'var(--cat-control)' }}>контроль</div> 
        </div > 
      </div>

      {/* BODY - Parameter selection (Mock UI) */}
      <div className="dasho-node__body">
        <div className="param-row">
          <span className="dasho-node__label">точка</span>
          <select className="dasho-node__select" defaultValue="правый_нос">
            {/* Здесь в будущем будут реальные варианты: Левый нос, Правая ладонь и т.д. */}
            <option value="левый_нос">Левый Нос</options> 
            <option value="правый_нос">Правый Нос</option>
            <option value="левая_ладонь">Левая Ладонь</option>
          </select>
        </div>

        {/* Подтверждение, что выбор точки происходит */}
        <div className="dasho-node__param" style={{display: 'flex', alignItems: 'center'}}><span className='dasho-node__label'>живое</span> 📍</div>
      </div >
       

      {/* SOCKETS - LEFT (INPUT) */}
      <div className="dasho-node__socket-row">
        <Handle type="target" position={Position.Left} id="pointinput"
          style={{ background: 'rgba(192,132,252,0.2)', borderColor: 'var(--wire-point)' }} />
        <span className="dasho-node__socket-label">Точка</span>
      </div>

      {/* SOCKETS - RIGHT (OUTPUT) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        {/* X Output */}
        <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">X</span>
          <Handle type="source" position={Position.Right} id="xresult" style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
        </div>
        {/* Y Output */}
        <div className="dasho-node__socket-row out">
          <span className="dasho-node__socket-label">Y</span>
          <Handle type="source" position={Position.Right} id="yresult" style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
        </div>
      </div > 


    </div > 

  )
}