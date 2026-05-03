import { create } from 'zustand';
import { temporal } from 'zundo';
import type { Scene, SceneComponent, ComponentProperties, Connection, ViewState, Room } from '@/shared/types';
import type { ViewMode } from '@/shared/types/constants';
import { generateId } from '@/shared/utils/id';
import { getDefaultSpatialForAsset } from '@/shared/utils/spatialDefaults';
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

  // Layer actions
  bringToFront: (ids: string[]) => void;
  sendToBack: (ids: string[]) => void;
  bringForward: (ids: string[]) => void;
  sendBackward: (ids: string[]) => void;

  // Group actions
  groupSelected: () => void;
  ungroupSelected: () => void;

  // Alignment & Distribution (operate on selectedIds)
  alignComponents: (direction: 'left' | 'right' | 'top' | 'bottom' | 'centerH' | 'centerV') => void;
  distributeComponents: (axis: 'horizontal' | 'vertical') => void;

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
      spatial: getDefaultSpatialForAsset(asset),
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

  // ==================== Layer Actions ====================

  bringToFront: (ids) => set((state) => {
    const maxZ = Math.max(...state.scene.components.map(c => c.zIndex), 0);
    return {
      scene: {
        ...state.scene,
        components: state.scene.components.map((c, i) =>
          ids.includes(c.id) ? { ...c, zIndex: maxZ + 1 + ids.indexOf(c.id) } : c
        ),
      },
    };
  }),

  sendToBack: (ids) => set((state) => {
    const minZ = Math.min(...state.scene.components.map(c => c.zIndex), 0);
    return {
      scene: {
        ...state.scene,
        components: state.scene.components.map((c) =>
          ids.includes(c.id) ? { ...c, zIndex: minZ - 1 - ids.indexOf(c.id) } : c
        ),
      },
    };
  }),

  bringForward: (ids) => set((state) => ({
    scene: {
      ...state.scene,
      components: state.scene.components.map((c) =>
        ids.includes(c.id) ? { ...c, zIndex: c.zIndex + 1 } : c
      ),
    },
  })),

  sendBackward: (ids) => set((state) => ({
    scene: {
      ...state.scene,
      components: state.scene.components.map((c) =>
        ids.includes(c.id) ? { ...c, zIndex: Math.max(0, c.zIndex - 1) } : c
      ),
    },
  })),

  // ==================== Group Actions ====================

  groupSelected: () => {
    const { scene } = get();
    const ids = scene.viewState.selectedIds;
    if (ids.length < 2) return;
    const groupId = generateId();
    set((state) => ({
      scene: {
        ...state.scene,
        components: state.scene.components.map((c) =>
          ids.includes(c.id) ? { ...c, groupId } : c
        ),
      },
    }));
  },

  ungroupSelected: () => {
    const { scene } = get();
    const ids = scene.viewState.selectedIds;
    set((state) => ({
      scene: {
        ...state.scene,
        components: state.scene.components.map((c) =>
          ids.includes(c.id) ? { ...c, groupId: null } : c
        ),
      },
    }));
  },

  // ==================== Alignment & Distribution ====================

  alignComponents: (direction) => {
    const { scene } = get();
    const ids = scene.viewState.selectedIds;
    if (ids.length < 2) return;

    const selected = scene.components.filter(c => ids.includes(c.id));
    const getW = (c: SceneComponent) => {
      const a = getAssetById(c.assetId);
      return a ? a.defaultSize.width * c.scale.x : 600;
    };
    const getH = (c: SceneComponent) => {
      const a = getAssetById(c.assetId);
      return a ? a.defaultSize.height * c.scale.y : 400;
    };

    let targetValue: number;
    switch (direction) {
      case 'left':   targetValue = Math.min(...selected.map(c => c.position.x)); break;
      case 'right':  targetValue = Math.max(...selected.map(c => c.position.x + getW(c))); break;
      case 'top':    targetValue = Math.min(...selected.map(c => c.position.y)); break;
      case 'bottom': targetValue = Math.max(...selected.map(c => c.position.y + getH(c))); break;
      case 'centerH': targetValue = selected.reduce((s, c) => s + c.position.x + getW(c) / 2, 0) / selected.length; break;
      case 'centerV': targetValue = selected.reduce((s, c) => s + c.position.y + getH(c) / 2, 0) / selected.length; break;
    }

    set((state) => ({
      scene: {
        ...state.scene,
        components: state.scene.components.map((c) => {
          if (!ids.includes(c.id)) return c;
          switch (direction) {
            case 'left':    return { ...c, position: { ...c.position, x: targetValue } };
            case 'right':   return { ...c, position: { ...c.position, x: targetValue - getW(c) } };
            case 'top':     return { ...c, position: { ...c.position, y: targetValue } };
            case 'bottom':  return { ...c, position: { ...c.position, y: targetValue - getH(c) } };
            case 'centerH': return { ...c, position: { ...c.position, x: targetValue - getW(c) / 2 } };
            case 'centerV': return { ...c, position: { ...c.position, y: targetValue - getH(c) / 2 } };
            default: return c;
          }
        }),
      },
    }));
  },

  distributeComponents: (axis) => {
    const { scene } = get();
    const ids = scene.viewState.selectedIds;
    if (ids.length < 3) return;

    const selected = scene.components
      .filter(c => ids.includes(c.id))
      .sort((a, b) => axis === 'horizontal' ? a.position.x - b.position.x : a.position.y - b.position.y);

    const getSize = (c: SceneComponent) => {
      const a = getAssetById(c.assetId);
      return axis === 'horizontal'
        ? (a ? a.defaultSize.width * c.scale.x : 600)
        : (a ? a.defaultSize.height * c.scale.y : 400);
    };

    const first = selected[0];
    const last = selected[selected.length - 1];
    const prop = axis === 'horizontal' ? 'x' : 'y';
    const totalSpan = (last.position[prop] + getSize(last)) - first.position[prop];
    const totalSizes = selected.reduce((s, c) => s + getSize(c), 0);
    const gap = (totalSpan - totalSizes) / (selected.length - 1);

    let cursor = first.position[prop];
    const posMap = new Map<string, number>();
    selected.forEach(c => {
      posMap.set(c.id, cursor);
      cursor += getSize(c) + gap;
    });

    set((state) => ({
      scene: {
        ...state.scene,
        components: state.scene.components.map(c => {
          const newPos = posMap.get(c.id);
          if (newPos === undefined) return c;
          return {
            ...c,
            position: { ...c.position, [prop]: newPos },
          };
        }),
      },
    }));
  },
}), {
  partialize: (state) => ({ scene: state.scene }),
  limit: 50,
}));
