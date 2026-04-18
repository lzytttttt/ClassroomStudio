import { Rect, Group, Line, Circle, Arc, Text, Ellipse } from 'react-konva';

/**
 * 2D 俯视图组件渲染器集合
 * 每个渲染器接收设备的像素尺寸(w, h)和品牌色(color)，
 * 返回 Konva 图形元素组，模拟真实设备的俯视外观。
 */

// ==================== 桌椅家具 ====================

/** 学生课桌 — 浅木色桌面 + 木纹线 */
export function renderDeskStudent(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 桌面主体 */}
      <Rect x={0} y={0} width={w} height={h} fill="#D4B896" cornerRadius={2} stroke="#B8976A" strokeWidth={1} />
      {/* 木纹装饰线 */}
      <Line points={[w * 0.2, 0, w * 0.2, h]} stroke="#C4A57B" strokeWidth={0.5} opacity={0.5} listening={false} />
      <Line points={[w * 0.5, 0, w * 0.5, h]} stroke="#C4A57B" strokeWidth={0.3} opacity={0.4} listening={false} />
      <Line points={[w * 0.8, 0, w * 0.8, h]} stroke="#C4A57B" strokeWidth={0.5} opacity={0.5} listening={false} />
      {/* 桌沿高光 */}
      <Line points={[1, 1, w - 1, 1]} stroke="rgba(255,255,255,0.35)" strokeWidth={1} listening={false} />
      {/* 桌腿暗示 (四角小方块) */}
      <Rect x={2} y={2} width={3} height={3} fill="#8B7355" listening={false} />
      <Rect x={w - 5} y={2} width={3} height={3} fill="#8B7355" listening={false} />
      <Rect x={2} y={h - 5} width={3} height={3} fill="#8B7355" listening={false} />
      <Rect x={w - 5} y={h - 5} width={3} height={3} fill="#8B7355" listening={false} />
    </Group>
  );
}

/** 学生椅 — 座面 + 靠背弧线 */
export function renderChairStudent(w: number, h: number, color: string) {
  const seatR = Math.min(w, h) * 0.4;
  return (
    <Group>
      {/* 靠背 */}
      <Rect x={w * 0.15} y={0} width={w * 0.7} height={h * 0.3} fill="#5B6B7D" cornerRadius={[3, 3, 0, 0]} stroke="#475569" strokeWidth={0.8} listening={false} />
      {/* 座面 */}
      <Rect x={w * 0.1} y={h * 0.28} width={w * 0.8} height={h * 0.55} fill="#6B7B8D" cornerRadius={3} stroke="#4A5568" strokeWidth={0.8} />
      {/* 座面高光 */}
      <Rect x={w * 0.15} y={h * 0.32} width={w * 0.7} height={h * 0.15} fill="rgba(255,255,255,0.12)" cornerRadius={2} listening={false} />
      {/* 椅腿 */}
      <Rect x={w * 0.15} y={h * 0.85} width={3} height={h * 0.12} fill="#475569" listening={false} />
      <Rect x={w * 0.82} y={h * 0.85} width={3} height={h * 0.12} fill="#475569" listening={false} />
    </Group>
  );
}

/** 教师讲台 — 宽大深色木质桌面 + 抽屉线 */
export function renderDeskTeacher(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 桌面 */}
      <Rect x={0} y={0} width={w} height={h} fill="#5C4033" cornerRadius={3} stroke="#3D2B1F" strokeWidth={1.5} />
      {/* 桌面纹理 */}
      <Line points={[w * 0.15, 2, w * 0.15, h - 2]} stroke="#6B4A3A" strokeWidth={0.4} opacity={0.6} listening={false} />
      <Line points={[w * 0.4, 2, w * 0.4, h - 2]} stroke="#6B4A3A" strokeWidth={0.3} opacity={0.4} listening={false} />
      <Line points={[w * 0.65, 2, w * 0.65, h - 2]} stroke="#6B4A3A" strokeWidth={0.3} opacity={0.4} listening={false} />
      <Line points={[w * 0.85, 2, w * 0.85, h - 2]} stroke="#6B4A3A" strokeWidth={0.4} opacity={0.6} listening={false} />
      {/* 抽屉区域 */}
      <Rect x={w * 0.6} y={h * 0.15} width={w * 0.35} height={h * 0.7} fill="#4A3428" cornerRadius={2} stroke="#3D2B1F" strokeWidth={0.8} listening={false} />
      {/* 抽屉把手 */}
      <Line points={[w * 0.73, h * 0.35, w * 0.83, h * 0.35]} stroke="#8B7355" strokeWidth={1.5} lineCap="round" listening={false} />
      <Line points={[w * 0.73, h * 0.55, w * 0.83, h * 0.55]} stroke="#8B7355" strokeWidth={1.5} lineCap="round" listening={false} />
      {/* 桌面高光 */}
      <Line points={[2, 2, w - 2, 2]} stroke="rgba(255,255,255,0.2)" strokeWidth={1} listening={false} />
      {/* 键盘/设备放置区域 */}
      <Rect x={w * 0.08} y={h * 0.2} width={w * 0.45} height={h * 0.6} fill="#4A3428" cornerRadius={2} opacity={0.4} listening={false} />
    </Group>
  );
}

/** 传统黑板 — 深绿色长条 + 粉笔区 */
export function renderBlackboard(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1A3C2A" cornerRadius={1} stroke="#0F2A1C" strokeWidth={1.5} />
      {/* 铝合金边框 */}
      <Rect x={1} y={1} width={w - 2} height={h - 2} stroke="#94A3B8" strokeWidth={0.8} cornerRadius={1} fill="transparent" listening={false} />
      {/* 粉笔槽 */}
      <Rect x={w * 0.1} y={h * 0.7} width={w * 0.8} height={h * 0.15} fill="#0F2A1C" cornerRadius={1} listening={false} />
    </Group>
  );
}

/** 储物柜 */
export function renderCabinet(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#D1D5DB" cornerRadius={2} stroke="#9CA3AF" strokeWidth={1} />
      {/* 柜门分隔线 */}
      <Line points={[w * 0.5, 2, w * 0.5, h - 2]} stroke="#9CA3AF" strokeWidth={1} listening={false} />
      {/* 把手 */}
      <Circle x={w * 0.42} y={h * 0.5} radius={Math.min(w, h) * 0.04} fill="#6B7280" listening={false} />
      <Circle x={w * 0.58} y={h * 0.5} radius={Math.min(w, h) * 0.04} fill="#6B7280" listening={false} />
      {/* 顶部高光 */}
      <Line points={[2, 2, w - 2, 2]} stroke="rgba(255,255,255,0.4)" strokeWidth={1} listening={false} />
    </Group>
  );
}

