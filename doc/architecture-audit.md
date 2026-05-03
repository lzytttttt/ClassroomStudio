# ClassRoom Studio — 架构与工程质量审计报告

> 审计日期: 2026-05-03
> 审计范围: 全部源码 (src/)、配置文件、数据模型、状态管理、渲染引擎、存储层
> 代码规模: ~35 个 TS/TSX 文件，约 6500 行有效代码

---

## A. 项目现状总结

### A1. 当前已实现的功能

- **2D 俯视蓝图编辑器** (react-konva): 拖拽放置、网格吸附、智能对齐参考线、框选、编组、图层排序、门窗编辑、复制粘贴、撤销重做
- **2.5D 等距轴测视图** (纯 SVG + 数学推演): 基于 ShapePrimitive 的自研图形引擎，支持动态 Z-Sorting、自动生成光影
- **拓扑信号流视图** (React Flow): 四类连线(网络/音视频/控制/电源)、自动接线推荐引擎、dagre 一键排版
- **BOM 设备清单**: 按资产分组汇总、可编辑品牌/型号/单价、CSV 导出
- **47 种内置教育设备资产库**，每个设备同时具备 2D Konva 渲染器和 2.5D SVG 几何定义
- **项目管理系统**: Dexie/IndexedDB 本地存储、自动存盘(3s debounce)、项目导入导出(.crs)
- **多方案支持**: 项目 → 方案版本 → 场景的层级结构

### A2. 核心技术路径

项目的核心技术路径是**"2D 布局为数据源，2.5D/拓扑/BOM 为不同视图的消费方"**。所有业务数据（组件位置、连接关系、属性）存储在 `Scene` 对象中，由 `sceneStore` 统一管理，各视图仅负责渲染。

这是一个正确的架构选择——单一数据源，多视图消费。

### A3. 最值得保留的架构部分

1. **类型定义体系** (`shared/types/index.ts`): `Scene → SceneComponent → Connection → Asset → ViewState` 的分层定义清晰，是整个项目的骨架
2. **2.5D 图形引擎** (`graphics/core/`): `isometric.ts` + `definitions.ts` + `types.ts` 的三层架构——投影数学 / 几何注册 / 类型抽象——非常干净，扩展性好
3. **场景 Store 的 temporal (undo/redo) 集成**: zundo 的 partialize 配置合理，只对 scene 做 undo，UI 状态不受影响
4. **自动接线引擎** (`auto-wiring.ts`): 基于设备角色分类的规则引擎，独立于 UI，可测试性好

---

## B. 架构审计

### B1. 目录结构

```
src/
├── App.tsx                    # 路由入口
├── main.tsx                   # 挂载点
├── engine/                    # 渲染引擎层
│   ├── canvas2d/              # 2D 编辑器 (Konva)
│   ├── canvas25d/             # 2.5D 视图 (SVG)
│   └── topology/              # 拓扑视图 (React Flow)
│       ├── nodes/
│       ├── edges/
│       ├── auto-wiring.ts
│       └── TopologyToolbar.tsx
├── features/                  # UI 功能模块
│   ├── bom-view/
│   ├── component-library/
│   ├── connection-picker/
│   ├── context-menu/
│   ├── property-panel/
│   ├── statusbar/
│   └── toolbar/
├── graphics/                  # 2.5D 图形核心
│   ├── core/                  # 投影数学 + 几何定义
│   └── components/            # SVG 组件
├── lib/                       # 基础设施 (DB)
├── pages/                     # 页面级组件
├── shared/                    # 共享类型 + 工具
├── store/                     # Zustand 状态管理
└── styles/                    # 全局样式
```

**评价**: 目录结构总体合理。`engine/`、`graphics/`、`features/`、`store/` 的四层划分有清晰的语义。但存在以下问题：

### B2. 职责混乱与耦合问题

**问题 1: `sceneStore` 过于庞大（537 行），承担了过多职责**

