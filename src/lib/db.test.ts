import { describe, it, expect } from 'vitest';
import { prepareProjectForSave } from './db';
import type { Project } from '@/shared/types';

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'proj-1',
    name: 'Test',
    description: '',
    schemaVersion: '1.0.0',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    thumbnail: '',
    activeSchemeId: 'scheme-1',
    schemes: [
      {
        id: 'scheme-1',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: '',
        scene: {
          id: 'scene-1',
          room: {
            width: 9000,
            height: 7000,
            ceilingHeight: 3200,
            wallThickness: 240,
            doors: [],
            windows: [],
            floorColor: '#F1F5F9',
            wallColor: '#E2E8F0',
          },
          components: [],
          connections: [],
          externalNodes: [],
          viewState: {
            activeView: '2d',
            canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true },
            topology: {
              layout: 'hierarchical',
              filterTypes: ['network', 'av', 'control', 'power'],
              highlightedNodeId: null,
              lineStyle: 'bezier',
            },
            selectedIds: [],
          },
        },
        presentationSteps: [],
      },
    ],
    metadata: { customer: '', school: '', author: '', tags: [] },
    ...overrides,
  };
}

describe('prepareProjectForSave', () => {
  it('returns a new object (does not mutate input)', () => {
    const original = makeProject();
    const result = prepareProjectForSave(original);
    expect(result).not.toBe(original);
  });

  it('updates updatedAt to a recent timestamp', () => {
    const before = new Date().toISOString();
    const result = prepareProjectForSave(makeProject());
    const after = new Date().toISOString();
    expect(result.updatedAt >= before).toBe(true);
    expect(result.updatedAt <= after).toBe(true);
  });

  it('does not modify the original updatedAt', () => {
    const original = makeProject({ updatedAt: '2020-01-01T00:00:00.000Z' });
    prepareProjectForSave(original);
    expect(original.updatedAt).toBe('2020-01-01T00:00:00.000Z');
  });

  it('preserves all other fields', () => {
    const original = makeProject();
    const result = prepareProjectForSave(original);
    expect(result.id).toBe(original.id);
    expect(result.name).toBe(original.name);
    expect(result.schemes).toBe(original.schemes);
    expect(result.metadata).toBe(original.metadata);
  });

  it('does not mutate nested objects in the original', () => {
    const original = makeProject();
    const originalSchemes = original.schemes;
    prepareProjectForSave(original);
    expect(original.schemes).toBe(originalSchemes);
  });
});