// ==================== 显示设备 ====================

/** 智慧黑板 — 深蓝屏幕 + 两侧黑板翼 + 反光 */
export function renderSmartBoard(w: number, h: number, color: string) {
  const screenW = w * 0.5;
  const wingW = w * 0.25;
  return (
    <Group>
      {/* 左侧黑板翼 */}
      <Rect x={0} y={0} width={wingW} height={h} fill="#1A3C2A" stroke="#0F2A1C" strokeWidth={1} cornerRadius={[2, 0, 0, 2]} listening={false} />
      {/* 中央触控屏 */}
      <Rect x={wingW} y={0} width={screenW} height={h} fill="#0F172A" stroke="#1E40AF" strokeWidth={1.5} />
      {/* 屏幕内容区 */}
      <Rect x={wingW + 2} y={2} width={screenW - 4} height={h - 4} fill="#1E3A5F" cornerRadius={1} listening={false} />
      {/* 屏幕反光 */}
      <Rect x={wingW + screenW * 0.1} y={2} width={screenW * 0.3} height={h - 4} fill="rgba(255,255,255,0.06)" listening={false} />
      {/* 右侧黑板翼 */}
      <Rect x={wingW + screenW} y={0} width={wingW} height={h} fill="#1A3C2A" stroke="#0F2A1C" strokeWidth={1} cornerRadius={[0, 2, 2, 0]} listening={false} />
      {/* 底部指示灯 */}
      <Circle x={w * 0.5} y={h * 0.8} radius={Math.max(1, h * 0.08)} fill="#3B82F6" shadowColor="#3B82F6" shadowBlur={3} listening={false} />
    </Group>
  );
}

/** 交互大屏 */
export function renderInteractiveScreen(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 边框 */}
      <Rect x={0} y={0} width={w} height={h} fill="#111827" cornerRadius={2} stroke="#374151" strokeWidth={1} />
      {/* 屏幕 */}
      <Rect x={2} y={2} width={w - 4} height={h - 4} fill="#0C4A6E" cornerRadius={1} listening={false} />
      {/* 反光 */}
      <Rect x={w * 0.15} y={2} width={w * 0.2} height={h - 4} fill="rgba(255,255,255,0.05)" listening={false} />
      {/* 底部指示灯 */}
      <Circle x={w * 0.5} y={h * 0.85} radius={Math.max(1, h * 0.06)} fill="#10B981" listening={false} />
    </Group>
  );
}

/** 投影仪 */
export function renderProjector(w: number, h: number, color: string) {
  const lensR = Math.min(w, h) * 0.2;
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#E5E7EB" cornerRadius={4} stroke="#9CA3AF" strokeWidth={1} />
      {/* 镜头 */}
      <Circle x={w * 0.35} y={h * 0.5} radius={lensR} fill="#1F2937" stroke="#4B5563" strokeWidth={1} />
      <Circle x={w * 0.35} y={h * 0.5} radius={lensR * 0.6} fill="#374151" listening={false} />
      <Circle x={w * 0.35} y={h * 0.5} radius={lensR * 0.25} fill="#60A5FA" shadowColor="#60A5FA" shadowBlur={3} listening={false} />
      {/* 散热栅格 */}
      {[0.6, 0.68, 0.76, 0.84].map(ratio => (
        <Line key={ratio} points={[w * ratio, h * 0.25, w * ratio, h * 0.75]} stroke="#9CA3AF" strokeWidth={0.8} opacity={0.5} listening={false} />
      ))}
      {/* 指示灯 */}
      <Circle x={w * 0.92} y={h * 0.2} radius={Math.max(1, Math.min(w, h) * 0.04)} fill="#22C55E" listening={false} />
    </Group>
  );
}

/** 投影幕布 */
export function renderProjectionScreen(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 安装槽 */}
      <Rect x={0} y={0} width={w} height={h} fill="#F1F5F9" cornerRadius={1} stroke="#CBD5E1" strokeWidth={1} />
      {/* 幕面 */}
      <Rect x={2} y={1} width={w - 4} height={h - 2} fill="#FAFAFA" listening={false} />
      {/* 底部配重条 */}
      <Rect x={1} y={h - 2} width={w - 2} height={2} fill="#94A3B8" listening={false} />
    </Group>
  );
}

/** 电子班牌 */
export function renderClassBoard(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={3} stroke="#0EA5E9" strokeWidth={1} />
      <Rect x={3} y={3} width={w - 6} height={h - 6} fill="#0C4A6E" cornerRadius={2} listening={false} />
      {/* 触控区域线 */}
      <Line points={[w * 0.1, h * 0.3, w * 0.9, h * 0.3]} stroke="#0EA5E9" strokeWidth={0.5} opacity={0.4} listening={false} />
      {/* 刷卡区 */}
      <Rect x={w * 0.7} y={h * 0.6} width={w * 0.2} height={h * 0.25} fill="#164E63" cornerRadius={2} stroke="#0891B2" strokeWidth={0.5} listening={false} />
    </Group>
  );
}

// ==================== 音视频设备 ====================

/** PTZ 摄像头 — 圆形底座 + 镜头 */
export function renderCameraPTZ(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.4;
  return (
    <Group>
      {/* 底座 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r} fill="#E5E7EB" stroke="#9CA3AF" strokeWidth={1} />
      {/* 旋转平台 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.7} fill="#D1D5DB" listening={false} />
      {/* 镜头 */}
      <Circle x={w * 0.5} y={h * 0.4} radius={r * 0.35} fill="#1F2937" stroke="#4B5563" strokeWidth={0.8} />
      <Circle x={w * 0.5} y={h * 0.4} radius={r * 0.15} fill="#0891B2" shadowColor="#0891B2" shadowBlur={2} listening={false} />
      {/* 状态灯 */}
      <Circle x={w * 0.5} y={h * 0.65} radius={Math.max(1, r * 0.08)} fill="#EF4444" listening={false} />
    </Group>
  );
}

