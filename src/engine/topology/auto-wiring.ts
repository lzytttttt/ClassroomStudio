/**
 * auto-wiring.ts — Smart wiring recommendation engine for topology view.
 * 
 * Analyzes scene components by their asset category and role, then generates
 * reasonable default connections (network, AV, control, power) that follow
 * common educational-IT deployment patterns.
 */

import type { Connection, SceneComponent } from '@/shared/types';
import type { ConnectionType } from '@/shared/types/constants';
import { getAssetById } from '@/features/component-library/assets-data';
import { generateId } from '@/shared/utils/id';

// ─── Role classification based on assetId ───

type DeviceRole =
  | 'switch'        // 交换机 — network hub
  | 'router'        // 路由器
  | 'ap'            // 无线AP
  | 'recording'     // 录播主机
  | 'camera'        // 摄像头
  | 'display'       // 显示设备 (智慧黑板/大屏/投影)
  | 'speaker'       // 音响/广播
  | 'microphone'    // 麦克风
  | 'pc'            // 电脑
  | 'central'       // 中控主机
  | 'control-panel' // 中控面板
  | 'ups'           // UPS / 电源
  | 'charging'      // 充电柜
  | 'other';

const ASSET_ROLE_MAP: Record<string, DeviceRole> = {
  'asset-switch': 'switch',
  'asset-router': 'router',
  'asset-ap': 'ap',
  'asset-recording-host': 'recording',
  'asset-camera-ptz': 'camera',
  'asset-camera-fixed': 'camera',
  'asset-smart-board': 'display',
  'asset-interactive-screen': 'display',
  'asset-projector': 'display',
  'asset-speaker': 'speaker',
  'asset-campus-broadcaster': 'speaker',
  'asset-amplifier': 'speaker',
  'asset-microphone': 'microphone',
  'asset-wireless-mic': 'microphone',
  'asset-hanging-mic': 'microphone',
  'asset-pc-desktop': 'pc',
  'asset-pc-laptop': 'pc',
  'asset-tablet': 'pc',
  'asset-central-control': 'central',
  'asset-control-panel': 'control-panel',
  'asset-ups': 'ups',
  'asset-ups-battery': 'ups',
  'asset-charging-cart': 'charging',
  'asset-document-camera': 'camera',
  'asset-class-board': 'display',
  'asset-class-sign': 'display',
  'asset-info-display': 'display',
};

function getRole(comp: SceneComponent): DeviceRole {
  return ASSET_ROLE_MAP[comp.assetId] || 'other';
}

function makeConn(
  sourceId: string,
  targetId: string,
  type: ConnectionType,
  label: string,
  bandwidth = ''
): Connection {
  return {
    id: generateId(),
    sourceId,
    targetId,
    type,
    label,
    bandwidth,
    protocol: '',
    style: { color: '', dashArray: '', lineWidth: 2, animated: true },
  };
}

/**
 * Check if a connection already exists between two components of a given type.
 */
function connectionExists(
  existing: Connection[],
  srcId: string,
  tgtId: string,
  type: ConnectionType
): boolean {
  return existing.some(
    (c) =>
      c.type === type &&
      ((c.sourceId === srcId && c.targetId === tgtId) ||
       (c.sourceId === tgtId && c.targetId === srcId))
  );
}

/**
 * Generate recommended wiring connections based on the devices present in the scene.
 * Only generates connections that don't already exist.
 */
