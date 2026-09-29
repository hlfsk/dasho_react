import { useState, useEffect } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'

type ToggleBodyNodeData = {
  label?: string
}

/**
 * Ноду переключения тела (ToggleBodyNode).
 */
export default function ToggleBodyNode({ data }: NodeProps<ToggleBodyNodeData>) {
  // State management should be internal to the component unless needed globally.
  const [isActive, setIsActive] = useState(false); 
  const label = typeof data.label === 'string' ? data.label : 'Переключить Тело';

  return (
    <div className="dasho-node dasho-node--control">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: '#98C379', color: 'var(--cat-control)' }}>🔄</span>
        <div className="dasho-node__title-group"> 
          <div className="dasho-node__title">{label}</div> 
          <div className="dasho-node__cat" style={{color: 'var(--cat-control)'}}>переключение</div>
        </div>
      </div>

      
      {/* BODY */}
      <div className="dasho-node__body">
        <div className='dasho-toggle'>
          <label>{isActive ? 'Активно' : 'Не активно'}</label>  
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(prev => !prev)}
          /> 
        </div>
      </div>


      {/* SOCKETS - INPUT */}
      <div className="dasho-node__socket-row" style={{paddingBottom: 8}}>
        <Handle type="target" position={Position.Left} id="trigger"
                 style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-trigger)' }}/>
        <span className="dasho-node__socket-label">Переключатель</span>
      </div>


      {/* SOCKETS - OUTPUT */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        <div className='dasho-toggle'>
          <label>Активность</label>  
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(prev => !prev)}
          /> 
        </div>
      </div>

    </div>
  )
}