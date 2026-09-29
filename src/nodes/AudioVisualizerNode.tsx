import { useEffect, useRef, useState, useCallback } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css' 

export default function AudioVisualizerNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Визуализатор'

  // Ref to hold the visual bars DOM elements (we will use CSS grid/flex for simplicity)
  const barRef = useRef<HTMLDivElement | null>(null)
  
  // State managed by the input signal
  const currentVolume = useInputSignal(
    [], // edges argument is technically needed but unused in this simple read-only logic block here, so we pass an empty array for simplicity.
    id, 
    'level'
  )

  return (
    <div className="dasho-node dasho-node--effect">
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(124,92,252,0.15)', color: 'var(--cat-fx)' }}>🔊</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-fx)' }}>визуал</div>
        </div>
      </div>

      {/* BODY - The animated display */}
      <div className="dasho-node__body">
        {currentVolume !== null ? (
          // We use a container element to represent multiple bars, whose total height reflects volume.
          <div className="audio-visualizer" 
            style={{ height: `${(currentVolume * 30) + 10}px`, transition: 'height 80ms cubic-bezier(0.25, 0.8, 0.25, 1)' }}
          >
            {/* This is where we would render dynamic bars in a real implementation */}
            <span className='dasho-node__label' style={{fontSize: '32px', color: '#fff'}}>{(currentVolume * 100).toFixed(0)}%</span>
          </div>
        ) : (
          <div className="param-row" style={{color:'var(--text-muted)'}}>
            <span>Ожидание 🔊...</span>
          </div>
        )}
      </div>

      {/* Input Connection */}
      <div className="dasho-node__socket-row target" style={{ marginLeft: '12px' }}> 
        <Handle type="target" position={Position.Left} id="levelinput" 
          style={{ background: 'rgba(192,132,252,0.2)', borderColor: 'var(--wire-data)' }} />
        <span className="dasho-node__socket-label">Уровень</span>
      </div>

      {/* Output (Usually this effect would pass video/image forward) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        <Handle type="source" position={Position.Right} id="visual_signal"
          style={{ background: 'rgba(124,92,252,0.2)', borderColor: 'var(--wire-data)' }} />
      </div > 

    </div>
  )
}