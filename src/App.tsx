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
    <div style={{ width: '100vw', height: '100vh' }}>
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
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--canvas-dot)" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
        <Palette />
      </ReactFlow>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  )
}
