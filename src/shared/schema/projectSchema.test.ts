import { describe, it, expect } from 'vitest';
import { validateProjectFile } from './projectSchema';

// Minimal valid project — only truly required fields
const MINIMAL_PROJECT = {
  id: 'proj-1',
  name: 'Test',
  schemes: [
    {
      id: 'scheme-1',
      scene: {
        id: 'scene-1',
        room: { width: 9000, height: 7000 },
      },
    },
  ],
};

describe('validateProjectFile', () => {
  // ── Acceptance ──

  it('accepts a minimal valid project', () => {
    const result = validateProjectFile(MINIMAL_PROJECT);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('proj-1');
      expect(result.data.name).toBe('Test');
      expect(result.data.schemes).toHaveLength(1);
    }
  });

  it('fills defaults for optional top-level fields', () => {
    const result = validateProjectFile(MINIMAL_PROJECT);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('');
      expect(result.data.schemaVersion).toBe('1.0.0');
      expect(result.data.activeSchemeId).toBe('');
      expect(result.data.thumbnail).toBe('');
      expect(result.data.metadata).toEqual({ customer: '', school: '', author: '', tags: [] });
    }
  });

  it('fills defaults for optional scene fields', () => {
    const result = validateProjectFile(MINIMAL_PROJECT);
    expect(result.success).toBe(true);
    if (result.success) {
      const scene = result.data.schemes[0].scene;
      expect(scene.components).toEqual([]);
      expect(scene.connections).toEqual([]);
      expect(scene.externalNodes).toEqual([]);
      expect(scene.viewState.activeView).toBe('2d');
    }
  });

  // ── Rejection: non-object / wrong type ──

  it('rejects null', () => {
    const result = validateProjectFile(null);
    expect(result.success).toBe(false);
  });

  it('rejects a string', () => {
    const result = validateProjectFile('not a project');
    expect(result.success).toBe(false);
  });

  it('rejects a number', () => {
    const result = validateProjectFile(42);
    expect(result.success).toBe(false);
  });

  it('rejects an empty object', () => {
    const result = validateProjectFile({});
    expect(result.success).toBe(false);
  });

  it('rejects an array', () => {
    const result = validateProjectFile([]);
    expect(result.success).toBe(false);
  });

  // ── Rejection: missing required fields ──

  it('rejects when id is missing', () => {
    const { id: _, ...noId } = MINIMAL_PROJECT;
    const result = validateProjectFile(noId);
    expect(result.success).toBe(false);
  });

  it('rejects when name is missing', () => {
    const { name: _, ...noName } = MINIMAL_PROJECT;
    const result = validateProjectFile(noName);
    expect(result.success).toBe(false);
  });

  it('rejects when schemes is missing', () => {
    const { schemes: _, ...noSchemes } = MINIMAL_PROJECT;
    const result = validateProjectFile(noSchemes);
    expect(result.success).toBe(false);
  });

  it('rejects when schemes is empty', () => {
    const result = validateProjectFile({ ...MINIMAL_PROJECT, schemes: [] });
    expect(result.success).toBe(false);
  });

  it('rejects when scheme id is missing', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    delete (project.schemes[0] as any).id;
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  // ── Rejection: missing scene.room ──

  it('rejects when scene.room is missing', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    delete (project.schemes[0].scene as any).room;
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  it('rejects when room.width is missing', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    delete (project.schemes[0].scene.room as any).width;
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  it('rejects when room.height is missing', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    delete (project.schemes[0].scene.room as any).height;
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  // ── Error message includes path ──

  it('includes field path in error message', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    delete (project.schemes[0].scene.room as any).width;
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('schemes');
      expect(result.error).toContain('room');
    }
  });

  // ── Spatial field (optional, backward-compatible) ──

  it('accepts components without spatial field (backward compat)', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).components = [
      { id: 'c1', assetId: 'a1', position: { x: 0, y: 0 } },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(true);
    if (result.success) {
      const comp = result.data.schemes[0].scene.components[0];
      expect(comp.spatial).toBeUndefined();
    }
  });

  it('accepts components with spatial field populated', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).components = [
      {
        id: 'c1', assetId: 'a1', position: { x: 0, y: 0 },
        spatial: { mountType: 'wall', objectHeight: 500, z: 1.5, layer: 'ceiling-dev' },
      },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(true);
    if (result.success) {
      const sp = result.data.schemes[0].scene.components[0].spatial!;
      expect(sp.mountType).toBe('wall');
      expect(sp.objectHeight).toBe(500);
      expect(sp.z).toBe(1.5);
      expect(sp.layer).toBe('ceiling-dev');
    }
  });

  it('rejects invalid mountType values', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).components = [
      { id: 'c1', assetId: 'a1', position: { x: 0, y: 0 }, spatial: { mountType: 'hover' } },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  // ── Relations field (optional, backward-compatible) ──

  it('accepts projects without relations (backward compat)', () => {
    const result = validateProjectFile(MINIMAL_PROJECT);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemes[0].scene.relations).toBeUndefined();
    }
  });

  it('accepts projects with valid relations', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).relations = [
      { id: 'r1', type: 'placed_on', sourceId: 'c1', targetId: 'c2' },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(true);
    if (result.success) {
      const rel = result.data.schemes[0].scene.relations![0];
      expect(rel.type).toBe('placed_on');
      expect(rel.sourceId).toBe('c1');
    }
  });

  it('rejects invalid relation type', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).relations = [
      { id: 'r1', type: 'invalid_type', sourceId: 'c1', targetId: 'c2' },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  it('rejects relation missing sourceId', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).relations = [
      { id: 'r1', type: 'controls', targetId: 'c2' },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });

  it('rejects relation missing targetId', () => {
    const project = structuredClone(MINIMAL_PROJECT);
    (project.schemes[0].scene as any).relations = [
      { id: 'r1', type: 'controls', sourceId: 'c1' },
    ];
    const result = validateProjectFile(project);
    expect(result.success).toBe(false);
  });
});
