import type {
  Scene,
  SceneComponent,
  SceneRelationType,
  Asset,
} from '@/shared/types';
import type {
  InteractionDefinition,
  InteractionTrigger,
  InteractionVisualEffect,
  ComponentInteractionState,
} from '@/shared/types/interaction';
import { getRelationsForComponent } from './sceneRelations';

// ==================== Relation Type Visual Style ====================

export interface RelationVisualStyle {
  color: string;
  label: string;
  dashed: boolean;
  opacity: number;
}

const RELATION_STYLE_MAP: Record<SceneRelationType, RelationVisualStyle> = {
  controls:   { color: '#3B82F6', label: '控制', dashed: false, opacity: 1 },
  depends_on: { color: '#F97316', label: '依赖', dashed: false, opacity: 1 },
  placed_on:  { color: '#22C55E', label: '放置', dashed: false, opacity: 1 },
  mounted_on: { color: '#A855F7', label: '安装', dashed: false, opacity: 1 },
  covers:     { color: '#06B6D4', label: '覆盖', dashed: false, opacity: 1 },
  contains:   { color: '#6B7280', label: '包含', dashed: true,  opacity: 1 },
};

export function getRelationTypeVisualStyle(type: SceneRelationType): RelationVisualStyle {
  return RELATION_STYLE_MAP[type];
}

// ==================== Default Interaction Definitions ====================

export function getDefaultInteractionDefinitions(): InteractionDefinition[] {
  return [
    {
      id: 'select-relation-highlight',
      name: '选中时高亮关联组件',
      description: '选中组件时，高亮所有有关系的组件',
      trigger: { type: 'select', source: 'component' },
      effects: [
        { type: 'highlight_components', target: 'related' },
      ],
    },
    {
      id: 'select-coverage-area',
      name: '选中时显示覆盖范围',
      description: '选中支持覆盖范围的组件时，显示覆盖区域',
      trigger: { type: 'select', source: 'component' },
      effects: [
        { type: 'show_coverage_area', target: 'self' },
      ],
    },
    {
      id: 'select-status-badge',
      name: '状态徽章',
      description: '组件有非 normal 状态时显示状态徽章',
      trigger: { type: 'status_change', source: 'component' },
      effects: [
        { type: 'show_status_badge', target: 'self' },
      ],
    },
    {
      id: 'select-relation-summary',
      name: '关系摘要',
      description: '在属性面板中展示当前组件的关系摘要',
      trigger: { type: 'select', source: 'component' },
      effects: [
        { type: 'show_relation_summary', target: 'self' },
      ],
    },
  ];
}

// ==================== Relation-Driven Effects ====================

export function getRelationDrivenEffects(
  scene: Scene,
  componentId: string,
): InteractionVisualEffect[] {
  const relations = getRelationsForComponent(scene, componentId);
  if (relations.length === 0) return [];

  const effects: InteractionVisualEffect[] = [];

  // Group related component IDs for a single highlight effect
  const relatedIds = new Set<string>();
  for (const rel of relations) {
    const otherId = rel.sourceId === componentId ? rel.targetId : rel.sourceId;
    relatedIds.add(otherId);
  }

  if (relatedIds.size > 0) {
    // Use the first relation's style as the highlight color (or amber fallback)
    const firstStyle = getRelationTypeVisualStyle(relations[0].type);
    effects.push({
      id: `highlight-related-${componentId}`,
      type: 'highlight_components',
      targetComponentIds: [...relatedIds],
      style: {
        color: firstStyle.color,
        dashed: firstStyle.dashed,
        opacity: 0.8,
      },
    });
  }

  // Per-relation badges (for PropertyPanel summary)
  for (const rel of relations) {
    const style = getRelationTypeVisualStyle(rel.type);
    const otherId = rel.sourceId === componentId ? rel.targetId : rel.sourceId;
    effects.push({
      id: `badge-${rel.id}`,
      type: 'show_relation_badges',
      targetComponentIds: [otherId],
      style: {
        color: style.color,
        label: style.label,
      },
      payload: {
        relationId: rel.id,
        relationType: rel.type,
        direction: rel.sourceId === componentId ? 'outgoing' : 'incoming',
      },
    });
  }

  return effects;
}

// ==================== Coverage Effect ====================

export function getCoverageEffectForComponent(
  component: SceneComponent,
  asset?: Asset,
): InteractionVisualEffect | null {
  const name = (asset?.name ?? component.name ?? '').toLowerCase();
  const icon = (asset?.icon2d ?? '').toLowerCase();

  // Microphone (check before AP since "无线麦克风" contains "无线")
  if (/mic|麦克|话筒|拾音/.test(name) || icon.includes('mic')) {
    return {
      id: `coverage-${component.id}`,
      type: 'show_coverage_area',
      targetComponentIds: [component.id],
      style: { color: '#22C55E', opacity: 0.08 },
      payload: { shape: 'circle', radius: 3000, unit: 'mm' },
    };
  }

  // AP / Wi-Fi
  if (/ap|wifi|无线|wi-fi/.test(name) || icon.includes('wifi') || icon.includes('ap')) {
    return {
      id: `coverage-${component.id}`,
      type: 'show_coverage_area',
      targetComponentIds: [component.id],
      style: { color: '#3B82F6', opacity: 0.08 },
      payload: { shape: 'circle', radius: 5000, unit: 'mm' },
    };
  }

  // Camera (sector payload, not rendered in v1)
  if (/camera|摄像|监控/.test(name) || icon.includes('camera')) {
    return {
      id: `coverage-${component.id}`,
      type: 'show_coverage_area',
      targetComponentIds: [component.id],
      style: { color: '#F97316', opacity: 0.08 },
      payload: { shape: 'sector', radius: 8000, angle: 120, unit: 'mm' },
    };
  }

  return null;
}

// ==================== Resolve All Effects ====================

interface ResolveParams {
  scene: Scene;
  componentId: string;
  trigger: InteractionTrigger;
  componentStatuses?: Map<string, ComponentInteractionState>;
}

export function resolveInteractionEffects(params: ResolveParams): InteractionVisualEffect[] {
  const { scene, componentId, trigger, componentStatuses } = params;
  const effects: InteractionVisualEffect[] = [];

  if (trigger.type === 'select' || trigger.type === 'click') {
    // Relation-driven highlights
    effects.push(...getRelationDrivenEffects(scene, componentId));

    // Coverage area for the selected component
    const comp = scene.components.find(c => c.id === componentId);
    if (comp) {
      const coverageEffect = getCoverageEffectForComponent(comp);
      if (coverageEffect) {
        effects.push(coverageEffect);
      }
    }
  }

  // Status badges
  if (componentStatuses) {
    for (const [, state] of componentStatuses) {
      if (state.status !== 'normal') {
        effects.push({
          id: `status-${state.componentId}`,
          type: 'show_status_badge',
          targetComponentIds: [state.componentId],
          style: {
            color: STATUS_COLOR_MAP[state.status] ?? '#6B7280',
            label: state.status,
          },
          payload: { status: state.status, note: state.note },
        });
      }
    }
  }

  return effects;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  active: '#22C55E',
  disabled: '#9CA3AF',
  warning: '#F59E0B',
  error: '#EF4444',
  offline: '#6B7280',
};
