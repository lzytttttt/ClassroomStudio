import { AssetGeometry } from './types';
import { getAssetById } from '../../features/component-library/assets-data';

export const geometryRegistry: Record<string, AssetGeometry> = {};

export function registerGeometry(assetId: string, def: Omit<AssetGeometry, 'assetId'>) {
  geometryRegistry[assetId] = { assetId, ...def };
}

// ===================== 桌椅家具 =====================
registerGeometry('asset-desk-student', {
  shapes: [ 
    { id: 'leg-1', type: 'box', x: -0.4, y: 0.4, z: 0, width: 0.05, depth: 0.05, height: 0.75, color: '#475569' },
    { id: 'leg-2', type: 'box', x: 0.4, y: 0.4, z: 0, width: 0.05, depth: 0.05, height: 0.75, color: '#475569' },
    { id: 'leg-3', type: 'box', x: -0.4, y: -0.4, z: 0, width: 0.05, depth: 0.05, height: 0.75, color: '#475569' },
    { id: 'leg-4', type: 'box', x: 0.4, y: -0.4, z: 0, width: 0.05, depth: 0.05, height: 0.75, color: '#475569' },
    { id: 'shelf', type: 'box', x: 0, y: 0, z: 0.5, width: 0.8, depth: 0.7, height: 0.1, color: '#64748B' },
    { id: 'desktop', type: 'box', x: 0, y: 0, z: 0.75, width: 1.0, depth: 1.0, height: 0.05, color: '#D4B896' },
    { id: 'edge', type: 'box', x: 0, y: 0, z: 0.8, width: 1.0, depth: 1.0, height: 0.01, color: '#B8976A' },
  ]
});
registerGeometry('asset-chair-student', {
  shapes: [ 
    { id: 'leg-base', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.5, height: 0.05, color: '#475569' },
    { id: 'stem', type: 'box', x: 0, y: 0, z: 0.05, width: 0.1, depth: 0.1, height: 0.35, color: '#64748B' },
    { id: 'seat', type: 'box', x: 0, y: 0, z: 0.4, width: 0.8, depth: 0.8, height: 0.08, color: '#334155' },
    { id: 'back-support', type: 'box', x: 0, y: 0.35, z: 0.48, width: 0.1, depth: 0.1, height: 0.4, color: '#64748B' },
    { id: 'backrest', type: 'box', x: 0, y: 0.4, z: 0.6, width: 0.7, depth: 0.08, height: 0.4, color: '#475569' },
  ]
});
registerGeometry('asset-desk-teacher', {
  shapes: [ 
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.9, depth: 0.8, height: 0.8, color: '#5C4033' },
    { id: 'drawer-front', type: 'box', x: 0, y: -0.4, z: 0.5, width: 0.8, depth: 0.02, height: 0.2, color: '#4A3428' },
    { id: 'desktop', type: 'box', x: 0, y: 0, z: 0.8, width: 1.0, depth: 1.0, height: 0.05, color: '#6B4A3A' },
    { id: 'monitor-base', type: 'box', x: 0.2, y: 0.1, z: 0.85, width: 0.2, depth: 0.2, height: 0.05, color: '#1E293B' },
    { id: 'monitor-panel', type: 'box', x: 0.2, y: 0.1, z: 0.9, width: 0.5, depth: 0.05, height: 0.3, color: '#0F172A' },
  ]
});

// ===================== 显示设备 =====================
registerGeometry('asset-smart-board', {
  shapes: [ 
    { id: 'wing-l', type: 'box', x: -0.375, y: 0, z: 0, width: 0.25, depth: 0.1, height: 0.9, color: '#14532D' },
    { id: 'wing-r', type: 'box', x: 0.375, y: 0, z: 0, width: 0.25, depth: 0.1, height: 0.9, color: '#14532D' },
    { id: 'center-frame', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.15, height: 1.0, color: '#1E293B' },
    { id: 'screen', type: 'box', x: 0, y: -0.05, z: 0.05, width: 0.46, depth: 0.02, height: 0.85, color: '#1E3A5F' },
    { id: 'shelf', type: 'box', x: 0, y: 0, z: -0.05, width: 1.0, depth: 0.2, height: 0.05, color: '#94A3B8' },
  ]
});
registerGeometry('asset-interactive-screen', {
  shapes: [ 
    { id: 'back', type: 'box', x: 0, y: 0.05, z: 0, width: 1.0, depth: 0.1, height: 1.0, color: '#111827' },
    { id: 'bezel', type: 'box', x: 0, y: 0, z: 0, width: 0.98, depth: 0.05, height: 0.98, color: '#374151' },
    { id: 'screen', type: 'box', x: 0, y: -0.02, z: 0.02, width: 0.94, depth: 0.01, height: 0.94, color: '#0C4A6E' },
  ]
});
registerGeometry('asset-projector', {
  shapes: [ 
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.8, height: 0.4, color: '#E5E7EB' },
    { id: 'lens-mount', type: 'box', x: -0.2, y: -0.35, z: 0.1, width: 0.3, depth: 0.1, height: 0.2, color: '#9CA3AF' },
    { id: 'lens', type: 'box', x: -0.2, y: -0.42, z: 0.15, width: 0.15, depth: 0.05, height: 0.1, color: '#1F2937' },
    { id: 'vent', type: 'box', x: 0.3, y: 0, z: 0.1, width: 0.1, depth: 0.6, height: 0.2, color: '#9CA3AF' },
  ]
});

