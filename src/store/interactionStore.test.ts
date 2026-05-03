import { describe, it, expect, beforeEach } from 'vitest';
import { useInteractionStore } from './interactionStore';
import type { Scene } from '@/shared/types';

function makeScene(overrides: Partial<Scene> = {}): Scene {
  return {
    id: 'scene-1',
    room: { width: 9000, height: 7000, ceilingHeight: 3200, wallThickness: 240, doors: [], windows: [], floorColor: '#F1F5F9', wallColor: '#E2E8F0' },
    components: [
      { id: 'c1', assetId: 'a1', position: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 0, name: 'Desk', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
      { id: 'c2', assetId: 'a2', position: { x: 100, y: 0 }, rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 1, name: 'Monitor', properties: { brand: '', model: '', interfaces: [], power: 0, price: 0, quantity: 1, remark: '', customFields: {} }, visible: true, locked: false, opacity: 1, groupId: null },
    ],
    connections: [],
    externalNodes: [],
    viewState: { activeView: '2d', canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true }, topology: { layout: 'hierarchical', filterTypes: [], highlightedNodeId: null, lineStyle: 'bezier' }, selectedIds: [] },
    ...overrides,
  };
}

describe('interactionStore', () => {
  beforeEach(() => {
    useInteractionStore.setState({
      activeComponentId: null,
      activeTrigger: null,
      activeEffects: [],
      componentStatuses: new Map(),
    });
  });

  it('setActiveComponent sets id and trigger', () => {
    const scene = makeScene();
    useInteractionStore.getState().setActiveComponent('c1', scene);
    const state = useInteractionStore.getState();
    expect(state.activeComponentId).toBe('c1');
    expect(state.activeTrigger).toEqual({ type: 'select', source: 'component' });
  });

  it('setActiveComponent with null clears state', () => {
    const scene = makeScene();
    useInteractionStore.getState().setActiveComponent('c1', scene);
    useInteractionStore.getState().setActiveComponent(null, scene);
    const state = useInteractionStore.getState();
    expect(state.activeComponentId).toBeNull();
    expect(state.activeEffects).toEqual([]);
  });

  it('clearInteraction resets all state', () => {
    const scene = makeScene();
    useInteractionStore.getState().setActiveComponent('c1', scene);
    useInteractionStore.getState().clearInteraction();
    const state = useInteractionStore.getState();
    expect(state.activeComponentId).toBeNull();
    expect(state.activeTrigger).toBeNull();
    expect(state.activeEffects).toEqual([]);
  });

  it('setComponentStatus updates status map', () => {
    useInteractionStore.getState().setComponentStatus('c1', 'warning', 'low signal');
    const state = useInteractionStore.getState();
    expect(state.componentStatuses.get('c1')).toEqual({
      componentId: 'c1',
      status: 'warning',
      note: 'low signal',
    });
  });

  it('clearComponentStatus removes status', () => {
    useInteractionStore.getState().setComponentStatus('c1', 'error');
    useInteractionStore.getState().clearComponentStatus('c1');
    expect(useInteractionStore.getState().componentStatuses.has('c1')).toBe(false);
  });

  it('runtime state does not affect Scene', () => {
    const scene = makeScene();
    const sceneBefore = JSON.stringify(scene);
    useInteractionStore.getState().setActiveComponent('c1', scene);
    useInteractionStore.getState().setComponentStatus('c2', 'offline');
    expect(JSON.stringify(scene)).toBe(sceneBefore);
  });
});
