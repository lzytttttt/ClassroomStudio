# ClassRoom Studio - Claude Code 项目上下文

## 项目概述

ClassRoom Studio 是一款面向教育信息化场景的**高保真教室设计与配置模拟器**。纯前端应用，支持 2D 俯视蓝图编辑、2.5D 等轴测视图、拓扑信号流视图和 BOM 设备清单四种视图。

- **当前版本**: v0.3.1
- **作者**: Lzytttttt
- **许可证**: MIT

## 技术栈

- React 19 + TypeScript 6 + Vite 8
- 状态管理: Zustand 5 + Zundo (undo/redo)
- 本地持久化: Dexie.js 4 (IndexedDB)
- 2D 渲染: Konva.js / react-konva
- 2.5D 渲染: 自研等轴测 SVG 数学引擎
- 拓扑视图: React Flow + dagre 自动布局
- 样式: Tailwind CSS v4 (glassmorphism UI)
- 校验: Zod 4
- 路由: React Router DOM 7

## 项目结构

```
src/
├── engine/           # 渲染引擎层 (canvas2d, canvas25d, topology)
├── features/         # UI 功能模块 (toolbar, property-panel, bom-view 等)
├── graphics/         # 2.5D 等轴测核心 (投影数学 + 几何定义 + SVG 生成)
├── lib/              # 基础设施 (Dexie 数据库封装)
├── pages/            # 页面级组件 (HomePage, EditorPage)
├── shared/           # 跨层共享 (types, schema, utils, components)
├── store/            # Zustand 状态管理 (scene, project, ui, interaction)
└── styles/           # 全局样式
```

## 核心架构

**单一数据源，多视图消费**: 所有业务数据存储在 `Scene` 对象中，由 `sceneStore` 统一管理。2D/2.5D/拓扑/BOM 各视图仅负责渲染。

数据层级: `Project -> SchemeVersion[] -> Scene -> Room + SceneComponent[] + Connection[]`

## 关键文件

| 文件 | 职责 |
|------|------|
| `src/store/sceneStore.ts` | 场景数据 + 选择 + undo/redo + 剪贴板 |
| `src/store/projectStore.ts` | 项目 CRUD + Dexie 持久化 |
| `src/shared/types/index.ts` | 核心类型定义 (244 行) |
| `src/features/component-library/assets-data.ts` | 47 种设备资产定义 |
| `src/engine/canvas2d/Canvas2D.tsx` | 2D 编辑器主组件 |
| `src/graphics/core/isometric.ts` | 等轴测投影数学 |
| `src/engine/topology/auto-wiring.ts` | 自动接线规则引擎 |

## 开发命令

```bash
npm run dev          # 启动开发服务器 (localhost:5173)
npm run build        # TypeScript 编译 + Vite 构建
npm run test         # Vitest 监听模式
npm run test:run     # Vitest 单次运行
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
npm run format:check # Prettier 检查
```

## 代码规范

- **路径别名**: `@/` 映射到 `src/`
- **格式化**: 单引号、分号、尾逗号、120 字符宽、2 空格缩进
- **测试**: 与源文件同目录放置，命名 `*.test.ts`
- **提交信息**: 使用中文，遵循 `type: description` 格式 (feat/fix/docs/chore/refactor)

## 测试基线

7 个测试文件，87 个用例，覆盖: 等轴测数学、DB 操作、项目 Schema 校验、空间语义、场景关系、交互引擎、交互 Store。

## 演进路线

- [x] v0.1: 基础 2D Canvas + IndexedDB
- [x] v0.2: 2.5D 等轴测引擎 + React Flow 拓扑
- [x] v0.3: 真实连接系统 + 47 种设备
- [ ] v0.4: 演示汇报模式 (Presentation Mode)
- [ ] v0.5: 合规检查 + BOM/报价单 PDF 导出

## 文档索引

- `README.md` - 项目介绍与快速开始
- `doc/architecture.md` - 架构详解
- `doc/development-guide.md` - 开发指南
- `doc/component-catalog.md` - 设备资产目录
- `doc/architecture-audit.md` - 架构审计报告 (历史)
- `doc/next-steps-plan.md` - 下一阶段计划 (历史)
- `CHANGELOG.md` - 版本变更记录
- `CONTRIBUTING.md` - 贡献指南
