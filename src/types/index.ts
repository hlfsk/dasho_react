// Socket types — only same-type sockets can connect
export type SocketType = 'video' | 'audio' | 'number' | 'trigger' | 'point' | 'state'

export const SOCKET_COLORS: Record<SocketType, string> = {
  video:   '#4ade80',  // 🟢 green
  audio:   '#60a5fa',  // 🔵 blue
  number:  '#facc15',  // 🟡 yellow
  trigger: '#f87171',  // 🔴 red
  point:   '#c084fc',  // 🟣 purple — точка в пространстве (нос, ладонь, палец)
  state:   '#fb923c',  // 🟠 orange — логическое состояние (открыт, активен, выбран)
}

// Base data shape every node carries
export interface BaseNodeData {
  label: string
  [key: string]: unknown
}

// Point in 2D/3D space — used for face/hand landmarks
export interface Point2D {
  x: number
  y: number
}

export interface Point3D extends Point2D {
  z: number
}