`sceneStore` 同时管理：
- 场景数据 (components, connections, room)
- 选择状态 (selectedIds)
- 视图状态 (zoom, pan, grid, snap)
- 剪贴板
- 图层操作
- 编组操作
- 对齐/分布操作

其中"选择状态"和"视图状态"严格来说是 UI 状态，不应与业务数据混在同一个 store 中。当前它们被嵌套在 `scene.viewState` 里，导致每次 zoom/pan 变化都会触发 scene 的 temporal 记录（虽然 zundo 的 partialize 做了过滤，但仍然会导致不必要的 re-render）。

**问题 2: 拓扑视图的双向同步存在脆弱性**

`TopologyView.tsx` 中，scene → ReactFlow 的同步通过两个 `useEffect` 完成（L68-95 和 L97-118），而 ReactFlow → scene 的回写通过 `handleNodesChange` 和 `handleEdgesChange` 完成。这种双向同步模式容易出现：
- 循环更新（scene 变 → useEffect 触发 setNodes → onNodesChange 触发 setScene）
- 竞态问题（拖拽过程中 scene 被其他操作修改）

当前代码中，`handleNodesChange` 只在 `dragging === false` 时回写，这是一种缓解但不是根本解决。

**问题 3: `Canvas2D.tsx` 过于庞大（1047 行）**

单文件包含了：画布渲染、组件节点渲染、连线渲染、框选逻辑、对齐吸附、拖拽放置、截图功能、连接工具交互。其中 `ComponentNode` 作为内部组件定义在同一个文件中，应该提取为独立文件。

**问题 4: `component-renderers.tsx` 过于庞大（935 行）**

47 个渲染器函数全部在一个文件中。每个渲染器虽然不大，但总量导致文件难以维护。应该按资产类别拆分。

### B3. 模块边界评估

| 边界 | 清晰度 | 说明 |
|------|--------|------|
| 类型定义层 (shared/types) | **清晰** | 类型与实现分离，常量独立 |
| 图形核心层 (graphics/core) | **清晰** | 投影数学、几何定义、类型三层分离 |
| 存储层 (lib/db) | **清晰** | 薄封装，职责单一 |
| 2D 编辑器 (engine/canvas2d) | **模糊** | 渲染逻辑与交互逻辑混杂 |
| 2.5D 视图 (engine/canvas25d) | **清晰** | 简洁，只做渲染 |
| 拓扑视图 (engine/topology) | **基本清晰** | 但与 sceneStore 的同步边界脆弱 |
| UI 功能 (features/) | **清晰** | 每个 feature 独立自包含 |
| 状态管理 (store/) | **模糊** | sceneStore 职责过重，uiStore 与 sceneStore 边界不严格 |

---

## C. 数据模型审计

### C1. 核心实体定义

数据模型定义在 `shared/types/index.ts`，结构为：

```
Project
  └── SchemeVersion[]
        └── Scene
              ├── Room
              ├── SceneComponent[]
              ├── Connection[]
              ├── ExternalNode[]
              └── ViewState
```

**评价**: 层级结构合理，但存在以下问题：

### C2. ViewState 混杂问题

`ViewState` 接口包含了：
- `activeView`: 纯 UI 状态（当前激活的视图 tab）
- `canvas2d`: 编辑器交互状态（pan, zoom, grid, snap）
- `topology`: 拓扑视图配置（layout, filterTypes, lineStyle）
- `selectedIds`: 选择状态

这些状态被嵌套在 `Scene` 内部，意味着：
1. 切换视图 tab 会修改 Scene 数据
2. 缩放画布会修改 Scene 数据
3. 选择组件会修改 Scene 数据

虽然 zundo 的 partialize 过滤了 undo 记录，但这些 UI 状态的变更仍然会触发所有订阅了 `scene` 的组件 re-render。

**建议**: `selectedIds`、`canvas2d` (pan/zoom)、`activeView` 应移入 `uiStore`，只保留 `topology` 配置和 `canvas2d` 的 grid/snap 配置在 Scene 中（因为这些是需要持久化的项目配置）。

