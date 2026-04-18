// Isometric Projection Engine
// Standard Isometric: rotate X axis by 30 degrees down, rotate Z axis by 45 degrees
// To convert X, Y (depth), Z (height) into 2D canvas coordinates (px, py)

const TILE_ANGLE = Math.PI / 6; // 30 degrees
const COS_30 = Math.cos(TILE_ANGLE);
const SIN_30 = Math.sin(TILE_ANGLE);

export function toIsoPoint(x: number, y: number, z: number): { x: number, y: number } {
  // x is width axis (bottom-right pointing)
  // y is depth axis (bottom-left pointing)
  // z is height axis (up pointing)
  
  // Iso X calculation: x moves right, y moves left on screen X
  const screenX = (x - y) * COS_30;
  
  // Iso Y calculation: both x and y move down on screen Y, z moves up
  const screenY = (x + y) * SIN_30 - z;
  
  return { x: screenX, y: screenY };
}

// Generates SVG path string for a 2.5D Isometric Box
export function generateIsoBox(
  originX: number, originY: number, originZ: number,
  w: number, d: number, h: number
) {
  // A box rests on (originX, originY) at height originZ 
  // It extends to width w, depth d, and height h
  
  // Points of the bottom plane
  const p0 = toIsoPoint(originX, originY, originZ);               // Back corner
  const p1 = toIsoPoint(originX + w, originY, originZ);           // Right corner
  const p2 = toIsoPoint(originX + w, originY + d, originZ);       // Front corner
  const p3 = toIsoPoint(originX, originY + d, originZ);           // Left corner
  
  // Points of the top plane
  const t0 = toIsoPoint(originX, originY, originZ + h);           // Back corner
  const t1 = toIsoPoint(originX + w, originY, originZ + h);       // Right corner
  const t2 = toIsoPoint(originX + w, originY + d, originZ + h);   // Front corner
  const t3 = toIsoPoint(originX, originY + d, originZ + h);       // Left corner

  // Top face
  const topPath = `M ${t0.x},${t0.y} L ${t1.x},${t1.y} L ${t2.x},${t2.y} L ${t3.x},${t3.y} Z`;
  
  // Right face (visible naturally in isometric view if we look from front-left)
  // Actually, left and right faces are:
  // Left face: t3, p3, p2, t2
  const leftFacePath = `M ${t3.x},${t3.y} L ${p3.x},${p3.y} L ${p2.x},${p2.y} L ${t2.x},${t2.y} Z`;
  
  // Right face: t2, p2, p1, t1
  const rightFacePath = `M ${t2.x},${t2.y} L ${p2.x},${p2.y} L ${p1.x},${p1.y} L ${t1.x},${t1.y} Z`;

  return {
    top: topPath,
    left: leftFacePath,
    right: rightFacePath
  };
}

// Generate shading colors based on a base HEX color
export function getIsoColors(baseHex: string) {
  // Advanced Glass/Tech Shading using color-mix for modern browsers
  // We use #0f172a (deep slate) to create "cool" shaded shadows rather than muddy black
  // Top: Lightest, reflects ceiling light
  // Left: Mid-tone, main visible surface
  // Right: Darkest, standard shadow side
  return {
    top: `color-mix(in srgb, ${baseHex} 70%, white)`,           
    left: `color-mix(in srgb, ${baseHex} 90%, #1e293b)`,       
    right: `color-mix(in srgb, ${baseHex} 70%, #0f172a)`       
  };
}
