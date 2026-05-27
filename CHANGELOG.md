# Changelog

本文件记录 ClassRoom Studio 的所有重要变更。格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [0.3.1] - 2026-05-03

### 新增
- **交互框架 v1**: `InteractionTrigger` / `VisualEffect` / `RuntimeStatus` 类型体系
- `interactionEngine.ts` 纯函数 (样式映射 + 效果解析 + 覆盖范围)
- `interactionStore.ts` Zustand 运行时 Store
- Canvas2D 消费 `InteractionVisualEffect`，替换硬编码高亮
- PropertyPanel 交互摘要与引擎样式映射
- 覆盖范围效果: AP 圆形 5000mm / 麦克风 3000mm / 摄像头扇形预留

### 优化
- 场景关系系统 v1: `SceneRelation` 类型 (6 种关系)、`sceneRelations.ts` 纯函数、PropertyPanel 关系编辑器
- 空间语义系统 v1: `ComponentSpatial` 接口、`spatialDefaults.ts`、PropertyPanel 空间配置面板
- Canvas2D 关联组件高亮 (琥珀色虚线边框)
- Canvas25D 深度排序使用 `spatial.z` 作为 tiebreaker

### 测试
- 新增 `interactionEngine.test.ts` (14 用例)
- 新增 `interactionStore.test.ts` (6 用例)
- 新增 `sceneRelations.test.ts` (15 用例)
- 新增 `spatialDefaults.test.ts` (11 用例)
- `projectSchema.test.ts` 增加 8 个向后兼容性用例
- 测试基线: 7 文件 / 87 用例 / 全部通过

## [0.3.0] - 2026-04-23

### 新增
- 2D 画布真实连接系统: 四类专业管线 (网络/音视频/控制/电源)
- 智能交互体验: "选择源 -> 选择目标 -> 分配线型" 两步流
- 动画贝塞尔连线与物理端点指示
- 组件资产库扩充至 47 种细分教育设备
- 所有设备同步支持 2D Konva 渲染与 2.5D SVG 模型

### 优化
- 2.5D 视觉效果大修: 优化资产几何体、精炼布局引擎
- 自动接线推荐引擎 (`auto-wiring.ts`)

## [0.2.0] - 2026-04-18

### 新增
- 2.5D 等轴测视图引擎: 纯数学推演 + SVG，30/45 度等距视角
- 动态 Z-Sorting 深度排序
- 基于组件颜色自动生成光影和高光质感模型
- React Flow 拓扑信号流视图
- dagre 一键自动布局

### 优化
- BOM 设备清单: 按资产分组汇总、可编辑品牌/型号/单价、CSV 导出

## [0.1.0] - 2026-04-14

### 新增
- 2D 俯视蓝图编辑器 (react-konva)
- 拖拽放置设备、网格吸附、智能对齐参考线
- 框选、编组、图层排序、门窗编辑、复制粘贴
- 撤销重做 (zundo, 50 步)
- 项目管理系统: Dexie/IndexedDB 本地存储、自动存盘 (3s debounce)
- 项目导入导出 (.crs JSON + Zod 校验)
- 多方案支持: 项目 -> 方案版本 -> 场景层级

---

## 工程质量加固 (Rounds 1-5)

### Round 1: 工程基础设施
- ESLint 配置 (typescript-eslint + react-hooks)
- Prettier 配置
- ErrorBoundary 组件及全页面包裹
- `.crs` 导入 Zod 校验
- `saveProject` 副作用修复
- 架构审计报告

### Round 2: 测试基础设施
- Vitest 配置
- 等轴测数学测试 (12 用例)
- DB 操作测试 (5 用例)
- 项目 Schema 测试 (25 用例)

### Round 3: 空间语义 v1
- `ComponentSpatial` 接口与 `spatialDefaults.ts`
- PropertyPanel 空间配置面板
- Zod Schema 向后兼容

### Round 4: 场景关系 v1
- `SceneRelation` 类型与 `sceneRelations.ts`
- PropertyPanel 关系编辑器
- Canvas2D 关联组件高亮

### Round 5: 交互框架 v1
- 交互引擎类型与纯函数
- 运行时 Store 与 Canvas2D 集成
- 覆盖范围效果系统