export function generateAutoWiring(
  components: SceneComponent[],
  existingConnections: Connection[]
): Connection[] {
  const newConns: Connection[] = [];

  // Classify all topology-relevant components by role
  const byRole = new Map<DeviceRole, SceneComponent[]>();
  for (const comp of components) {
    const asset = getAssetById(comp.assetId);
    if (!asset) continue;
    // Skip pure furniture
    if (
      asset.category === 'furniture' &&
      (!asset.defaultProperties.interfaces || asset.defaultProperties.interfaces.length === 0) &&
      !asset.defaultProperties.power
    ) continue;

    const role = getRole(comp);
    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role)!.push(comp);
  }

  const switches = byRole.get('switch') || [];
  const routers = byRole.get('router') || [];
  const aps = byRole.get('ap') || [];
  const cameras = byRole.get('camera') || [];
  const recordings = byRole.get('recording') || [];
  const displays = byRole.get('display') || [];
  const speakers = byRole.get('speaker') || [];
  const microphones = byRole.get('microphone') || [];
  const pcs = byRole.get('pc') || [];
  const centrals = byRole.get('central') || [];
  const controlPanels = byRole.get('control-panel') || [];
  const upses = byRole.get('ups') || [];
  const chargings = byRole.get('charging') || [];

  const all = [...existingConnections, ...newConns];
  const tryAdd = (src: string, tgt: string, type: ConnectionType, label: string, bw = '') => {
    if (!connectionExists([...existingConnections, ...newConns], src, tgt, type)) {
      newConns.push(makeConn(src, tgt, type, label, bw));
    }
  };

  // Pick a core switch (first one) as the network hub
  const coreSwitch = switches[0];

  // ═══════════════════════════════════════════════
  // 1. NETWORK connections (via switch)
  // ═══════════════════════════════════════════════
  if (coreSwitch) {
    // Router → Switch
    for (const r of routers) {
      tryAdd(r.id, coreSwitch.id, 'network', '上联', '1Gbps');
    }
    // Switch → AP
    for (const ap of aps) {
      tryAdd(coreSwitch.id, ap.id, 'network', 'PoE', '1Gbps');
    }
    // Switch → PC (limit to first 6 to avoid clutter)
    for (const pc of pcs.slice(0, 6)) {
      tryAdd(coreSwitch.id, pc.id, 'network', 'RJ45', '1Gbps');
    }
    // Switch → Recording host
    for (const rec of recordings) {
      tryAdd(coreSwitch.id, rec.id, 'network', 'RJ45', '1Gbps');
    }
    // Switch → Smart displays
    for (const disp of displays) {
      const asset = getAssetById(disp.assetId);
      const hasNet = asset?.defaultProperties.interfaces?.some(
        (i) => i.includes('RJ45') || i.includes('WiFi') || i.includes('网络')
      );
      if (hasNet) {
        tryAdd(coreSwitch.id, disp.id, 'network', 'RJ45', '1Gbps');
      }
    }
    // Switch → Cameras (IP cameras)
    for (const cam of cameras) {
      tryAdd(coreSwitch.id, cam.id, 'network', 'PoE', '100Mbps');
    }
    // Switch → Central control
    for (const cc of centrals) {
      tryAdd(coreSwitch.id, cc.id, 'network', 'RJ45', '100Mbps');
    }
    // Additional switches → core switch (daisy chain)
    for (const sw of switches.slice(1)) {
      tryAdd(coreSwitch.id, sw.id, 'network', '级联', '1Gbps');
    }
  }

  // ═══════════════════════════════════════════════
  // 2. AV connections (video/audio signal flow)
  // ═══════════════════════════════════════════════
  
  // Camera → Recording host
  const recHost = recordings[0];
  if (recHost) {
    for (const cam of cameras) {
      tryAdd(cam.id, recHost.id, 'av', 'SDI/HDMI', '');
    }
    // Recording host → Display (output)
    for (const disp of displays) {
      tryAdd(recHost.id, disp.id, 'av', 'HDMI', '');
    }
  }

  // Microphone → Speaker/Amplifier (audio chain)
  const spk = speakers[0];
  if (spk) {
    for (const mic of microphones) {
      tryAdd(mic.id, spk.id, 'av', '音频', '');
    }
  }

  // PC → Display (HDMI out)
  if (displays.length > 0 && pcs.length > 0) {
    // Teacher PC → main display
    tryAdd(pcs[0].id, displays[0].id, 'av', 'HDMI', '');
  }

  // ═══════════════════════════════════════════════
  // 3. CONTROL connections (central control signals)
  // ═══════════════════════════════════════════════
  const cc = centrals[0];
  if (cc) {
    // Central control → displays
    for (const disp of displays) {
      tryAdd(cc.id, disp.id, 'control', 'RS232', '');
    }
    // Central control → speakers
    for (const sp of speakers) {
      tryAdd(cc.id, sp.id, 'control', 'IR/IP', '');
    }
    // Central control → projectors
    for (const disp of displays.filter(d => d.assetId === 'asset-projector')) {
      tryAdd(cc.id, disp.id, 'control', 'RS232', '');
    }
    // Central control → control panel
    for (const cp of controlPanels) {
      tryAdd(cc.id, cp.id, 'control', 'IP', '');
    }
    // Central control → recording host
    for (const rec of recordings) {
      tryAdd(cc.id, rec.id, 'control', 'RS232', '');
    }
  }

  // ═══════════════════════════════════════════════
  // 4. POWER connections
  // ═══════════════════════════════════════════════
  const ups = upses[0];
  if (ups) {
    // UPS → all high-power devices
    const powerDevices = [...displays, ...recordings, ...centrals, ...(coreSwitch ? [coreSwitch] : [])];
    for (const dev of powerDevices) {
      const asset = getAssetById(dev.assetId);
      if (asset && (asset.defaultProperties.power || 0) > 0) {
        tryAdd(ups.id, dev.id, 'power', '220V', `${asset.defaultProperties.power}W`);
      }
    }
  }

  // Charging cart → tablets/laptops
  if (chargings.length > 0) {
    const cart = chargings[0];
    const portableDevices = pcs.filter(
      (p) => p.assetId === 'asset-tablet' || p.assetId === 'asset-pc-laptop'
    );
    for (const pd of portableDevices.slice(0, 6)) {
      tryAdd(cart.id, pd.id, 'power', '充电', '');
    }
  }

  return newConns;
}
