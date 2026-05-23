import { useCallback } from 'react'
import { useReactFlow, Panel } from '@xyflow/react'
import './Palette.css'

const NODE_CATALOG = [
  { cat: 'Источники', nodes: [
    { type: 'camera',   icon: '📷', label: 'Камера',    dot: 'video'   },
    { type: 'gradient', icon: '🌈', label: 'Градиент',  dot: 'video'   },
    { type: 'text',     icon: '🔤', label: 'Текст',      dot: 'video'   },
  ]},
  { cat: 'Управление', nodes: [
    { type: 'mapping',  icon: '⇄',  label: 'Диапазон',   dot: 'number'  },
  ]},
  { cat: 'Вывод', nodes: [
    { type: 'output',   icon: '📺', label: 'Вывод',      dot: 'video'   },
  ]},
]

export default function Palette() {
  const { addNodes, screenToFlowPosition } = useReactFlow()

  const addNode = useCallback((type: string, label: string) => {
    const cx = window.innerWidth  / 2
    const cy = window.innerHeight / 2
    const position = screenToFlowPosition({ x: cx, y: cy })
    addNodes({
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label },
    })
  }, [addNodes, screenToFlowPosition])

  return (
    <Panel position="top-left">
      <aside className="dasho-palette">
        <div className="dasho-palette__panel">
          <div className="dasho-palette__header">
            <span className="dasho-palette__title">Ноды</span>
          </div>
          {NODE_CATALOG.map(({ cat, nodes }) => (
            <div key={cat}>
              <div className="dasho-palette__cat">{cat}</div>
              {nodes.map(({ type, icon, label, dot }) => (
                <button
                  key={type}
                  className="dasho-palette__item"
                  onClick={() => addNode(type, label)}
                >
                  <span className="dasho-palette__item-icon">{icon}</span>
                  <span>{label}</span>
                  <span
                    className="dasho-palette__dot"
                    style={{ background: `var(--socket-${dot})` }}
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </Panel>
  )
}