### C3. Asset 与 SceneComponent 的关系

`Asset` 是组件库中的模板定义，`SceneComponent` 是场景中的实例。当前关系通过 `assetId` 字段关联。

**问题**: `SceneComponent.properties` 中的 `brand`、`model`、`price` 等字段是从 `Asset.defaultProperties` 拷贝而来的。用户可以在 BOM 视图中通过 `updateComponentsByAssetId` 批量修改这些属性。这导致了一个隐式的"按 assetId 分组修改"语义，但代码中没有明确的文档或类型约束来说明这一点。

### C4. Connection 数据模型

`Connection` 接口设计合理，`type` / `label` / `bandwidth` / `protocol` / `style` 的分离足够灵活。

**小问题**: `style` 字段在创建连线时总是传入 `{ color: '', dashArray: '', lineWidth: 2, animated: true }`，实际颜色由 `CONNECTION_COLORS` 常量决定。`style` 字段实际上没有被使用，属于冗余字段。

### C5. 是否需要统一 schema

**当前不需要**。数据模型已经足够清晰，核心实体定义在单一文件中。但建议在以下时机引入 schema 版本管理：
- 当开始支持文件导入/导出的版本兼容时
- 当 IndexedDB schema 需要升级时

---

## D. 状态管理审计

### D1. Store 拆分

| Store | 职责 | 行数 | 评价 |
|-------|------|------|------|
| sceneStore | 场景数据 + 选择 + 视图状态 + 剪贴板 + 图层 + 编组 + 对齐 | 537 | **过大** |
| projectStore | 项目 CRUD + 持久化 | 101 | 合理 |
| uiStore | 工具模式 + 侧边栏 + 连线状态 + Toast | 90 | 合理但有边界问题 |

### D2. sceneStore 具体问题

**问题 1: 状态重复**

`sceneStore` 中的 `scene.viewState.selectedIds` 和 `uiStore` 中的 `highlightedComponentId` 存在语义重叠。`highlightedComponentId` 用于拓扑视图和 2D 视图之间的交叉高亮，但它的自动清除（3s setTimeout）可能导致竞态。

**问题 2: 动作职责不清**

`addComponent` 内部调用了 `getAssetById` 来获取默认属性，这意味着 store 层依赖了 feature 层（component-library/assets-data）。这违反了依赖方向——store 应该是底层，不应依赖 feature 层。

**建议**: 将 `getAssetById` 的调用移到组件层，store 的 `addComponent` 只接收完整的 `SceneComponent` 对象。

**问题 3: 派生状态计算**

`getSelectedComponents` 作为 store action 存在，每次调用都会重新 filter。更 Zustand 的做法是使用 selector：`useSceneStore(s => s.scene.components.filter(c => s.scene.viewState.selectedIds.includes(c.id)))`。

### D3. Undo/Redo 边界

zundo 的配置：
```ts
partialize: (state) => ({ scene: state.scene }),
limit: 50,
```

**评价**: partialize 配置正确，只对 scene 做 undo。但 `limit: 50` 对于大型场景（47+ 组件）可能占用较多内存，因为每次 undo 记录都是完整的 scene 快照。

**建议**: 考虑使用 structural sharing 或 diff-based 的 undo 策略。

### D4. 持久化策略

| 状态 | 当前是否持久化 | 建议 |
|------|--------------|------|
| scene (components, connections, room) | 是 (Dexie) | 正确 |
| viewState (activeView, zoom, pan) | 是 (嵌入 scene) | **不应持久化** — 这是会话状态 |
| viewState (grid, snap, topology config) | 是 | 正确 — 这是项目偏好 |
| uiStore (sidebar, tool mode) | 否 | 正确 |
| clipboard | 否 | 正确 |

---

## E. 编辑器与渲染审计

### E1. 2D 编辑器 (Canvas2D)

