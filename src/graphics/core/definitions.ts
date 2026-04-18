import { AssetGeometry } from './types';
import { getAssetById } from '../../features/component-library/assets-data';

export const geometryRegistry: Record<string, AssetGeometry> = {};

export function registerGeometry(assetId: string, def: Omit<AssetGeometry, 'assetId'>) {
  geometryRegistry[assetId] = { assetId, ...def };
}

// ===================== 桌椅家具 =====================
registerGeometry('asset-desk-student', {
  shapes: [ 
    { id: 'leg-1', type: 'box', x: -0.42, y: 0.42, z: 0, width: 0.04, depth: 0.04, height: 0.72, color: '#64748B' },
    { id: 'leg-2', type: 'box', x: 0.42, y: 0.42, z: 0, width: 0.04, depth: 0.04, height: 0.72, color: '#64748B' },
    { id: 'leg-3', type: 'box', x: -0.42, y: -0.42, z: 0, width: 0.04, depth: 0.04, height: 0.72, color: '#64748B' },
    { id: 'leg-4', type: 'box', x: 0.42, y: -0.42, z: 0, width: 0.04, depth: 0.04, height: 0.72, color: '#64748B' },
    { id: 'foot-1', type: 'box', x: -0.42, y: 0.42, z: 0, width: 0.06, depth: 0.06, height: 0.02, color: '#334155' },
    { id: 'foot-2', type: 'box', x: 0.42, y: 0.42, z: 0, width: 0.06, depth: 0.06, height: 0.02, color: '#334155' },
    { id: 'foot-3', type: 'box', x: -0.42, y: -0.42, z: 0, width: 0.06, depth: 0.06, height: 0.02, color: '#334155' },
    { id: 'foot-4', type: 'box', x: 0.42, y: -0.42, z: 0, width: 0.06, depth: 0.06, height: 0.02, color: '#334155' },
    { id: 'shelf', type: 'box', x: 0, y: 0, z: 0.55, width: 0.85, depth: 0.75, height: 0.08, color: '#94A3B8' },
    { id: 'desktop', type: 'box', x: 0, y: 0, z: 0.72, width: 1.0, depth: 1.0, height: 0.03, color: '#F1F5F9' },
    { id: 'desktop-edge', type: 'box', x: 0, y: 0, z: 0.72, width: 1.02, depth: 1.02, height: 0.015, color: '#CBD5E1' },
  ]
});
registerGeometry('asset-chair-student', {
  shapes: [ 
    { id: 'leg-base', type: 'box', x: 0, y: 0, z: 0, width: 0.4, depth: 0.4, height: 0.04, color: '#475569' },
    { id: 'stem', type: 'box', x: 0, y: 0, z: 0.04, width: 0.08, depth: 0.08, height: 0.36, color: '#64748B' },
    { id: 'seat-base', type: 'box', x: 0, y: 0, z: 0.4, width: 0.7, depth: 0.7, height: 0.04, color: '#334155' },
    { id: 'cushion', type: 'box', x: 0, y: 0, z: 0.44, width: 0.65, depth: 0.65, height: 0.06, color: '#475569' },
    { id: 'back-frame', type: 'box', x: 0, y: 0.3, z: 0.5, width: 0.08, depth: 0.08, height: 0.45, color: '#64748B' },
    { id: 'backrest', type: 'box', x: 0, y: 0.32, z: 0.65, width: 0.6, depth: 0.06, height: 0.35, color: '#475569' },
  ]
});
registerGeometry('asset-desk-teacher', {
  shapes: [ 
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.95, depth: 0.85, height: 0.75, color: '#1E293B' },
    { id: 'drawer-1', type: 'box', x: 0, y: -0.43, z: 0.5, width: 0.8, depth: 0.02, height: 0.15, color: '#334155' },
    { id: 'handle', type: 'box', x: 0, y: -0.45, z: 0.58, width: 0.15, depth: 0.02, height: 0.02, color: '#94A3B8' },
    { id: 'desktop', type: 'box', x: 0, y: 0, z: 0.75, width: 1.05, depth: 0.95, height: 0.04, color: '#334155' },
    { id: 'monitor-stand', type: 'box', x: 0.2, y: 0.1, z: 0.79, width: 0.15, depth: 0.15, height: 0.02, color: '#0F172A' },
    { id: 'monitor-neck', type: 'box', x: 0.2, y: 0.1, z: 0.81, width: 0.05, depth: 0.05, height: 0.1, color: '#1E293B' },
    { id: 'monitor-body', type: 'box', x: 0.2, y: 0.1, z: 0.91, width: 0.6, depth: 0.04, height: 0.35, color: '#0F172A' },
    { id: 'monitor-screen', type: 'box', x: 0.2, y: 0.08, z: 0.93, width: 0.56, depth: 0.01, height: 0.31, color: '#0EA5E9', opacity: 0.8 },
  ]
});

