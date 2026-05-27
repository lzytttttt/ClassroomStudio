# 设备资产目录

> 最后更新: 2026-05-27
> 设备总数: 47 种
> 定义文件: `src/features/component-library/assets-data.ts`

## 分类总览

| 分类 | ID | 数量 | 说明 |
|------|----|------|------|
| 桌椅家具 | `furniture` | 5 | 课桌椅、讲台、黑板、柜体 |
| 显示设备 | `display` | 9 | 智慧黑板、投影、大屏、班牌 |
| 音视频 | `av` | 10 | 摄像头、麦克风、音响、录播 |
| 网络设备 | `network` | 3 | AP、交换机、路由器 |
| 计算终端 | `computing` | 8 | 电脑、平板、充电柜、中控 |
| 实验器材 | `lab` | 4 | 实验台、显微镜、传感器、3D 打印 |
| 基础设施 | `infrastructure` | 8 | 空调、照明、机柜、门禁、新风 |

## 桌椅家具 (furniture)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 |
|----|------|---------------------|---------|
| `asset-desk-student` | 学生课桌 | 600×400×750 | ¥350 |
| `asset-chair-student` | 学生椅 | 420×420×800 | ¥180 |
| `asset-desk-teacher` | 教师讲台 | 1200×600×900 | ¥1,200 |
| `asset-blackboard` | 传统黑板 | 4000×100×1200 | ¥800 |
| `asset-cabinet` | 储物柜 | 900×450×1800 | ¥600 |

## 显示设备 (display)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-smart-board` | 智慧黑板 | 4200×150×1200 | ¥35,000 | HDMI, USB, WiFi |
| `asset-interactive-screen` | 交互大屏 | 1920×100×1080 | ¥25,000 | HDMI, USB-C, WiFi |
| `asset-projector` | 投影仪 | 340×260×100 | ¥8,000 | HDMI, VGA, USB |
| `asset-projection-screen` | 投影幕布 | 2600×80×1500 | ¥1,500 | - |
| `asset-class-board` | 电子班牌 | 500×320×40 | ¥3,500 | RJ45, WiFi, RFID |
| `asset-whiteboard-pen` | 电子白板笔 | 160×25×15 | ¥300 | 蓝牙, USB 充电 |
| `asset-info-display` | 信息发布屏 | 1000×560×55 | ¥8,000 | HDMI, RJ45, WiFi |
| `asset-class-sign` | 电子班牌 | 520×300×40 | ¥4,500 | RJ45, WiFi, USB, IC 卡 |
| `asset-led-panel` | LED 护眼灯 | 1200×300×60 | ¥400 | 220V |

## 音视频 (av)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-camera-ptz` | PTZ 摄像头 | 200×200×250 | ¥6,000 | RJ45, RS485 |
| `asset-camera-fixed` | 固定摄像头 | 120×120×120 | ¥2,500 | RJ45 |
| `asset-recording-host` | 录播主机 | 430×450×90 | ¥28,000 | HDMI, SDI, RJ45, USB |
| `asset-speaker` | 壁挂音响 | 180×160×280 | ¥800 | RCA |
| `asset-microphone` | 全向麦克风 | 120×120×40 | ¥2,000 | XLR, USB |
| `asset-amplifier` | 功放机 | 430×150×320 | ¥2,500 | RCA, Optical |
| `asset-audio-mixer` | 调音台 | 250×70×300 | ¥3,200 | XLR, USB, TRS |
| `asset-wireless-mic` | 无线话筒 | 200×45×150 | ¥1,800 | XLR |
| `asset-hanging-mic` | 吊顶麦克风 | 600×600×30 | ¥4,500 | RJ45, Dante |
| `asset-campus-broadcaster` | 广播音柱 | 140×350×120 | ¥1,200 | IP 网络, 100V |
| `asset-document-camera` | 高拍仪 | 280×150×380 | ¥1,500 | USB, HDMI |

## 网络设备 (network)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-switch` | 交换机 | 440×250×44 | ¥3,500 | RJ45×24, SFP×4 |
| `asset-ap` | 无线 AP | 200×200×50 | ¥1,500 | RJ45, PoE |
| `asset-router` | 核心路由器 | 440×44×360 | ¥8,500 | WAN×2, LAN×8 |

