import { describe, it, expect } from 'vitest';
import { toIsoPoint, generateIsoBox, getIsoColors } from './isometric';

const COS_30 = Math.cos(Math.PI / 6);
const SIN_30 = Math.sin(Math.PI / 6);

describe('toIsoPoint', () => {
  it('maps origin (0,0,0) to screen (0,0)', () => {
    const p = toIsoPoint(0, 0, 0);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0);
  });

  it('moves screen-x right when increasing world-x', () => {
    const p = toIsoPoint(100, 0, 0);
    expect(p.x).toBeCloseTo(100 * COS_30);
    expect(p.y).toBeCloseTo(100 * SIN_30);
  });

  it('moves screen-x left when increasing world-y', () => {
    const p = toIsoPoint(0, 100, 0);
    expect(p.x).toBeCloseTo(-100 * COS_30);
    expect(p.y).toBeCloseTo(100 * SIN_30);
  });

  it('moves screen-y up when increasing world-z', () => {
    const p = toIsoPoint(0, 0, 100);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-100);
  });

  it('is linear: 2x input gives 2x output', () => {
    const p1 = toIsoPoint(100, 200, 300);
    const p2 = toIsoPoint(200, 400, 600);
    expect(p2.x).toBeCloseTo(p1.x * 2);
    expect(p2.y).toBeCloseTo(p1.y * 2);
  });
});

describe('generateIsoBox', () => {
  it('returns three SVG path strings', () => {
    const box = generateIsoBox(0, 0, 0, 100, 100, 100);
    expect(box).toHaveProperty('top');
    expect(box).toHaveProperty('left');
    expect(box).toHaveProperty('right');
    expect(typeof box.top).toBe('string');
    expect(typeof box.left).toBe('string');
    expect(typeof box.right).toBe('string');
  });

  it('paths start with M and end with Z', () => {
    const box = generateIsoBox(0, 0, 0, 100, 100, 100);
    for (const path of [box.top, box.left, box.right]) {
      expect(path.startsWith('M ')).toBe(true);
      expect(path.endsWith(' Z')).toBe(true);
    }
  });

  it('each path contains 4 line segments (M + 3L + Z)', () => {
    const box = generateIsoBox(0, 0, 0, 100, 100, 100);
    for (const path of [box.top, box.left, box.right]) {
      const segments = path.split(' L ');
      expect(segments.length).toBe(4); // M point + 3 L points
    }
  });

  it('zero-size box degenerates to a single point', () => {
    const box = generateIsoBox(50, 50, 0, 0, 0, 0);
    // All 8 corners collapse to the same isometric point
    const origin = toIsoPoint(50, 50, 0);
    expect(box.top).toContain(`${origin.x},${origin.y}`);
  });
});

describe('getIsoColors', () => {
  it('returns three color strings', () => {
    const colors = getIsoColors('#FF0000');
    expect(colors).toHaveProperty('top');
    expect(colors).toHaveProperty('left');
    expect(colors).toHaveProperty('right');
    expect(typeof colors.top).toBe('string');
    expect(typeof colors.left).toBe('string');
    expect(typeof colors.right).toBe('string');
  });

  it('includes the base color in all outputs', () => {
    const base = '#3366CC';
    const colors = getIsoColors(base);
    expect(colors.top).toContain(base);
    expect(colors.left).toContain(base);
    expect(colors.right).toContain(base);
  });
});
