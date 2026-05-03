import { z } from 'zod';
import type { Project } from '@/shared/types';

/**
 * Zod schema for validating imported .crs project files.
 * Only validates structural integrity — does not enforce business rules.
 *
 * Note: Zod 4 requires full values (or factory functions) for .default() on
 * objects, so nested object defaults use explicit factory functions.
 */

const ComponentSpatialSchema = z.object({
  z: z.number().optional(),
  elevation: z.number().optional(),
  depth: z.number().optional(),
  objectHeight: z.number().optional(),
  mountType: z.enum(['floor', 'wall', 'ceiling', 'desktop', 'rack']).optional(),
  layer: z.string().optional(),
  supportsChildren: z.boolean().optional(),
  parentId: z.string().optional(),
}).optional();

const ComponentPropertiesSchema = z.object({
  brand: z.string().default(''),
  model: z.string().default(''),
  interfaces: z.array(z.string()).default([]),
  power: z.number().default(0),
  price: z.number().default(0),
  quantity: z.number().default(1),
  remark: z.string().default(''),
  customFields: z.record(z.string(), z.string()).default(() => ({})),
});

const SceneComponentSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  rotation: z.number().default(0),
  scale: z.object({ x: z.number(), y: z.number() }).default({ x: 1, y: 1 }),
  elevation: z.number().default(0),
  zIndex: z.number().default(0),
  name: z.string().default(''),
  properties: ComponentPropertiesSchema.default(() => ({
    brand: '',
    model: '',
    interfaces: [],
    power: 0,
    price: 0,
    quantity: 1,
    remark: '',
    customFields: {},
  })),
  visible: z.boolean().default(true),
  locked: z.boolean().default(false),
  opacity: z.number().default(1),
  groupId: z.string().nullable().default(null),
  topologyPosition: z.object({ x: z.number(), y: z.number() }).optional(),
  spatial: ComponentSpatialSchema,
});

const ConnectionStyleSchema = z.object({
  color: z.string().default(''),
  dashArray: z.string().default(''),
  lineWidth: z.number().default(2),
  animated: z.boolean().default(true),
});

const ConnectionSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  type: z.string().default('network'),
  label: z.string().default(''),
  bandwidth: z.string().default(''),
  protocol: z.string().default(''),
  style: ConnectionStyleSchema.default(() => ({
    color: '',
    dashArray: '',
    lineWidth: 2,
    animated: true,
  })),
});

const ExternalNodeSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  type: z.string().default('external'),
  icon: z.string().default(''),
  position: z.object({ x: z.number(), y: z.number() }).default({ x: 0, y: 0 }),
  description: z.string().default(''),
});

const DoorWindowSchema = z.object({
  id: z.string(),
  type: z.enum(['door', 'window']),
  wall: z.enum(['north', 'south', 'east', 'west']),
  position: z.number(),
  width: z.number(),
  height: z.number(),
});

const RoomSchema = z.object({
  width: z.number(),
  height: z.number(),
  ceilingHeight: z.number().default(3200),
  wallThickness: z.number().default(240),
  doors: z.array(DoorWindowSchema).default([]),
  windows: z.array(DoorWindowSchema).default([]),
  floorColor: z.string().default('#F1F5F9'),
  wallColor: z.string().default('#E2E8F0'),
});

const ViewStateSchema = z.object({
  activeView: z.string().default('2d'),
  canvas2d: z
    .object({
      panX: z.number().default(0),
      panY: z.number().default(0),
      zoom: z.number().default(1),
      showGrid: z.boolean().default(true),
      gridSize: z.number().default(500),
      snapToGrid: z.boolean().default(true),
    })
    .default(() => ({ panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true })),
  topology: z
    .object({
      layout: z.string().default('hierarchical'),
      filterTypes: z.array(z.string()).default(['network', 'av', 'control', 'power']),
      highlightedNodeId: z.string().nullable().default(null),
      lineStyle: z.string().default('bezier'),
    })
    .default(() => ({
      layout: 'hierarchical',
      filterTypes: ['network', 'av', 'control', 'power'],
      highlightedNodeId: null,
      lineStyle: 'bezier',
    })),
  selectedIds: z.array(z.string()).default([]),
});

const PresentationStepSchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  description: z.string().default(''),
  highlightComponentIds: z.array(z.string()).default([]),
  highlightConnectionIds: z.array(z.string()).default([]),
  view: z.string().default('2d'),
  camera: z
    .object({
      panX: z.number().default(0),
      panY: z.number().default(0),
      zoom: z.number().default(1),
    })
    .default(() => ({ panX: 0, panY: 0, zoom: 1 })),
});

const SceneSchema = z.object({
  id: z.string(),
  room: RoomSchema,
  components: z.array(SceneComponentSchema).default([]),
  connections: z.array(ConnectionSchema).default([]),
  externalNodes: z.array(ExternalNodeSchema).default([]),
  viewState: ViewStateSchema.default(() => ({
    activeView: '2d',
    canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true },
    topology: {
      layout: 'hierarchical',
      filterTypes: ['network', 'av', 'control', 'power'],
      highlightedNodeId: null,
      lineStyle: 'bezier',
    },
    selectedIds: [],
  })),
});

const ProjectMetadataSchema = z.object({
  customer: z.string().default(''),
  school: z.string().default(''),
  author: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

const SchemeVersionSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  description: z.string().default(''),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
  scene: SceneSchema,
  presentationSteps: z.array(PresentationStepSchema).default([]),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().default(''),
  schemaVersion: z.string().default('1.0.0'),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
  thumbnail: z.string().default(''),
  activeSchemeId: z.string().default(''),
  schemes: z.array(SchemeVersionSchema).min(1, 'Project must have at least one scheme'),
  metadata: ProjectMetadataSchema.default(() => ({ customer: '', school: '', author: '', tags: [] })),
});

/**
 * Validate and parse a raw JSON object as a Project.
 * Returns { success: true, data } on success, or { success: false, error } on failure.
 *
 * The zod schema uses loose types (e.g. z.string() instead of z.enum()) for
 * lenient import validation. The cast to Project is safe because the schema
 * enforces the same structural shape as the Project interface.
 */
export function validateProjectFile(
  raw: unknown,
): { success: true; data: Project } | { success: false; error: string } {
  const result = ProjectSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data as Project };
  }
  const firstIssue = result.error.issues[0];
  const path = firstIssue.path.join('.');
  return {
    success: false,
    error: `${path ? path + ': ' : ''}${firstIssue.message}`,
  };
}
