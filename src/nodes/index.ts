import TextNode     from './TextNode'
import GradientNode from './GradientNode'
import CameraNode   from './CameraNode'
import MappingNode  from './MappingNode' // Projection Mapper
import OutputNode   from './OutputNode'
import ValueDisplayNode from './ValueDisplayNode' 
import ToggleBodyNode from './ToggleBodyNode' // New body control node

export const nodeTypes = {
  text:     TextNode,
  gradient: GradientNode,
  camera:   CameraNode,
  mapping:  MappingNode,
  output:   OutputNode,
  // --- NEW CONTROL NODES (THE MAGIC) ---
  valueDisplay: ValueDisplayNode, 
  toggleBody: ToggleBodyNode, 
}