## 计算终端 (computing)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-pc-desktop` | 台式电脑 | 180×380×350 | ¥4,500 | HDMI, DP, USB×6, RJ45 |
| `asset-pc-laptop` | 笔记本电脑 | 325×225×20 | ¥5,500 | HDMI, USB-C, USB×2, RJ45 |
| `asset-charging-cart` | 充电柜 | 700×500×1100 | ¥8,000 | 220V |
| `asset-control-panel` | 中控面板 | 220×150×50 | ¥3,500 | RJ45, RS232, IR |
| `asset-ups-battery` | UPS 电源 | 190×330×400 | ¥2,500 | RS232, USB |
| `asset-server-rack` | 机架服务器 | 482×87×750 | ¥35,000 | RJ45×4, SFP+, FC |
| `asset-clicker` | 学生答题器 | 80×130×18 | ¥120 | RF 2.4G |
| `asset-tablet` | 学生平板 | 250×170×8 | ¥2,800 | WiFi, USB-C, 蓝牙 |
| `asset-central-control` | 中控主机 | 430×44×300 | ¥6,000 | RS232, RS485, IR, RJ45, HDMI |

## 实验器材 (lab)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-lab-table` | 实验台 | 1800×750×800 | ¥2,800 | - |
| `asset-microscope` | 数码显微镜 | 200×250×400 | ¥3,500 | USB |
| `asset-sensor-kit` | 传感器套件 | 300×200×80 | ¥1,200 | USB, BLE |
| `asset-3d-printer` | 3D 打印机 | 450×450×470 | ¥5,000 | USB, SD 卡, WiFi |

## 基础设施 (infrastructure)

| ID | 名称 | 默认尺寸 (W×H×D mm) | 默认价格 | 接口 |
|----|------|---------------------|---------|------|
| `asset-air-conditioner` | 智能空调 | 400×1800×400 | ¥6,500 | WiFi, IR |
| `asset-curtain-motor` | 窗帘电机 | 50×250×50 | ¥800 | Zigbee |
| `asset-environment-sensor` | 环境检测仪 | 80×80×30 | ¥500 | RS485, LoRa |
| `asset-smart-light` | 护眼灯管 | 1200×30×60 | ¥300 | WiFi, 蓝牙 Mesh |
| `asset-network-cabinet` | 标准机柜 | 600×2000×800 | ¥1,500 | - |
| `asset-access-control` | 门禁读卡器 | 90×130×25 | ¥800 | RS485, Wiegand |
| `asset-led-panel` | LED 护眼灯 | 1200×300×60 | ¥400 | 220V |
| `asset-ups` | UPS 电源 | 300×500×200 | ¥3,500 | 220V 输入/输出 |
| `asset-air-purifier` | 新风净化器 | 500×350×250 | ¥6,000 | 220V, WiFi |

## 扩展设备

### 添加新设备的步骤

1. **定义资产** — `src/features/component-library/assets-data.ts`
2. **2D 渲染** — `src/engine/canvas2d/component-renderers.tsx`
3. **2.5D 几何** — `src/graphics/core/definitions.ts`
4. **空间语义** (可选) — `src/shared/utils/spatialDefaults.ts`

详见 [开发指南 - 添加新设备](development-guide.md#添加新设备)。

### 设备分类体系

分类定义在 `src/shared/types/constants.ts` 的 `AssetCategory` 类型中:

```ts
type AssetCategory =
  | 'furniture'       // 桌椅、讲台、黑板、柜体
  | 'display'         // 智慧黑板、交互大屏、投影
  | 'av'              // 摄像头、录播主机、音响、麦克风
  | 'network'         // AP、交换机
  | 'computing'       // 电脑终端、充电设备、控制面板
  | 'lab'             // 实验仪器、实验台、传感器
  | 'infrastructure'; // 门、窗、电源插座
```

添加新分类需同时更新 `AssetCategory`、`CATEGORY_LABELS`、`CATEGORY_ICONS`。
