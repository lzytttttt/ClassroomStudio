import { create } from 'zustand';
import type { Scene } from '@/shared/types';
import type {
  InteractionTrigger,
  InteractionVisualEffect,
  ComponentInteractionState,
  ComponentRuntimeStatus,
} from '@/shared/types/interaction';
import { resolveInteractionEffects } from '@/shared/utils/interactionEngine';

interface InteractionState {
  activeComponentId: string | null;
  activeTrigger: InteractionTrigger | null;
  activeEffects: InteractionVisualEffect[];
  componentStatuses: Map<string, ComponentInteractionState>;

  setActiveComponent: (id: string | null, scene: Scene) => void;
  clearInteraction: () => void;
  setComponentStatus: (componentId: string, status: ComponentRuntimeStatus, note?: string) => void;
  clearComponentStatus: (componentId: string) => void;
}

export const useInteractionStore = create<InteractionState>()((set, get) => ({
  activeComponentId: null,
  activeTrigger: null,
  activeEffects: [],
  componentStatuses: new Map(),

  setActiveComponent: (id, scene) => {
    if (!id) {
      set({ activeComponentId: null, activeTrigger: null, activeEffects: [] });
      return;
    }

    const trigger: InteractionTrigger = { type: 'select', source: 'component' };
    const effects = resolveInteractionEffects({
      scene,
      componentId: id,
      trigger,
      componentStatuses: get().componentStatuses,
    });

    set({
      activeComponentId: id,
      activeTrigger: trigger,
      activeEffects: effects,
    });
  },

  clearInteraction: () => {
    set({
      activeComponentId: null,
      activeTrigger: null,
      activeEffects: [],
    });
  },

  setComponentStatus: (componentId, status, note) => {
    set((state) => {
      const next = new Map(state.componentStatuses);
      next.set(componentId, { componentId, status, note });
      return { componentStatuses: next };
    });
  },

  clearComponentStatus: (componentId) => {
    set((state) => {
      const next = new Map(state.componentStatuses);
      next.delete(componentId);
      return { componentStatuses: next };
    });
  },
}));
