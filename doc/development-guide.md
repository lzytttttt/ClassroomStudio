# 开发指南

> 最后更新: 2026-05-27

## 环境要求

- Node.js >= 18
- npm >= 9

## 快速开始

```bash
npm install
npm run dev    # http://localhost:5173
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | Vite 开发服务器 (HMR 热更新) |
| `npm run build` | `tsc` 类型检查 + `vite build` 生产构建 |
| `npm run test` | Vitest 监听模式 (开发时使用) |
| `npm run test:run` | Vitest 单次运行 (CI / 提交前) |
| `npm run lint` | ESLint 检查 |
| `npm run format` | Prettier 自动格式化 |
| `npm run format:check` | Prettier 格式检查 (不修改文件) |

## 代码风格

### Prettier 配置

- 单引号 (`'`)
- 分号
- 尾逗号
- 120 字符行宽
- 2 空格缩进

### 路径别名

`@/` 映射到 `src/`，在 `tsconfig.json` 和 `vite.config.ts` 中同步配置:

```ts
import { useSceneStore } from '@/store/sceneStore';
import type { Scene } from '@/shared/types';
```

### 命名约定

- **组件文件**: PascalCase (`Canvas2D.tsx`, `PropertyPanel.tsx`)
- **工具/逻辑文件**: camelCase (`auto-wiring.ts`, `spatialDefaults.ts`)
- **类型文件**: camelCase (`index.ts`, `interaction.ts`, `constants.ts`)
- **测试文件**: 与源文件同名 + `.test.ts` (`isometric.test.ts`)
- **CSS 文件**: camelCase (`globals.css`)

## 架构分层

```
store/        ← 状态管理 (Zustand)
shared/       ← 类型、工具、Schema (无 UI 依赖)
engine/       ← 渲染引擎 (消费 store + shared)
features/     ← UI 功能模块 (消费 store + shared)
pages/        ← 页面级组合 (组合 engine + features)
```

### 依赖方向

```
pages → engine, features
engine → store, shared, graphics
features → store, shared
store → shared (types only)
shared → (无依赖)
```

**规则**: `store` 不依赖 `engine` 或 `features`。`shared` 不依赖任何其他层。

## 状态管理

### 四个 Store

| Store | 文件 | 职责 |
|-------|------|------|
| `sceneStore` | `store/sceneStore.ts` | 场景数据、选择、视图配置、剪贴板、图层/编组/对齐 |
| `projectStore` | `store/projectStore.ts` | 项目 CRUD、Dexie 持久化 |
| `uiStore` | `store/uiStore.ts` | 工具模式、侧边栏、连线状态、Toast |
| `interactionStore` | `store/interactionStore.ts` | 交互运行时状态 |

### 使用原则

- 使用 Zustand selector 优化订阅粒度，避免全量订阅
- UI 状态 (如 tool mode、sidebar) 放 `uiStore`，不放 `sceneStore`
- Undo/Redo 只作用于 `sceneStore` 的 `scene` 字段

```ts
// 好: 使用 selector
const components = useSceneStore(s => s.scene.components);

// 避免: 全量订阅
const { scene } = useSceneStore();
```

## 测试

### 文件组织

测试文件与源文件同目录:

```
src/graphics/core/isometric.ts
src/graphics/core/isometric.test.ts
src/shared/utils/spatialDefaults.ts
src/shared/utils/spatialDefaults.test.ts
```

### 编写测试

```ts
import { describe, it, expect } from 'vitest';
import { projectToScreen } from './isometric';

describe('projectToScreen', () => {
  it('应将原点投影到屏幕中心', () => {
    const result = projectToScreen(0, 0, 0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});
```

### 测试原则

1. 纯函数优先测试 (无副作用、易断言)
2. Store 测试关键状态转换，不测试实现细节
3. 使用 `describe` 按行为分组，`it` 描述具体场景
4. 测试行为而非实现 (不依赖内部结构)

## 添加新设备

### 1. 定义资产

在 `src/features/component-library/assets-data.ts` 的 `builtinAssets` 数组中添加:

```ts
{
  id: 'asset-my-device',
  name: '我的设备',
  category: 'av',           // 选择已有分类
  subcategory: '自定义',
  defaultProperties: { price: 1000, brand: '品牌', model: '型号', interfaces: ['HDMI'], power: 50 },
  icon2d: 'my-device',      // 对应 component-renderers 中的渲染函数名
  color: '#3B82F6',
  defaultSize: { width: 300, height: 200, depth: 150 },  // mm
  isBuiltin: true,
  tags: ['标签1', '标签2'],
}
```

### 2. 添加 2D 渲染

在 `src/engine/canvas2d/component-renderers.tsx` 中添加渲染函数:

```ts
case 'my-device':
  return (
    <Group>
      {/* Konva 形状 */}
    </Group>
  );
```

### 3. 添加 2.5D 几何定义

在 `src/graphics/core/definitions.ts` 中注册 ShapePrimitive:

```ts
'my-device': {
  shapes: [
    { type: 'box', w: 300, h: 200, d: 150, color: '#3B82F6' },
  ],
}
```

### 4. 添加空间语义默认值 (可选)

在 `src/shared/utils/spatialDefaults.ts` 中添加映射:

```ts
case 'asset-my-device':
  return { mountType: 'desktop', objectHeight: 150 };
```

## 添加新连线类型

当前支持 4 种连线类型: `network` / `av` / `control` / `power`。

添加新类型需修改:

1. `src/shared/types/constants.ts` — `ConnectionType` 联合类型 + 颜色/标签映射
2. `src/engine/topology/nodes/DeviceNode.tsx` — 添加 Handle
3. `src/engine/topology/nodes/ExternalNodeNode.tsx` — 添加 Handle
4. `src/engine/topology/edges/SignalEdge.tsx` — 边渲染逻辑
5. `src/engine/topology/auto-wiring.ts` — 自动接线规则
6. `src/engine/canvas2d/Canvas2D.tsx` — 2D 画布连线渲染

## 调试技巧

### Zustand Devtools

安装 [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/) 浏览器扩展，可在 DevTools 中查看 Zustand 状态变化。

### React Devtools

使用 React DevTools Profiler 分析组件 re-render，特别关注 `Canvas2D` 和 `TopologyView` 的渲染频率。

### 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 画布拖拽卡顿 | sceneStore 全量订阅 | 使用 selector 优化订阅 |
| 2.5D 视图闪烁 | SVG 复杂度过高 | 减少可见组件或降低细节 |
| 拓扑视图循环更新 | scene ↔ ReactFlow 双向同步 | 检查 useEffect 依赖 |
