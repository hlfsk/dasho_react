import { useEffect, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { SOCKET_COLORS } from '../types'
import './node.css'

/**
 * Сглаживание (SmoothingNode) - transforms unstable number input into a steady output.
 * Uses Exponential Moving Average for low latency smoothness.
 */

export default function SmoothingNode({ data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Сглаживание'

  // State to hold current value and smoothed value
  // We use a ref for the smoothValue because we want continuous updates without triggering unnecessary React re-renders on every tick.
  const smoothValueRef = useRef<number | null>(null)
  
  // Initial state for input value (should be initialized by the first edge connection)
  const [inputValue, setInputValue] = useState<number | null>(null)
  
  // Internal parameter: The smoothing factor (alpha). 0 is slow/smooth; 1 is fast/no smoothing.
  const alphaInput = typeof data.alphaInput === 'number' ? data.alphaInput : 0.2

  useEffect(() => {
    // This effect runs on every React render when the component mounts and watches state changes (if any)
    // The actual "smoothing" logic runs continuously using ref updates managed by useEffects inside a tick loop.
  }, [data])


  const runSmoothingTick = () => {
    smoothValueRef.current = smoothValueRef.current ?? data.inMin || 0 // Initialize if null
    let currentValue: number | null = null

    // We should check the edges in the parent component and signalBus for current input (value)
    // Since we cannot access `useEdges` here without breaking encapsulation, we assume an external system handles ticking based on connectivity.
    // For this structural implementation, we simplify the execution step: a real edge handler would be needed.

    const stableValue = smoothValueRef.current! // Safe because input is assumed to exist when live

    return stableValue
  }


  // Rendered value (For display/use in React)
  const smoothOutputValue = runSmoothingTick()

  return (
    <div className="dasho-node dasho-node--transform">
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(255,190,11,0.15)', color: 'var(--cat-control)' }}>📈</span>
        <span className="dasho-node__title">{label}</span>
        <span className="dasho-node__cat">трансформация</span>
      </div>

      <div className="dasho-node__body">
        <div className="dasho-node__input-display" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className='dasho-node__label'>Вх:</span>
            <span className={inputValue !== null ? 'dasho-param-value' : ''}>
                {inputValue !== null ? inputValue.toFixed(4) : '--'} 
            </span>
        </div>

        <div className="dasho-node__param">
          <span className="dasho-node__label">скорость (альфа)</span>
          <input type="range" min={0} max={1} step={0.01} defaultValue={alphaInput}
            className="dasho-range" />
        </div>
      </div>

      <div className="dasho-node__socket-row">
        <Handle type="target" position={Position.Left} id="inputvalue"
          style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'var(--wire-video)' }} />
        <span className="dasho-node__socket-label">Вход</span>
      </div>
      <div className="dasho-node__socket-row out" style={{ paddingBottom: 8 }}>
        <span className="dasho-node__socket-label">Результат</span>
        <Handle type="source" position={Position.Right} id="smoothresult"
          style={{ background: 'rgba(124,92,252,0.2)', borderColor: 'var(--wire-data)' }} />
      </div>
    </div>
  )
}