import { describe, it, expect } from 'vitest';
import { getDefaultSpatialForAsset, getComponentSpatial } from './spatialDefaults';
import type { Asset, SceneComponent } from '@/shared/types';

function makeAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    id: 'asset-1',
    name: 'Test Asset',
    category: 'furniture',
    subcategory: '桌子',
    defaultProperties: {},
    icon2d: 'desk',
    color: '#64748B',
    defaultSize: { width: 600, height: 400, depth: 750 },
    isBuiltin: true,
    tags: [],
    ...overrides,
  };
}

function makeComponent(overrides: Partial<SceneComponent> = {}): SceneComponent {
  return {
    id: 'comp-1',
    assetId: 'asset-1',
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1 },
    elevation: 0,
    zIndex: 0,
    name: 'Test',
    properties: {
      brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {},
    },
    visible: true,
    locked: false,
    opacity: 1,
    groupId: null,
    ...overrides,
  };
}

describe('getDefaultSpatialForAsset', () => {
  it('returns mountType floor by default', () => {
    const sp = getDefaultSpatialForAsset(makeAsset());
    expect(sp.mountType).toBe('floor');
  });

  it('picks up asset.defaultSize.depth', () => {
    const sp = getDefaultSpatialForAsset(makeAsset({ defaultSize: { width: 100, height: 100, depth: 999 } }));
    expect(sp.depth).toBe(999);
  });

  it('returns conservative defaults when no asset provided', () => {
    const sp = getDefaultSpatialForAsset(undefined);
    expect(sp.mountType).toBe('floor');
    expect(sp.depth).toBeUndefined();
    expect(sp.objectHeight).toBe(0);
    expect(sp.supportsChildren).toBe(false);
  });

  it('does not set parentId', () => {
    const sp = getDefaultSpatialForAsset(makeAsset());
    expect(sp.parentId).toBeUndefined();
  });
});

describe('getComponentSpatial', () => {
  it('falls back to top-level elevation', () => {
    const comp = makeComponent({ elevation: 2500 });
    const sp = getComponentSpatial(comp);
    expect(sp.elevation).toBe(2500);
  });

  it('uses comp.elevation even when spatial.elevation exists', () => {
    const comp = makeComponent({ elevation: 2500, spatial: { elevation: 999 } });
    const sp = getComponentSpatial(comp);
    expect(sp.elevation).toBe(2500);
  });

  it('falls back to zIndex when spatial.z is absent', () => {
    const comp = makeComponent({ zIndex: 5 });
    const sp = getComponentSpatial(comp);
    expect(sp.z).toBe(5);
  });

  it('prefers spatial.z over zIndex', () => {
    const comp = makeComponent({ zIndex: 5, spatial: { z: 3.7 } });
    const sp = getComponentSpatial(comp);
    expect(sp.z).toBeCloseTo(3.7);
  });

  it('returns floor mountType when spatial is undefined', () => {
    const comp = makeComponent();
    const sp = getComponentSpatial(comp);
    expect(sp.mountType).toBe('floor');
  });

  it('returns spatial mountType when present', () => {
    const comp = makeComponent({ spatial: { mountType: 'ceiling' } });
    const sp = getComponentSpatial(comp);
    expect(sp.mountType).toBe('ceiling');
  });

  it('defaults depth and objectHeight to 0 when spatial is undefined', () => {
    const comp = makeComponent();
    const sp = getComponentSpatial(comp);
    expect(sp.depth).toBe(0);
    expect(sp.objectHeight).toBe(0);
  });
});