/** 固定摄像头 */
export function renderCameraFixed(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.35;
  return (
    <Group>
      <Circle x={w * 0.5} y={h * 0.5} radius={r} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1} />
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.6} fill="#374151" listening={false} />
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.25} fill="#0E7490" shadowColor="#22D3EE" shadowBlur={2} listening={false} />
    </Group>
  );
}

/** 录播主机 — 黑色机身 + 指示灯阵列 */
export function renderRecordingHost(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1E293B" cornerRadius={3} stroke="#334155" strokeWidth={1} />
      {/* 面板 */}
      <Rect x={w * 0.05} y={h * 0.15} width={w * 0.9} height={h * 0.4} fill="#0F172A" cornerRadius={2} listening={false} />
      {/* 指示灯行 */}
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((r, i) => (
        <Circle key={r} x={w * r} y={h * 0.7} radius={Math.max(1, Math.min(w, h) * 0.03)} fill={i === 0 ? '#22C55E' : i === 1 ? '#3B82F6' : '#475569'} listening={false} />
      ))}
      {/* 散热孔 */}
      {[0.25, 0.35, 0.45, 0.55, 0.65, 0.75].map(r => (
        <Line key={r} points={[w * r, h * 0.85, w * r, h * 0.95]} stroke="#475569" strokeWidth={0.8} listening={false} />
      ))}
    </Group>
  );
}

/** 壁挂音响 */
export function renderSpeaker(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.3;
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1F2937" cornerRadius={3} stroke="#374151" strokeWidth={1} />
      {/* 喇叭 */}
      <Circle x={w * 0.5} y={h * 0.4} radius={r} fill="#111827" stroke="#374151" strokeWidth={0.8} />
      <Circle x={w * 0.5} y={h * 0.4} radius={r * 0.5} fill="#1F2937" listening={false} />
      <Circle x={w * 0.5} y={h * 0.4} radius={r * 0.15} fill="#374151" listening={false} />
      {/* 低音区 */}
      <Circle x={w * 0.5} y={h * 0.75} radius={r * 0.45} fill="#111827" stroke="#374151" strokeWidth={0.5} listening={false} />
    </Group>
  );
}

/** 全向麦克风 */
export function renderMicrophone(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.38;
  return (
    <Group>
      {/* 底座 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r} fill="#374151" stroke="#4B5563" strokeWidth={1} />
      {/* 拾音膜 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.6} fill="#1F2937" listening={false} />
      {/* 声波指示 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.25} fill="#6B7280" listening={false} />
      {/* LED 环 */}
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.85} stroke="#22C55E" strokeWidth={0.8} opacity={0.5} fill="transparent" listening={false} />
    </Group>
  );
}

/** 功放机 */
export function renderAmplifier(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1E293B" cornerRadius={2} stroke="#334155" strokeWidth={1} />
      {/* 散热栅 */}
      {Array.from({ length: 8 }, (_, i) => (
        <Line key={i} points={[w * (0.1 + i * 0.1), h * 0.15, w * (0.1 + i * 0.1), h * 0.85]} stroke="#475569" strokeWidth={0.6} listening={false} />
      ))}
      {/* VU 表 */}
      <Rect x={w * 0.35} y={h * 0.25} width={w * 0.3} height={h * 0.5} fill="#0F172A" cornerRadius={2} stroke="#475569" strokeWidth={0.5} listening={false} />
      {/* 电源灯 */}
      <Circle x={w * 0.1} y={h * 0.5} radius={Math.max(1, Math.min(w, h) * 0.04)} fill="#EF4444" listening={false} />
    </Group>
  );
}

/** 调音台 */
export function renderAudioMixer(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#374151" cornerRadius={2} stroke="#4B5563" strokeWidth={1} />
      {/* 推子轨道 */}
      {Array.from({ length: 6 }, (_, i) => (
        <Group key={i}>
          <Line points={[w * (0.12 + i * 0.14), h * 0.2, w * (0.12 + i * 0.14), h * 0.8]} stroke="#6B7280" strokeWidth={1} listening={false} />
          <Rect x={w * (0.1 + i * 0.14)} y={h * (0.35 + Math.random() * 0.25)} width={w * 0.04} height={h * 0.12} fill="#94A3B8" cornerRadius={1} listening={false} />
        </Group>
      ))}
    </Group>
  );
}

/** 无线话筒 */
export function renderWirelessMic(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 接收器机身 */}
      <Rect x={0} y={0} width={w} height={h} fill="#1F2937" cornerRadius={2} stroke="#374151" strokeWidth={1} />
      {/* 天线 */}
      <Line points={[w * 0.85, 0, w * 0.85, -h * 0.3]} stroke="#6B7280" strokeWidth={1} lineCap="round" listening={false} />
      <Line points={[w * 0.92, 0, w * 0.92, -h * 0.2]} stroke="#6B7280" strokeWidth={1} lineCap="round" listening={false} />
      {/* 显示屏 */}
      <Rect x={w * 0.1} y={h * 0.2} width={w * 0.5} height={h * 0.6} fill="#0C4A6E" cornerRadius={1} listening={false} />
      {/* 频道指示灯 */}
      <Circle x={w * 0.75} y={h * 0.5} radius={Math.max(1, h * 0.1)} fill="#22C55E" listening={false} />
    </Group>
  );
}

/** 吊顶麦克风 */
export function renderHangingMic(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.4;
  return (
    <Group>
      {/* 方形外壳 */}
      <Rect x={w * 0.1} y={h * 0.1} width={w * 0.8} height={h * 0.8} fill="#F1F5F9" cornerRadius={3} stroke="#CBD5E1" strokeWidth={1} />
      {/* 拾音阵列网格 */}
      {Array.from({ length: 3 }, (_, i) =>
        Array.from({ length: 3 }, (_, j) => (
          <Circle key={`${i}-${j}`} x={w * (0.3 + j * 0.2)} y={h * (0.3 + i * 0.2)} radius={Math.max(1, r * 0.08)} fill="#94A3B8" listening={false} />
        ))
      )}
    </Group>
  );
}

/** 广播音柱 */
export function renderBroadcaster(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#E5E7EB" cornerRadius={[3, 3, 3, 3]} stroke="#9CA3AF" strokeWidth={1} />
      {/* 喇叭面网 */}
      {Array.from({ length: Math.max(3, Math.floor(h / (w * 0.4))), }, (_, i) => (
        <Circle key={i} x={w * 0.5} y={h * (0.15 + i * 0.22)} radius={w * 0.25} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={0.5} listening={false} />
      ))}
    </Group>
  );
}

