import { useCallback } from 'react'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react'
import { create } from 'zustand'

interface PatchState {
  nodes: Node<any>[] // Using 'any' as BaseNodeData was not fully defined globally before.
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  setNodes: (nodes: Node<any>[]) => void
  setEdges: (edges: Edge[]) => void
}

export const usePatchStore = create<PatchState>((set) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) as Node<any>[] })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) =>
    set((state) => ({ edges: addEdge(connection, state.edges) })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
}))