// ===================== 新增教育设备 (Task 2) =====================
registerGeometry('asset-whiteboard-pen', {
  shapes: [
    { id: 'barrel', type: 'box', x: 0, y: 0, z: 0.2, width: 1.0, depth: 0.2, height: 0.2, color: '#E5E7EB' },
    { id: 'tip', type: 'box', x: -0.45, y: 0, z: 0.2, width: 0.1, depth: 0.15, height: 0.15, color: '#6B7280' },
    { id: 'button', type: 'box', x: 0.1, y: 0, z: 0.3, width: 0.2, depth: 0.1, height: 0.05, color: '#8B5CF6' },
  ]
});
registerGeometry('asset-clicker', {
  shapes: [
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 1.0, height: 0.2, color: '#F3F4F6' },
    { id: 'btn-1', type: 'box', x: -0.2, y: -0.2, z: 0.2, width: 0.3, depth: 0.3, height: 0.05, color: '#EF4444' },
    { id: 'btn-2', type: 'box', x: 0.2, y: -0.2, z: 0.2, width: 0.3, depth: 0.3, height: 0.05, color: '#3B82F6' },
    { id: 'btn-3', type: 'box', x: -0.2, y: 0.2, z: 0.2, width: 0.3, depth: 0.3, height: 0.05, color: '#F59E0B' },
    { id: 'btn-4', type: 'box', x: 0.2, y: 0.2, z: 0.2, width: 0.3, depth: 0.3, height: 0.05, color: '#10B981' },
  ]
});
registerGeometry('asset-tablet', {
  shapes: [
    { id: 'case', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 1.0, height: 0.05, color: '#111827' },
    { id: 'screen', type: 'box', x: 0, y: 0, z: 0.05, width: 0.92, depth: 0.92, height: 0.01, color: '#1E3A5F' },
  ]
});
registerGeometry('asset-3d-printer', {
  shapes: [
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 1.0, height: 0.15, color: '#1F2937' },
    { id: 'post-l', type: 'box', x: -0.4, y: 0, z: 0.15, width: 0.1, depth: 0.1, height: 0.8, color: '#374151' },
    { id: 'post-r', type: 'box', x: 0.4, y: 0, z: 0.15, width: 0.1, depth: 0.1, height: 0.8, color: '#374151' },
    { id: 'crossbar', type: 'box', x: 0, y: 0, z: 0.85, width: 1.0, depth: 0.1, height: 0.1, color: '#374151' },
    { id: 'bed', type: 'box', x: 0, y: 0, z: 0.2, width: 0.7, depth: 0.7, height: 0.05, color: '#4B5563' },
    { id: 'head', type: 'box', x: 0, y: 0, z: 0.5, width: 0.2, depth: 0.2, height: 0.2, color: '#F97316' },
  ]
});
registerGeometry('asset-document-camera', {
  shapes: [
    { id: 'base', type: 'box', x: 0, y: 0.3, z: 0, width: 0.6, depth: 0.4, height: 0.1, color: '#D1D5DB' },
    { id: 'arm-v', type: 'box', x: 0, y: 0.4, z: 0.1, width: 0.1, depth: 0.1, height: 0.8, color: '#94A3B8' },
    { id: 'arm-h', type: 'box', x: 0, y: 0.1, z: 0.8, width: 0.1, depth: 0.6, height: 0.1, color: '#94A3B8' },
    { id: 'head', type: 'box', x: 0, y: -0.2, z: 0.75, width: 0.2, depth: 0.3, height: 0.15, color: '#1F2937' },
    { id: 'lens', type: 'box', x: 0, y: -0.2, z: 0.7, width: 0.1, depth: 0.1, height: 0.05, color: '#14B8A6' },
  ]
});
registerGeometry('asset-led-panel', {
  shapes: [
    { id: 'frame', type: 'box', x: 0, y: 0, z: 0.95, width: 1.0, depth: 0.4, height: 0.05, color: '#FBBF24' },
    { id: 'panel', type: 'box', x: 0, y: 0, z: 0.92, width: 0.95, depth: 0.35, height: 0.03, color: '#FEF9C3' },
  ]
});
registerGeometry('asset-curtain-motor', {
  shapes: [
    { id: 'rail', type: 'box', x: 0, y: 0, z: 0.95, width: 1.0, depth: 0.05, height: 0.05, color: '#94A3B8' },
    { id: 'fabric', type: 'box', x: 0, y: 0.02, z: 0, width: 0.98, depth: 0.02, height: 0.95, color: '#DDD6FE' },
    { id: 'motor', type: 'box', x: 0.45, y: 0, z: 0.8, width: 0.1, depth: 0.1, height: 0.2, color: '#A78BFA' },
  ]
});
registerGeometry('asset-central-control', {
  shapes: [
    { id: 'case', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.2, color: '#1E293B' },
    { id: 'face', type: 'box', x: 0, y: -0.38, z: 0.05, width: 0.9, depth: 0.05, height: 0.15, color: '#0F172A' },
    { id: 'led1', type: 'box', x: -0.3, y: -0.4, z: 0.1, width: 0.05, depth: 0.02, height: 0.05, color: '#22C55E' },
    { id: 'led2', type: 'box', x: -0.2, y: -0.4, z: 0.1, width: 0.05, depth: 0.02, height: 0.05, color: '#3B82F6' },
    { id: 'led3', type: 'box', x: -0.1, y: -0.4, z: 0.1, width: 0.05, depth: 0.02, height: 0.05, color: '#F59E0B' },
  ]
});
registerGeometry('asset-ups', {
  shapes: [
    { id: 'tower', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.8, height: 1.0, color: '#1E293B' },
    { id: 'screen', type: 'box', x: 0, y: -0.38, z: 0.7, width: 0.4, depth: 0.05, height: 0.2, color: '#022C22' },
    { id: 'vent', type: 'box', x: 0, y: -0.38, z: 0.2, width: 0.4, depth: 0.02, height: 0.3, color: '#0F172A' },
  ]
});
registerGeometry('asset-info-display', {
  shapes: [
    { id: 'stand', type: 'box', x: 0, y: 0, z: 0, width: 0.4, depth: 0.3, height: 0.1, color: '#334155' },
    { id: 'post', type: 'box', x: 0, y: 0.1, z: 0.1, width: 0.1, depth: 0.1, height: 0.9, color: '#475569' },
    { id: 'frame', type: 'box', x: 0, y: 0, z: 0.6, width: 1.0, depth: 0.1, height: 0.8, color: '#111827' },
    { id: 'screen', type: 'box', x: 0, y: -0.05, z: 0.65, width: 0.94, depth: 0.02, height: 0.7, color: '#0284C7' },
  ]
});
registerGeometry('asset-class-sign', {
  shapes: [
    { id: 'mount', type: 'box', x: 0, y: 0.05, z: 0.5, width: 0.6, depth: 0.05, height: 0.4, color: '#2563EB' },
    { id: 'tablet', type: 'box', x: 0, y: -0.02, z: 0.5, width: 0.5, depth: 0.05, height: 0.3, color: '#0F172A' },
    { id: 'screen', type: 'box', x: 0, y: -0.05, z: 0.55, width: 0.46, depth: 0.01, height: 0.2, color: '#1E3A5F' },
  ]
});
registerGeometry('asset-air-purifier', {
  shapes: [
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.8, height: 1.0, color: '#F0FDFA' },
    { id: 'grill', type: 'box', x: 0, y: 0, z: 0.95, width: 0.7, depth: 0.7, height: 0.05, color: '#06B6D4' },
    { id: 'panel', type: 'box', x: 0, y: -0.38, z: 0.8, width: 0.4, depth: 0.05, height: 0.1, color: '#ECFDF5' },
  ]
});

