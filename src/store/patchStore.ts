import { useCallback } from 'react'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
} from '@xyflow/react'
import { create } from 'zustand'
import type { BaseNodeData } from '../types'

interface PatchState {
  nodes: Node<BaseNodeData>[]
  edges: Edge[]
  setNodes: (nodes: Node<BaseNodeData>[]) => void
  setEdges: (edges: Edge[]) => void
}

// Zustand store holds the serialisable patch state
export const usePatchStore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BaseNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  )

  return { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect }
}
