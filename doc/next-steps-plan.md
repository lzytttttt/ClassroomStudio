# ClassRoom Studio — 下一阶段计划建议

> 生成日期: 2026-05-03
> 修正日期: 2026-05-03
> 基于: architecture-audit.md + Round 1~5 完成情况

---

## 一、已完成工作总结

### Round 1: 工程基础设施

| 交付物 | 状态 |
|--------|------|
| ESLint 配置 (`eslint.config.js`) — typescript-eslint + react-hooks | 已完成 |
| Prettier 配置 (`.prettierrc` + `.prettierignore`) | 已完成 |
| ErrorBoundary 组件 (`shared/components/ErrorBoundary.tsx`) | 已完成 |
| ErrorBoundary 包裹: App / EditorPage (2D / 2.5D / 拓扑 / BOM) | 已完成 |
| `.crs` 导入 Zod 校验 (`shared/schema/projectSchema.ts`) | 已完成 |
| `saveProject` 副作用修复 — 改用 `prepareProjectForSave` 拷贝 | 已完成 |
| 架构审计报告 (`doc/architecture-audit.md`) | 已完成 |

### Round 2: 测试基础设施

| 交付物 | 状态 |
|--------|------|
| Vitest 配置 (`vitest.config.ts`) | 已完成 |
| `isometric.test.ts` — 投影/屏幕坐标数学函数 (12 用例) | 已完成 |
| `db.test.ts` — prepareProjectForSave 副作用验证 (5 用例) | 已完成 |
| `projectSchema.test.ts` — .crs 导入校验 (25 用例) | 已完成 |

### Round 3: Spatial Semantics v1

| 交付物 | 状态 |
|--------|------|
| `ComponentSpatial` 接口 (mountType/z/depth/objectHeight/layer/supportsChildren/parentId) | 已完成 |
| `spatialDefaults.ts` 纯函数 (getDefaultSpatialForAsset / getComponentSpatial) | 已完成 |
| PropertyPanel "空间" Section (mountType 下拉 + 数值字段 + 承载复选框) | 已完成 |
| Zod Schema (ComponentSpatialSchema, .optional() 向后兼容) | 已完成 |
| Canvas25D 深度排序使用 spatial.z 作为 tiebreaker | 已完成 |
| sceneStore.addComponent 调用 getDefaultSpatialForAsset | 已完成 |
| 测试: spatialDefaults.test.ts (11) + projectSchema.test.ts (+3) | 已完成 |

### Round 4: SceneRelation v1

| 交付物 | 状态 |
|--------|------|
| `SceneRelation` 类型 (6 种关系类型) | 已完成 |
| `sceneRelations.ts` 纯函数 (5 个) | 已完成 |
| sceneStore actions (addRelation/removeRelation/updateRelation) | 已完成 |
| PropertyPanel "关系" Section (RelationEditor: 查看/新增/删除) | 已完成 |
| Canvas2D 关联组件高亮 (琥珀色虚线边框) | 已完成 |
| Zod Schema (SceneRelationSchema, .optional() 向后兼容) | 已完成 |
| 测试: sceneRelations.test.ts (15) + projectSchema.test.ts (+5) | 已完成 |

### Round 5: Interaction Framework v1

| 交付物 | 状态 |
|--------|------|
| 交互框架类型 (InteractionTrigger/VisualEffect/RuntimeStatus 等) | 已完成 |
| `interactionEngine.ts` 纯函数 (样式映射 + 效果解析 + 覆盖范围) | 已完成 |
| `interactionStore.ts` Zustand 运行时 store | 已完成 |
| Canvas2D 消费 InteractionVisualEffect (替换硬编码高亮) | 已完成 |
| PropertyPanel 使用 engine 样式映射 + 交互摘要 | 已完成 |
| 覆盖范围 effect (AP 圆形 5000mm / 麦克风 3000mm / 摄像头扇形预留) | 已完成 |
| 测试: interactionEngine.test.ts (14) + interactionStore.test.ts (6) | 已完成 |

### 当前测试基线

- 7 个测试文件, 87 个测试用例, 全部通过
- build: 通过
- lint: 0 errors, 98 warnings (均为历史遗留)

---

## 二、审计报告遗留问题对照

以下列出 architecture-audit.md 中提出的问题，标注当前状态：

### 已解决

