import type { Asset } from '@/shared/types';

/**
 * 内置组件库资源定义
 * 包含教育信息化场景中常用的桌椅家具、显示设备、音视频设备、网络设备等
 */
export const builtinAssets: Asset[] = [
  // ===================== 桌椅家具 =====================
  {
    id: 'asset-desk-student',
    name: '学生课桌',
    category: 'furniture',
    subcategory: '桌子',
    defaultProperties: { price: 350, brand: '通用', model: 'KZ-600', interfaces: [], power: 0 },
    icon2d: 'desk-student',
    color: '#64748B', // Slate 500
    defaultSize: { width: 600, height: 400, depth: 750 },
    isBuiltin: true,
    tags: ['桌子', '学生'],
  },
  {
    id: 'asset-chair-student',
    name: '学生椅',
    category: 'furniture',
    subcategory: '椅子',
    defaultProperties: { price: 180, brand: '通用', model: 'KY-01', interfaces: [], power: 0 },
    icon2d: 'chair-student',
    color: '#475569', // Slate 600
    defaultSize: { width: 420, height: 420, depth: 800 },
    isBuiltin: true,
    tags: ['椅子', '学生'],
  },
  {
    id: 'asset-desk-teacher',
    name: '教师讲台',
    category: 'furniture',
    subcategory: '讲台',
    defaultProperties: { price: 1200, brand: '通用', model: 'JT-1200', interfaces: [], power: 0 },
    icon2d: 'desk-teacher',
    color: '#334155', // Slate 700
    defaultSize: { width: 1200, height: 600, depth: 900 },
    isBuiltin: true,
    tags: ['讲台', '教师'],
  },
  {
    id: 'asset-blackboard',
    name: '传统黑板',
    category: 'furniture',
    subcategory: '黑板',
    defaultProperties: { price: 800, brand: '通用', model: 'HB-4000', interfaces: [], power: 0 },
    icon2d: 'blackboard',
    color: '#14532D', // Deep Green for traditional blackboard
    defaultSize: { width: 4000, height: 100, depth: 1200 },
    isBuiltin: true,
    tags: ['黑板'],
  },
  {
    id: 'asset-cabinet',
    name: '储物柜',
    category: 'furniture',
    subcategory: '柜体',
    defaultProperties: { price: 600, brand: '通用', model: 'CC-900', interfaces: [], power: 0 },
    icon2d: 'cabinet',
    color: '#94A3B8', // Slate 400
    defaultSize: { width: 900, height: 450, depth: 1800 },
    isBuiltin: true,
    tags: ['柜子', '存储'],
  },

  // ===================== 显示设备 =====================
  {
    id: 'asset-smart-board',
    name: '智慧黑板',
    category: 'display',
    subcategory: '智慧黑板',
    defaultProperties: { price: 35000, brand: '希沃', model: 'MB86EA', interfaces: ['HDMI', 'USB', 'WiFi'], power: 350 },
    icon2d: 'smart-board',
    color: '#1D4ED8', // Premium Blue
    defaultSize: { width: 4200, height: 150, depth: 1200 },
    isBuiltin: true,
    tags: ['智慧黑板', '触控', '显示'],
  },
  {
    id: 'asset-interactive-screen',
    name: '交互大屏',
    category: 'display',
    subcategory: '大屏',
    defaultProperties: { price: 25000, brand: '海信', model: '86MR6DE', interfaces: ['HDMI', 'USB-C', 'WiFi'], power: 280 },
    icon2d: 'interactive-screen',
    color: '#0369A1', // Sky Dark
    defaultSize: { width: 1920, height: 100, depth: 1080 },
    isBuiltin: true,
    tags: ['大屏', '触控', '显示'],
  },
  {
    id: 'asset-projector',
    name: '投影仪',
    category: 'display',
    subcategory: '投影',
    defaultProperties: { price: 8000, brand: '爱普生', model: 'CB-X06E', interfaces: ['HDMI', 'VGA', 'USB'], power: 320 },
    icon2d: 'projector',
    color: '#CBD5E1', // Silver/White
    defaultSize: { width: 340, height: 260, depth: 100 },
    isBuiltin: true,
    tags: ['投影', '显示'],
  },
  {
    id: 'asset-projection-screen',
    name: '投影幕布',
    category: 'display',
    subcategory: '幕布',
    defaultProperties: { price: 1500, brand: '通用', model: 'MB-120', interfaces: [], power: 50 },
    icon2d: 'projection-screen',
    color: '#F8FAFC', // Almost white
    defaultSize: { width: 2600, height: 80, depth: 1500 },
    isBuiltin: true,
    tags: ['幕布', '投影'],
  },

  // ===================== 音视频设备 =====================
  {
    id: 'asset-camera-ptz',
    name: 'PTZ 摄像头',
    category: 'av',
    subcategory: '摄像头',
    defaultProperties: { price: 6000, brand: '海康威视', model: 'DS-2DF8225IH', interfaces: ['RJ45', 'RS485'], power: 30 },
    icon2d: 'camera-ptz',
    color: '#0891B2', // Cyan 600
    defaultSize: { width: 200, height: 200, depth: 250 },
    isBuiltin: true,
    tags: ['摄像头', '录播', 'PTZ'],
  },
  {
    id: 'asset-camera-fixed',
    name: '固定摄像头',
    category: 'av',
    subcategory: '摄像头',
    defaultProperties: { price: 2500, brand: '海康威视', model: 'DS-2CD3T86FWD', interfaces: ['RJ45'], power: 12 },
    icon2d: 'camera-fixed',
    color: '#0E7490', // Cyan 700
    defaultSize: { width: 120, height: 120, depth: 120 },
    isBuiltin: true,
    tags: ['摄像头', '监控'],
  },
  {
    id: 'asset-recording-host',
    name: '录播主机',
    category: 'av',
    subcategory: '录播',
    defaultProperties: { price: 28000, brand: '奥威亚', model: 'AV-HP300', interfaces: ['HDMI', 'SDI', 'RJ45', 'USB'], power: 120 },
    icon2d: 'recording-host',
    color: '#1E293B', // Slate 800
    defaultSize: { width: 430, height: 450, depth: 90 },
    isBuiltin: true,
    tags: ['录播', '主机'],
  },
  {
    id: 'asset-speaker',
    name: '壁挂音响',
    category: 'av',
    subcategory: '音响',
    defaultProperties: { price: 800, brand: 'JBL', model: 'Control-25', interfaces: ['RCA'], power: 30 },
    icon2d: 'speaker',
    color: '#111827', // Gray 900
    defaultSize: { width: 180, height: 160, depth: 280 },
    isBuiltin: true,
    tags: ['音响', '壁挂'],
  },
  {
    id: 'asset-microphone',
    name: '全向麦克风',
    category: 'av',
    subcategory: '麦克风',
    defaultProperties: { price: 2000, brand: '舒尔', model: 'MX395', interfaces: ['XLR', 'USB'], power: 5 },
    icon2d: 'microphone',
    color: '#6B7280', // Gray 500
    defaultSize: { width: 120, height: 120, depth: 40 },
    isBuiltin: true,
    tags: ['麦克风', '拾音'],
  },

  // ===================== 网络设备 =====================
  {
    id: 'asset-switch',
    name: '交换机',
    category: 'network',
    subcategory: '交换机',
    defaultProperties: { price: 3500, brand: '华为', model: 'S5735-L24T4S', interfaces: ['RJ45 x24', 'SFP x4'], power: 40 },
    icon2d: 'switch',
    color: '#0284C7', // Light Blue
    defaultSize: { width: 440, height: 250, depth: 44 },
    isBuiltin: true,
    tags: ['交换机', '网络'],
  },
  {
    id: 'asset-ap',
    name: '无线 AP',
    category: 'network',
    subcategory: 'AP',
    defaultProperties: { price: 1500, brand: '华为', model: 'AirEngine 5760-10', interfaces: ['RJ45', 'PoE'], power: 15 },
    icon2d: 'ap',
    color: '#10B981', // Emerald
    defaultSize: { width: 200, height: 200, depth: 50 },
    isBuiltin: true,
    tags: ['AP', '无线', 'WiFi'],
  },

  // ===================== 计算终端 =====================
  {
    id: 'asset-pc-desktop',
    name: '台式电脑',
    category: 'computing',
    subcategory: '电脑',
    defaultProperties: { price: 4500, brand: '联想', model: 'ThinkCentre M930t', interfaces: ['HDMI', 'DP', 'USB x6', 'RJ45'], power: 250 },
    icon2d: 'pc-desktop',
    color: '#0F172A', // Slate 900
    defaultSize: { width: 180, height: 380, depth: 350 },
    isBuiltin: true,
    tags: ['电脑', '台式机'],
  },
  {
    id: 'asset-pc-laptop',
    name: '笔记本电脑',
    category: 'computing',
    subcategory: '电脑',
    defaultProperties: { price: 5500, brand: '联想', model: 'ThinkPad E14', interfaces: ['HDMI', 'USB-C', 'USB x2', 'RJ45'], power: 65 },
    icon2d: 'pc-laptop',
    color: '#94A3B8', // Silver
    defaultSize: { width: 325, height: 225, depth: 20 },
    isBuiltin: true,
    tags: ['电脑', '笔记本'],
  },
  {
    id: 'asset-charging-cart',
    name: '充电柜',
    category: 'computing',
    subcategory: '充电',
    defaultProperties: { price: 8000, brand: '智多星', model: 'ZDX-60', interfaces: ['220V'], power: 3000 },
    icon2d: 'charging-cart',
    color: '#059669', // Emerald 600
    defaultSize: { width: 700, height: 500, depth: 1100 },
    isBuiltin: true,
    tags: ['充电', '柜子'],
  },
  {
    id: 'asset-control-panel',
    name: '中控面板',
    category: 'computing',
    subcategory: '控制',
    defaultProperties: { price: 3500, brand: '快思聪', model: 'TSW-760', interfaces: ['RJ45', 'RS232', 'IR'], power: 15 },
    icon2d: 'control-panel',
    color: '#4F46E5', // Indigo 600
    defaultSize: { width: 220, height: 150, depth: 50 },
    isBuiltin: true,
    tags: ['中控', '控制'],
  },

  // ===================== 实验器材 =====================
  {
    id: 'asset-lab-table',
    name: '实验台',
    category: 'lab',
    subcategory: '实验桌',
    defaultProperties: { price: 2800, brand: '通用', model: 'SYT-1800', interfaces: [], power: 0 },
    icon2d: 'lab-table',
    color: '#E2E8F0', // Slate 200
    defaultSize: { width: 1800, height: 750, depth: 800 },
    isBuiltin: true,
    tags: ['实验台', '实验室'],
  },
  {
    id: 'asset-microscope',
    name: '数码显微镜',
    category: 'lab',
    subcategory: '仪器',
    defaultProperties: { price: 3500, brand: '奥林巴斯', model: 'CX23', interfaces: ['USB'], power: 20 },
    icon2d: 'microscope',
    color: '#CBD5E1',
    defaultSize: { width: 200, height: 250, depth: 400 },
    isBuiltin: true,
    tags: ['显微镜', '实验'],
  },
  {
    id: 'asset-sensor-kit',
    name: '传感器套件',
    category: 'lab',
    subcategory: '传感器',
    defaultProperties: { price: 1200, brand: '朗威', model: 'LW-S100', interfaces: ['USB', 'BLE'], power: 5 },
    icon2d: 'sensor-kit',
    color: '#8B5CF6', // Violet 500
    defaultSize: { width: 300, height: 200, depth: 80 },
    isBuiltin: true,
    tags: ['传感器', '数据采集'],
  },

  // ===================== 新增音视频扩展设备 =====================
  {
    id: 'asset-amplifier',
    name: '功放机',
    category: 'av',
    subcategory: '音频处理',
    defaultProperties: { price: 2500, brand: '天龙', model: 'AVR-X550BT', interfaces: ['RCA', 'Optical'], power: 300 },
    icon2d: 'amplifier',
    color: '#334155',
    defaultSize: { width: 430, height: 150, depth: 320 },
    isBuiltin: true,
    tags: ['功放', '音频', '扩音'],
  },
  {
    id: 'asset-audio-mixer',
    name: '调音台',
    category: 'av',
    subcategory: '音频处理',
    defaultProperties: { price: 3200, brand: '雅马哈', model: 'MG10XU', interfaces: ['XLR', 'USB', 'TRS'], power: 25 },
    icon2d: 'audio-mixer',
    color: '#475569',
    defaultSize: { width: 250, height: 70, depth: 300 },
    isBuiltin: true,
    tags: ['调音台', '混音', '音频'],
  },
  {
    id: 'asset-wireless-mic',
    name: '无线话筒',
    category: 'av',
    subcategory: '麦克风',
    defaultProperties: { price: 1800, brand: '森海塞尔', model: 'XSW 1-825', interfaces: ['XLR'], power: 10 },
    icon2d: 'wireless-mic',
    color: '#475569',
    defaultSize: { width: 200, height: 45, depth: 150 },
    isBuiltin: true,
    tags: ['麦克风', '无线', '话筒'],
  },
  {
    id: 'asset-hanging-mic',
    name: '吊顶麦克风',
    category: 'av',
    subcategory: '麦克风',
    defaultProperties: { price: 4500, brand: '舒尔', model: 'MXA910', interfaces: ['RJ45', 'Dante'], power: 15 },
    icon2d: 'hanging-mic',
    color: '#F8FAFC',
    defaultSize: { width: 600, height: 600, depth: 30 },
    isBuiltin: true,
    tags: ['麦克风', '阵列麦', '吊麦'],
  },
  {
    id: 'asset-campus-broadcaster',
    name: '广播音柱',
    category: 'av',
    subcategory: '音响',
    defaultProperties: { price: 1200, brand: 'DSPPA', model: 'DSP258', interfaces: ['IP网络', '100V'], power: 60 },
    icon2d: 'broadcaster',
    color: '#94A3B8',
    defaultSize: { width: 140, height: 350, depth: 120 },
    isBuiltin: true,
    tags: ['音柱', 'IP广播', '喇叭'],
  },

  // ===================== 新增基础感知与温控设备 =====================
  {
    id: 'asset-air-conditioner',
    name: '智能空调',
    category: 'infrastructure',
    subcategory: '环境控制',
    defaultProperties: { price: 6500, brand: '格力', model: 'KFR-72LW', interfaces: ['WiFi', 'IR'], power: 2500 },
    icon2d: 'air-conditioner',
    color: '#F8FAFC', // White
    defaultSize: { width: 400, height: 1800, depth: 400 },
    isBuiltin: true,
    tags: ['空调', '温控', '立式'],
  },
  {
    id: 'asset-curtain-motor',
    name: '窗帘电机',
    category: 'infrastructure',
    subcategory: '环境控制',
    defaultProperties: { price: 800, brand: '绿米', model: 'Aqara B1', interfaces: ['Zigbee'], power: 30 },
    icon2d: 'curtain',
    color: '#F1F5F9',
    defaultSize: { width: 50, height: 250, depth: 50 },
    isBuiltin: true,
    tags: ['窗帘', '电机', '遮光'],
  },
  {
    id: 'asset-environment-sensor',
    name: '环境检测仪',
    category: 'infrastructure',
    subcategory: '物联网',
    defaultProperties: { price: 500, brand: '海康威视', model: 'DS-PEA', interfaces: ['RS485', 'LoRa'], power: 2 },
    icon2d: 'sensor',
    color: '#059669', // Emerald 600
    defaultSize: { width: 80, height: 80, depth: 30 },
    isBuiltin: true,
    tags: ['温湿度', '甲醛', 'PM2.5', '传感器'],
  },
  {
    id: 'asset-smart-light',
    name: '护眼灯管',
    category: 'infrastructure',
    subcategory: '照明',
    defaultProperties: { price: 300, brand: '欧普', model: 'OP-LED', interfaces: ['WiFi', '蓝牙Mesh'], power: 40 },
    icon2d: 'light',
    color: '#FEF08A', // Yellow 200
    defaultSize: { width: 1200, height: 30, depth: 60 },
    isBuiltin: true,
    tags: ['灯泡', '照明', '护眼灯'],
  },

  // ===================== 新增计算与支持外设 =====================
  {
    id: 'asset-class-board',
    name: '电子班牌',
    category: 'display',
    subcategory: '物联网面板',
    defaultProperties: { price: 3500, brand: '希沃', model: 'CB21', interfaces: ['RJ45', 'WiFi', 'RFID'], power: 45 },
    icon2d: 'class-board',
    color: '#0EA5E9', // Sky 500
    defaultSize: { width: 500, height: 320, depth: 40 },
    isBuiltin: true,
    tags: ['班牌', '考勤', '触控'],
  },
  {
    id: 'asset-ups-battery',
    name: 'UPS电源',
    category: 'computing',
    subcategory: '供配电',
    defaultProperties: { price: 2500, brand: '山特', model: 'C3K', interfaces: ['RS232', 'USB'], power: 3000 },
    icon2d: 'ups',
    color: '#020617', // Slate 950
    defaultSize: { width: 190, height: 330, depth: 400 },
    isBuiltin: true,
    tags: ['电源', 'UPS', '不间断'],
  },
  {
    id: 'asset-network-cabinet',
    name: '标准机柜',
    category: 'infrastructure',
    subcategory: '支持支撑',
    defaultProperties: { price: 1500, brand: '图腾', model: 'G642', interfaces: [], power: 0 },
    icon2d: 'cabinet-rack',
    color: '#334155', // Slate 700
    defaultSize: { width: 600, height: 2000, depth: 800 },
    isBuiltin: true,
    tags: ['机柜', '服务器', '弱电'],
  },
  {
    id: 'asset-server-rack',
    name: '机架服务器',
    category: 'computing',
    subcategory: '服务器',
    defaultProperties: { price: 35000, brand: '戴尔', model: 'R750', interfaces: ['RJ45x4', 'SFP+', 'FC'], power: 800 },
    icon2d: 'server',
    color: '#0F172A', // Slate 900
    defaultSize: { width: 482, height: 87, depth: 750 },
    isBuiltin: true,
    tags: ['服务器', '存储', '机架式'],
  },
  {
    id: 'asset-router',
    name: '核心路由器',
    category: 'network',
    subcategory: '路由交换',
    defaultProperties: { price: 8500, brand: '新华三', model: 'MSR3600', interfaces: ['WANx2', 'LANx8'], power: 150 },
    icon2d: 'router',
    color: '#0EA5E9', // Sky 500
    defaultSize: { width: 440, height: 44, depth: 360 },
    isBuiltin: true,
    tags: ['路由', '网关', '防火墙'],
  },
  {
    id: 'asset-access-control',
    name: '门禁读卡器',
    category: 'infrastructure',
    subcategory: '安防',
    defaultProperties: { price: 800, brand: '大华', model: 'ASR1102A', interfaces: ['RS485', 'Wiegand'], power: 5 },
    icon2d: 'access-control',
    color: '#F43F5E', // Rose 500
    defaultSize: { width: 90, height: 130, depth: 25 },
    isBuiltin: true,
    tags: ['门禁', '打卡', '安防'],
  },

  // ===================== 新增教育设备 =====================
  {
    id: 'asset-whiteboard-pen',
    name: '电子白板笔',
    category: 'display',
    subcategory: '配件',
    defaultProperties: { price: 300, brand: '希沃', model: 'SP30', interfaces: ['蓝牙', 'USB充电'], power: 0 },
    icon2d: 'whiteboard-pen',
    color: '#8B5CF6', // Violet 500
    defaultSize: { width: 160, height: 25, depth: 15 },
    isBuiltin: true,
    tags: ['笔', '触控', '白板'],
  },
  {
    id: 'asset-clicker',
    name: '学生答题器',
    category: 'computing',
    subcategory: '交互设备',
    defaultProperties: { price: 120, brand: '畅言', model: 'CY-100', interfaces: ['RF 2.4G'], power: 0 },
    icon2d: 'clicker',
    color: '#10B981', // Emerald 500
    defaultSize: { width: 80, height: 130, depth: 18 },
    isBuiltin: true,
    tags: ['答题器', '互动', '学生'],
  },
  {
    id: 'asset-tablet',
    name: '学生平板',
    category: 'computing',
    subcategory: '终端',
    defaultProperties: { price: 2800, brand: '华为', model: 'MatePad SE 10.4', interfaces: ['WiFi', 'USB-C', '蓝牙'], power: 10 },
    icon2d: 'tablet',
    color: '#6366F1', // Indigo 500
    defaultSize: { width: 250, height: 170, depth: 8 },
    isBuiltin: true,
    tags: ['平板', '终端', '学习'],
  },
  {
    id: 'asset-3d-printer',
    name: '3D打印机',
    category: 'lab',
    subcategory: '创客设备',
    defaultProperties: { price: 5000, brand: '创想三维', model: 'Ender-3 V3', interfaces: ['USB', 'SD卡', 'WiFi'], power: 350 },
    icon2d: '3d-printer',
    color: '#F97316', // Orange 500
    defaultSize: { width: 450, height: 450, depth: 470 },
    isBuiltin: true,
    tags: ['3D打印', '创客', 'STEAM'],
  },
  {
    id: 'asset-document-camera',
    name: '高拍仪',
    category: 'av',
    subcategory: '采集',
    defaultProperties: { price: 1500, brand: '良田', model: 'S1020AF', interfaces: ['USB', 'HDMI'], power: 8 },
    icon2d: 'document-camera',
    color: '#14B8A6', // Teal 500
    defaultSize: { width: 280, height: 150, depth: 380 },
    isBuiltin: true,
    tags: ['高拍仪', '展台', '实物扫描'],
  },
  {
    id: 'asset-led-panel',
    name: 'LED护眼灯',
    category: 'infrastructure',
    subcategory: '照明',
    defaultProperties: { price: 400, brand: '欧普', model: 'MT-LED36', interfaces: ['220V'], power: 36 },
    icon2d: 'led-panel',
    color: '#FBBF24', // Amber 400
    defaultSize: { width: 1200, height: 300, depth: 60 },
    isBuiltin: true,
    tags: ['灯具', '照明', '护眼'],
  },
  {
    id: 'asset-curtain-motor',
    name: '电动窗帘',
    category: 'infrastructure',
    subcategory: '环境控制',
    defaultProperties: { price: 1200, brand: '杜亚', model: 'DT52E', interfaces: ['RS485', 'RF', 'WiFi'], power: 40 },
    icon2d: 'curtain',
    color: '#A78BFA', // Violet 400
    defaultSize: { width: 100, height: 2000, depth: 120 },
    isBuiltin: true,
    tags: ['窗帘', '遮光', '电动'],
  },
  {
    id: 'asset-central-control',
    name: '中控主机',
    category: 'computing',
    subcategory: '控制',
    defaultProperties: { price: 6000, brand: '快思聪', model: 'MC4-R', interfaces: ['RS232', 'RS485', 'IR', 'RJ45', 'HDMI'], power: 25 },
    icon2d: 'central-control',
    color: '#1E293B', // Slate 800
    defaultSize: { width: 430, height: 44, depth: 300 },
    isBuiltin: true,
    tags: ['中控', '控制', '集中管理'],
  },
  {
    id: 'asset-ups',
    name: 'UPS电源',
    category: 'infrastructure',
    subcategory: '电力',
    defaultProperties: { price: 3500, brand: 'APC', model: 'BX1100CI', interfaces: ['220V输入', '220V输出x6'], power: 660 },
    icon2d: 'ups',
    color: '#EF4444', // Red 500
    defaultSize: { width: 300, height: 500, depth: 200 },
    isBuiltin: true,
    tags: ['UPS', '不间断', '备用电源'],
  },
  {
    id: 'asset-info-display',
    name: '信息发布屏',
    category: 'display',
    subcategory: '公告',
    defaultProperties: { price: 8000, brand: '海康威视', model: 'DS-D6043FL', interfaces: ['HDMI', 'RJ45', 'WiFi'], power: 120 },
    icon2d: 'info-display',
    color: '#0284C7', // Sky 600
    defaultSize: { width: 1000, height: 560, depth: 55 },
    isBuiltin: true,
    tags: ['信息发布', '广告机', '公告'],
  },
  {
    id: 'asset-class-sign',
    name: '电子班牌',
    category: 'display',
    subcategory: '智能终端',
    defaultProperties: { price: 4500, brand: '鸿合', model: 'HD-I2165E', interfaces: ['RJ45', 'WiFi', 'USB', 'IC卡'], power: 30 },
    icon2d: 'class-sign',
    color: '#2563EB', // Blue 600
    defaultSize: { width: 520, height: 300, depth: 40 },
    isBuiltin: true,
    tags: ['班牌', '考勤', '走班'],
  },
  {
    id: 'asset-air-purifier',
    name: '新风净化器',
    category: 'infrastructure',
    subcategory: '环境控制',
    defaultProperties: { price: 6000, brand: '远大', model: 'SC500', interfaces: ['220V', 'WiFi'], power: 180 },
    icon2d: 'air-purifier',
    color: '#06B6D4', // Cyan 500
    defaultSize: { width: 500, height: 350, depth: 250 },
    isBuiltin: true,
    tags: ['新风', '空气净化', '环境'],
  }
];

export const getAssetById = (id: string): Asset | undefined =>
  builtinAssets.find(a => a.id === id);

export const getAssetsByCategory = (category: string): Asset[] =>
  builtinAssets.filter(a => a.category === category);
