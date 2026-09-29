import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant, ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { usePatchStore } from './store/patchStore'
import { nodeTypes } from './nodes'
import Palette from './components/Palette'
import './styles/globals.css'
import './styles/app.css'

function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = usePatchStore()

  return (
    <div className="dasho-canvas-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={2} color="rgba(255,255,255,0.12)" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
        <Palette />
      </ReactFlow>
      <div className="hint">🖱 тяни ноды за заголовок · колёсиком — зум · пробел+тяни — перемещение холста</div>
    </div>
  )
}

export default function App() {
  return (
    <div className="dasho-app">
      <div className="toolbar">
        <div className="app-logo">DÄ<span>SHO</span></div>
        <button className="toolbar-btn">💾 Сохранить</button>
        <button className="toolbar-btn">↺ Сброс</button>
        <div className="spacer"></div>
        <div className="status-dot"></div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>Патч активен</span>
        <button className="toolbar-btn active">⬛ На проектор</button>
      </div>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  )
}
