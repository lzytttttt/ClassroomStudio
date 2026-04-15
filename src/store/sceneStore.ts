import { create } from 'zustand';
import { temporal } from 'zundo';
import type { Scene, SceneComponent, ComponentProperties, Connection, ViewState, Room } from '@/shared/types';
import type { ViewMode } from '@/shared/types/constants';
import { generateId } from '@/shared/utils/id';
import { getAssetById } from '@/features/component-library/assets-data';

// ==================== Default Values ====================

const defaultRoom: Room = {
  width: 12000,    // 12m
  height: 9000,    // 9m
  ceilingHeight: 3200,
  wallThickness: 240,
  doors: [],
  windows: [],
  floorColor: '#F1F5F9',
  wallColor: '#E2E8F0',
};

const defaultViewState: ViewState = {
  activeView: '2d',
  canvas2d: {
    panX: 0,
    panY: 0,
    zoom: 1,
    showGrid: true,
    gridSize: 500, // 500mm = 0.5m grid
    snapToGrid: true,
  },
  topology: {
    layout: 'hierarchical',
    filterTypes: ['network', 'av', 'control', 'power'],
    highlightedNodeId: null,
    lineStyle: 'bezier',
  },
  selectedIds: [],
};

export const createDefaultScene = (): Scene => ({
  id: generateId(),
  room: { ...defaultRoom },
  components: [],
  connections: [],
  externalNodes: [],
  viewState: { ...defaultViewState },
});

// ==================== Store Interface ====================

interface SceneState {
  scene: Scene;
  clipboard: SceneComponent[];

  // Scene actions
  setScene: (scene: Scene) => void;
  resetScene: () => void;

  // Room actions
  updateRoom: (room: Partial<Room>) => void;

  // Component actions
  addComponent: (assetId: string, x: number, y: number) => void;
  updateComponent: (id: string, updates: Partial<Omit<SceneComponent, 'properties'>> & { properties?: Partial<ComponentProperties> }) => void;
  updateComponentsByAssetId: (assetId: string, updates: Partial<Omit<SceneComponent, 'properties'>> & { properties?: Partial<ComponentProperties> }) => void;
  removeComponents: (ids: string[]) => void;
  duplicateComponents: (ids: string[]) => void;

  // Selection
  selectComponents: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Clipboard
  copySelected: () => void;
  pasteClipboard: () => void;

  // View
  setActiveView: (view: ViewMode) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;

  // Connection actions
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;

  // Helpers
  getSelectedComponents: () => SceneComponent[];
}

