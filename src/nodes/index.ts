import TextNode from './TextNode'
import GradientNode from './GradientNode'
import CameraNode from './CameraNode'
import MappingNode from './MappingNode'

// Register all node types here
// Key must match the `type` field when creating a node
export const nodeTypes = {
  text: TextNode,
  gradient: GradientNode,
  camera: CameraNode,
  mapping: MappingNode,
}