// ==================== 网络设备 ====================

/** 交换机 — 扁长机身 + 网口点阵 */
export function renderSwitch(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1E293B" cornerRadius={2} stroke="#334155" strokeWidth={1} />
      {/* 网口区域 */}
      <Rect x={w * 0.05} y={h * 0.2} width={w * 0.8} height={h * 0.6} fill="#0F172A" cornerRadius={1} listening={false} />
      {/* 网口矩阵 */}
      {Array.from({ length: 12 }, (_, i) => (
        <Rect key={i} x={w * (0.08 + i * 0.065)} y={h * 0.3} width={w * 0.04} height={h * 0.4} fill="#374151" cornerRadius={0.5} stroke="#475569" strokeWidth={0.3} listening={false} />
      ))}
      {/* 状态指示灯 */}
      {Array.from({ length: 6 }, (_, i) => (
        <Circle key={`led-${i}`} x={w * (0.1 + i * 0.13)} y={h * 0.85} radius={Math.max(0.8, h * 0.04)} fill={i < 4 ? '#22C55E' : '#475569'} listening={false} />
      ))}
      {/* 品牌标 */}
      <Rect x={w * 0.88} y={h * 0.3} width={w * 0.08} height={h * 0.4} fill="#0284C7" cornerRadius={1} listening={false} />
    </Group>
  );
}

/** 无线 AP — 圆形扁盒 + WiFi 标识 */
export function renderAP(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.42;
  return (
    <Group>
      <Circle x={w * 0.5} y={h * 0.5} radius={r} fill="#F1F5F9" stroke="#CBD5E1" strokeWidth={1} />
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.7} fill="#E2E8F0" listening={false} />
      {/* WiFi 信号弧线 */}
      <Arc x={w * 0.5} y={h * 0.55} innerRadius={r * 0.15} outerRadius={r * 0.22} angle={140} rotation={-70} fill="#10B981" listening={false} />
      <Arc x={w * 0.5} y={h * 0.55} innerRadius={r * 0.28} outerRadius={r * 0.35} angle={140} rotation={-70} fill="#10B981" opacity={0.6} listening={false} />
      <Arc x={w * 0.5} y={h * 0.55} innerRadius={r * 0.42} outerRadius={r * 0.48} angle={140} rotation={-70} fill="#10B981" opacity={0.3} listening={false} />
      {/* 中心指示灯 */}
      <Circle x={w * 0.5} y={h * 0.55} radius={r * 0.08} fill="#10B981" shadowColor="#10B981" shadowBlur={3} listening={false} />
    </Group>
  );
}

/** 核心路由器 */
export function renderRouter(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1E293B" cornerRadius={2} stroke="#334155" strokeWidth={1} />
      {/* 前面板指示灯 */}
      {Array.from({ length: 8 }, (_, i) => (
        <Circle key={i} x={w * (0.1 + i * 0.1)} y={h * 0.35} radius={Math.max(0.5, h * 0.06)} fill={i < 2 ? '#22C55E' : i < 5 ? '#3B82F6' : '#475569'} listening={false} />
      ))}
      {/* 端口 */}
      {Array.from({ length: 4 }, (_, i) => (
        <Rect key={`port-${i}`} x={w * (0.1 + i * 0.12)} y={h * 0.55} width={w * 0.08} height={h * 0.3} fill="#374151" cornerRadius={0.5} listening={false} />
      ))}
      {/* 品牌区 */}
      <Rect x={w * 0.7} y={h * 0.5} width={w * 0.25} height={h * 0.35} fill="#0EA5E9" cornerRadius={1} opacity={0.8} listening={false} />
    </Group>
  );
}

// ==================== 计算终端 ====================

/** 台式电脑 — 黑色机箱俯视 */
export function renderPCDesktop(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#111827" cornerRadius={2} stroke="#374151" strokeWidth={1} />
      {/* 顶部散热口 */}
      {Array.from({ length: 6 }, (_, i) => (
        <Line key={i} points={[w * 0.15, h * (0.1 + i * 0.12), w * 0.85, h * (0.1 + i * 0.12)]} stroke="#374151" strokeWidth={0.8} listening={false} />
      ))}
      {/* 电源按钮 */}
      <Circle x={w * 0.5} y={h * 0.88} radius={Math.max(1.5, Math.min(w, h) * 0.06)} fill="#1F2937" stroke="#4B5563" strokeWidth={0.8} />
      <Circle x={w * 0.5} y={h * 0.88} radius={Math.max(0.8, Math.min(w, h) * 0.03)} fill="#3B82F6" listening={false} />
    </Group>
  );
}

/** 笔记本电脑 — 展开形态 */
export function renderPCLaptop(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 机身 */}
      <Rect x={0} y={0} width={w} height={h} fill="#94A3B8" cornerRadius={3} stroke="#64748B" strokeWidth={1} />
      {/* 屏幕区域 (上半) */}
      <Rect x={w * 0.05} y={h * 0.05} width={w * 0.9} height={h * 0.42} fill="#0F172A" cornerRadius={2} listening={false} />
      <Rect x={w * 0.08} y={h * 0.08} width={w * 0.84} height={h * 0.36} fill="#1E3A5F" cornerRadius={1} listening={false} />
      {/* 铰链线 */}
      <Line points={[w * 0.1, h * 0.5, w * 0.9, h * 0.5]} stroke="#64748B" strokeWidth={1.5} listening={false} />
      {/* 键盘区域 */}
      <Rect x={w * 0.08} y={h * 0.55} width={w * 0.84} height={h * 0.3} fill="#78909C" cornerRadius={1} listening={false} />
      {/* 触控板 */}
      <Rect x={w * 0.35} y={h * 0.87} width={w * 0.3} height={h * 0.09} fill="#8698AA" cornerRadius={1} stroke="#64748B" strokeWidth={0.5} listening={false} />
    </Group>
  );
}

