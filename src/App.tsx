import { ReactFlow, Background, Controls, MiniMap, BackgroundVariant } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { usePatchStore } from './store/patchStore'
import { nodeTypes } from './nodes'
import Palette from './components/Palette'
import './styles/app.css'

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = usePatchStore()

  return (
    <div className="app">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#333" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
      <Palette />
    </div>
  )
}
