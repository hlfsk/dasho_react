import TextNode     from './TextNode'
import GradientNode from './GradientNode'
import CameraNode   from './CameraNode'
import MappingNode  from './MappingNode'
import OutputNode   from './OutputNode'

export const nodeTypes = {
  text:     TextNode,
  gradient: GradientNode,
  camera:   CameraNode,
  mapping:  MappingNode,
  output:   OutputNode,
}
