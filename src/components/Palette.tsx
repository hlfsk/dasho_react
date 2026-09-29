import { useCallback } from 'react'
import { useReactFlow, Panel } from '@xyflow/react'
import './Palette.css'

const BUTTONS = [
  { icon: '📷', tooltip: 'Камера', type: 'camera' },
  { icon: '🌈', tooltip: 'Градиент', type: 'gradient' },
  { icon: '🔤', tooltip: 'Текст', type: 'text' },
  { icon: '🔲', tooltip: 'Управление', type: 'mapping' },
  { icon: '🖥️', tooltip: 'Вывод', type: 'output' },
]

export default function Palette() {
  const { addNodes, screenToFlowPosition } = useReactFlow()

  const addNode = useCallback((type: string, tooltip: string) => {
    const cx = window.innerWidth  / 2
    const cy = window.innerHeight / 2
    const position = screenToFlowPosition({ x: cx, y: cy })
    addNodes({
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: tooltip },
    })
  }, [addNodes, screenToFlowPosition])

  return (
    <div className="palette">
      {BUTTONS.map(({ icon, tooltip, type }) => (
        <button key={type} className="palette-btn" onClick={() => addNode(type, tooltip)}>
          {icon}
          <div className="palette-tooltip">{tooltip}</div>
        </button>
      ))}
      <button className="palette-btn" style={{ marginTop: 8, borderStyle: 'dashed', fontSize: 22, color: 'var(--text-muted)' }}>
        +<div className="palette-tooltip">Добавить ноду</div>
      </button>
    </div>
  )
}
