import { create } from 'zustand';

interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  isDraggingAsset: boolean;
  draggingAssetId: string | null;
  showRulers: boolean;
  showStatusBar: boolean;

  // Tool mode
  activeTool: 'select' | 'pan' | 'zoom' | 'connect';

  // Connection wiring state
  connectionSource: string | null;

  // Modal state
  activeModal: string | null;

  // Cross-view highlight (topology ↔ 2D linking)
  highlightedComponentId: string | null;

  // Toast notifications
  toasts: Toast[];

  // Actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setDraggingAsset: (assetId: string | null) => void;
  setActiveTool: (tool: 'select' | 'pan' | 'zoom' | 'connect') => void;
  setConnectionSource: (id: string | null) => void;
  setActiveModal: (modal: string | null) => void;
  setHighlightedComponent: (id: string | null) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

let toastId = 0;

export const useUIStore = create<UIState>()((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  isDraggingAsset: false,
  draggingAssetId: null,
  showRulers: false,
  showStatusBar: true,
  activeTool: 'select',
  connectionSource: null,
  activeModal: null,
  highlightedComponentId: null,
  toasts: [],

  toggleLeftSidebar: () => set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen })),
  toggleRightSidebar: () => set((s) => ({ rightSidebarOpen: !s.rightSidebarOpen })),
  setDraggingAsset: (assetId) => set({
    isDraggingAsset: assetId !== null,
    draggingAssetId: assetId,
  }),
  setActiveTool: (tool) => set({ activeTool: tool, connectionSource: null }),
  setConnectionSource: (id) => set({ connectionSource: id }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setHighlightedComponent: (id) => {
    set({ highlightedComponentId: id });
    // Auto-clear after 3s
    if (id) {
      setTimeout(() => set((s) => s.highlightedComponentId === id ? { highlightedComponentId: null } : {}), 3000);
    }
  },
  addToast: (toast) => {
    const id = `toast-${++toastId}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 3000);
  },
  removeToast: (id) => set((s) => ({
    toasts: s.toasts.filter((t) => t.id !== id),
  })),
}));
