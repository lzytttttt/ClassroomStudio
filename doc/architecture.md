# 架构文档

> 最后更新: 2026-05-27
> 代码规模: ~51 个 TS/TSX 文件，约 6500 行

## 核心设计原则

**单一数据源，多视图消费**: 所有业务数据存储在 `Scene` 对象中，由 `sceneStore` 统一管理。2D/2.5D/拓扑/BOM 各视图仅负责渲染，不持有独立业务状态。

## 数据模型

```
Project
  ├── id, name, description, schemaVersion
  ├── metadata: { customer, school, author, tags }
  └── schemes: SchemeVersion[]
        └── SchemeVersion
              ├── id, name, description
              ├── presentationSteps: PresentationStep[]
              └── scene: Scene
                    ├── room: Room (尺寸、门窗、颜色)
                    ├── components: SceneComponent[] (设备实例)
                    ├── connections: Connection[] (连线)
                    ├── externalNodes: ExternalNode[] (外部节点)
                    ├── relations?: SceneRelation[] (组件关系)
                    └── viewState: ViewState (视图配置)
```

### 核心类型

| 类型 | 文件 | 说明 |
|------|------|------|
| `Scene` | `shared/types/index.ts` | 场景容器，持有所有业务数据 |
| `SceneComponent` | `shared/types/index.ts` | 设备实例 (位置、旋转、属性、空间语义) |
| `Asset` | `shared/types/index.ts` | 组件库中的设备模板定义 |
| `Connection` | `shared/types/index.ts` | 两个组件之间的连线 (类型、带宽、协议) |
| `ComponentSpatial` | `shared/types/index.ts` | 空间语义 (安装方式、高度、图层) |
| `SceneRelation` | `shared/types/index.ts` | 组件间关系 (放置、控制、依赖等) |
| `Room` | `shared/types/index.ts` | 教室空间定义 (尺寸、门窗) |

### Asset 与 SceneComponent 的关系

`Asset` 是模板，`SceneComponent` 是实例。通过 `assetId` 关联。实例化时，`Asset.defaultProperties` 被拷贝到 `SceneComponent.properties`，用户可独立修改。

## 目录结构

```
src/
├── App.tsx                     # 路由入口 (HomePage / EditorPage)
├── main.tsx                    # React 挂载点
├── engine/                     # 渲染引擎层
│   ├── canvas2d/               # 2D 编辑器 (Konva)
│   │   ├── Canvas2D.tsx        # 主组件 (画布 + 工具 + 渲染)
│   │   └── component-renderers.tsx  # 47 个设备的 2D 渲染函数
│   ├── canvas25d/              # 2.5D 等轴测视图 (SVG)
│   │   └── Canvas25D.tsx       # 只读视图，消费 scene 数据
│   └── topology/               # 拓扑信号流视图 (React Flow)
│       ├── TopologyView.tsx    # React Flow 容器 + scene 同步
│       ├── TopologyToolbar.tsx # 拓扑工具栏
│       ├── auto-wiring.ts      # 自动接线规则引擎 (纯函数)
│       ├── nodes/              # 自定义节点组件
│       └── edges/              # 自定义边组件
├── features/                   # UI 功能模块
│   ├── bom-view/               # BOM 设备清单
│   ├── component-library/      # 组件库面板 + 资产定义
│   ├── connection-picker/      # 连线类型选择器
│   ├── context-menu/           # 右键菜单
│   ├── property-panel/         # 属性面板
│   ├── statusbar/              # 状态栏
│   └── toolbar/                # 工具栏 + 视图切换
├── graphics/                   # 2.5D 图形核心
│   ├── core/
│   │   ├── isometric.ts        # 等轴测投影数学函数
│   │   ├── definitions.ts      # 几何形状定义注册表
│   │   └── types.ts            # ShapePrimitive 类型抽象
│   └── components/
│       ├── SvgGenerator.tsx    # SVG 路径生成器
│       └── RoomGraphics.tsx    # 房间 2.5D 渲染
├── lib/
│   └── db.ts                   # Dexie/IndexedDB 封装
├── pages/
│   ├── HomePage/               # 项目列表页
│   └── EditorPage/             # 编辑器主页
├── shared/
│   ├── types/
│   │   ├── index.ts            # 核心类型定义
│   │   ├── constants.ts        # 枚举常量 (分类、连接类型、视图)
│   │   └── interaction.ts      # 交互框架类型
│   ├── schema/
│   │   └── projectSchema.ts    # Zod 校验 (.crs 导入)
│   ├── utils/
│   │   ├── id.ts               # UUID 生成
│   │   ├── spatialDefaults.ts  # 空间语义默认值
│   │   ├── sceneRelations.ts   # 场景关系工具函数
│   │   └── interactionEngine.ts # 交互引擎纯函数
│   └── components/
│       └── ErrorBoundary.tsx   # 全局错误边界
├── store/
│   ├── sceneStore.ts           # 场景数据 + 选择 + undo/redo
│   ├── projectStore.ts         # 项目 CRUD + Dexie 持久化
│   ├── uiStore.ts              # 工具模式 + 侧边栏 + Toast
│   └── interactionStore.ts     # 交互运行时状态
└── styles/
    └── globals.css             # Tailwind + 全局样式
```

