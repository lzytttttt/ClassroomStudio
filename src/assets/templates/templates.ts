import type { Scene } from '@/shared/types';
import { generateId } from '@/shared/utils/id';

/**
 * 普通教室模板
 * 6列×8排学生桌椅 + 教师讲台 + 传统黑板
 */
export function createNormalClassroom(): Scene {
  const components = [];
  const roomW = 12000;
  const roomH = 9000;

  // 黑板 (前墙中央)
  components.push({
    id: generateId(),
    assetId: 'asset-blackboard',
    position: { x: (roomW - 4000) / 2, y: 200 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 900, zIndex: 0,
    name: '传统黑板',
    properties: { brand: '通用', model: 'HB-4000', interfaces: [], power: 0, price: 800, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 教师讲台 (前方居中)
  components.push({
    id: generateId(),
    assetId: 'asset-desk-teacher',
    position: { x: (roomW - 1200) / 2, y: 800 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 1,
    name: '教师讲台',
    properties: { brand: '通用', model: 'JT-1200', interfaces: [], power: 0, price: 1200, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 学生桌椅: 6列 × 8排
  const cols = 6;
  const rows = 8;
  const deskW = 600;
  const deskH = 400;
  const gapX = 350;
  const gapY = 400; // Increased spacing between rows
  const startX = (roomW - (cols * deskW + (cols - 1) * gapX)) / 2;
  const startY = 1800; // Move starting row slightly up

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (deskW + gapX);
      const y = startY + r * (deskH + gapY);

      // 课桌
      components.push({
        id: generateId(),
        assetId: 'asset-desk-student',
        position: { x, y },
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 10 + r * cols + c,
        name: `课桌 ${r + 1}-${c + 1}`,
        properties: { brand: '通用', model: 'KZ-600', interfaces: [], power: 0, price: 350, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });

      // 椅子 (桌子后方)
      components.push({
        id: generateId(),
        assetId: 'asset-chair-student',
        position: { x: x + 90, y: y + deskH + 180 }, // Increased chair to desk distance
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 10 + r * cols + c + 100,
        name: `椅子 ${r + 1}-${c + 1}`,
        properties: { brand: '通用', model: 'KY-01', interfaces: [], power: 0, price: 180, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });
    }
  }

  return {
    id: generateId(),
    room: {
      width: roomW, height: roomH, ceilingHeight: 3200, wallThickness: 240,
      doors: [], windows: [],
      floorColor: '#F1F5F9', wallColor: '#E2E8F0',
    },
    components,
    connections: [],
    externalNodes: [],
    viewState: {
      activeView: '2d',
      canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true },
      topology: { layout: 'hierarchical', filterTypes: ['network', 'av', 'control', 'power'], highlightedNodeId: null, lineStyle: 'bezier' },
      selectedIds: [],
    },
  };
}

/**
 * 精品录播教室模板
 * 4列×6排桌椅 + 智慧黑板 + PTZ摄像头×3 + 录播主机 + 音响 + 麦克风
 */
export function createRecordingClassroom(): Scene {
  const components = [];
  const roomW = 12000;
  const roomH = 9000;

  // 智慧黑板
  components.push({
    id: generateId(),
    assetId: 'asset-smart-board',
    position: { x: (roomW - 4200) / 2, y: 100 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 800, zIndex: 0,
    name: '智慧黑板',
    properties: { brand: '希沃', model: 'MB86EA', interfaces: ['HDMI', 'USB', 'WiFi'], power: 350, price: 35000, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 教师讲台
  components.push({
    id: generateId(),
    assetId: 'asset-desk-teacher',
    position: { x: (roomW - 1200) / 2, y: 700 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 1,
    name: '教师讲台',
    properties: { brand: '通用', model: 'JT-1200', interfaces: [], power: 0, price: 1200, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // PTZ 摄像头 × 3 (后墙两侧 + 前墙)
  const cameraPositions = [
    { x: 500, y: 8400, name: '后方摄像头-左' },
    { x: 11300, y: 8400, name: '后方摄像头-右' },
    { x: 11300, y: 500, name: '前方摄像头' },
  ];
  cameraPositions.forEach((pos, i) => {
    components.push({
      id: generateId(),
      assetId: 'asset-camera-ptz',
      position: { x: pos.x, y: pos.y },
      rotation: 0, scale: { x: 1, y: 1 }, elevation: 2800, zIndex: 200 + i,
      name: pos.name,
      properties: { brand: '海康威视', model: 'DS-2DF8225IH', interfaces: ['RJ45', 'RS485'], power: 30, price: 6000, quantity: 1, remark: '', customFields: {} },
      visible: true, locked: false, opacity: 1, groupId: null,
    });
  });

  // 录播主机 (前方角落)
  components.push({
    id: generateId(),
    assetId: 'asset-recording-host',
    position: { x: 500, y: 500 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 210,
    name: '录播主机',
    properties: { brand: '奥威亚', model: 'AV-HP300', interfaces: ['HDMI', 'SDI', 'RJ45', 'USB'], power: 120, price: 28000, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 壁挂音响 × 2
  [{ x: 500, y: 3000 }, { x: 11300, y: 3000 }].forEach((pos, i) => {
    components.push({
      id: generateId(),
      assetId: 'asset-speaker',
      position: { x: pos.x, y: pos.y },
      rotation: 0, scale: { x: 1, y: 1 }, elevation: 2200, zIndex: 220 + i,
      name: `壁挂音响-${i === 0 ? '左' : '右'}`,
      properties: { brand: 'JBL', model: 'Control-25', interfaces: ['RCA'], power: 30, price: 800, quantity: 1, remark: '', customFields: {} },
      visible: true, locked: false, opacity: 1, groupId: null,
    });
  });

  // 全向麦克风 (讲台上)
  components.push({
    id: generateId(),
    assetId: 'asset-microphone',
    position: { x: (roomW - 120) / 2, y: 750 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 230,
    name: '全向麦克风',
    properties: { brand: '舒尔', model: 'MX395', interfaces: ['XLR', 'USB'], power: 5, price: 2000, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 交换机 (讲台旁)
  components.push({
    id: generateId(),
    assetId: 'asset-switch',
    position: { x: 1000, y: 800 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 240,
    name: '接入交换机',
    properties: { brand: '华为', model: 'S5735-L24T4S', interfaces: ['RJ45 x24', 'SFP x4'], power: 40, price: 3500, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 无线AP (天花板中央)
  components.push({
    id: generateId(),
    assetId: 'asset-ap',
    position: { x: (roomW - 200) / 2, y: (roomH - 200) / 2 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 3100, zIndex: 250,
    name: '无线AP',
    properties: { brand: '华为', model: 'AirEngine 5760-10', interfaces: ['RJ45', 'PoE'], power: 15, price: 1500, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 4列 × 6排 学生桌椅
  const cols = 4, rows = 6;
  const deskW = 600, deskH = 400, gapX = 600, gapY = 500;
  const startX = (roomW - (cols * deskW + (cols - 1) * gapX)) / 2;
  const startY = 1800;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (deskW + gapX);
      const y = startY + r * (deskH + gapY);
      components.push({
        id: generateId(),
        assetId: 'asset-desk-student',
        position: { x, y },
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 10 + r * cols + c,
        name: `课桌 ${r + 1}-${c + 1}`,
        properties: { brand: '通用', model: 'KZ-600', interfaces: [], power: 0, price: 350, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });
      components.push({
        id: generateId(),
        assetId: 'asset-chair-student',
        position: { x: x + 90, y: y + deskH + 180 },
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 100 + r * cols + c,
        name: `椅子 ${r + 1}-${c + 1}`,
        properties: { brand: '通用', model: 'KY-01', interfaces: [], power: 0, price: 180, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });
    }
  }

  return {
    id: generateId(),
    room: {
      width: roomW, height: roomH, ceilingHeight: 3200, wallThickness: 240,
      doors: [], windows: [],
      floorColor: '#F1F5F9', wallColor: '#E2E8F0',
    },
    components,
    connections: [],
    externalNodes: [],
    viewState: {
      activeView: '2d',
      canvas2d: { panX: 0, panY: 0, zoom: 1, showGrid: true, gridSize: 500, snapToGrid: true },
      topology: { layout: 'hierarchical', filterTypes: ['network', 'av', 'control', 'power'], highlightedNodeId: null, lineStyle: 'bezier' },
      selectedIds: [],
    },
  };
}

/**
 * 计算机教室模板
 * U型布局 + 中央演示区 + 充电柜
 */
export function createComputerClassroom(): Scene {
  const components = [];
  const roomW = 14000;
  const roomH = 10000;

  // 交互大屏
  components.push({
    id: generateId(),
    assetId: 'asset-interactive-screen',
    position: { x: (roomW - 1920) / 2, y: 100 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 800, zIndex: 0,
    name: '交互大屏',
    properties: { brand: '海信', model: '86MR6DE', interfaces: ['HDMI', 'USB-C', 'WiFi'], power: 280, price: 25000, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 教师讲台 + 教师电脑
  components.push({
    id: generateId(),
    assetId: 'asset-desk-teacher',
    position: { x: (roomW - 1200) / 2, y: 700 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 1,
    name: '教师讲台',
    properties: { brand: '通用', model: 'JT-1200', interfaces: [], power: 0, price: 1200, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  components.push({
    id: generateId(),
    assetId: 'asset-pc-desktop',
    position: { x: (roomW - 180) / 2 + 300, y: 750 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 2,
    name: '教师电脑',
    properties: { brand: '联想', model: 'ThinkCentre M930t', interfaces: ['HDMI', 'DP', 'USB x6', 'RJ45'], power: 250, price: 4500, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 学生电脑区: 每排6台，5排
  const cols = 6, rows = 5;
  const startX = 1600, startY = 2000;
  const spacingX = 1800, spacingY = 1600;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * spacingX;
      const y = startY + r * spacingY;

      components.push({
        id: generateId(),
        assetId: 'asset-desk-student',
        position: { x, y },
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 10 + r * cols + c,
        name: `机位 ${r + 1}-${c + 1}`,
        properties: { brand: '通用', model: 'KZ-600', interfaces: [], power: 0, price: 350, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });

      components.push({
        id: generateId(),
        assetId: 'asset-pc-desktop',
        position: { x: x + 200, y: y + 20 },
        rotation: 0, scale: { x: 1, y: 1 }, elevation: 750, zIndex: 100 + r * cols + c,
        name: `电脑 ${r + 1}-${c + 1}`,
        properties: { brand: '联想', model: 'ThinkCentre M930t', interfaces: ['HDMI', 'DP', 'USB x6', 'RJ45'], power: 250, price: 4500, quantity: 1, remark: '', customFields: {} },
        visible: true, locked: false, opacity: 1, groupId: null,
      });
    }
  }

  // 充电柜 (后方角落)
  components.push({
    id: generateId(),
    assetId: 'asset-charging-cart',
    position: { x: roomW - 1200, y: roomH - 1600 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 300,
    name: '充电柜',
    properties: { brand: '智多星', model: 'ZDX-60', interfaces: ['220V'], power: 3000, price: 8000, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 交换机
  components.push({
    id: generateId(),
    assetId: 'asset-switch',
    position: { x: 500, y: 800 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 0, zIndex: 310,
    name: '核心交换机',
    properties: { brand: '华为', model: 'S5735-L48T4S', interfaces: ['RJ45 x48', 'SFP x4'], power: 65, price: 5500, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  // 无线AP
  components.push({
    id: generateId(),
    assetId: 'asset-ap',
    position: { x: (roomW - 200) / 2, y: (roomH - 200) / 2 },
    rotation: 0, scale: { x: 1, y: 1 }, elevation: 3100, zIndex: 320,
    name: '无线AP',
    properties: { brand: '华为', model: 'AirEngine 5760-10', interfaces: ['RJ45', 'PoE'], power: 15, price: 1500, quantity: 1, remark: '', customFields: {} },
    visible: true, locked: false, opacity: 1, groupId: null,
  });

  return {
    id: generateId(),
    room: {
      width: roomW, height: roomH, ceilingHeight: 3200, wallThickness: 240,
      doors: [], windows: [],
      floorColor: '#F1F5F9', wallColor: '#E2E8F0',
    },
    components,
    connections: [],
    externalNodes: [],
    viewState: {
      activeView: '2d',
      canvas2d: { panX: 0, panY: 0, zoom: 0.8, showGrid: true, gridSize: 500, snapToGrid: true },
      topology: { layout: 'hierarchical', filterTypes: ['network', 'av', 'control', 'power'], highlightedNodeId: null, lineStyle: 'bezier' },
      selectedIds: [],
    },
  };
}

export const TEMPLATE_FACTORIES: Record<string, () => Scene> = {
  normal: createNormalClassroom,
  recording: createRecordingClassroom,
  computer: createComputerClassroom,
};
