import { AssetGeometry } from './types';
import { getAssetById } from '../../features/component-library/assets-data';

export const geometryRegistry: Record<string, AssetGeometry> = {};

export function registerGeometry(assetId: string, def: Omit<AssetGeometry, 'assetId'>) {
  geometryRegistry[assetId] = { assetId, ...def };
}

// ===================== 桌椅家具 =====================
registerGeometry('asset-desk-student', {
  shapes: [ // 带有书斗的学生桌
    { id: 'leg-bl', type: 'box', x: -0.4, y: 0.4, z: 0, width: 0.05, depth: 0.05, height: 0.95, color: '#94A3B8' },
    { id: 'leg-tl', type: 'box', x: -0.4, y: -0.4, z: 0, width: 0.05, depth: 0.05, height: 0.95, color: '#94A3B8' },
    { id: 'leg-br', type: 'box', x: 0.4, y: 0.4, z: 0, width: 0.05, depth: 0.05, height: 0.95, color: '#94A3B8' },
    { id: 'leg-tr', type: 'box', x: 0.4, y: -0.4, z: 0, width: 0.05, depth: 0.05, height: 0.95, color: '#94A3B8' },
    { id: 'shelf', type: 'box', x: 0, y: 0, z: 0.7, width: 0.9, depth: 0.8, height: 0.1, color: '#64748B' },
    { id: 'desktop', type: 'box', x: 0, y: 0, z: 0.95, width: 1.0, depth: 1.0, height: 0.05, color: '#D97706' },
  ]
});
registerGeometry('asset-chair-student', {
  shapes: [ // 带椅背的主体
    { id: 'seat', type: 'box', x: 0, y: -0.1, z: 0.45, width: 0.8, depth: 0.8, height: 0.05, color: '#334155' },
    { id: 'back', type: 'box', x: 0, y: -0.45, z: 0.5, width: 0.8, depth: 0.05, height: 0.5, color: '#475569' },
    { id: 'base', type: 'box', x: 0, y: -0.1, z: 0, width: 0.6, depth: 0.6, height: 0.45, color: '#94A3B8' },
  ]
});
registerGeometry('asset-desk-teacher', {
  shapes: [ // 讲台带控制面板凹槽
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.95, depth: 0.8, height: 0.85, color: '#1E293B' },
    { id: 'top', type: 'box', x: 0, y: 0, z: 0.85, width: 1.0, depth: 1.0, height: 0.05, color: '#475569' },
    { id: 'screen-stand', type: 'box', x: 0, y: 0.3, z: 0.9, width: 0.4, depth: 0.2, height: 0.05, color: '#0F172A' },
    { id: 'screen', type: 'box', x: 0, y: 0.3, z: 0.95, width: 0.5, depth: 0.05, height: 0.3, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-blackboard', {
  shapes: [ // 两侧推拉的复合黑板
    { id: 'board-bg', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.1, height: 1.0, color: '#14532D' },
    { id: 'frame-top', type: 'box', x: 0, y: 0, z: 1.0, width: 1.02, depth: 0.12, height: 0.05, color: '#E2E8F0' },
    { id: 'frame-bottom', type: 'box', x: 0, y: 0, z: -0.05, width: 1.02, depth: 0.12, height: 0.05, color: '#E2E8F0' },
  ]
});
registerGeometry('asset-cabinet', {
  shapes: [ // 高柜
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 1.0, height: 0.05, color: '#64748B' },
    { id: 'body', type: 'box', x: 0, y: 0, z: 0.05, width: 0.95, depth: 0.95, height: 0.95, color: '#94A3B8' },
    { id: 'door-l', type: 'box', x: -0.25, y: -0.48, z: 0.05, width: 0.45, depth: 0.02, height: 0.9, color: '#F8FAFC' },
    { id: 'door-r', type: 'box', x: 0.25, y: -0.48, z: 0.05, width: 0.45, depth: 0.02, height: 0.9, color: '#F8FAFC' },
  ]
});