| 审计问题 | 解决方式 | 解决轮次 |
|----------|----------|----------|
| H4 零 ESLint/Prettier | ESLint (typescript-eslint + react-hooks) + Prettier 已接入 | Round 1 |
| H4 零 Error Boundary | ErrorBoundary 组件 + App/EditorPage 四处包裹 | Round 1 |
| H2 零测试 | Vitest 基础设施 + 7 个测试文件, 87 个用例 | Round 2-5 |
| G3 导入文件无 schema 验证 | projectSchema.ts (Zod) + HomePage 调用 validateProjectFile | Round 1 |
| G1 saveProject 副作用 | prepareProjectForSave 拷贝，不再 mutate 入参 | Round 1 |
| C5 spatial/relations 无 schema | Zod Schema 覆盖 spatial + relations，.optional() 向后兼容 | Round 3-4 |
| B2 问题 2 拓扑视图联动缺乏统一机制 | interactionStore 提供统一焦点管理入口 | Round 5 |
| F2 缺乏统一焦点管理 | interactionStore.setActiveComponent 是统一入口 | Round 5 |

### 部分解决

| 审计问题 | 当前状态 | 剩余工作 |
|----------|----------|----------|
| B2 问题 1 sceneStore 过于庞大 | 新增 interactionStore 分担运行时状态 | selectedIds/activeView 仍在 sceneStore |
| B2 问题 3 Canvas2D 过于庞大 | effect 逻辑已移到 engine，但文件仍 1070+ 行 | 需要提取 ComponentNode |
| I1 ComponentNode 无 memo | 未处理 | 添加 React.memo |
| E1 门窗渲染代码重复 | 未处理 | 抽象通用函数 |

### 未触及

| 审计问题 | 严重度 | 说明 |
|----------|--------|------|
| D2 ViewState 混杂 | 中 | selectedIds/activeView 嵌在 scene 内 |
| I1 sceneStore 全量订阅 | 高 | 无 selector 优化 |
| B2 问题 4 component-renderers 过大 | 中 | 935 行单文件 |
| F3 连线类型扩展需改 7+ 文件 | 中 | 缺乏抽象 |
| G2 自动保存竞态 | 低 | debounce 3s |
| G1 无 Dexie schema migration | 低 | 当前只有 v1 |

---

## 三、可选的下一步方向

### 方向 A-lite: 工程收尾 (零风险, 低收益)

**目标**: 检查已有基础设施的覆盖范围，补齐遗漏，不引入新机制

| 任务 | 预估工作量 | 风险 | 收益 |
|------|-----------|------|------|
| 检查 Error Boundary 覆盖范围 (Canvas25D 是否独立包裹) | 小 | 无 | 防止局部白屏 |
| 保持 ESLint warning 为 warn，不全量清理 | 无 | 无 | 维持现状 |
| 不做全仓格式化 | 无 | 无 | 避免 git blame 污染 |
| 补 interactionEngine / interactionStore 遗漏测试 (如有) | 小 | 无 | 测试完整性 |

**适合场景**: Round 1-2 的基础设施需要做一次收尾检查

---

### 方向 B1: 小切口 Canvas2D 整理 (低风险, 中收益)

**目标**: 提取 ComponentNode，添加 memo，不改状态架构

| 任务 | 预估工作量 | 风险 | 收益 |
|------|-----------|------|------|
| 提取 ComponentNode 为独立文件 (ComponentNode.tsx) | 中 | 低 (重构渲染层) | Canvas2D 从 1070 行降到 ~400 行 |
| ComponentNode 添加 React.memo | 小 | 低 | 减少不必要 re-render |
| 门窗渲染逻辑抽象为通用函数 | 小 | 低 | 消除重复代码 |

**明确不做的事**:
- 不改 sceneStore
- 不迁移 selectedIds
- 不改拓扑
- 不大拆 Canvas2D (只提取 ComponentNode)

**适合场景**: 渲染层可维护性需要改善，但不想动状态架构

---

### 方向 B2: Interaction Effect Renderer Adapter (低风险, 中收益)

**目标**: 将 Canvas2D 中的 effect 渲染逻辑提取为独立模块

| 任务 | 预估工作量 | 风险 | 收益 |
|------|-----------|------|------|
| 提取 Canvas2D 的 effect 渲染逻辑为独立模块 | 中 | 低 | Canvas2D 主文件只负责组合 Layer |
| 支持 highlight_components / show_coverage_area / show_status_badge 三种 effect 的渲染 | 中 | 低 | effect 渲染可独立测试和扩展 |
| Canvas2D 主文件只保留 Layer 组合 + 事件分发 | 小 | 低 | 职责清晰 |

**明确不做的事**:
- 不做大规模性能重构
- 不迁移 Zustand selector
- 不改 sceneStore 订阅方式

**适合场景**: interactionEngine 的 effect 需要独立的渲染层，为后续合规检查铺路

---

### 方向 E-lite: 规则检查 Spike (低风险, 中收益)

**目标**: 最小验证——规则检查能否复用 interactionEngine 的 effect 系统

