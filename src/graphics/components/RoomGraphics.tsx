import React from 'react';
import { generateIsoBox, getIsoColors, toIsoPoint } from '../core/isometric';

interface Props {
  widthMm: number;
  heightMm: number;
  floorColor?: string;
  wallColor?: string;
  wallThickness?: number;
  wallHeight?: number;
}

export interface RoomFeature {
  id: string;
  type: 'door' | 'window';
  wall: 'north' | 'south' | 'east' | 'west';
  position: number;
  width: number;
}

interface Props {
  widthMm: number;
  heightMm: number;
  floorColor?: string;
  wallColor?: string;
  wallThickness?: number;
  wallHeight?: number;
  doors?: RoomFeature[];
  windows?: RoomFeature[];
}

export function RoomGraphics25DGroup({ 
  widthMm, 
  heightMm, 
  floorColor = '#F1F5F9', // light gray
  wallColor = '#E2E8F0', 
  wallThickness = 240,
  wallHeight = 3200,
  doors = [],
  windows = []
}: Props) {
  // We use scale to keep SVG coordinates manageable. 
  // e.g. 1 unit = 1 meter
  const w = widthMm / 1000;
  const d = heightMm / 1000;
  const h = wallHeight / 1000;
  const t = wallThickness / 1000;

  // The floor is a thin box
  const floor = generateIsoBox(0, 0, 0, w, d, 0.05);
  const floorShading = getIsoColors(floorColor);

  return (
    <g>
      {/* Floor - Main Plane */}
      <path d={floor.top} fill={floorShading.top} stroke="rgba(0,0,0,0.05)" strokeWidth={0.01} />
      <path d={floor.left} fill={floorShading.left} />
      <path d={floor.right} fill={floorShading.right} />
      
      {/* Wooden Plank Texture - Subtle lines */}
      <g opacity={0.1}>
        {Array.from({ length: Math.ceil(w * 5) }).map((_, i) => {
          const x = i * 0.2;
          const p = toIsoPoint(x, 0, 0.052);
          const p2 = toIsoPoint(x, d, 0.052);
          return <path key={`plank-${i}`} d={`M ${p.x},${p.y} L ${p2.x},${p2.y}`} stroke="#000" strokeWidth={0.005} />;
        })}
      </g>

      {/* Wall 1 (Left / West Wall) */}
      <g>
        <path d={generateIsoBox(0, 0, 0, t, d, h).right} fill={getIsoColors(wallColor).right} />
        <path d={generateIsoBox(0, 0, h, t, d, 0.1).top} fill={getIsoColors(wallColor).top} />
        {/* Baseboard */}
        <path d={generateIsoBox(t, 0, 0.05, 0.02, d, 0.1).right} fill="#94A3B8" />

        {/* Doors on West Wall */}
        {doors.filter(dr => dr.wall === 'west').map(door => {
          const y = door.position / 1000;
          const dw = door.width / 1000;
          const dh = 2.1;
          const frameColor = '#475569';
          const doorColor = '#FDF8F5';
          return (
            <g key={door.id}>
              {/* Hole effect */}
              <path d={generateIsoBox(t, y, 0, 0.01, dw, dh).right} fill="#0F172A" />
              {/* Door Panel */}
              <path d={generateIsoBox(t+0.01, y + 0.05, 0, 0.02, dw - 0.1, dh).right} fill={getIsoColors(doorColor).right} />
              
              {/* Frame Left Post */}
              <path d={generateIsoBox(t, y, 0, 0.04, 0.05, dh).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y, 0, 0.04, 0.05, dh).top} fill={getIsoColors(frameColor).top} />
              
              {/* Frame Right Post */}
              <path d={generateIsoBox(t, y + dw - 0.05, 0, 0.04, 0.05, dh).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y + dw - 0.05, 0, 0.04, 0.05, dh).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(t, y + dw - 0.05, 0, 0.04, 0.05, dh).top} fill={getIsoColors(frameColor).top} />
              
              {/* Frame Header */}
              <path d={generateIsoBox(t, y, dh, 0.04, dw, 0.05).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y, dh, 0.04, dw, 0.05).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(t, y, dh, 0.04, dw, 0.05).top} fill={getIsoColors(frameColor).top} />
            </g>
          );
        })}

        {/* Windows on West Wall */}
        {windows.filter(win => win.wall === 'west').map(win => {
          const y = win.position / 1000;
          const ww = win.width / 1000;
          const wh = 1.5;
          const wz = 0.9;
          const frameColor = '#94A3B8';
          const glassColor = '#bae6fd';
          return (
            <g key={win.id}>
              {/* Hole & Glass */}
              <path d={generateIsoBox(t, y, wz, 0.01, ww, wh).right} fill="#0F172A" />
              <path d={generateIsoBox(t+0.01, y, wz, 0.02, ww, wh).right} fill={glassColor} opacity={0.6} />
              
              {/* Sill */}
              <path d={generateIsoBox(t, y, wz, 0.06, ww, 0.04).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y, wz, 0.06, ww, 0.04).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(t, y, wz, 0.06, ww, 0.04).top} fill={getIsoColors(frameColor).top} />
              
              {/* Header */}
              <path d={generateIsoBox(t, y, wz + wh, 0.06, ww, 0.04).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y, wz + wh, 0.06, ww, 0.04).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(t, y, wz + wh, 0.06, ww, 0.04).top} fill={getIsoColors(frameColor).top} />

              {/* Left Post */}
              <path d={generateIsoBox(t, y, wz, 0.06, 0.04, wh).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(t, y, wz, 0.06, 0.04, wh).left} fill={getIsoColors(frameColor).left} />
              
              {/* Right Post */}
              <path d={generateIsoBox(t, y + ww - 0.04, wz, 0.06, 0.04, wh).right} fill={getIsoColors(frameColor).right} />
            </g>
          );
        })}
      </g>
      
      {/* Wall 2 (Back / North Wall) */}
      <g>
        {/* Adjusted to start at x=t to prevent weird corner overlap */}
        <path d={generateIsoBox(t, 0, 0, w - t, t, h).left} fill={getIsoColors(wallColor).left} />
        <path d={generateIsoBox(t, 0, h, w - t, t, 0.1).top} fill={getIsoColors(wallColor).top} />
        {/* Baseboard */}
        <path d={generateIsoBox(t, t, 0.05, w - t, 0.02, 0.1).left} fill="#94A3B8" />

        {/* Doors on North Wall */}
        {doors.filter(dr => dr.wall === 'north').map(door => {
          const x = Math.max(t, door.position / 1000); // ensure it doesn't overlap corner
          const dw = door.width / 1000;
          const dh = 2.1;
          const frameColor = '#475569';
          const doorColor = '#FDF8F5';
          return (
            <g key={door.id}>
              <path d={generateIsoBox(x, t, 0, dw, 0.01, dh).left} fill="#0F172A" />
              <path d={generateIsoBox(x + 0.05, t + 0.01, 0, dw - 0.1, 0.02, dh).left} fill={getIsoColors(doorColor).left} />
              
              <path d={generateIsoBox(x, t, 0, 0.05, 0.04, dh).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x, t, 0, 0.05, 0.04, dh).right} fill={getIsoColors(frameColor).right} />
              <path d={generateIsoBox(x, t, 0, 0.05, 0.04, dh).top} fill={getIsoColors(frameColor).top} />
              
              <path d={generateIsoBox(x + dw - 0.05, t, 0, 0.05, 0.04, dh).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x + dw - 0.05, t, 0, 0.05, 0.04, dh).top} fill={getIsoColors(frameColor).top} />
              
              <path d={generateIsoBox(x, t, dh, dw, 0.04, 0.05).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x, t, dh, dw, 0.04, 0.05).top} fill={getIsoColors(frameColor).top} />
              <path d={generateIsoBox(x, t, dh, dw, 0.04, 0.05).right} fill={getIsoColors(frameColor).right} />
            </g>
          );
        })}

        {/* Windows on North Wall */}
        {windows.filter(win => win.wall === 'north').map(win => {
          const x = Math.max(t, win.position / 1000);
          const ww = win.width / 1000;
          const wh = 1.5;
          const wz = 0.9;
          const frameColor = '#94A3B8';
          const glassColor = '#bae6fd';
          return (
            <g key={win.id}>
              <path d={generateIsoBox(x, t, wz, ww, 0.01, wh).left} fill="#0F172A" />
              <path d={generateIsoBox(x, t+0.01, wz, ww, 0.02, wh).left} fill={glassColor} opacity={0.6} />
              
              <path d={generateIsoBox(x, t, wz, ww, 0.06, 0.04).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x, t, wz, ww, 0.06, 0.04).top} fill={getIsoColors(frameColor).top} />
              <path d={generateIsoBox(x, t, wz, ww, 0.06, 0.04).right} fill={getIsoColors(frameColor).right} />

              <path d={generateIsoBox(x, t, wz + wh, ww, 0.06, 0.04).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x, t, wz + wh, ww, 0.06, 0.04).top} fill={getIsoColors(frameColor).top} />
              <path d={generateIsoBox(x, t, wz + wh, ww, 0.06, 0.04).right} fill={getIsoColors(frameColor).right} />

              <path d={generateIsoBox(x, t, wz, 0.04, 0.06, wh).left} fill={getIsoColors(frameColor).left} />
              <path d={generateIsoBox(x, t, wz, 0.04, 0.06, wh).right} fill={getIsoColors(frameColor).right} />
              
              <path d={generateIsoBox(x + ww - 0.04, t, wz, 0.04, 0.06, wh).left} fill={getIsoColors(frameColor).left} />
            </g>
          );
        })}
      </g>

      {/* Ambient shadow gradient at wall intersection */}
      <path 
        d={`M ${toIsoPoint(t,t,0.05).x},${toIsoPoint(t,t,0.05).y} L ${toIsoPoint(w,t,0.05).x},${toIsoPoint(w,t,0.05).y} L ${toIsoPoint(t,d,0.05).x},${toIsoPoint(t,d,0.05).y} Z`} 
        fill="url(#wall-shadow)" 
        opacity={0.1}
      />
      
      <defs>
        <radialGradient id="wall-shadow" cx="0%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  );
}

export function RoomGraphics25D(props: Props) {
  const w = props.widthMm / 1000;
  const d = props.heightMm / 1000;
  const h = (props.wallHeight || 3200) / 1000;

  return (
    <svg 
      viewBox={`-${Math.max(w, d)} -${h + 2} ${Math.max(w, d) * 2} ${(Math.max(w, d) + h) * 1.5}`} 
      width="100%" height="100%" 
      style={{ overflow: 'visible' }}
    >
      <RoomGraphics25DGroup {...props} />
    </svg>
  );
}
