import { Handle, Position, type NodeProps } from '@xyflow/react'
import React, { useState, useEffect } from 'react'
import { SOCKET_COLORS } from '../types'
import './dasho-base.css'

export default function TextNode({ data, onUpdate }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Текст'
  // Initialize local state with external data
  const [localText, setLocalText] = useState<string>(data.text || '')

  // Sync local state when the node data changes externally (e.g., from another part of the graph)
  useEffect(() => {
    setLocalText(data.text || '')
  }, [data.text])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value
    setLocalText(newText)
    // Commit the change back to the graph state using the provided callback
    onUpdate('text', newText) 
  }

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
          {/* Use controlled input */}
          <input 
            type="text" 
            value={localText} 
            onChange={handleChange} 
            className="dasho-node__input" 
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="video" style={{ background: SOCKET_COLORS.video }} />
    </div>
  )
}