// ===================== 显示设备 =====================
registerGeometry('asset-smart-board', {
  shapes: [ // 包含中间大屏的智慧黑板
    { id: 'panel', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.2, height: 1.0, color: '#0F172A' },
    { id: 'screen', type: 'box', x: 0, y: -0.11, z: 0.05, width: 0.6, depth: 0.02, height: 0.9, color: '#1D4ED8' },
  ]
});
registerGeometry('asset-interactive-screen', {
  shapes: [ // 独立交互大屏
    { id: 'bezel', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.15, height: 1.0, color: '#1E293B' },
    { id: 'glass', type: 'box', x: 0, y: -0.08, z: 0.02, width: 0.96, depth: 0.02, height: 0.96, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-projector', {
  shapes: [ // 投影机
    { id: 'body', type: 'box', x: 0, y: 0.1, z: 0, width: 0.8, depth: 0.8, height: 0.4, color: '#F8FAFC' },
    { id: 'lens', type: 'box', x: 0, y: -0.3, z: 0.1, width: 0.3, depth: 0.1, height: 0.2, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-projection-screen', {
  shapes: [ // 投影幕布（顶部卷筒 + 垂下幕布）
    { id: 'roller', type: 'box', x: 0, y: 0, z: 0.9, width: 1.0, depth: 0.15, height: 0.1, color: '#94A3B8' },
    { id: 'screen', type: 'box', x: 0, y: 0, z: 0, width: 0.9, depth: 0.02, height: 0.9, color: '#F8FAFC' },
  ]
});

// ===================== 音视频设备 =====================
registerGeometry('asset-camera-ptz', {
  shapes: [
    { id: 'mount', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.6, height: 0.2, color: '#475569' },
    { id: 'sphere-sim', type: 'box', x: 0, y: 0, z: 0.2, width: 0.4, depth: 0.4, height: 0.4, color: '#1E293B' },
    { id: 'lens', type: 'box', x: 0, y: -0.15, z: 0.3, width: 0.2, depth: 0.15, height: 0.2, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-camera-fixed', {
  shapes: [ // 枪机
    { id: 'base', type: 'box', x: 0, y: 0.3, z: 0, width: 0.4, depth: 0.2, height: 0.8, color: '#64748B' },
    { id: 'barrel', type: 'box', x: 0, y: -0.1, z: 0.2, width: 0.3, depth: 0.8, height: 0.3, color: '#1E293B' },
    { id: 'lens', type: 'box', x: 0, y: -0.5, z: 0.2, width: 0.25, depth: 0.05, height: 0.25, color: '#EF4444' }, // Red glowing eye
  ]
});
registerGeometry('asset-recording-host', {
  shapes: [
    { id: 'case', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.3, color: '#0F172A' },
    { id: 'panel', type: 'box', x: 0, y: -0.4, z: 0.05, width: 0.9, depth: 0.02, height: 0.2, color: '#334155' },
    { id: 'light', type: 'box', x: -0.3, y: -0.41, z: 0.1, width: 0.05, depth: 0.01, height: 0.05, color: '#10B981' },
  ]
});
registerGeometry('asset-speaker', {
  shapes: [ // 音响带网口倒角感
    { id: 'box', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.8, height: 1.0, color: '#1E293B' },
    { id: 'grill', type: 'box', x: 0, y: -0.41, z: 0.1, width: 0.7, depth: 0.02, height: 0.8, color: '#0F172A' },
  ]
});
registerGeometry('asset-microphone', {
  shapes: [ // 麦桌面底座+杆
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.6, height: 0.1, color: '#334155' },
    { id: 'stem', type: 'box', x: 0, y: -0.1, z: 0.1, width: 0.05, depth: 0.05, height: 0.7, color: '#94A3B8' },
    { id: 'mic', type: 'box', x: 0, y: -0.15, z: 0.8, width: 0.1, depth: 0.1, height: 0.2, color: '#1E293B' },
  ]
});

// ===================== 网络设备 =====================
registerGeometry('asset-switch', {
  shapes: [
    { id: 'case', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.6, height: 0.3, color: '#0284C7' },
    { id: 'ports-row', type: 'box', x: 0, y: -0.31, z: 0.05, width: 0.8, depth: 0.02, height: 0.15, color: '#0F172A' },
  ]
});
registerGeometry('asset-ap', {
  shapes: [ // 吸顶 AP
    { id: 'base', type: 'box', x: 0, y: 0, z: 0.8, width: 0.8, depth: 0.8, height: 0.2, color: '#F8FAFC' },
    { id: 'ring', type: 'box', x: 0, y: 0, z: 0.75, width: 0.5, depth: 0.5, height: 0.05, color: '#10B981' }, // emerald glow
  ]
});

// ===================== 计算终端 =====================
registerGeometry('asset-pc-desktop', {
  shapes: [
    { id: 'tower', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.9, height: 1.0, color: '#0F172A' },
    { id: 'front-io', type: 'box', x: 0, y: -0.46, z: 0.7, width: 0.3, depth: 0.02, height: 0.2, color: '#334155' },
  ]
});
registerGeometry('asset-pc-laptop', {
  shapes: [ // 展开的笔记本
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.1, color: '#94A3B8' },
    { id: 'kbd', type: 'box', x: 0, y: 0, z: 0.1, width: 0.8, depth: 0.4, height: 0.02, color: '#334155' },
    { id: 'screen', type: 'box', x: 0, y: 0.38, z: 0.1, width: 1.0, depth: 0.05, height: 0.7, color: '#475569' },
    { id: 'glass', type: 'box', x: 0, y: 0.35, z: 0.15, width: 0.9, depth: 0.02, height: 0.6, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-charging-cart', {
  shapes: [
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.9, depth: 0.9, height: 0.9, color: '#059669' }, // Emerald charging cart
    { id: 'door', type: 'box', x: 0, y: -0.46, z: 0.1, width: 0.8, depth: 0.02, height: 0.7, color: '#D1D5DB' },
    { id: 'wheels', type: 'box', x: 0, y: 0, z: -0.1, width: 0.8, depth: 0.8, height: 0.1, color: '#1E293B' },
  ]
});
registerGeometry('asset-control-panel', {
  shapes: [ // 桌面倾斜中控台
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.6, height: 0.2, color: '#334155' },
    { id: 'tilt', type: 'box', x: 0, y: -0.1, z: 0.2, width: 0.8, depth: 0.4, height: 0.2, color: '#1E293B' },
    { id: 'screen', type: 'box', x: 0, y: -0.12, z: 0.41, width: 0.7, depth: 0.35, height: 0.02, color: '#4F46E5' },
  ]
});

// ===================== 实验器材 =====================
registerGeometry('asset-lab-table', {
  shapes: [ // 实验桌带有中间隔水板
    { id: 'top', type: 'box', x: 0, y: 0, z: 0.8, width: 1.0, depth: 1.0, height: 0.1, color: '#E2E8F0' },
    { id: 'divider', type: 'box', x: 0, y: 0, z: 0.9, width: 1.0, depth: 0.1, height: 0.3, color: '#94A3B8' }, // 挡板
    { id: 'leg-l', type: 'box', x: -0.4, y: 0, z: 0, width: 0.1, depth: 0.8, height: 0.8, color: '#64748B' },
    { id: 'leg-r', type: 'box', x: 0.4, y: 0, z: 0, width: 0.1, depth: 0.8, height: 0.8, color: '#64748B' },
  ]
});
registerGeometry('asset-microscope', {
  shapes: [
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.8, height: 0.2, color: '#64748B' },
    { id: 'arm', type: 'box', x: 0, y: 0.2, z: 0.2, width: 0.3, depth: 0.3, height: 0.6, color: '#CBD5E1' },
    { id: 'lens', type: 'box', x: 0, y: 0, z: 0.5, width: 0.2, depth: 0.2, height: 0.3, color: '#334155' },
  ]
});
registerGeometry('asset-sensor-kit', {
  shapes: [
    { id: 'box', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.6, height: 0.4, color: '#8B5CF6' },
    { id: 'probe', type: 'box', x: 0.2, y: -0.35, z: 0.1, width: 0.1, depth: 0.3, height: 0.1, color: '#D1D5DB' },
  ]
});

// ===================== 新增音视频扩展设备 =====================
registerGeometry('asset-amplifier', {
  shapes: [ // 功放
    { id: 'chassis', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.4, color: '#334155' },
    { id: 'knob', type: 'box', x: 0.3, y: -0.41, z: 0.1, width: 0.15, depth: 0.05, height: 0.15, color: '#94A3B8' },
  ]
});
registerGeometry('asset-audio-mixer', {
  shapes: [ // 调音台
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.1, color: '#475569' },
    { id: 'faders', type: 'box', x: 0, y: 0.2, z: 0.1, width: 0.8, depth: 0.5, height: 0.05, color: '#1E293B' },
  ]
});
registerGeometry('asset-wireless-mic', {
  shapes: [
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.4, height: 0.2, color: '#475569' },
    { id: 'antenna-1', type: 'box', x: -0.3, y: 0.2, z: 0.2, width: 0.05, depth: 0.05, height: 0.4, color: '#1E293B' },
    { id: 'antenna-2', type: 'box', x: 0.3, y: 0.2, z: 0.2, width: 0.05, depth: 0.05, height: 0.4, color: '#1E293B' },
  ]
});
registerGeometry('asset-hanging-mic', {
  shapes: [ // 吊顶麦克风（阵列面板）
    { id: 'panel', type: 'box', x: 0, y: 0, z: 0.9, width: 1.0, depth: 1.0, height: 0.1, color: '#F8FAFC' },
    { id: 'core', type: 'box', x: 0, y: 0, z: 0.85, width: 0.5, depth: 0.5, height: 0.05, color: '#E2E8F0' },
  ]
});
registerGeometry('asset-campus-broadcaster', {
  shapes: [ // 校园广播音柱
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.5, height: 1.0, color: '#94A3B8' },
    { id: 'mesh', type: 'box', x: 0, y: -0.26, z: 0.1, width: 0.4, depth: 0.02, height: 0.8, color: '#475569' },
  ]
});