// ===================== 其余核心资产精修 (Task 3) =====================
registerGeometry('asset-switch', {
  shapes: [
    { id: 'chassis', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.6, height: 0.2, color: '#1E293B' },
    { id: 'port-area', type: 'box', x: 0, y: -0.28, z: 0.05, width: 0.9, depth: 0.05, height: 0.1, color: '#0F172A' },
    { id: 'led-1', type: 'box', x: -0.4, y: -0.3, z: 0.08, width: 0.02, depth: 0.02, height: 0.05, color: '#22C55E' },
    { id: 'led-2', type: 'box', x: -0.35, y: -0.3, z: 0.08, width: 0.02, depth: 0.02, height: 0.05, color: '#22C55E' },
  ]
});
registerGeometry('asset-camera-ptz', {
  shapes: [
    { id: 'base', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.6, height: 0.1, color: '#E5E7EB' },
    { id: 'body', type: 'box', x: 0, y: 0, z: 0.1, width: 0.4, depth: 0.4, height: 0.3, color: '#D1D5DB' },
    { id: 'lens-housing', type: 'box', x: 0, y: -0.1, z: 0.2, width: 0.25, depth: 0.25, height: 0.2, color: '#1F2937' },
    { id: 'lens', type: 'box', x: 0, y: -0.2, z: 0.25, width: 0.1, depth: 0.1, height: 0.1, color: '#0891B2' },
  ]
});
registerGeometry('asset-ap', {
  shapes: [
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
