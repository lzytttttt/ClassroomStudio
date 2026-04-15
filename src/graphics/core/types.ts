export type ShapeType = 'box' | 'cylinder' | 'plane';

// Coordinate system relative to the asset. 
// Standard: x (width), y (depth), z (height from ground)
export interface ShapePrimitive {
  id: string;
  type: ShapeType;
  // Position relative to the center-bottom of the object bounds [0, 0, 0]
  x: number; // percentage (-0.5 to 0.5) or absolute if we normalize
  y: number; // percentage (-0.5 to 0.5)
  z: number; // height offset parameter (absolute mm or percentage)
  
  width: number; // factor of total width
  depth: number; // factor of total depth
  height: number;// actual thickness/height in mm or factor
  
  color: string; // Base HEX color. Isometric engine will generate top/left/right shades automatically.
  opacity?: number;
  label?: string; 
}

export interface AssetGeometry {
  assetId: string;
  // A collection of sub-shapes making up the asset
  shapes: ShapePrimitive[];
}