// ===================== 基础感知与温控设备 =====================
registerGeometry('asset-air-conditioner', {
  shapes: [ // 立柜式空调
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.6, height: 1.0, color: '#F8FAFC' },
    { id: 'vent', type: 'box', x: 0, y: -0.31, z: 0.7, width: 0.6, depth: 0.02, height: 0.2, color: '#334155' },
    { id: 'display', type: 'box', x: 0, y: -0.31, z: 0.5, width: 0.2, depth: 0.02, height: 0.1, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-curtain-motor', {
  shapes: [ // 窗帘导轨和电机
    { id: 'rail', type: 'box', x: 0, y: 0, z: 0.9, width: 1.0, depth: 0.1, height: 0.1, color: '#E2E8F0' },
    { id: 'motor', type: 'box', x: 0.4, y: 0, z: 0.5, width: 0.1, depth: 0.1, height: 0.4, color: '#94A3B8' },
  ]
});
registerGeometry('asset-environment-sensor', {
  shapes: [ // 壁挂/顶装 环境传感器
    { id: 'base', type: 'box', x: 0, y: 0, z: 0.7, width: 0.6, depth: 0.6, height: 0.1, color: '#F1F5F9' },
    { id: 'sensor', type: 'box', x: 0, y: 0, z: 0.6, width: 0.3, depth: 0.3, height: 0.1, color: '#059669' },
  ]
});
registerGeometry('asset-smart-light', {
  shapes: [ // 护眼灯
    { id: 'fixture', type: 'box', x: 0, y: 0, z: 0.9, width: 1.0, depth: 0.4, height: 0.1, color: '#F8FAFC' },
    { id: 'bulb', type: 'box', x: 0, y: 0, z: 0.85, width: 0.9, depth: 0.2, height: 0.05, color: '#FEF08A' }, // glowing yellow
  ]
});

// ===================== 计算与支持外设 =====================
registerGeometry('asset-class-board', {
  shapes: [ // 电子班牌
    { id: 'frame', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.1, height: 0.8, color: '#E2E8F0' },
    { id: 'screen', type: 'box', x: 0, y: -0.06, z: 0.1, width: 0.9, depth: 0.02, height: 0.6, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-ups-battery', {
  shapes: [
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.9, height: 0.8, color: '#020617' },
    { id: 'vents', type: 'box', x: 0, y: -0.46, z: 0.2, width: 0.4, depth: 0.02, height: 0.4, color: '#334155' },
  ]
});
registerGeometry('asset-network-cabinet', {
  shapes: [ // 机柜
    { id: 'rack', type: 'box', x: 0, y: 0, z: 0, width: 0.9, depth: 0.9, height: 1.0, color: '#1E293B' },
    { id: 'door-glass', type: 'box', x: 0, y: -0.46, z: 0.05, width: 0.8, depth: 0.02, height: 0.9, color: '#0EA5E9', opacity: 0.4 }, // Transparent front
    { id: 'server-1', type: 'box', x: 0, y: -0.1, z: 0.2, width: 0.7, depth: 0.6, height: 0.1, color: '#475569' },
    { id: 'server-2', type: 'box', x: 0, y: -0.1, z: 0.4, width: 0.7, depth: 0.6, height: 0.1, color: '#475569' },
    { id: 'server-3', type: 'box', x: 0, y: -0.1, z: 0.6, width: 0.7, depth: 0.6, height: 0.1, color: '#475569' },
  ]
});
registerGeometry('asset-server-rack', {
  shapes: [ // 机架式服务器单体
    { id: 'chassis', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.2, color: '#0F172A' },
    { id: 'panel', type: 'box', x: 0, y: -0.41, z: 0.02, width: 0.9, depth: 0.02, height: 0.16, color: '#334155' },
    { id: 'drive-1', type: 'box', x: -0.3, y: -0.42, z: 0.05, width: 0.1, depth: 0.02, height: 0.1, color: '#94A3B8' },
  ]
});
registerGeometry('asset-router', {
  shapes: [
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.7, height: 0.2, color: '#0EA5E9' },
    { id: 'antenna', type: 'box', x: -0.4, y: 0.3, z: 0.2, width: 0.05, depth: 0.05, height: 0.4, color: '#334155' },
    { id: 'antenna2', type: 'box', x: 0.4, y: 0.3, z: 0.2, width: 0.05, depth: 0.05, height: 0.4, color: '#334155' },
  ]
});
registerGeometry('asset-access-control', {
  shapes: [
    { id: 'pad', type: 'box', x: 0, y: 0, z: 0.4, width: 0.5, depth: 0.1, height: 0.6, color: '#334155' },
    { id: 'sensor-area', type: 'box', x: 0, y: -0.06, z: 0.5, width: 0.3, depth: 0.02, height: 0.3, color: '#F43F5E' },
  ]
});

// 通用 Fallback Geometry
export function getAssetGeometry(assetId: string): AssetGeometry {
  if (geometryRegistry[assetId]) {
    return geometryRegistry[assetId];
  }
  
  const asset = getAssetById(assetId);
  if (!asset) {
    return {
      assetId,
      shapes: [{ id: 'fallback', type: 'box', x: 0, y: 0, z: 0, width: 1, depth: 1, height: 1, color: '#cbd5e1' }]
    };
  }

  return {
    assetId,
    shapes: [
      { 
        id: 'main-body', 
        type: 'box', 
        x: 0, y: 0, z: 0, 
        width: 1, depth: 1, 
        height: Math.max(0.1, asset.defaultSize.height / asset.defaultSize.width), 
        color: asset.color 
      }
    ]
  };
}