/** 充电柜 */
export function renderChargingCart(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#D1D5DB" cornerRadius={3} stroke="#9CA3AF" strokeWidth={1} />
      {/* 柜门 */}
      <Rect x={2} y={2} width={w - 4} height={h - 4} fill="#E5E7EB" cornerRadius={2} listening={false} />
      {/* 充电指示区 */}
      <Rect x={w * 0.1} y={h * 0.15} width={w * 0.8} height={h * 0.3} fill="#059669" cornerRadius={2} opacity={0.2} listening={false} />
      {/* 充电图标 (闪电) */}
      <Line points={[w * 0.43, h * 0.2, w * 0.52, h * 0.28, w * 0.48, h * 0.28, w * 0.57, h * 0.38, w * 0.48, h * 0.3, w * 0.52, h * 0.3]} stroke="#059669" strokeWidth={1.5} closed listening={false} fill="#059669" />
      {/* 分层线 */}
      <Line points={[w * 0.1, h * 0.5, w * 0.9, h * 0.5]} stroke="#9CA3AF" strokeWidth={0.8} listening={false} />
      {/* 散热孔 */}
      {Array.from({ length: 5 }, (_, i) => (
        <Circle key={i} x={w * (0.2 + i * 0.15)} y={h * 0.75} radius={Math.max(1, w * 0.02)} fill="#9CA3AF" listening={false} />
      ))}
    </Group>
  );
}

/** 中控面板 */
export function renderControlPanel(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={3} stroke="#4F46E5" strokeWidth={1} />
      {/* 触屏 */}
      <Rect x={3} y={3} width={w - 6} height={h - 6} fill="#1E1B4B" cornerRadius={2} listening={false} />
      {/* 功能按钮区域 */}
      {[0.25, 0.5, 0.75].map(rx => (
        [0.35, 0.65].map(ry => (
          <Rect key={`${rx}-${ry}`} x={w * rx - 3} y={h * ry - 3} width={6} height={6} fill="#4F46E5" cornerRadius={1} opacity={0.6} listening={false} />
        ))
      ))}
    </Group>
  );
}

/** UPS 电源 */
export function renderUPS(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={2} stroke="#1E293B" strokeWidth={1} />
      {/* 显示面板 */}
      <Rect x={w * 0.15} y={h * 0.1} width={w * 0.7} height={h * 0.3} fill="#022C22" cornerRadius={1} listening={false} />
      {/* 状态灯 */}
      <Circle x={w * 0.3} y={h * 0.55} radius={Math.max(1, Math.min(w, h) * 0.04)} fill="#22C55E" listening={false} />
      <Circle x={w * 0.5} y={h * 0.55} radius={Math.max(1, Math.min(w, h) * 0.04)} fill="#F59E0B" listening={false} />
      <Circle x={w * 0.7} y={h * 0.55} radius={Math.max(1, Math.min(w, h) * 0.04)} fill="#475569" listening={false} />
      {/* 散热 */}
      {Array.from({ length: 4 }, (_, i) => (
        <Line key={i} points={[w * (0.2 + i * 0.18), h * 0.7, w * (0.2 + i * 0.18), h * 0.9]} stroke="#1E293B" strokeWidth={0.8} listening={false} />
      ))}
    </Group>
  );
}

/** 机架服务器 */
export function renderServerRack(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1E293B" cornerRadius={1} stroke="#334155" strokeWidth={1} />
      {/* 硬盘位 */}
      {Array.from({ length: 8 }, (_, i) => (
        <Rect key={i} x={w * (0.05 + i * 0.11)} y={h * 0.15} width={w * 0.08} height={h * 0.7} fill="#0F172A" cornerRadius={0.5} stroke="#475569" strokeWidth={0.3} listening={false} />
      ))}
      {/* 电源指示灯 */}
      <Circle x={w * 0.95} y={h * 0.5} radius={Math.max(0.5, h * 0.08)} fill="#22C55E" listening={false} />
    </Group>
  );
}

// ==================== 实验器材 ====================

/** 实验台 */
export function renderLabTable(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#94A3B8" cornerRadius={2} stroke="#64748B" strokeWidth={1} />
      {/* 台面 */}
      <Rect x={2} y={2} width={w - 4} height={h - 4} fill="#CBD5E1" cornerRadius={1} listening={false} />
      {/* 水槽凹陷 */}
      <Rect x={w * 0.75} y={h * 0.2} width={w * 0.15} height={h * 0.35} fill="#94A3B8" cornerRadius={2} stroke="#64748B" strokeWidth={0.5} listening={false} />
      {/* 实验区域标线 */}
      <Line points={[w * 0.05, h * 0.5, w * 0.65, h * 0.5]} stroke="#94A3B8" strokeWidth={0.5} dash={[3,3]} listening={false} />
    </Group>
  );
}

/** 数码显微镜 */
export function renderMicroscope(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 底座 */}
      <Rect x={w * 0.1} y={h * 0.5} width={w * 0.8} height={h * 0.45} fill="#D1D5DB" cornerRadius={3} stroke="#9CA3AF" strokeWidth={1} />
      {/* 支柱 */}
      <Rect x={w * 0.4} y={h * 0.1} width={w * 0.2} height={h * 0.5} fill="#9CA3AF" cornerRadius={1} listening={false} />
      {/* 目镜 */}
      <Circle x={w * 0.5} y={h * 0.12} radius={Math.min(w, h) * 0.1} fill="#374151" stroke="#4B5563" strokeWidth={0.8} listening={false} />
      {/* 载物台 */}
      <Rect x={w * 0.25} y={h * 0.55} width={w * 0.5} height={h * 0.15} fill="#E2E8F0" cornerRadius={1} stroke="#94A3B8" strokeWidth={0.5} listening={false} />
    </Group>
  );
}

/** 传感器套件 */
export function renderSensorKit(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#F3F4F6" cornerRadius={3} stroke="#D1D5DB" strokeWidth={1} />
      {/* 传感器模块 */}
      {[0.2, 0.5, 0.8].map((rx, i) => (
        <Group key={i}>
          <Rect x={w * rx - w * 0.08} y={h * 0.2} width={w * 0.16} height={h * 0.6} fill={['#8B5CF6', '#10B981', '#F59E0B'][i]} cornerRadius={2} opacity={0.3} listening={false} />
          <Circle x={w * rx} y={h * 0.45} radius={Math.max(1, Math.min(w, h) * 0.06)} fill={['#8B5CF6', '#10B981', '#F59E0B'][i]} listening={false} />
        </Group>
      ))}
    </Group>
  );
}

// ==================== 基础设施 ====================

