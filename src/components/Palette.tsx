import { useCallback } from 'react'
import { useReactFlow, Panel } from '@xyflow/react'
import './Palette.css'

const BUTTONS = [
  { icon: '📷', tooltip: 'Камера (Источник)', type: 'camera' }, 
  { icon: '🌈', tooltip: 'Градиент (Начало)', type: 'gradient' },
  { icon: '🔤', tooltip: 'Текст', type: 'text' },

  // --- NEW CONTROL AND TRANSFORM NODES ---
  { icon: '🔢', tooltip: 'Показать Значение', type: 'valueDisplay' }, 
  { icon: '🪄', tooltip: 'Маппинг/Проец.', type: 'mapping' }, // Projection Mapper
  { icon: '🎛️', tooltip: 'Управление телом/Событие', type: 'toggleBody' },

  { icon: '🖥️', tooltip: 'Вывод (Проектор)', type: 'output'},
]

export default function Palette() {
  const { addNodes, screenToFlowPosition } = useReactFlow()

  const addNode = useCallback((type: string, tooltip: string) => {
    // Using a placeholder location; in real app this would be dynamic
    const cx = 50 + (Math.random() * 100); 
    const cy = 50 + (Math.random() * 100);

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