// ===================== 显示设备 =====================
registerGeometry('asset-smart-board', {
  shapes: [ 
    { id: 'wall-mount', type: 'box', x: 0, y: 0.08, z: 0.1, width: 1.0, depth: 0.04, height: 0.8, color: '#475569' },
    { id: 'bezel', type: 'box', x: 0, y: 0.04, z: 0.05, width: 0.98, depth: 0.04, height: 0.9, color: '#1E293B' },
    { id: 'screen', type: 'box', x: 0, y: 0.02, z: 0.1, width: 0.92, depth: 0.01, height: 0.8, color: '#0F172A' },
    { id: 'content', type: 'box', x: 0, y: 0.015, z: 0.12, width: 0.9, depth: 0.005, height: 0.76, color: '#0284C7', opacity: 0.6 },
    { id: 'glow', type: 'box', x: 0, y: 0.01, z: 0.12, width: 0.92, depth: 0.005, height: 0.78, color: '#38BDF8', opacity: 0.2 },
    { id: 'pen-tray', type: 'box', x: 0, y: 0, z: 0.04, width: 0.6, depth: 0.08, height: 0.02, color: '#64748B' },
  ]
});
registerGeometry('asset-interactive-screen', {
  shapes: [ 
    { id: 'back-housing', type: 'box', x: 0, y: 0.06, z: 0, width: 1.0, depth: 0.08, height: 1.0, color: '#111827' },
    { id: 'bezel', type: 'box', x: 0, y: 0.02, z: 0.02, width: 0.98, depth: 0.04, height: 0.96, color: '#374151' },
    { id: 'screen', type: 'box', x: 0, y: 0.01, z: 0.05, width: 0.94, depth: 0.01, height: 0.9, color: '#0C4A6E', opacity: 0.9 },
    { id: 'glass-reflection', type: 'box', x: 0.1, y: 0.005, z: 0.05, width: 0.4, depth: 0.005, height: 0.9, color: '#FFFFFF', opacity: 0.05 },
  ]
});
registerGeometry('asset-projector', {
  shapes: [ 
    { id: 'main-chassis', type: 'box', x: 0, y: 0, z: 0.1, width: 0.85, depth: 0.85, height: 0.35, color: '#F1F5F9' },
    { id: 'lens-housing', type: 'box', x: -0.22, y: -0.38, z: 0.15, width: 0.28, depth: 0.1, height: 0.22, color: '#1E293B' },
    { id: 'lens-glass', type: 'box', x: -0.22, y: -0.45, z: 0.2, width: 0.18, depth: 0.02, height: 0.12, color: '#0EA5E9', opacity: 0.7 },
    { id: 'front-grill', type: 'box', x: 0.2, y: -0.41, z: 0.15, width: 0.35, depth: 0.02, height: 0.25, color: '#CBD5E1' },
    { id: 'top-buttons', type: 'box', x: 0.2, y: 0.2, z: 0.45, width: 0.2, depth: 0.2, height: 0.02, color: '#94A3B8' },
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
    { id: 'ergonomic-body', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 1.0, height: 0.15, color: '#334155' },
    { id: 'btn-main', type: 'box', x: 0, y: -0.2, z: 0.15, width: 0.4, depth: 0.3, height: 0.05, color: '#2563EB' },
    { id: 'btn-back', type: 'box', x: 0, y: 0.2, z: 0.15, width: 0.3, depth: 0.2, height: 0.05, color: '#475569' },
    { id: 'laser-aperture', type: 'box', x: 0, y: -0.48, z: 0.08, width: 0.1, depth: 0.04, height: 0.04, color: '#000' },
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
    { id: 'base-chassis', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 1.0, height: 0.12, color: '#1F2937' },
    { id: 'frame-l', type: 'box', x: -0.42, y: 0, z: 0.12, width: 0.08, depth: 0.08, height: 0.85, color: '#374151' },
    { id: 'frame-r', type: 'box', x: 0.42, y: 0, z: 0.12, width: 0.08, depth: 0.08, height: 0.85, color: '#374151' },
    { id: 'top-rail', type: 'box', x: 0, y: 0, z: 0.95, width: 0.9, depth: 0.06, height: 0.06, color: '#374151' },
    { id: 'build-plate', type: 'box', x: 0, y: 0, z: 0.2, width: 0.7, depth: 0.7, height: 0.02, color: '#F97316' },
    { id: 'print-head', type: 'box', x: 0, y: -0.05, z: 0.5, width: 0.18, depth: 0.18, height: 0.18, color: '#111827' },
    { id: 'nozzle', type: 'box', x: 0, y: -0.05, z: 0.48, width: 0.04, depth: 0.04, height: 0.04, color: '#D1D5DB' },
    { id: 'control-display', type: 'box', x: 0.3, y: -0.4, z: 0.12, width: 0.25, depth: 0.05, height: 0.15, color: '#1E293B' },
  ]
});
registerGeometry('asset-document-camera', {
  shapes: [
    { id: 'heavy-base', type: 'box', x: 0, y: 0.3, z: 0, width: 0.65, depth: 0.45, height: 0.08, color: '#E2E8F0' },
    { id: 'telescopic-pole', type: 'box', x: 0, y: 0.4, z: 0.08, width: 0.06, depth: 0.06, height: 0.82, color: '#94A3B8' },
    { id: 'articulating-arm', type: 'box', x: 0, y: 0.1, z: 0.8, width: 0.06, depth: 0.55, height: 0.06, color: '#94A3B8' },
    { id: 'camera-housing', type: 'box', x: 0, y: -0.25, z: 0.76, width: 0.25, depth: 0.35, height: 0.12, color: '#1E293B' },
    { id: 'lens-element', type: 'box', x: 0, y: -0.25, z: 0.7, width: 0.12, depth: 0.12, height: 0.06, color: '#0EA5E9', opacity: 0.8 },
    { id: 'led-light-array', type: 'box', x: 0, y: -0.25, z: 0.74, width: 0.2, depth: 0.3, height: 0.01, color: '#FFF', opacity: 0.3 },
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
    { id: 'main-tower', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.9, height: 0.8, color: '#0F172A' },
    { id: 'front-bezel', type: 'box', x: 0, y: -0.42, z: 0, width: 0.45, depth: 0.05, height: 0.8, color: '#1E293B' },
    { id: 'lcd-disp', type: 'box', x: 0, y: -0.45, z: 0.55, width: 0.3, depth: 0.01, height: 0.12, color: '#22C55E', opacity: 0.7 },
  ]
});
registerGeometry('asset-info-display', {
  shapes: [
    { id: 'heavy-stand', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.5, height: 0.06, color: '#1E293B' },
    { id: 'central-post', type: 'box', x: 0, y: 0.1, z: 0.06, width: 0.08, depth: 0.08, height: 1.2, color: '#475569' },
    { id: 'display-head', type: 'box', x: 0, y: 0, z: 0.8, width: 1.0, depth: 0.08, height: 0.7, color: '#334155' },
    { id: 'screen-active', type: 'box', x: 0, y: -0.04, z: 0.85, width: 0.94, depth: 0.01, height: 0.6, color: '#0EA5E9', opacity: 0.8 },
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
    { id: 'main-body', type: 'box', x: 0, y: 0, z: 0, width: 0.75, depth: 0.75, height: 0.9, color: '#F1F5F9' },
    { id: 'grill-top', type: 'box', x: 0, y: 0, z: 0.9, width: 0.65, depth: 0.65, height: 0.05, color: '#1E293B' },
    { id: 'intake-grill', type: 'box', x: 0, y: -0.36, z: 0.2, width: 0.6, depth: 0.02, height: 0.5, color: '#64748B' },
    { id: 'status-ring', type: 'box', x: 0, y: 0, z: 0.88, width: 0.5, depth: 0.5, height: 0.01, color: '#22C55E', opacity: 0.5 },
  ]
});