**优势**:
- 智能对齐参考线实现完整（X/Y 轴 + 中心线）
- 框选逻辑正确
- 组件拖拽 + 网格吸附 + 对齐吸附的优先级处理合理

**问题**:
1. **单文件过大** (1047 行): `ComponentNode` 应提取为独立文件
2. **门/窗渲染逻辑重复**: 四面墙的门窗渲染代码几乎完全相同，只是坐标轴不同，应抽象为通用函数
3. **连接线渲染与组件渲染在同一 Layer**: 连接线应该在独立的 Layer 中渲染，避免与组件交互冲突
4. **截图功能通过全局 ref 暴露** (`canvas2dScreenshotRef`): 这是一种 hack，应通过 store 或 context 暴露

### E2. 2.5D 渲染 (Canvas25D)

**优势**:
- 渲染逻辑简洁
- 深度排序正确（x + y + elevation）
- 与 2D 数据源保持一致（直接读取 scene.components）

**问题**:
1. **2.5D 视图有自己的 pan/zoom 状态** (L17-18 的 useState)，与 2D 视图的 pan/zoom 不共享。这意味着切换视图后 pan/zoom 会重置
2. **选择高亮过于简陋**: 只是一个圆圈 (`<circle r="0.1" />`)，没有与 2D 视图的选择高亮风格统一
3. **没有右键菜单**: 2.5D 视图只支持点击选择，不支持编辑操作

### E3. 渲染层性能风险

**风险 1: 全量 re-render**

`Canvas2D` 组件订阅了 `useSceneStore()`，没有使用 selector 优化。任何 scene 变更（包括 zoom/pan/selection 变化）都会导致整个画布 re-render。

**风险 2: 组件渲染器无 memo**

`ComponentNode` 组件没有使用 `React.memo`。当 scene 变更时，所有组件节点都会 re-render，即使它们的数据没有变化。

**风险 3: 网格线全量计算**

`gridLines` 在每次 render 时都会重新计算和创建 React 元素。对于大房间 + 小网格，可能产生数百个 `<Line>` 元素。

**风险 4: 2.5D 视图的 SVG 复杂度**

每个组件的 2.5D 渲染包含多个 `<path>` 元素（一个 box 产生 3 个面路径 + 边框 + 高光）。47 个组件 × 平均 6 个 shapes × 4-5 个 path = ~1400 个 SVG path 元素。在缩放/平移时可能导致帧率下降。

---

## F. 拓扑系统审计

### F1. 数据独立性

拓扑数据**不完全独立**。拓扑视图直接读取 `scene.components` 和 `scene.connections`，通过 `useEffect` 同步到 ReactFlow 的内部状态。这意味着：
- 拓扑视图的节点位置（通过拖拽调整）通过 `topologyPosition` 字段回写到 `SceneComponent`
- 但这个字段是可选的 (`topologyPosition?: { x: number; y: number }`)，没有默认值策略

### F2. 联动方式

2D ↔ 拓扑的联动通过 `uiStore.highlightedComponentId` 实现：
- 拓扑视图点击节点 → 设置 highlighted → 2D 视图高亮对应组件
- 2D 视图选择组件 → `selectComponents` → 拓扑视图通过 `selectedIds` 同步选择

**问题**: 这种联动是单向的事件驱动，没有统一的"焦点管理"机制。如果未来增加更多视图（如演示模式），每个视图都需要单独实现联动逻辑。

### F3. 连线系统扩展性

当前连线系统支持 4 种类型（network/av/control/power），每种类型在拓扑节点上有独立的 Handle。

**扩展性评估**:
- 增加新连线类型：需要修改 `ConnectionType`、`CONNECTION_COLORS`、`CONNECTION_LABELS`、`DeviceNode` 的 Handle、`ExternalNodeNode` 的 Handle、`SignalEdge` 的渲染逻辑、`auto-wiring.ts` 的规则。**改动点分散在 7+ 个文件中**。
- 增加新规则检查：`auto-wiring.ts` 的规则引擎是硬编码的 if-else 链，没有抽象为可配置的规则系统。

