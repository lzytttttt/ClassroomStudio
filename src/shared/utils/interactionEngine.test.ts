import { describe, it, expect } from 'vitest';
import {
  getRelationTypeVisualStyle,
  getRelationDrivenEffects,
  getCoverageEffectForComponent,
  resolveInteractionEffects,
} from './interactionEngine';
import type { Scene, SceneComponent, SceneRelation } from '@/shared/types';

function makeScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: 'scene-1',
    room: { width: 9000, height: 7000, ceilingHeight: 3200, wallThickness: 240, doors: [], windows: [], floorColor: '#F1F5F9', wallColor: '#E2E8F0' },
    components: [
      { id: 'c1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: 'Desk', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c2', assetId: 'a2', position: { x: 100, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 1, name: 'Monitor', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c3', assetId: 'a3', position: { x: 200, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 3000, zIndex: 2, name: 'Projector', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c4', assetId: 'a4', position: { x: 300, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 3, name: 'AP-WiFi', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
    ],
    connections: [],
    externalNodes: [],
    viewState: { activeView: '2d', canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true }, topology: { layout: 'hierarchical', filterTypes: [], highlightedNodeId: null, lineStyle: 'bezier' }, selectedIds: [] },
    ...overrides,
  };
}

const rel1: SceneRelation = { id: 'r1', type: 'placed_on', sourceId: 'c2', targetId: 'c1' };
const rel2: SceneRelation = { id: 'r2', type: 'controls', sourceId: 'c3', targetId: 'c2' };

describe('getRelationTypeVisualStyle', () => {
  it('returns correct color and label for each relation type', () => {
    expect(getRelationTypeVisualStyle('controls')).toEqual({ color: '#3B82F6', label: '控制', dashed: false, opacity: 1 });
    expect(getRelationTypeVisualStyle('depends_on')).toEqual({ color: '#F97316', label: '依赖', dashed: false, opacity: 1 });
    expect(getRelationTypeVisualStyle('placed_on')).toEqual({ color: '#22C55E', label: '放置', dashed: false, opacity: 1 });
    expect(getRelationTypeVisualStyle('mounted_on')).toEqual({ color: '#A855F7', label: '安装', dashed: false, opacity: 1 });
    expect(getRelationTypeVisualStyle('covers')).toEqual({ color: '#06B6D4', label: '覆盖', dashed: false, opacity: 1 });
    expect(getRelationTypeVisualStyle('contains')).toEqual({ color: '#6B7280', label: '包含', dashed: true, opacity: 1 });
  });
});

describe('getRelationDrivenEffects', () => {
  it('returns empty when no relations', () => {
    const scene = makeScene();
    expect(getRelationDrivenEffects(scene, 'c1')).toEqual([]);
  });

  it('generates highlight effects for related components', () => {
    const scene = makeScene({ relations: [rel1, rel2] });
    const effects = getRelationDrivenEffects(scene, 'c1');
    // c1 is target of rel1 (source=c2), so c2 should be highlighted
    expect(effects.length).toBeGreaterThan(0);
    const highlight = effects.find(e => e.type === 'highlight_components');
    expect(highlight).toBeDefined();
    expect(highlight!.targetComponentIds).toContain('c2');
  });

  it('generates relation badge effects', () => {
    const scene = makeScene({ relations: [rel1] });
    const effects = getRelationDrivenEffects(scene, 'c1');
    const badges = effects.filter(e => e.type === 'show_relation_badges');
    expect(badges).toHaveLength(1);
    expect(badges[0].payload).toMatchObject({ relationType: 'placed_on', direction: 'incoming' });
  });

  it('does not mutate scene', () => {
    const scene = makeScene({ relations: [rel1] });
    const before = JSON.stringify(scene);
    getRelationDrivenEffects(scene, 'c1');
    expect(JSON.stringify(scene)).toBe(before);
  });
});

describe('getCoverageEffectForComponent', () => {
  it('returns circle effect for AP/WiFi', () => {
    const comp: SceneComponent = { id: 'ap1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: 'AP-WiFi', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null };
    const effect = getCoverageEffectForComponent(comp);
    expect(effect).not.toBeNull();
    expect(effect!.type).toBe('show_coverage_area');
    expect(effect!.payload).toMatchObject({ shape: 'circle', radius: 5000 });
  });

  it('returns circle effect for microphone', () => {
    const comp: SceneComponent = { id: 'mic1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: '无线麦克风', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null };
    const effect = getCoverageEffectForComponent(comp);
    expect(effect).not.toBeNull();
    expect(effect!.payload).toMatchObject({ shape: 'circle', radius: 3000 });
  });

  it('returns sector payload for camera', () => {
    const comp: SceneComponent = { id: 'cam1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: '摄像头', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null };
    const effect = getCoverageEffectForComponent(comp);
    expect(effect).not.toBeNull();
    expect(effect!.payload).toMatchObject({ shape: 'sector', radius: 8000, angle: 120 });
  });

  it('returns null for generic component', () => {
    const comp: SceneComponent = { id: 'd1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: '桌子', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null };
    expect(getCoverageEffectForComponent(comp)).toBeNull();
  });
});

describe('resolveInteractionEffects', () => {
  it('returns empty for component with no relations and no coverage', () => {
    const scene = makeScene();
    const effects = resolveInteractionEffects({ scene, componentId: 'c1', trigger: { type: 'select' } });
    expect(effects).toEqual([]);
  });

  it('generates highlight and badge effects for component with relations', () => {
    const scene = makeScene({ relations: [rel1, rel2] });
    const effects = resolveInteractionEffects({ scene, componentId: 'c1', trigger: { type: 'select' } });
    expect(effects.length).toBeGreaterThan(0);
    expect(effects.some(e => e.type === 'highlight_components')).toBe(true);
    expect(effects.some(e => e.type === 'show_relation_badges')).toBe(true);
  });

  it('includes coverage effect for AP component', () => {
    const scene = makeScene({ relations: [] });
    const effects = resolveInteractionEffects({ scene, componentId: 'c4', trigger: { type: 'select' } });
    const coverage = effects.find(e => e.type === 'show_coverage_area');
    expect(coverage).toBeDefined();
    expect(coverage!.payload).toMatchObject({ shape: 'circle', radius: 5000 });
  });

  it('includes status badge effects when statuses provided', () => {
    const scene = makeScene();
    const statuses = new Map([
      ['c1', { componentId: 'c1', status: 'warning' as const }],
    ]);
    const effects = resolveInteractionEffects({ scene, componentId: 'c1', trigger: { type: 'select' }, componentStatuses: statuses });
    const statusBadge = effects.find(e => e.type === 'show_status_badge');
    expect(statusBadge).toBeDefined();
    expect(statusBadge!.payload).toMatchObject({ status: 'warning' });
  });

  it('does not mutate scene', () => {
    const scene = makeScene({ relations: [rel1] });
    const before = JSON.stringify(scene);
    resolveInteractionEffects({ scene, componentId: 'c1', trigger: { type: 'select' } });
    expect(JSON.stringify(scene)).toBe(before);
  });
});