// ===================== 其余核心资产精修 (Task 3) =====================
registerGeometry('asset-switch', {
  shapes: [
    { id: 'chassis', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.5, height: 0.15, color: '#1E293B' },
    { id: 'face', type: 'box', x: 0, y: -0.24, z: 0.02, width: 0.98, depth: 0.02, height: 0.11, color: '#0F172A' },
    { id: 'port-1', type: 'box', x: -0.3, y: -0.25, z: 0.04, width: 0.05, depth: 0.01, height: 0.05, color: '#334155' },
    { id: 'port-2', type: 'box', x: -0.2, y: -0.25, z: 0.04, width: 0.05, depth: 0.01, height: 0.05, color: '#334155' },
    { id: 'port-3', type: 'box', x: -0.1, y: -0.25, z: 0.04, width: 0.05, depth: 0.01, height: 0.05, color: '#334155' },
    { id: 'led-pwr', type: 'box', x: 0.4, y: -0.25, z: 0.06, width: 0.02, depth: 0.01, height: 0.02, color: '#22C55E' },
    { id: 'led-act', type: 'box', x: 0.35, y: -0.25, z: 0.06, width: 0.02, depth: 0.01, height: 0.02, color: '#F59E0B' },
  ]
});
registerGeometry('asset-camera-ptz', {
  shapes: [
    { id: 'base-plate', type: 'box', x: 0, y: 0, z: 0, width: 0.6, depth: 0.6, height: 0.05, color: '#D1D5DB' },
    { id: 'rotating-base', type: 'box', x: 0, y: 0, z: 0.05, width: 0.45, depth: 0.45, height: 0.15, color: '#E5E7EB' },
    { id: 'camera-head', type: 'box', x: 0, y: 0, z: 0.2, width: 0.35, depth: 0.35, height: 0.35, color: '#334155' },
    { id: 'lens-housing', type: 'box', x: 0, y: -0.15, z: 0.3, width: 0.25, depth: 0.1, height: 0.2, color: '#1E293B' },
    { id: 'main-lens', type: 'box', x: 0, y: -0.21, z: 0.35, width: 0.15, depth: 0.02, height: 0.15, color: '#0EA5E9', opacity: 0.6 },
    { id: 'indicator', type: 'box', x: 0.1, y: -0.18, z: 0.45, width: 0.02, depth: 0.02, height: 0.02, color: '#EF4444' },
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
    { id: 'case', type: 'box', x: 0, y: 0, z: 0, width: 0.4, depth: 0.9, height: 0.9, color: '#0F172A' },
    { id: 'front-panel', type: 'box', x: 0, y: -0.42, z: 0.05, width: 0.38, depth: 0.05, height: 0.8, color: '#1E293B' },
    { id: 'io-top', type: 'box', x: 0, y: -0.44, z: 0.75, width: 0.2, depth: 0.02, height: 0.05, color: '#334155' },
    { id: 'power-btn', type: 'box', x: 0.1, y: -0.45, z: 0.82, width: 0.04, depth: 0.01, height: 0.04, color: '#0EA5E9' },
  ]
});
registerGeometry('asset-pc-laptop', {
  shapes: [ 
    { id: 'bottom-body', type: 'box', x: 0, y: 0.1, z: 0, width: 1.0, depth: 0.7, height: 0.05, color: '#94A3B8' },
    { id: 'keyboard-area', type: 'box', x: 0, y: 0.1, z: 0.05, width: 0.9, depth: 0.4, height: 0.01, color: '#1E293B' },
    { id: 'trackpad', type: 'box', x: 0, y: -0.15, z: 0.05, width: 0.3, depth: 0.2, height: 0.01, color: '#64748B' },
    { id: 'screen-hinge', type: 'box', x: 0, y: 0.4, z: 0.02, width: 0.6, depth: 0.05, height: 0.03, color: '#475569' },
    { id: 'screen-lid', type: 'box', x: 0, y: 0.42, z: 0.05, width: 1.0, depth: 0.04, height: 0.7, color: '#94A3B8' },
    { id: 'screen-panel', type: 'box', x: 0, y: 0.4, z: 0.1, width: 0.94, depth: 0.01, height: 0.6, color: '#0F172A' },
    { id: 'screen-glow', type: 'box', x: 0, y: 0.39, z: 0.1, width: 0.9, depth: 0.01, height: 0.56, color: '#38BDF8', opacity: 0.3 },
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
  shapes: [ 
    { id: 'work-surface', type: 'box', x: 0, y: 0, z: 0.82, width: 1.0, depth: 1.0, height: 0.04, color: '#F1F5F9' },
    { id: 'chemical-lip', type: 'box', x: 0, y: 0, z: 0.82, width: 1.02, depth: 1.02, height: 0.015, color: '#CBD5E1' },
    { id: 'privacy-panel', type: 'box', x: 0, y: 0, z: 0.86, width: 1.0, depth: 0.04, height: 0.35, color: '#94A3B8', opacity: 0.8 },
    { id: 'heavy-frame-l', type: 'box', x: -0.4, y: 0, z: 0, width: 0.15, depth: 0.85, height: 0.82, color: '#475569' },
    { id: 'heavy-frame-r', type: 'box', x: 0.4, y: 0, z: 0, width: 0.15, depth: 0.85, height: 0.82, color: '#475569' },
    { id: 'power-box', type: 'box', x: 0.3, y: 0.3, z: 0.86, width: 0.15, depth: 0.15, height: 0.12, color: '#1E293B' },
  ]
});
registerGeometry('asset-microscope', {
  shapes: [
    { id: 'weighted-base', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.7, height: 0.15, color: '#334155' },
    { id: 'stage-plate', type: 'box', x: 0, y: -0.1, z: 0.35, width: 0.4, depth: 0.4, height: 0.02, color: '#111827' },
    { id: 'neck-arm', type: 'box', x: 0, y: 0.25, z: 0.15, width: 0.15, depth: 0.3, height: 0.7, color: '#64748B' },
    { id: 'eyepiece-tube', type: 'box', x: 0, y: 0.1, z: 0.85, width: 0.12, depth: 0.12, height: 0.15, color: '#111827' },
    { id: 'objective-lens', type: 'box', x: 0, y: -0.1, z: 0.45, width: 0.1, depth: 0.1, height: 0.15, color: '#CBD5E1' },
    { id: 'adjustment-knob', type: 'box', x: 0.1, y: 0.25, z: 0.3, width: 0.08, depth: 0.08, height: 0.08, color: '#94A3B8' },
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
  shapes: [ 
    { id: 'console-body', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.85, height: 0.12, color: '#1E293B' },
    { id: 'channel-strips', type: 'box', x: 0, y: 0.1, z: 0.12, width: 0.9, depth: 0.6, height: 0.02, color: '#0F172A' },
    { id: 'knob-zone', type: 'box', x: 0, y: 0.35, z: 0.14, width: 0.85, depth: 0.15, height: 0.02, color: '#334155' },
    { id: 'fader-track-1', type: 'box', x: -0.3, y: -0.1, z: 0.14, width: 0.04, depth: 0.3, height: 0.01, color: '#000' },
    { id: 'fader-track-2', type: 'box', x: -0.1, y: -0.1, z: 0.14, width: 0.04, depth: 0.3, height: 0.01, color: '#000' },
    { id: 'fader-track-3', type: 'box', x: 0.1, y: -0.1, z: 0.14, width: 0.04, depth: 0.3, height: 0.01, color: '#000' },
    { id: 'level-meter', type: 'box', x: 0.35, y: 0.25, z: 0.14, width: 0.15, depth: 0.3, height: 0.01, color: '#22C55E', opacity: 0.7 },
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
  shapes: [ 
    { id: 'housing', type: 'box', x: 0, y: 0, z: 0, width: 0.5, depth: 0.4, height: 1.0, color: '#CBD5E1' },
    { id: 'mesh-front', type: 'box', x: 0, y: -0.21, z: 0.1, width: 0.4, depth: 0.01, height: 0.8, color: '#475569' },
    { id: 'badge', type: 'box', x: 0, y: -0.22, z: 0.15, width: 0.1, depth: 0.01, height: 0.05, color: '#94A3B8' },
  ]
});

// ===================== 基础感知与温控设备 =====================
registerGeometry('asset-air-conditioner', {
  shapes: [ 
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 0.8, depth: 0.7, height: 1.0, color: '#F8FAFC' },
    { id: 'top-vent', type: 'box', x: 0, y: -0.32, z: 0.75, width: 0.65, depth: 0.04, height: 0.15, color: '#334155' },
    { id: 'bottom-grill', type: 'box', x: 0, y: -0.32, z: 0.1, width: 0.65, depth: 0.02, height: 0.4, color: '#E2E8F0' },
    { id: 'lcd-panel', type: 'box', x: 0, y: -0.35, z: 0.6, width: 0.25, depth: 0.01, height: 0.08, color: '#0EA5E9', opacity: 0.8 },
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
  shapes: [ 
    { id: 'outer-frame', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 1.0, height: 1.0, color: '#1E293B' },
    { id: 'inner-rack', type: 'box', x: 0, y: 0, z: 0.05, width: 0.9, depth: 0.9, height: 0.9, color: '#0F172A' },
    { id: 'door-frame', type: 'box', x: 0, y: -0.48, z: 0, width: 0.96, depth: 0.04, height: 1.0, color: '#334155' },
    { id: 'door-glass', type: 'box', x: 0, y: -0.5, z: 0.05, width: 0.8, depth: 0.01, height: 0.9, color: '#38BDF8', opacity: 0.15 },
    { id: 'server-u1', type: 'box', x: 0, y: -0.1, z: 0.2, width: 0.85, depth: 0.7, height: 0.1, color: '#475569' },
    { id: 'server-u2', type: 'box', x: 0, y: -0.1, z: 0.4, width: 0.85, depth: 0.7, height: 0.1, color: '#475569' },
    { id: 'server-u3', type: 'box', x: 0, y: -0.1, z: 0.6, width: 0.85, depth: 0.7, height: 0.1, color: '#475569' },
    { id: 'server-leds', type: 'box', x: -0.3, y: -0.45, z: 0.25, width: 0.1, depth: 0.01, height: 0.02, color: '#22C55E' },
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
    { id: 'body', type: 'box', x: 0, y: 0, z: 0, width: 1.0, depth: 0.8, height: 0.15, color: '#1E293B' },
    { id: 'ant-1', type: 'box', x: -0.4, y: 0.35, z: 0.15, width: 0.03, depth: 0.03, height: 0.6, color: '#334155' },
    { id: 'ant-2', type: 'box', x: -0.1, y: 0.35, z: 0.15, width: 0.03, depth: 0.03, height: 0.6, color: '#334155' },
    { id: 'ant-3', type: 'box', x: 0.1, y: 0.35, z: 0.15, width: 0.03, depth: 0.03, height: 0.6, color: '#334155' },
    { id: 'ant-4', type: 'box', x: 0.4, y: 0.35, z: 0.15, width: 0.03, depth: 0.03, height: 0.6, color: '#334155' },
    { id: 'leds', type: 'box', x: 0, y: -0.38, z: 0.1, width: 0.6, depth: 0.01, height: 0.02, color: '#22C55E', opacity: 0.8 },
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