### F4. 最可能出问题的地方

1. **双向同步的竞态**: `TopologyView` 的 scene ↔ ReactFlow 同步
2. **Handle ID 的硬编码约定**: `"network-source"`, `"av-target"` 等字符串约定散落在多个文件中
3. **自动接线的规则冲突**: 当前 `tryAdd` 只检查连接是否已存在，不检查连接的合理性（如一个设备不应同时连接到两个交换机）

---

## G. 存储与项目文件审计

### G1. Dexie/IndexedDB 使用

```ts
this.version(1).stores({
  projects: 'id, name, updatedAt, createdAt'
});
```

**评价**: 索引设计合理，支持按更新时间排序。但：

**问题 1: 没有 schema 版本迁移策略**

当前只有 `version(1)`。如果未来修改 `Project` 结构（如增加字段），没有 migration 机制。Dexie 支持 `upgrade` 回调，但当前没有使用。

**问题 2: 整个项目对象作为单条记录存储**

`Project` 对象包含完整的 `schemes[]` → `scene` → `components[]` → `connections[]`。对于大型项目（100+ 组件），单条记录可能达到数百 KB。IndexedDB 对单条记录没有大小限制，但大记录会影响读写性能。

**问题 3: saveProject 直接修改传入对象**

```ts
export async function saveProject(project: Project) {
  project.updatedAt = new Date().toISOString(); // 直接修改原对象
  await db.projects.put(project);
}
```

这是一个副作用，可能导致意外的状态变更。

### G2. 项目保存/恢复隐患

**隐患 1: 自动保存的竞态**

`EditorPage` 中的自动保存使用 3s debounce，但如果用户在保存过程中继续编辑，保存的 scene 可能不是触发保存时的 scene（因为 scene 是引用类型，可能已被修改）。

**隐患 2: 导入文件没有 schema 验证**

`HomePage.tsx` 的 `handleImportCRS` 直接 `JSON.parse` 后检查 `project.id && project.schemes`，没有验证数据结构的完整性。恶意或损坏的文件可能导致运行时错误。

**隐患 3: 没有数据完整性检查**

加载项目时，如果 `activeSchemeId` 指向的方案不存在，`EditorPage` 的 L38-41 会静默失败（`activeScheme` 为 undefined，不调用 setScene）。

### G3. 是否建议定义项目文件 schema

**强烈建议**。具体措施：
1. 定义 JSON Schema 或 Zod schema 用于验证导入文件
2. 在 Dexie 的 `upgrade` 回调中处理 schema 迁移
3. 在 `Project` 中增加 `schemaVersion` 字段（已有，但未使用于迁移逻辑）

---

## H. 工程质量审计

### H1. 类型定义

**优势**:
- `strict: true` 已启用
- 核心类型定义完整且有注释
- 使用了 discriminated union (`ConnectionType`, `AssetCategory`)

**问题**:
1. `noUnusedLocals: false` 和 `noUnusedParameters: false` — 关闭了未使用变量检查
2. `projectStore.saveCurrentProject(scene: any)` — 使用了 `any` 类型
3. 部分组件的 props 使用内联 style 对象而非类型化的 CSSProperties
4. `Template` 接口定义了但从未使用

### H2. 测试

**当前状态: 零测试**。没有测试文件、没有测试配置、没有测试依赖。

**最需要测试的模块**:
1. `auto-wiring.ts` — 纯函数，最容易测试
2. `graphics/core/isometric.ts` — 纯数学函数
3. `store/sceneStore` — 状态逻辑
4. `shared/types` — 类型编译检查

### H3. 文档

- README 有基本的项目介绍和启动说明
- 代码注释：关键文件有中文注释，但缺少 API 文档
- 没有 CONTRIBUTING.md、CHANGELOG.md
- 没有架构设计文档（本审计报告是第一份）

### H4. Lint / Format / Validation

