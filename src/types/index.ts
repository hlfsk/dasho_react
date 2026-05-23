// Socket types — only same-type sockets can connect
export type SocketType = 'video' | 'audio' | 'number' | 'trigger'

export const SOCKET_COLORS: Record<SocketType, string> = {
  video: '#4ade80',    // 🟢 green
  audio: '#60a5fa',   // 🔵 blue
  number: '#facc15',  // 🟡 yellow
  trigger: '#f87171', // 🔴 red
}

// Base data shape every node carries
export interface BaseNodeData {
  label: string
  [key: string]: unknown
}
