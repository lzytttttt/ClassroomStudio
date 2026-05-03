import type { Scene, SceneRelation } from '@/shared/types';

/** Get all relations where the given component is source or target. */
export function getRelationsForComponent(scene: Scene, componentId: string): SceneRelation[] {
  const relations = scene.relations ?? [];
  return relations.filter(r => r.sourceId === componentId || r.targetId === componentId);
}

/** Get all component IDs related to the given component (deduplicated). */
export function getRelatedComponentIds(scene: Scene, componentId: string): string[] {
  const relations = getRelationsForComponent(scene, componentId);
  const ids = new Set<string>();
  for (const r of relations) {
    if (r.sourceId !== componentId) ids.add(r.sourceId);
    if (r.targetId !== componentId) ids.add(r.targetId);
  }
  return [...ids];
}

/** Add a relation. Returns a new scene; ignores duplicate ids. */
export function addSceneRelation(scene: Scene, relation: SceneRelation): Scene {
  const existing = scene.relations ?? [];
  if (existing.some(r => r.id === relation.id)) return scene;
  return { ...scene, relations: [...existing, relation] };
}

/** Remove a relation by id. Returns a new scene. */
export function removeSceneRelation(scene: Scene, relationId: string): Scene {
  const existing = scene.relations ?? [];
  return { ...scene, relations: existing.filter(r => r.id !== relationId) };
}

/** Update a relation by id with a partial patch. Returns a new scene. */
export function updateSceneRelation(scene: Scene, relationId: string, patch: Partial<Omit<SceneRelation, 'id'>>): Scene {
  const existing = scene.relations ?? [];
  return {
    ...scene,
    relations: existing.map(r => r.id === relationId ? { ...r, ...patch } : r),
  };
}