| 工具 | 状态 |
|------|------|
| ESLint | **缺失** |
| Prettier | **缺失** |
| Husky / lint-staged | **缺失** |
| Error Boundary | **缺失** |
| 日志机制 | **缺失** (只有 console.error) |
| 输入验证 | **缺失** (导入文件无 schema 验证) |

### H5. 最需要先补工程基础设施的部分

按优先级排序：
1. **ESLint + Prettier**: 代码风格一致性
2. **Error Boundary**: 至少在 EditorPage 和 Canvas2D 包裹，防止渲染错误导致白屏
3. **基础测试框架**: Vitest + 对 auto-wiring 和 isometric 的单元测试
4. **Schema 验证**: Zod 对导入文件的验证

---

## I. 性能与体验风险

### I1. 主要性能风险

| 风险 | 严重度 | 位置 |
|------|--------|------|
| sceneStore 全量订阅导致不必要的 re-render | **高** | Canvas2D, TopologyView |
| ComponentNode 无 memo | **高** | Canvas2D |
| 网格线每次 render 全量重建 | **中** | Canvas2D |
| 2.5D SVG 复杂度随组件数线性增长 | **中** | Canvas25D |
| undo/redo 存储完整 scene 快照 | **低** | sceneStore |

### I2. 主要可维护性风险

| 风险 | 严重度 | 位置 |
|------|--------|------|
| Canvas2D 单文件 1047 行 | **高** | engine/canvas2d |
| component-renderers 935 行 | **高** | engine/canvas2d |
| sceneStore 537 行且职责混杂 | **高** | store |
| 拓扑 Handle ID 硬编码在 7+ 文件 | **中** | engine/topology |
| 门窗渲染代码重复 (4 面墙) | **低** | Canvas2D |

### I3. 主要用户体验风险

| 风险 | 说明 |
|------|------|
| 无 Error Boundary | 渲染错误直接白屏，无恢复手段 |
| 导入文件无验证 | 损坏文件可能导致应用崩溃 |
| 自动保存无冲突处理 | 快速编辑时可能丢失最近的修改 |
| 2.5D 视图无法编辑 | 用户可能期望在 2.5D 视图中也能操作组件 |
| 无加载状态 | 打开大型项目时无 loading 指示 |

---

## J. 优先级建议

### J1. 立即处理（现在就该做）

1. **添加 ESLint + Prettier**: 不改业务代码，只加工程基础设施。影响：代码一致性、协作效率
2. **添加 Error Boundary**: 在 EditorPage 和各 Canvas 视图外层包裹。影响：防止白屏崩溃
3. **将 `selectedIds` 和 `activeView` 从 sceneStore 迁移到 uiStore**: 这是最小代价的状态架构修正，可以显著减少不必要的 re-render
4. **为 ComponentNode 添加 React.memo**: 最小改动，最大性能收益
5. **修复 `saveProject` 的副作用**: 不应直接修改传入对象

### J2. 近期处理（下一阶段做）

1. **拆分 Canvas2D.tsx**: 提取 ComponentNode、ConnectionLines、GridLayer、DoorWindowRenderer 为独立文件
2. **拆分 component-renderers.tsx**: 按资产类别拆分为 furniture-renderers.tsx、display-renderers.tsx 等
3. **拆分 sceneStore**: 将 view/selection/clipboard 相关逻辑提取到独立 store 或 hook
4. **添加 Vitest + 核心模块单元测试**: auto-wiring、isometric、sceneStore
5. **为导入文件添加 Zod schema 验证**
6. **优化 sceneStore 订阅**: 使用 Zustand selector 优化各组件的订阅粒度

### J3. 延后处理（先不要动）

1. **Dexie schema migration 策略**: 当前只有 v1，等需要升级时再做
2. **undo/redo 优化 (structural sharing)**: 当前的 50 步快照在实际使用中足够
3. **2.5D 视图编辑能力**: 当前只读是合理的，等核心编辑功能稳定后再做
4. **拓扑规则引擎抽象化**: 当前硬编码的规则足够应对 v0.3 的需求
5. **项目文件格式标准化 (.crs)**: 等需要跨版本兼容时再做

