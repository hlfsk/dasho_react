// A base interface for all custom data carried by XyFlow nodes.
export interface BaseNodeData {
  id: string; // Redundant as flow provides it, but useful for external logic correlation.
  label?: string;
  text?: string;
  // Future expansion: statusIndicators?: boolean[];
}