/** 智能空调 */
export function renderAirConditioner(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#F1F5F9" cornerRadius={4} stroke="#CBD5E1" strokeWidth={1} />
      {/* 出风口栅格 */}
      {Array.from({ length: 6 }, (_, i) => (
        <Line key={i} points={[w * 0.1, h * (0.15 + i * 0.07), w * 0.9, h * (0.15 + i * 0.07)]} stroke="#CBD5E1" strokeWidth={0.8} listening={false} />
      ))}
      {/* 显示区域 */}
      <Rect x={w * 0.25} y={h * 0.65} width={w * 0.5} height={h * 0.1} fill="#0C4A6E" cornerRadius={1} listening={false} />
      {/* 品牌标识 */}
      <Rect x={w * 0.35} y={h * 0.82} width={w * 0.3} height={h * 0.05} fill="#94A3B8" cornerRadius={1} opacity={0.5} listening={false} />
    </Group>
  );
}

/** 窗帘电机 */
export function renderCurtainMotor(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.3;
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#E5E7EB" cornerRadius={2} stroke="#9CA3AF" strokeWidth={0.8} />
      <Circle x={w * 0.5} y={h * 0.4} radius={r} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={0.8} listening={false} />
      <Circle x={w * 0.5} y={h * 0.4} radius={r * 0.3} fill="#6B7280" listening={false} />
    </Group>
  );
}

/** 环境检测仪 */
export function renderEnvironmentSensor(w: number, h: number, color: string) {
  const r = Math.min(w, h) * 0.35;
  return (
    <Group>
      <Circle x={w * 0.5} y={h * 0.5} radius={r} fill="#F0FDF4" stroke="#059669" strokeWidth={1} />
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.5} fill="#DCFCE7" listening={false} />
      <Circle x={w * 0.5} y={h * 0.5} radius={r * 0.15} fill="#059669" listening={false} />
    </Group>
  );
}

/** 护眼灯管 */
export function renderSmartLight(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#FEFCE8" cornerRadius={h * 0.4} stroke="#FDE047" strokeWidth={0.8} />
      <Rect x={2} y={h * 0.15} width={w - 4} height={h * 0.7} fill="#FEF9C3" cornerRadius={h * 0.3} listening={false} />
      {/* 发光效果 */}
      <Rect x={0} y={0} width={w} height={h} fill="rgba(253, 224, 71, 0.15)" cornerRadius={h * 0.4} listening={false} />
    </Group>
  );
}

/** 标准机柜 */
export function renderNetworkCabinet(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#334155" cornerRadius={2} stroke="#1E293B" strokeWidth={1.5} />
      {/* U 位线 */}
      {Array.from({ length: Math.min(10, Math.floor(h / (w * 0.12))), }, (_, i) => (
        <Line key={i} points={[2, h * (0.05 + i * 0.09), w - 2, h * (0.05 + i * 0.09)]} stroke="#475569" strokeWidth={0.5} listening={false} />
      ))}
      {/* 门把手 */}
      <Rect x={w * 0.85} y={h * 0.3} width={w * 0.06} height={h * 0.4} fill="#64748B" cornerRadius={1} listening={false} />
    </Group>
  );
}

/** 门禁读卡器 */
export function renderAccessControl(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#1F2937" cornerRadius={3} stroke="#374151" strokeWidth={1} />
      {/* 刷卡区 */}
      <Rect x={w * 0.15} y={h * 0.15} width={w * 0.7} height={h * 0.45} fill="#111827" cornerRadius={2} listening={false} />
      {/* 指示灯 */}
      <Circle x={w * 0.5} y={h * 0.75} radius={Math.max(1, Math.min(w, h) * 0.08)} fill="#F43F5E" shadowColor="#F43F5E" shadowBlur={2} listening={false} />
    </Group>
  );
}

// ==================== 新增教育设备渲染器 ====================

/** 电子白板笔 */
export function renderWhiteboardPen(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={h * 0.2} width={w} height={h * 0.6} fill="#E5E7EB" cornerRadius={h * 0.3} stroke="#9CA3AF" strokeWidth={0.8} />
      {/* 笔尖 */}
      <Rect x={0} y={h * 0.3} width={w * 0.12} height={h * 0.4} fill="#6B7280" cornerRadius={[h * 0.2, 0, 0, h * 0.2]} listening={false} />
      {/* 按钮 */}
      <Rect x={w * 0.35} y={h * 0.3} width={w * 0.12} height={h * 0.4} fill="#8B5CF6" cornerRadius={1} listening={false} />
      <Rect x={w * 0.5} y={h * 0.3} width={w * 0.08} height={h * 0.4} fill="#A78BFA" cornerRadius={1} listening={false} />
      {/* 握持区纹理 */}
      <Rect x={w * 0.65} y={h * 0.25} width={w * 0.2} height={h * 0.5} fill="#D1D5DB" cornerRadius={1} listening={false} />
    </Group>
  );
}

/** 学生答题器 */
export function renderClicker(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#F3F4F6" cornerRadius={[4, 4, w * 0.3, w * 0.3]} stroke="#D1D5DB" strokeWidth={1} />
      {/* 按钮区 */}
      {['#EF4444', '#3B82F6', '#F59E0B', '#10B981'].map((c, i) => (
        <Rect key={i} x={w * (i % 2 === 0 ? 0.15 : 0.55)} y={h * (i < 2 ? 0.15 : 0.4)} width={w * 0.3} height={h * 0.2} fill={c} cornerRadius={2} opacity={0.8} listening={false} />
      ))}
      {/* 显示窗 */}
      <Rect x={w * 0.2} y={h * 0.7} width={w * 0.6} height={h * 0.12} fill="#0F172A" cornerRadius={1} listening={false} />
    </Group>
  );
}

/** 学生平板 */
export function renderTablet(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#111827" cornerRadius={4} stroke="#374151" strokeWidth={1} />
      {/* 屏幕 */}
      <Rect x={3} y={3} width={w - 6} height={h - 6} fill="#1E3A5F" cornerRadius={2} listening={false} />
      {/* 反光 */}
      <Rect x={w * 0.1} y={3} width={w * 0.25} height={h - 6} fill="rgba(255,255,255,0.05)" listening={false} />
      {/* 前置摄像头 */}
      <Circle x={w * 0.5} y={5} radius={1.5} fill="#374151" listening={false} />
    </Group>
  );
}

