import { describe, it, expect } from 'vitest';
import {
  getRelationsForComponent,
  getRelatedComponentIds,
  addSceneRelation,
  removeSceneRelation,
  updateSceneRelation,
} from './sceneRelations';
import type { Scene, SceneRelation } from '@/shared/types';

function makeScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: 'scene-1',
    room: { width: 9000, height: 7000, ceilingHeight: 3200, wallThickness: 240, doors: [], windows: [], floorColor: '#F1F5F9', wallColor: '#E2E8F0' },
    components: [
      { id: 'c1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: 'Desk', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c2', assetId: 'a2', position: { x: 100, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 1, name: 'Monitor', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c3', assetId: 'a3', position: { x: 200, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 3000, zIndex: 2, name: 'Projector', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
    ],
    connections: [],
    externalNodes: [],
    viewState: { activeView: '2d', canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true }, topology: { layout: 'hierarchical', filterTypes: [], highlightedNodeId: null, lineStyle: 'bezier' }, selectedIds: [] },
    ...overrides,
  };
}

const rel1: SceneRelation = { id: 'r1', type: 'placed_on', sourceId: 'c2', targetId: 'c1' };
const rel2: SceneRelation = { id: 'r2', type: 'mounted_on', sourceId: 'c3', targetId: 'c1' };
const rel3: SceneRelation = { id: 'r3', type: 'controls', sourceId: 'c3', targetId: 'c2' };

describe('getRelationsForComponent', () => {
  it('returns empty when scene has no relations', () => {
    const scene = makeScene();
    expect(getRelationsForComponent(scene, 'c1')).toEqual([]);
  });

  it('finds relations where component is source', () => {
    const scene = makeScene({ relations: [rel1, rel3] });
    const result = getRelationsForComponent(scene, 'c3');
    expect(result).toHaveLength(1); // only rel3 has c3 as source
    expect(result[0].id).toBe('r3');
  });

  it('finds relations where component is target', () => {
    const scene = makeScene({ relations: [rel1, rel2] });
    const result = getRelationsForComponent(scene, 'c1');
    expect(result).toHaveLength(2); // rel1 + rel2 both target c1
  });

  it('returns empty for unknown component', () => {
    const scene = makeScene({ relations: [rel1] });
    expect(getRelationsForComponent(scene, 'c99')).toEqual([]);
  });
});

describe('getRelatedComponentIds', () => {
  it('returns empty when no relations', () => {
    const scene = makeScene();
    expect(getRelatedComponentIds(scene, 'c1')).toEqual([]);
  });

  it('returns deduplicated related ids', () => {
    const scene = makeScene({ relations: [rel1, rel2] });
    const ids = getRelatedComponentIds(scene, 'c1');
    expect(ids).toContain('c2');
    expect(ids).toContain('c3');
    expect(ids).toHaveLength(2);
  });

  it('excludes the query component itself', () => {
    const scene = makeScene({ relations: [rel1] });
    const ids = getRelatedComponentIds(scene, 'c1');
    expect(ids).not.toContain('c1');
  });
});

describe('addSceneRelation', () => {
  it('adds a relation to an empty scene', () => {
    const scene = makeScene();
    const next = addSceneRelation(scene, rel1);
    expect(next.relations).toHaveLength(1);
    expect(next.relations![0].id).toBe('r1');
  });

  it('does not mutate the original scene', () => {
    const scene = makeScene();
    addSceneRelation(scene, rel1);
    expect(scene.relations).toBeUndefined();
  });

  it('ignores duplicate id', () => {
    const scene = makeScene({ relations: [rel1] });
    const next = addSceneRelation(scene, { ...rel1, type: 'contains' });
    expect(next.relations).toHaveLength(1);
    expect(next.relations![0].type).toBe('placed_on'); // original preserved
  });
});

describe('removeSceneRelation', () => {
  it('removes by id', () => {
    const scene = makeScene({ relations: [rel1, rel2] });
    const next = removeSceneRelation(scene, 'r1');
    expect(next.relations).toHaveLength(1);
    expect(next.relations![0].id).toBe('r2');
  });

  it('does not mutate original', () => {
    const scene = makeScene({ relations: [rel1] });
    removeSceneRelation(scene, 'r1');
    expect(scene.relations).toHaveLength(1);
  });

  it('works when relations is undefined', () => {
    const scene = makeScene();
    const next = removeSceneRelation(scene, 'r1');
    expect(next.relations).toEqual([]);
  });
});

describe('updateSceneRelation', () => {
  it('patches a relation', () => {
    const scene = makeScene({ relations: [rel1] });
    const next = updateSceneRelation(scene, 'r1', { label: 'on desk' });
    expect(next.relations![0].label).toBe('on desk');
    expect(next.relations![0].type).toBe('placed_on'); // unchanged
  });

  it('does not mutate original', () => {
    const scene = makeScene({ relations: [rel1] });
    updateSceneRelation(scene, 'r1', { label: 'test' });
    expect(scene.relations![0].label).toBeUndefined();
  });
});