## 状态管理

### Store 职责

| Store | 职责 | 关键状态 |
|-------|------|----------|
| `sceneStore` | 场景数据、选择、视图配置、剪贴板、图层/编组/对齐操作 | `scene`, `clipboard` |
| `projectStore` | 项目 CRUD、Dexie 持久化 | `projects`, `currentProject` |
| `uiStore` | 工具模式、侧边栏、连线状态、Toast | `activeTool`, `sidebarOpen` |
| `interactionStore` | 交互运行时状态 | `activeComponentId`, `visualEffects` |

### Undo/Redo

通过 `zundo` 实现，仅对 `scene` 做 undo (通过 `partialize` 过滤)，UI 状态不受影响。限制 50 步。

### 持久化

- **Dexie.js** 封装 IndexedDB，单表 `projects`
- 自动存盘: 3 秒 debounce
- 项目导入/导出: `.crs` JSON 文件 + Zod 校验

## 渲染引擎

### 2D 编辑器 (Canvas2D)

- 基于 `react-konva` 的画布编辑器
- 功能: 拖拽放置、网格吸附、智能对齐、框选、编组、图层排序、门窗编辑、复制粘贴、撤销重做
- 连线系统: 四类管线 (网络/音视频/控制/电源)，贝塞尔曲线动画

### 2.5D 等轴测视图 (Canvas25D)

- 纯 SVG + 数学推演，无 3D 引擎依赖
- 投影核心: `graphics/core/isometric.ts` (30/45 度等距投影)
- 几何定义: `graphics/core/definitions.ts` (ShapePrimitive 注册表)
- 深度排序: 基于 x + y + elevation + spatial.z

### 拓扑视图 (Topology)

- 基于 `@xyflow/react` (React Flow) + dagre 自动布局
- 节点: 设备节点 + 外部节点
- 边: 四类信号线 (网络/音视频/控制/电源)
- 自动接线: `auto-wiring.ts` 基于设备角色的规则引擎

### BOM 视图

- 按资产分组汇总设备清单
- 可编辑品牌/型号/单价
- CSV 导出

## 关键设计决策

1. **2D 为数据源**: 2D 编辑器是唯一的编辑入口，2.5D/拓扑/BOM 只读消费
2. **自研 2.5D 引擎**: 避免 Three.js 等 3D 引擎的体积开销，纯数学 + SVG 足以满足教育场景
3. **本地优先**: Dexie/IndexedDB 存储，支持完全离线运行
4. **类型驱动**: 核心数据模型在 `shared/types` 中统一定义，Zod 校验外部输入