| 任务 | 预估工作量 | 风险 | 收益 |
|------|-----------|------|------|
| 定义 RuleDefinition / RuleCheckResult 最小接口 | 小 | 低 | 类型基础 |
| 实现 1 个示例规则 (如: 最小间距检查) | 小 | 低 | 验证规则 → effect 的路径 |
| 规则结果转成 InteractionVisualEffect | 小 | 低 | 复用已有渲染管线 |
| 规则结果在 PropertyPanel 展示 | 小 | 低 | 验证端到端路径 |

**明确不做的事**:
- 不做完整地区标准
- 不做复杂遮挡/通道算法
- 不做规则引擎框架 (只做 spike)
- 不做规则编辑 UI

**适合场景**: 验证合规检查的技术路径，为后续完整实现做准备

---

## 四、推荐路径

### 推荐方案: A-lite → B1 → B2 → E-lite

**理由**:

1. **A-lite 先行** — 对 Round 1-2 的基础设施做一次收尾检查，确认 Error Boundary 覆盖完整。零风险，不改业务代码。

2. **B1 其次** — ComponentNode 提取 + React.memo 是审计报告中收益/风险比最高的单项优化。提取后 Canvas2D 从 1070 行降到 ~400 行，可维护性质的飞跃。不改状态架构，风险可控。

3. **B2 继之** — 将 effect 渲染逻辑从 Canvas2D 中分离，Canvas2D 主文件只负责 Layer 组合。为 E-lite 的规则检查提供独立的渲染入口。

4. **E-lite 最后** — 用最小 spike 验证"规则 → effect → 渲染"的完整路径。只做 1 个示例规则，不做框架。验证通过后再决定是否扩展为完整引擎。

### 明确暂缓

| 方向 | 原因 |
|------|------|
| selectedIds / activeView / zoom / pan 迁移 | 改动面广，风险高，收益不如 B1 直接 |
| Zustand selector 全面迁移 | 需逐一排查订阅点，工作量大，应在 B1 之后再做 |
| 拓扑系统重构 (scene ↔ ReactFlow 单向数据流) | 当前拓扑功能够用，改动风险高 |
| component-renderers 全量拆分 | 935 行单文件，但每个渲染器独立，拆分收益有限 |
| 复杂 Dexie schema migration | 当前只有 v1，等需要升级时再做 |
| Presentation Mode | 功能量大，应先稳定核心 |

---

## 五、如果选择推荐路径，建议的任务拆分

### Round 6: 工程收尾 + 小切口 Canvas2D 整理

| 任务 | 内容 |
|------|------|
| 6.1 | 检查 Error Boundary 覆盖范围，确认 Canvas25D 独立包裹 |
| 6.2 | 提取 ComponentNode 为独立文件 (ComponentNode.tsx) |
| 6.3 | ComponentNode 添加 React.memo |
| 6.4 | 门窗渲染逻辑抽象为通用函数 |
| 6.5 | 补 interactionEngine / interactionStore 遗漏测试 (如有) |
| 6.6 | 验收: build + lint + test 全通过 |

### Round 7: Interaction Effect Renderer Adapter

| 任务 | 内容 |
|------|------|
| 7.1 | 提取 Canvas2D 的 effect 渲染逻辑为独立模块 |
| 7.2 | 支持 highlight_components / show_coverage_area / show_status_badge 渲染 |
| 7.3 | Canvas2D 主文件只保留 Layer 组合 + 事件分发 |
| 7.4 | 验收: build + lint + test + effect 渲染回归 |

### Round 8: 规则检查 Spike

| 任务 | 内容 |
|------|------|
| 8.1 | 定义 RuleDefinition / RuleCheckResult 最小接口 |
| 8.2 | 实现 1 个示例规则 (最小间距检查) |
| 8.3 | 规则结果转成 InteractionVisualEffect |
| 8.4 | PropertyPanel 展示规则检查结果 |
| 8.5 | 测试 |
| 8.6 | 验收: build + lint + test + spike 演示 |

---

## 六、风险提示

1. **ComponentNode 提取可能影响 Konva Transformer** — Transformer 通过 `#comp-${id}` 选择节点，提取文件后需确保 id 注入不受影响。
2. **Effect Renderer Adapter 需要定义清晰的渲染接口** — highlight / coverage / status 三种 effect 的渲染差异较大，接口设计需要统一。
3. **Spike 的规则可能因教室标准不同而差异很大** — 建议第一版只实现通用规则（最小间距），不做特定地区标准。
4. **ESLint 98 个 warning 应保持 warn 状态** — 不全量清理，避免引入与业务无关的变更。

---

*本报告基于 Round 1-5 的完成状态和 architecture-audit.md 的分析编写。建议根据实际开发节奏和用户反馈动态调整优先级。*
