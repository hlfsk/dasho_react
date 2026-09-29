import { useEffect, useRef } from 'react'
import { Handle, Position, type NodeProps, useEdges } from '@xyflow/react'
import { signalBus } from '../store/signalBus'
import './dasho-base.css';

export default function ValueDisplayNode({ id, data }: NodeProps) {
  const label = typeof data.label === 'string' ? data.label : 'Показать Значение'
  const refValue = useRef<number | null>(null)
  const edges = useEdges()
  // Find the input edge (we assume there is exactly one numeric input for simplicity)
  const sourceEdge = edges.find(e => e.target === id && ['inputvalue', 'intensityinput'].includes(e.targetHandle))

  useEffect(() => {
    if (!sourceEdge) return
    
    const { source, sourceHandle } = sourceEdge;
    let currentInputVal: number | null = refValue.current;

    // Set up the tick loop using requestAnimationFrame for continuous real-time reading
    const tick = () => {
      const raw = signalBus.read(source, sourceHandle ?? 'inputvalue');
      if (typeof raw === 'number') {
        refValue.current = raw;
      }
      requestAnimationFrame(tick);
    };

    // Start the loop immediately after finding an edge
    requestAnimationFrame(tick);

    return () => cancelAnimationFrame(tick);
  }, [/* depends on edges/source* - though simplified for read-only purpose */]);


  const displayValue = refValue.current?.toFixed(4) ?? '...'; // Displaying the value to 4 decimal places

  return (
    <div className="dasho-node dasho-node--transform" style={{ width: '200px' }}>
      {/* HEADER */}
      <div className="dasho-node__header">
        <span className="dasho-node__icon" style={{ background: 'rgba(192,132,252,0.15)', color: 'var(--cat-control)' }}>🔢</span>
        <div className="dasho-node__title-group">
          <div className="dasho-node__title">{label}</div>
          <div className="dasho-node__cat" style={{ color: 'var(--cat-control)' }}>индикатор</div>
        </div > 
      </div>

      {/* BODY - Display Area */}
      <div className="dasho-node__body">
        <span style={{ fontSize: '32px', fontWeight: '900', color: '#cc3d6d' }}>
            {displayValue} 
        </span>
        <div className='dasho-node__subcaption'> (единица измерения)</div>
      </div >
      

      {/* SOCKETS - INPUT (The data we are monitoring) */}
      <div className="dasho-node__socket-row" style={{paddingBottom: 8}}>
        <span className="dasho-node__socket-label">Вход</span>
        <Handle type="target" position={Position.Left} id="inputvalue"
          style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />
      </div>

      {/* SOCKETS - OUTPUT (Passed through) */}
      <div className="dasho-node__body" style={{paddingTop: 0}}>
        <span className="dasho-node__socket-label">Значение</span>
        <Handle type="source" position={Position.Right} id="displayresult"
          style={{ background: 'rgba(255,190,11,0.2)', borderColor: 'var(--wire-data)' }} />

      </div > 

    </div> 
  )
}