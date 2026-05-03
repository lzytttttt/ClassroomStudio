import type { SceneRelationType } from './index';

// ==================== Interaction Triggers ====================

export type InteractionTriggerType =
  | 'select'
  | 'click'
  | 'hover'
  | 'status_change'
  | 'mode_change';

export interface InteractionTrigger {
  type: InteractionTriggerType;
  source?: 'component' | 'scene' | 'view' | 'system';
}

// ==================== Runtime Status ====================

export type ComponentRuntimeStatus =
  | 'normal'
  | 'active'
  | 'disabled'
  | 'warning'
  | 'error'
  | 'offline';

export interface ComponentInteractionState {
  componentId: string;
  status: ComponentRuntimeStatus;
  visible?: boolean;
  note?: string;
}

// ==================== Visual Effects ====================

export type InteractionEffectType =
  | 'highlight_components'
  | 'show_relation_badges'
  | 'show_coverage_area'
  | 'show_status_badge'
  | 'show_relation_summary';

export interface InteractionVisualEffect {
  id: string;
  type: InteractionEffectType;
  targetComponentIds: string[];
  style?: {
    color?: string;
    label?: string;
    dashed?: boolean;
    opacity?: number;
  };
  payload?: Record<string, unknown>;
}

// ==================== Effect Definitions ====================

export interface InteractionEffectDefinition {
  type: InteractionEffectType;
  relationTypes?: SceneRelationType[];
  target?: 'self' | 'related' | 'source' | 'target';
  style?: {
    color?: string;
    label?: string;
    dashed?: boolean;
    opacity?: number;
  };
}

export interface InteractionDefinition {
  id: string;
  name: string;
  description?: string;
  trigger: InteractionTrigger;
  effects: InteractionEffectDefinition[];
  enabled?: boolean;
}