---

## K. 总结评分与建议

### K1. 总体评分

| 维度 | 分数 (10分制) | 说明 |
|------|:------------:|------|
| **架构成熟度** | 7.0 | 核心分层清晰，数据模型设计合理，但 store 职责混杂、部分模块边界模糊 |
| **可维护性** | 5.5 | 关键文件过大、缺乏 lint/test/error boundary 等工程基础设施 |
| **扩展性** | 6.5 | 类型系统和图形引擎扩展性好，但连线系统和状态管理的扩展需要较多改动 |

### K2. 5 个最关键问题

1. **sceneStore 职责过重，UI 状态与业务数据混杂** — 导致 zoom/pan/selection 变更触发全量 scene re-render
2. **零测试、零 lint、零 Error Boundary** — 工程基础设施缺失，代码质量和运行稳定性无保障
3. **Canvas2D.tsx 1047 行单文件** — 渲染、交互、工具逻辑混杂，难以维护和扩展
4. **拓扑视图的双向同步脆弱** — scene ↔ ReactFlow 的 useEffect + handleNodesChange 模式存在循环更新风险
5. **导入文件无 schema 验证** — 损坏或恶意文件可能导致应用崩溃

### K3. 5 个最值得做的优化项

1. **添加 ESLint + Prettier + Error Boundary** — 零业务风险，立即提升工程下限
2. **将 selectedIds/activeView 从 sceneStore 迁移到 uiStore** — 最小代价的状态架构修正，减少 30%+ 的不必要 re-render
3. **为 ComponentNode 添加 React.memo + 优化 sceneStore 订阅粒度** — 最小改动，最大渲染性能收益
4. **拆分 Canvas2D.tsx 和 component-renderers.tsx** — 将 1000+ 行文件拆为 200-300 行的模块，显著提升可维护性
5. **添加 Vitest + auto-wiring/isometric 单元测试** — 从纯函数开始，建立测试文化

### K4. 建议的下一阶段目标

**"稳定编辑器核心，补全工程基础设施"**

具体来说：添加 ESLint/Prettier、Error Boundary、拆分大文件、优化渲染性能。不新增功能，不改数据模型，只提升现有代码的可维护性和稳定性。

这是最值得做的单一目标，因为：
- 当前代码已经功能完整（v0.3），但工程质量不足以支撑 v0.4/v0.5 的开发
- 补基础设施的成本低、风险低、收益高
- 为后续的功能迭代（演示模式、合规检查）打下坚实基础

### K5. 第一批建议修改的文件及原因

| 文件 | 修改内容 | 原因 |
|------|---------|------|
| `package.json` | 添加 eslint, prettier, vitest 依赖 | 工程基础设施 |
| `.eslintrc.json` (新建) | 配置 ESLint 规则 | 代码质量保障 |
| `.prettierrc` (新建) | 配置 Prettier 规则 | 代码格式一致性 |
| `src/App.tsx` | 添加 Error Boundary 包裹 | 防止白屏崩溃 |
| `src/engine/canvas2d/Canvas2D.tsx` | 提取 ComponentNode 为独立文件，添加 React.memo | 降低文件复杂度 + 渲染性能 |
| `src/store/sceneStore.ts` | 将 selectedIds、activeView 移到 uiStore | 减少不必要 re-render |
| `src/store/uiStore.ts` | 接收从 sceneStore 迁移的状态 | 状态职责修正 |
| `src/lib/db.ts` | 修复 saveProject 的副作用 | 消除隐蔽 bug |
| `src/pages/HomePage/HomePage.tsx` | 添加导入文件的 Zod 验证 | 防止损坏文件导致崩溃 |

---

*本报告基于 2026-05-03 的代码快照编写。建议在每次重大功能迭代后重新审计。*