/** 3D打印机 */
export function render3DPrinter(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 底座框架 */}
      <Rect x={0} y={0} width={w} height={h} fill="#1F2937" cornerRadius={3} stroke="#374151" strokeWidth={1} />
      {/* 打印平台 */}
      <Rect x={w * 0.1} y={h * 0.1} width={w * 0.8} height={h * 0.8} fill="#374151" cornerRadius={2} listening={false} />
      {/* 打印床 */}
      <Rect x={w * 0.15} y={h * 0.15} width={w * 0.7} height={h * 0.7} fill="#4B5563" cornerRadius={1} listening={false} />
      {/* 床面网格 */}
      {[0.3, 0.5, 0.7].map(r => (
        <Group key={r}>
          <Line points={[w * 0.15, h * r, w * 0.85, h * r]} stroke="#6B7280" strokeWidth={0.3} listening={false} />
          <Line points={[w * r, h * 0.15, w * r, h * 0.85]} stroke="#6B7280" strokeWidth={0.3} listening={false} />
        </Group>
      ))}
      {/* 喷头 */}
      <Circle x={w * 0.45} y={h * 0.4} radius={Math.min(w, h) * 0.04} fill="#F97316" shadowColor="#F97316" shadowBlur={3} listening={false} />
      {/* X轴导轨 */}
      <Line points={[w * 0.1, h * 0.4, w * 0.9, h * 0.4]} stroke="#F97316" strokeWidth={1} opacity={0.4} listening={false} />
    </Group>
  );
}

/** 高拍仪 */
export function renderDocumentCamera(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 底座 */}
      <Rect x={w * 0.1} y={h * 0.5} width={w * 0.8} height={h * 0.45} fill="#D1D5DB" cornerRadius={3} stroke="#9CA3AF" strokeWidth={1} />
      {/* 支撑臂 */}
      <Rect x={w * 0.45} y={h * 0.1} width={w * 0.1} height={h * 0.5} fill="#94A3B8" cornerRadius={1} listening={false} />
      {/* 摄像头 */}
      <Circle x={w * 0.5} y={h * 0.12} radius={Math.min(w, h) * 0.08} fill="#1F2937" stroke="#4B5563" strokeWidth={0.8} listening={false} />
      <Circle x={w * 0.5} y={h * 0.12} radius={Math.min(w, h) * 0.04} fill="#14B8A6" listening={false} />
      {/* 补光灯 */}
      <Rect x={w * 0.3} y={h * 0.2} width={w * 0.4} height={h * 0.05} fill="#FBBF24" opacity={0.3} cornerRadius={1} listening={false} />
    </Group>
  );
}

/** LED护眼灯面板 */
export function renderLEDPanel(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#FEFCE8" cornerRadius={2} stroke="#FDE047" strokeWidth={0.8} />
      {/* 灯管组 */}
      {Array.from({ length: 3 }, (_, i) => (
        <Rect key={i} x={w * 0.05} y={h * (0.15 + i * 0.28)} width={w * 0.9} height={h * 0.2} fill="#FEF9C3" cornerRadius={h * 0.08} stroke="#FDE047" strokeWidth={0.3} listening={false} />
      ))}
      {/* 发光效果 */}
      <Rect x={0} y={0} width={w} height={h} fill="rgba(253, 224, 71, 0.12)" cornerRadius={2} listening={false} />
    </Group>
  );
}

/** 电动窗帘 */
export function renderCurtain(w: number, h: number, color: string) {
  return (
    <Group>
      {/* 导轨 */}
      <Rect x={0} y={0} width={w} height={h * 0.05} fill="#94A3B8" cornerRadius={1} listening={false} />
      {/* 帘布褶皱 */}
      {Array.from({ length: Math.max(4, Math.floor(h / 15)) }, (_, i) => (
        <Group key={i}>
          <Rect x={0} y={h * 0.05 + i * (h * 0.95 / Math.max(4, Math.floor(h / 15)))} width={w} height={h * 0.95 / Math.max(4, Math.floor(h / 15))}
            fill={i % 2 === 0 ? '#E9D5FF' : '#DDD6FE'} listening={false} />
        </Group>
      ))}
      {/* 外框 */}
      <Rect x={0} y={0} width={w} height={h} fill="transparent" stroke="#A78BFA" strokeWidth={0.8} cornerRadius={1} />
    </Group>
  );
}

/** 中控主机 */
export function renderCentralControl(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={2} stroke="#334155" strokeWidth={1} />
      {/* 前面板 */}
      <Rect x={w * 0.05} y={h * 0.15} width={w * 0.6} height={h * 0.7} fill="#1E293B" cornerRadius={1} listening={false} />
      {/* 接口指示灯 */}
      {Array.from({ length: 6 }, (_, i) => (
        <Circle key={i} x={w * (0.1 + i * 0.09)} y={h * 0.5} radius={Math.max(0.8, h * 0.06)}
          fill={i < 2 ? '#22C55E' : i < 4 ? '#3B82F6' : '#F59E0B'} listening={false} />
      ))}
      {/* RS232/485 端口 */}
      {Array.from({ length: 4 }, (_, i) => (
        <Rect key={`port-${i}`} x={w * (0.7 + i * 0.065)} y={h * 0.3} width={w * 0.04} height={h * 0.4}
          fill="#475569" cornerRadius={0.5} listening={false} />
      ))}
    </Group>
  );
}

/** UPS不间断电源 */
export function renderUPSPower(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={3} stroke="#1E293B" strokeWidth={1} />
      {/* LCD屏 */}
      <Rect x={w * 0.15} y={h * 0.08} width={w * 0.7} height={h * 0.25} fill="#022C22" cornerRadius={1} listening={false} />
      {/* 电池图标 */}
      <Rect x={w * 0.3} y={h * 0.4} width={w * 0.4} height={h * 0.15} fill="transparent" stroke="#22C55E" strokeWidth={0.8} cornerRadius={1} listening={false} />
      <Rect x={w * 0.32} y={h * 0.42} width={w * 0.3} height={h * 0.11} fill="#22C55E" opacity={0.6} cornerRadius={0.5} listening={false} />
      {/* 插口区 */}
      {Array.from({ length: 3 }, (_, i) => (
        <Rect key={i} x={w * (0.15 + i * 0.28)} y={h * 0.65} width={w * 0.2} height={h * 0.12}
          fill="#1E293B" cornerRadius={1} stroke="#374151" strokeWidth={0.5} listening={false} />
      ))}
      {/* 状态灯 */}
      <Circle x={w * 0.25} y={h * 0.88} radius={Math.max(1, Math.min(w, h) * 0.03)} fill="#22C55E" listening={false} />
      <Circle x={w * 0.5} y={h * 0.88} radius={Math.max(1, Math.min(w, h) * 0.03)} fill="#F59E0B" listening={false} />
      <Circle x={w * 0.75} y={h * 0.88} radius={Math.max(1, Math.min(w, h) * 0.03)} fill="#EF4444" opacity={0.3} listening={false} />
    </Group>
  );
}