export const useSceneStore = create<SceneState>()(temporal((set, get) => ({
  scene: createDefaultScene(),
  clipboard: [],

  setScene: (scene) => set({ scene }),
  resetScene: () => set({ scene: createDefaultScene() }),

  updateRoom: (roomUpdates) => set((state) => ({
    scene: {
      ...state.scene,
      room: { ...state.scene.room, ...roomUpdates },
    },
  })),

  addComponent: (assetId, x, y) => {
    const asset = getAssetById(assetId);
    if (!asset) return;

    const component: SceneComponent = {
      id: generateId(),
      assetId,
      position: { x, y },
      rotation: 0,
      scale: { x: 1, y: 1 },
      elevation: 0,
      zIndex: get().scene.components.length,
      name: asset.name,
      properties: {
        brand: asset.defaultProperties.brand || '',
        model: asset.defaultProperties.model || '',
        interfaces: asset.defaultProperties.interfaces || [],
        power: asset.defaultProperties.power || 0,
        price: asset.defaultProperties.price || 0,
        quantity: 1,
        remark: '',
        customFields: {},
      },
      visible: true,
      locked: false,
      opacity: 1,
      groupId: null,
    };

    set((state) => ({
      scene: {
        ...state.scene,
        components: [...state.scene.components, component],
        viewState: {
          ...state.scene.viewState,
          selectedIds: [component.id],
        },
      },
    }));
  },

  updateComponent: (id, updates) => set((state) => ({
    scene: {
      ...state.scene,
      components: state.scene.components.map((c) => {
        if (c.id === id) {
          const mergedProperties = updates.properties 
            ? { ...c.properties, ...updates.properties } 
            : c.properties;
          return { ...c, ...updates, properties: mergedProperties };
        }
        return c;
      }),
    },
  })),

  updateComponentsByAssetId: (assetId, updates) => set((state) => ({
    scene: {
      ...state.scene,
      components: state.scene.components.map((c) => {
        if (c.assetId === assetId) {
          const mergedProperties = updates.properties 
            ? { ...c.properties, ...updates.properties } 
            : c.properties;
          return { ...c, ...updates, properties: mergedProperties };
        }
        return c;
      }),
    },
  })),

  removeComponents: (ids) => set((state) => ({
    scene: {
      ...state.scene,
      components: state.scene.components.filter((c) => !ids.includes(c.id)),
      connections: state.scene.connections.filter(
        (conn) => !ids.includes(conn.sourceId) && !ids.includes(conn.targetId)
      ),
      viewState: {
        ...state.scene.viewState,
        selectedIds: state.scene.viewState.selectedIds.filter((id) => !ids.includes(id)),
      },
    },
  })),

  duplicateComponents: (ids) => {
    const { scene } = get();
    const toDuplicate = scene.components.filter((c) => ids.includes(c.id));
    const newComponents = toDuplicate.map((c) => ({
      ...c,
      id: generateId(),
      position: { x: c.position.x + 200, y: c.position.y + 200 },
      zIndex: scene.components.length + 1,
    }));

    set((state) => ({
      scene: {
        ...state.scene,
        components: [...state.scene.components, ...newComponents],
        viewState: {
          ...state.scene.viewState,
          selectedIds: newComponents.map((c) => c.id),
        },
      },
    }));
  },

  selectComponents: (ids) => set((state) => ({
    scene: {
      ...state.scene,
      viewState: { ...state.scene.viewState, selectedIds: ids },
    },
  })),

  addToSelection: (id) => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        selectedIds: state.scene.viewState.selectedIds.includes(id)
          ? state.scene.viewState.selectedIds.filter((i) => i !== id)
          : [...state.scene.viewState.selectedIds, id],
      },
    },
  })),

  clearSelection: () => set((state) => ({
    scene: {
      ...state.scene,
      viewState: { ...state.scene.viewState, selectedIds: [] },
    },
  })),

  selectAll: () => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        selectedIds: state.scene.components.map((c) => c.id),
      },
    },
  })),

  copySelected: () => {
    const { scene } = get();
    const selected = scene.components.filter((c) =>
      scene.viewState.selectedIds.includes(c.id)
    );
    set({ clipboard: selected });
  },

  pasteClipboard: () => {
    const { clipboard, scene } = get();
    if (clipboard.length === 0) return;

    const newComponents = clipboard.map((c) => ({
      ...c,
      id: generateId(),
      position: { x: c.position.x + 200, y: c.position.y + 200 },
      zIndex: scene.components.length + 1,
    }));

    set((state) => ({
      scene: {
        ...state.scene,
        components: [...state.scene.components, ...newComponents],
        viewState: {
          ...state.scene.viewState,
          selectedIds: newComponents.map((c) => c.id),
        },
      },
    }));
  },

  setActiveView: (view) => set((state) => ({
    scene: {
      ...state.scene,
      viewState: { ...state.scene.viewState, activeView: view },
    },
  })),

  setZoom: (zoom) => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        canvas2d: { ...state.scene.viewState.canvas2d, zoom: Math.max(0.1, Math.min(3, zoom)) },
      },
    },
  })),

  setPan: (panX, panY) => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        canvas2d: { ...state.scene.viewState.canvas2d, panX, panY },
      },
    },
  })),

  toggleGrid: () => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        canvas2d: {
          ...state.scene.viewState.canvas2d,
          showGrid: !state.scene.viewState.canvas2d.showGrid,
        },
      },
    },
  })),

  toggleSnap: () => set((state) => ({
    scene: {
      ...state.scene,
      viewState: {
        ...state.scene.viewState,
        canvas2d: {
          ...state.scene.viewState.canvas2d,
          snapToGrid: !state.scene.viewState.canvas2d.snapToGrid,
        },
      },
    },
  })),

  addConnection: (connection) => set((state) => ({
    scene: {
      ...state.scene,
      connections: [...state.scene.connections, connection],
    },
  })),

  removeConnection: (id) => set((state) => ({
    scene: {
      ...state.scene,
      connections: state.scene.connections.filter((c) => c.id !== id),
    },
  })),

  getSelectedComponents: () => {
    const { scene } = get();
    return scene.components.filter((c) =>
      scene.viewState.selectedIds.includes(c.id)
    );
  },
}), {
  partialize: (state) => ({ scene: state.scene }),
  limit: 50,
}));
