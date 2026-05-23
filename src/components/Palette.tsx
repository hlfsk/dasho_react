import { useCallback } from 'react'
import { useReactFlow, Panel } from '@xyflow/react'
import './Palette.css'

const NODE_CATALOG = [
  { type: 'camera',   icon: '📷', label: 'Камера' },
  { type: 'text',     icon: '🔤', label: 'Текст' },
  { type: 'gradient', icon: '🌈', label: 'Градиент' },
  { type: 'mapping',  icon: '⇄',  label: 'Маппинг' },
]

export default function Palette() {
  const { addNodes, screenToFlowPosition } = useReactFlow()

  const addNode = useCallback((type: string, label: string) => {
    const position = screenToFlowPosition({ x: 200, y: 200 })
    addNodes({
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label },
    })
  }, [addNodes, screenToFlowPosition])

  return (
    <Panel position="top-left">
      <aside className="palette">
        <div className="palette__title">Ноды</div>
        {NODE_CATALOG.map(({ type, icon, label }) => (
          <button
            key={type}
            className="palette__item"
            onClick={() => addNode(type, label)}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </aside>
    </Panel>
  )
}
