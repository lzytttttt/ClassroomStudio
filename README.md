# ClassRoom Studio (Classroom Simulator / Classroom Tycoon)

ClassRoom Studio 是一款针对教育场景和智慧教室设计的**高保真、纯前端驱动的专业设计与配置模拟器**。它融合了 "Tycoon"（模拟经营）的交互灵感与工业级 CAD 工具的严谨性，旨在帮助系统集成商、产品经理和方案售前快速搭建、布线并三维可视化演示教室解决方案。

## ✨ 核心特性

### 🎨 双视角专业级编辑器
- **2D 俯视蓝图编辑器** (基于 `react-konva`)：支持拖拽放置设备、网格吸附、无限平移缩放、批量框选。
- **2.5D 等距轴测视图** (纯数学推演 + SVG)：自研图形引擎将 2D 坐标系实时投射至 30度/45度 等距视角。不仅支持动态 Z-Sorting 深度排序，还能基于组件颜色自动生成高级的光影和高光质感模型，告别静态切图。

### 🔌 组件交互与综合布线系统 (v0.3)
支持直接在画布上连接各个设备，还原真实弱电工程实施场景：
- **四类专业管线**：支持网络线(蓝)、音视频线(紫)、控制线(青)、电源线(红)。
- **智能交互体验**：提供直观的"选择连线源 👉 选择目标 👉 分配线型"两步流，内置动画贝塞尔连线和物理端点指示。

### 📦 广域的专业资产库
内置多达 47 种细分教育设备（支持 2D & 2.5D 双模渲染）：
- **基础家具**：学生课桌椅、教师多功能讲台、推拉黑板、储物柜。
- **多媒体显示**：智慧黑板、交互大屏、投影仪、幕布、LED信息屏、电子班牌。
- **音视频设备**：PTZ 摄像头、全向麦、无线话简、调音台、录播主机、音柱等。
- **计算与拓扑**：笔记本、学生平板、核心路由器、交换机、机房机柜、UPS 电源。
- **创客与基建**：3D 打印机、高拍仪、新风净化机、智能空调、环境传感器等。

### 💾 强健的工程与架构体系
- **客户端先行本地存储**：依托 `Dexie.js` (IndexedDB)，支持项目的完全离线运行、自动存盘与大型配置工程的高速读取。
- **状态流管理**：依靠 `Zustand` 和 `zundo` 实现状态解耦与顺滑的撤销重做（Undo/Redo）功能。

## 🛠️ 技术栈

本项目基于现代 Web 标准构建，不依赖传统 3D 引擎负担，轻量高效：
- **前端框架**：[React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) + TypeScript
- **状态管理**：[Zustand](https://github.com/pmndrs/zustand) + [Zundo](https://github.com/charkour/zundo)
- **本地数据库**：[Dexie.js](https://dexie.org/)
- **图形渲染**：[Konva.js / react-konva](https://konvajs.org/) (2D画布) & SVG Isometric Math (2.5D画布) & [React Flow](https://reactflow.dev/) (拓扑分析)
- **UI & 样式**：[Tailwind CSS v4](https://tailwindcss.com/) + Glassmorphism 极具未来感的亚克力 UI。

## 🚀 快速启动

1. **克隆仓库**
   ```bash
   git clone https://github.com/lzytttttt/ClassroomStudio.git
   cd ClassroomStudio
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **运行开发服务器**
   ```bash
   npm run dev
   ```
   随后在浏览器中打开 `http://localhost:5173/` 即可进入系统。

## 🗺️ 演进路线

- [x] **v0.1**: 建立基础 2D Canvas 编辑环境与底层 IndexedDB 项目管理系统。 
- [x] **v0.2**: 开发 2.5D 等距视图投射引擎与 React Flow 信号流拓扑视图。
- [x] **v0.3**: 实装 2D 真实连接系统、大幅扩充至 47 种物理设备，补全并精修所有硬件的 2.5D 模型渲染。
- [ ] **v0.4 (Next)**: 演示汇报模式 (Presentation Mode) —— 步进式生成幻灯片动画序列。
- [ ] **v0.5**: 自动规范合规检查引擎及基于 `jsPDF` 的物料清单 (BOM) 与专业报价单导出。

## 👨‍💻 作者与参与者
由 Google Deepmind Advanced Agentic Coding 团队的 Antigravity 协助构建与演进迭代。

---
*「让每一处教育数字化的细节都在画布中鲜活可见。」*
