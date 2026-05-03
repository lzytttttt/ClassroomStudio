import type { AssetCategory, ConnectionType, ExternalNodeType, ViewMode } from './constants';

export * from './interaction';

// ==================== 空间语义 ====================

export type MountType = 'floor' | 'wall' | 'ceiling' | 'desktop' | 'rack';

export interface ComponentSpatial {
  z?: number;                // 堆叠/渲染精细层级（浮点，区别于顶层 zIndex 粗粒度排序）
  elevation?: number;        // 离地高度 mm — 未来迁移预留，当前主字段为顶层 elevation
  depth?: number;            // 2.5D 视觉深度 mm（覆盖 Asset.defaultSize.depth）
  objectHeight?: number;     // 物体自身高度 mm（Z 轴尺寸，区别于 elevation 离地高度）
  mountType?: MountType;     // 安装方式
  layer?: string;            // 自定义图层标签
  supportsChildren?: boolean; // 是否可承载子组件（如桌面、机架）
  parentId?: string;         // 承载组件 ID（临时轻量字段，不替代未来 relations 模型）
}

// ==================== 场景关系 ====================

export type SceneRelationType =
  | 'placed_on'
  | 'mounted_on'
  | 'controls'
  | 'depends_on'
  | 'covers'
  | 'contains';

export interface SceneRelation {
  id: string;
  type: SceneRelationType;
  sourceId: string;
  targetId: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

// ==================== 项目层 ====================

export interface Project {
  id: string;
  name: string;
  description: string;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  activeSchemeId: string;
  schemes: SchemeVersion[];
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  customer: string;
  school: string;
  author: string;
  tags: string[];
}

// ==================== 方案版本层 ====================

export interface SchemeVersion {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  scene: Scene;
  presentationSteps: PresentationStep[];
}

// ==================== 场景层 ====================

export interface Scene {
  id: string;
  room: Room;
  components: SceneComponent[];
  connections: Connection[];
  externalNodes: ExternalNode[];
  viewState: ViewState;
  relations?: SceneRelation[];
}

// ==================== 教室空间 ====================

export interface Room {
  width: number;     // mm
  height: number;    // mm (depth)
  ceilingHeight: number;
  wallThickness: number;
  doors: DoorWindow[];
  windows: DoorWindow[];
  floorColor: string;
  wallColor: string;
}

export interface DoorWindow {
  id: string;
  type: 'door' | 'window';
  wall: 'north' | 'south' | 'east' | 'west';
  position: number;
  width: number;
  height: number;
}

// ==================== 组件实例 ====================

export interface SceneComponent {
  id: string;
  assetId: string;
  position: { x: number; y: number };
  rotation: number;
  scale: { x: number; y: number };
  elevation: number;
  zIndex: number;
  name: string;
  properties: ComponentProperties;
  visible: boolean;
  locked: boolean;
  opacity: number;
  groupId: string | null;
  topologyPosition?: { x: number; y: number };
  spatial?: ComponentSpatial;
}

export interface ComponentProperties {
  brand: string;
  model: string;
  interfaces: string[];
  power: number;
  price: number;
  quantity: number;
  remark: string;
  customFields: Record<string, string>;
}

// ==================== 组件库 Asset ====================

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  subcategory: string;
  defaultProperties: Partial<ComponentProperties>;
  icon2d: string;        // SVG string or path
  color: string;
  defaultSize: { width: number; height: number; depth: number };
  isBuiltin: boolean;
  tags: string[];
}

// ==================== 拓扑关系 ====================

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
  label: string;
  bandwidth: string;
  protocol: string;
  style: ConnectionStyle;
}

export interface ConnectionStyle {
  color: string;
  dashArray: string;
  lineWidth: number;
  animated: boolean;
}

// ==================== 外部节点 ====================

export interface ExternalNode {
  id: string;
  name: string;
  type: ExternalNodeType;
  icon: string;
  position: { x: number; y: number };
  description: string;
}

// ==================== 视图状态 ====================

export interface ViewState {
  activeView: ViewMode;
  canvas2d: {
    panX: number;
    panY: number;
    zoom: number;
    showGrid: boolean;
    gridSize: number;
    snapToGrid: boolean;
  };
  topology: {
    layout: 'hierarchical' | 'force' | 'manual';
    filterTypes: ConnectionType[];
    highlightedNodeId: string | null;
    lineStyle: 'bezier' | 'step';
  };
  selectedIds: string[];
}

// ==================== 演示模式 ====================

export interface PresentationStep {
  id: string;
  title: string;
  description: string;
  highlightComponentIds: string[];
  highlightConnectionIds: string[];
  view: ViewMode;
  camera: {
    panX: number;
    panY: number;
    zoom: number;
  };
}

// ==================== 模板 ====================

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  icon: string;
  scene: Scene;
  isBuiltin: boolean;
  componentCount: number;
}

// ==================== 合理性检查 ====================

export interface RuleCheckResult {
  id: string;
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedComponentIds: string[];
  suggestion: string;
}
