# 贡献指南

感谢你对 ClassRoom Studio 的关注。本文件说明项目的开发流程与规范。

## 开发环境

- Node.js >= 18
- npm >= 9

```bash
git clone https://github.com/lzytttttt/ClassroomStudio.git
cd ClassroomStudio
npm install
npm run dev
```

开发服务器启动后访问 `http://localhost:5173/`。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器 (HMR) |
| `npm run build` | TypeScript 编译 + 生产构建 |
| `npm run test` | Vitest 监听模式 |
| `npm run test:run` | Vitest 单次运行 (CI 用) |
| `npm run lint` | ESLint 检查 |
| `npm run format` | Prettier 格式化 |
| `npm run format:check` | Prettier 格式检查 |

## 代码规范

### 格式化

项目使用 Prettier 统一代码格式，配置见 `.prettierrc`:

- 单引号
- 分号
- 尾逗号
- 120 字符行宽
- 2 空格缩进

提交前运行 `npm run format` 确保格式一致。

### Lint

ESLint 配置见 `eslint.config.js`。提交前运行 `npm run lint` 检查。

### 路径别名

使用 `@/` 代替相对路径 `../`:

```ts
// 好
import { useSceneStore } from '@/store/sceneStore';

// 避免
import { useSceneStore } from '../../../store/sceneStore';
```

## 提交规范

使用中文提交信息，遵循以下格式:

```
type: 简短描述
```

### 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 Bug |
| `docs` | 文档变更 |
| `style` | 代码格式调整 (不影响逻辑) |
| `refactor` | 重构 (不新增功能、不修复 Bug) |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具/配置变更 |

### 示例

```
feat: 添加 2.5D 视图的组件选择功能
fix: 修复拓扑视图拖拽时的循环更新问题
refactor: 拆分 Canvas2D.tsx 中的 ComponentNode 为独立文件
docs: 更新架构文档
```

## 测试

测试文件与源文件同目录放置，命名为 `*.test.ts`:

```
src/graphics/core/isometric.ts
src/graphics/core/isometric.test.ts
```

运行测试:

```bash
npm run test        # 监听模式 (开发时)
npm run test:run    # 单次运行 (提交前)
```

### 测试原则

- 纯函数优先测试 (如 `auto-wiring.ts`, `isometric.ts`, `spatialDefaults.ts`)
- Store 逻辑测试关键状态转换
- 使用 `describe` / `it` 组织测试，描述行为而非实现

## 分支策略

- `main`: 稳定分支，可直接部署
- 功能分支: 从 `main` 创建，完成后通过 PR 合并

## 架构概览

详细架构说明见 [doc/architecture.md](doc/architecture.md)。

核心原则: **单一数据源，多视图消费**。所有业务数据存储在 `Scene` 对象中，由 `sceneStore` 统一管理。

## 文件组织

```
src/
├── engine/       # 渲染引擎 (按视图类型分)
├── features/     # UI 功能模块 (各自独立)
├── graphics/     # 2.5D 图形核心 (纯数学)
├── lib/          # 基础设施
├── pages/        # 页面级组件
├── shared/       # 跨层共享 (types, utils, schema)
├── store/        # Zustand 状态管理
└── styles/       # 全局样式
```

### 新增设备资产

1. 在 `src/features/component-library/assets-data.ts` 的 `builtinAssets` 数组中添加 Asset 定义
2. 在 `src/engine/canvas2d/component-renderers.tsx` 中添加 2D 渲染函数
3. 在 `src/graphics/core/definitions.ts` 中添加 2.5D 几何定义
4. 在 `src/shared/utils/spatialDefaults.ts` 中添加空间语义默认值 (如需要)

### 新增连线类型

需要修改以下文件:

1. `src/shared/types/constants.ts` — `ConnectionType` + 颜色/标签
2. `src/engine/topology/nodes/DeviceNode.tsx` — Handle 定义
3. `src/engine/topology/nodes/ExternalNodeNode.tsx` — Handle 定义
4. `src/engine/topology/edges/SignalEdge.tsx` — 边渲染
5. `src/engine/topology/auto-wiring.ts` — 自动接线规则
6. `src/engine/canvas2d/Canvas2D.tsx` — 2D 连线渲染
