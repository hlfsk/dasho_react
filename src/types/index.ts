// Socket types — only same-type sockets can connect
export type SocketType = 'video' | 'audio' | 'number' | 'trigger' | 'point' | 'state'

// Colors must match CSS vars in globals.css
export const SOCKET_COLORS: Record<SocketType, string> = {
  video:   '#3d9eff',  // синий    --socket-video
  audio:   '#4ade80',  // зелёный  --socket-audio
  number:  '#facc15',  // жёлтый   --socket-number
  trigger: '#f87171',  // красный  --socket-trigger
  point:   '#c084fc',  // фиолет   --socket-point
  state:   '#fb923c',  // оранжев  --socket-state
}

export interface BaseNodeData {
  label: string
  [key: string]: unknown
}

export interface Point2D { x: number; y: number }
export interface Point3D extends Point2D { z: number }
