import React from 'react';
import { getAssetGeometry } from '../core/definitions';
import { generateIsoBox, getIsoColors } from '../core/isometric';

interface Props {
  assetId: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

// Render a 2D top-down view of the geometry
export function Asset2DView({ assetId, width = 100, height = 100, className, style }: Props) {
  const geo = getAssetGeometry(assetId);

  // Sort by Z index to render bottom-up
  const shapes = [...geo.shapes].sort((a, b) => a.z - b.z);

  return (
    <svg 
      className={className} 
      style={{ overflow: 'visible', ...style }}
      viewBox="-0.5 -0.5 1 1" 
      width={width} 
      height={height}
    >
      {shapes.map(shape => (
        <rect
          key={shape.id}
          x={shape.x - shape.width / 2}
          y={shape.y - shape.depth / 2}
          width={shape.width}
          height={shape.depth}
          fill={shape.color}
          opacity={shape.opacity ?? 1}
        />
      ))}
    </svg>
  );
}

// Render the internal groups for a 2.5D view (useful for composing within a larger SVG)
export function Asset25DNodeGroup({ 
  assetId,
  scaleX = 1,
  scaleY = 1,
  scaleZ = 1,
  rotationZ = 0
}: { 
  assetId: string;
  scaleX?: number;
  scaleY?: number;
  scaleZ?: number;
  rotationZ?: number;
}) {
  const geo = getAssetGeometry(assetId);
  
  // Depth sorting in 3D to Isometric: draw back-to-front, bottom-to-top.
  // We apply scale and planar rotation to the parameters first.
  const shapes = [...geo.shapes].map(s => {
    let x = s.x * scaleX;
    let y = s.y * scaleY;
    let z = s.z * scaleZ;
    let width = s.width * scaleX;
    let depth = s.depth * scaleY;
    let height = s.height * scaleZ;

    const rotMod = (Math.round(rotationZ) % 360 + 360) % 360;
    if (rotMod === 90) {
      let nx = -y; let ny = x;
      x = nx; y = ny;
      let nw = depth; let nd = width;
      width = nw; depth = nd;
    } else if (rotMod === 180) {
      x = -x; y = -y;
    } else if (rotMod === 270) {
      let nx = y; let ny = -x;
      x = nx; y = ny;
      let nw = depth; let nd = width;
      width = nw; depth = nd;
    }

    return { ...s, x, y, z, width, depth, height };
  }).sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));

  return (
    <>
      {shapes.map(shape => {
        // Create full path definition
        const originX = shape.x - shape.width / 2;
        const originY = shape.y - shape.depth / 2;
        
        const box = generateIsoBox(originX, originY, shape.z, shape.width, shape.depth, shape.height);
        const shading = getIsoColors(shape.color);
        
        return (
          <g key={shape.id} opacity={shape.opacity ?? 1}>
            <path d={box.left} fill={shading.left} stroke="rgba(0,0,0,0.1)" strokeWidth={0.01} strokeLinejoin="round" />
            <path d={box.right} fill={shading.right} stroke="rgba(0,0,0,0.1)" strokeWidth={0.01} strokeLinejoin="round" />
            <path d={box.top} fill={shading.top} stroke="rgba(0,0,0,0.05)" strokeWidth={0.01} strokeLinejoin="round" />
          </g>
        );
      })}
    </>
  );
}

// Render an isometric 2.5D view of the geometry wrapped in an SVG
export function Asset25DView({ assetId, width = 100, height = 100, className, style }: Props) {
  return (
    <svg 
      className={className} 
      style={{ overflow: 'visible', ...style }}
      viewBox="-1 -1.5 2 2.5" 
      width={width} 
      height={height}
    >
      <Asset25DNodeGroup assetId={assetId} />
    </svg>
  );
}
