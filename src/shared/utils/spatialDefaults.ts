import type { Asset, SceneComponent, ComponentSpatial } from '@/shared/types';

/**
 * Conservative default spatial values for a new component.
 * mountType defaults to 'floor' for all assets unless overridden.
 *
 * Note: parentId is intentionally omitted — full relation model deferred.
 */
export function getDefaultSpatialForAsset(asset?: Asset): ComponentSpatial {
  return {
    mountType: 'floor',
    depth: asset?.defaultSize.depth,
    objectHeight: 0,
    z: 0,
    layer: '',
    supportsChildren: false,
  };
}

/**
 * Resolve effective spatial values with fallbacks.
 * Top-level elevation is the primary source; spatial.elevation is a future migration slot.
 */
export function getComponentSpatial(comp: SceneComponent): Required<Omit<ComponentSpatial, 'parentId'>> {
  return {
    z: comp.spatial?.z ?? comp.zIndex,
    elevation: comp.elevation,
    depth: comp.spatial?.depth ?? 0,
    objectHeight: comp.spatial?.objectHeight ?? 0,
    mountType: comp.spatial?.mountType ?? 'floor',
    layer: comp.spatial?.layer ?? '',
    supportsChildren: comp.spatial?.supportsChildren ?? false,
  };
}
