// ==================== 组件分类 ====================

export type AssetCategory =
  | 'furniture'       // 桌椅、讲台、黑板、柜体
  | 'display'         // 智慧黑板、交互大屏、投影
  | 'av'              // 摄像头、录播主机、音响、麦克风
  | 'network'         // AP、交换机
  | 'computing'       // 电脑终端、充电设备、控制面板
  | 'lab'             // 实验仪器、实验台、传感器
  | 'infrastructure'; // 门、窗、电源插座

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  furniture: '桌椅家具',
  display: '显示设备',
  av: '音视频',
  network: '网络设备',
  computing: '计算终端',
  lab: '实验器材',
  infrastructure: '基础设施',
};

export const CATEGORY_ICONS: Record<AssetCategory, string> = {
  furniture: '🪑',
  display: '🖥️',
  av: '📹',
  network: '📡',
  computing: '💻',
  lab: '🔬',
  infrastructure: '🏗️',
};

// ==================== 连接类型 ====================

export type ConnectionType =
  | 'network'     // 网络连接
  | 'av'          // 音视频链路
  | 'control'     // 控制信号
  | 'power';      // 电源

export const CONNECTION_LABELS: Record<ConnectionType, string> = {
  network: '网络连接',
  av: '音视频链路',
  control: '控制信号',
  power: '电源连接',
};

export const CONNECTION_COLORS: Record<ConnectionType, string> = {
  network: '#2563EB',
  av: '#7C3AED',
  control: '#0891B2',
  power: '#DC2626',
};

// ==================== 外部节点类型 ====================

export type ExternalNodeType =
  | 'department'  // 教务处、总务处、安防中心
  | 'platform'    // 校级平台、区县平台
  | 'server'      // 服务器/机房
  | 'external'    // 外部系统
  | 'internet'    // 公网
  | 'campus-network' // 校园网
  | 'cloud-server' // 云服务
  | 'broadcast-center' // 广播中心
  | 'power-grid'; // 市电

// ==================== 视图类型 ====================

export type ViewMode = '2d' | '2.5d' | 'topology' | 'bom';

export const VIEW_LABELS: Record<ViewMode, string> = {
  '2d': '2D 编辑',
  '2.5d': '2.5D 展示',
  'topology': '拓扑视图',
  'bom': '设备清单',
};