/** 信息发布屏 */
export function renderInfoDisplay(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#111827" cornerRadius={2} stroke="#374151" strokeWidth={1} />
      {/* 屏幕 */}
      <Rect x={3} y={3} width={w - 6} height={h - 8} fill="#0C4A6E" cornerRadius={1} listening={false} />
      {/* 内容模拟 */}
      <Rect x={w * 0.1} y={h * 0.15} width={w * 0.5} height={h * 0.12} fill="rgba(255,255,255,0.15)" cornerRadius={1} listening={false} />
      <Rect x={w * 0.1} y={h * 0.35} width={w * 0.8} height={h * 0.05} fill="rgba(255,255,255,0.08)" listening={false} />
      <Rect x={w * 0.1} y={h * 0.45} width={w * 0.6} height={h * 0.05} fill="rgba(255,255,255,0.08)" listening={false} />
      {/* 底边logo区 */}
      <Rect x={0} y={h - 5} width={w} height={5} fill="#0284C7" cornerRadius={[0, 0, 2, 2]} opacity={0.7} listening={false} />
    </Group>
  );
}

/** 电子班牌 (新版) */
export function renderClassSign(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#0F172A" cornerRadius={4} stroke="#2563EB" strokeWidth={1.2} />
      <Rect x={3} y={3} width={w - 6} height={h * 0.65} fill="#1E3A5F" cornerRadius={2} listening={false} />
      {/* 标题区 */}
      <Rect x={w * 0.1} y={h * 0.08} width={w * 0.6} height={h * 0.1} fill="rgba(59,130,246,0.3)" cornerRadius={2} listening={false} />
      {/* 刷卡感应区 */}
      <Rect x={w * 0.25} y={h * 0.72} width={w * 0.5} height={h * 0.22} fill="#1E293B" cornerRadius={3} stroke="#3B82F6" strokeWidth={0.5} listening={false} />
      <Circle x={w * 0.5} y={h * 0.83} radius={Math.min(w, h) * 0.06} fill="#3B82F6" opacity={0.4} listening={false} />
    </Group>
  );
}

/** 新风净化器 */
export function renderAirPurifier(w: number, h: number, color: string) {
  return (
    <Group>
      <Rect x={0} y={0} width={w} height={h} fill="#F0FDFA" cornerRadius={4} stroke="#06B6D4" strokeWidth={1} />
      {/* 进风栅格 */}
      {Array.from({ length: 5 }, (_, i) => (
        <Line key={i} points={[w * 0.1, h * (0.1 + i * 0.08), w * 0.9, h * (0.1 + i * 0.08)]}
          stroke="#99F6E4" strokeWidth={1} listening={false} />
      ))}
      {/* 风扇轮廓 */}
      <Circle x={w * 0.5} y={h * 0.65} radius={Math.min(w, h) * 0.18} fill="#ECFDF5" stroke="#06B6D4" strokeWidth={0.8} listening={false} />
      <Circle x={w * 0.5} y={h * 0.65} radius={Math.min(w, h) * 0.06} fill="#06B6D4" opacity={0.5} listening={false} />
      {/* HEPA 标识 */}
      <Rect x={w * 0.3} y={h * 0.88} width={w * 0.4} height={h * 0.08} fill="#06B6D4" cornerRadius={2} opacity={0.2} listening={false} />
    </Group>
  );
}

// ==================== 渲染器注册表 ====================

type RendererFn = (w: number, h: number, color: string) => React.ReactNode;

const RENDERER_MAP: Record<string, RendererFn> = {
  'desk-student': renderDeskStudent,
  'chair-student': renderChairStudent,
  'desk-teacher': renderDeskTeacher,
  'blackboard': renderBlackboard,
  'cabinet': renderCabinet,
  'smart-board': renderSmartBoard,
  'interactive-screen': renderInteractiveScreen,
  'projector': renderProjector,
  'projection-screen': renderProjectionScreen,
  'class-board': renderClassBoard,
  'camera-ptz': renderCameraPTZ,
  'camera-fixed': renderCameraFixed,
  'recording-host': renderRecordingHost,
  'speaker': renderSpeaker,
  'microphone': renderMicrophone,
  'amplifier': renderAmplifier,
  'audio-mixer': renderAudioMixer,
  'wireless-mic': renderWirelessMic,
  'hanging-mic': renderHangingMic,
  'broadcaster': renderBroadcaster,
  'switch': renderSwitch,
  'ap': renderAP,
  'router': renderRouter,
  'pc-desktop': renderPCDesktop,
  'pc-laptop': renderPCLaptop,
  'charging-cart': renderChargingCart,
  'control-panel': renderControlPanel,
  'ups': renderUPS,
  'server': renderServerRack,
  'lab-table': renderLabTable,
  'microscope': renderMicroscope,
  'sensor-kit': renderSensorKit,
  'air-conditioner': renderAirConditioner,
  'curtain': renderCurtainMotor,
  'sensor': renderEnvironmentSensor,
  'light': renderSmartLight,
  'cabinet-rack': renderNetworkCabinet,
  'access-control': renderAccessControl,
  // New devices
  'whiteboard-pen': renderWhiteboardPen,
  'clicker': renderClicker,
  'tablet': renderTablet,
  '3d-printer': render3DPrinter,
  'document-camera': renderDocumentCamera,
  'led-panel': renderLEDPanel,
  'curtain-motor': renderCurtain,
  'central-control': renderCentralControl,
  'ups-power': renderUPSPower,
  'info-display': renderInfoDisplay,
  'class-sign': renderClassSign,
  'air-purifier': renderAirPurifier,
};

export function getComponentRenderer(icon2d: string): RendererFn | null {
  return RENDERER_MAP[icon2d] || null;
}
