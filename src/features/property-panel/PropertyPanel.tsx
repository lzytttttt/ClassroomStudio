import { useState } from 'react';
import { useSceneStore } from '@/store/sceneStore';
import { getAssetById } from '@/features/component-library/assets-data';
import type { SceneComponent, DoorWindow, MountType, SceneRelation, SceneRelationType, Scene } from '@/shared/types';
import { CATEGORY_LABELS } from '@/shared/types/constants';
import { Settings2, Package, Ruler, Plug, DollarSign, MessageSquare, Home, Palette, DoorOpen, Plus, Trash2, Move3d, Link2 } from 'lucide-react';
import { generateId } from '@/shared/utils/id';
import { getRelationsForComponent } from '@/shared/utils/sceneRelations';

export default function PropertyPanel() {
  const { scene, updateComponent, updateRoom, addRelation, removeRelation } = useSceneStore();
  const selectedIds = scene.viewState.selectedIds;

  if (selectedIds.length === 0) {
    return <RoomEditor />;
  }

  if (selectedIds.length > 1) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>属性</div>
        </div>
        <div style={{ padding: 14, color: 'var(--color-text-secondary)', fontSize: 13 }}>
          已选择 {selectedIds.length} 个组件
        </div>
      </div>
    );
  }

  const component = scene.components.find(c => c.id === selectedIds[0]);
  if (!component) return null;

  const asset = getAssetById(component.assetId);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>属性</div>
      </div>

      {/* Component Info */}
      <div className="panel-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${asset?.color || '#6B7280'}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: asset?.color || '#6B7280', opacity: 0.7 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{component.name}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
              {asset ? CATEGORY_LABELS[asset.category] : '未知分类'}
            </div>
          </div>
        </div>
      </div>

      {/* Transform */}
      <Section icon={Ruler} title="变换">
        <FieldRow label="X" value={Math.round(component.position.x)} suffix="mm"
          onChange={v => updateComponent(component.id, { position: { ...component.position, x: Number(v) } })} />
        <FieldRow label="Y" value={Math.round(component.position.y)} suffix="mm"
          onChange={v => updateComponent(component.id, { position: { ...component.position, y: Number(v) } })} />
        <FieldRow label="旋转" value={Math.round(component.rotation)} suffix="°"
          onChange={v => updateComponent(component.id, { rotation: Number(v) })} />
      </Section>

      {/* Spatial */}
      <Section icon={Move3d} title="空间">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>安装</label>
          <select
            value={component.spatial?.mountType ?? 'floor'}
            onChange={e => updateComponent(component.id, {
              spatial: { ...component.spatial, mountType: e.target.value as MountType },
            })}
            className="input input-sm"
            style={{ flex: 1 }}
          >
            <option value="floor">地面</option>
            <option value="wall">壁挂</option>
            <option value="ceiling">吊装</option>
            <option value="desktop">桌面</option>
            <option value="rack">机架</option>
          </select>
        </div>
        <FieldRow label="离地" value={Math.round(component.elevation)} suffix="mm"
          onChange={v => updateComponent(component.id, { elevation: Number(v) })} />
        <FieldRow label="Z" value={component.spatial?.z ?? 0} suffix=""
          onChange={v => updateComponent(component.id, {
            spatial: { ...component.spatial, z: Number(v) },
          })} />
        <FieldRow label="深度" value={component.spatial?.depth ?? 0} suffix="mm"
          onChange={v => updateComponent(component.id, {
            spatial: { ...component.spatial, depth: Number(v) },
          })} />
        <FieldRow label="高度" value={component.spatial?.objectHeight ?? 0} suffix="mm"
          onChange={v => updateComponent(component.id, {
            spatial: { ...component.spatial, objectHeight: Number(v) },
          })} />
        <FieldText label="图层" value={component.spatial?.layer ?? ''}
          onChange={v => updateComponent(component.id, {
            spatial: { ...component.spatial, layer: v },
          })} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <label style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>承载</label>
          <input
            type="checkbox"
            checked={component.spatial?.supportsChildren ?? false}
            onChange={e => updateComponent(component.id, {
              spatial: { ...component.spatial, supportsChildren: e.target.checked },
            })}
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>可放置子组件</span>
        </div>
      </Section>

      {/* Basic Properties */}
      <Section icon={Package} title="基本信息">
        <FieldText label="名称" value={component.name}
          onChange={v => updateComponent(component.id, { name: v })} />
        <FieldText label="品牌" value={component.properties.brand}
          onChange={v => updateComponent(component.id, {
            properties: { ...component.properties, brand: v }
          })} />
        <FieldText label="型号" value={component.properties.model}
          onChange={v => updateComponent(component.id, {
            properties: { ...component.properties, model: v }
          })} />
      </Section>

      {/* Specifications */}
      <Section icon={Plug} title="规格">
        <FieldRow label="功耗" value={component.properties.power} suffix="W"
          onChange={v => updateComponent(component.id, {
            properties: { ...component.properties, power: Number(v) }
          })} />
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
          接口: {component.properties.interfaces.join(', ') || '无'}
        </div>
      </Section>

      {/* Price */}
      <Section icon={DollarSign} title="报价">
        <FieldRow label="单价" value={component.properties.price} suffix="元"
          onChange={v => updateComponent(component.id, {
            properties: { ...component.properties, price: Number(v) }
          })} />
        <FieldRow label="数量" value={component.properties.quantity} suffix="台"
          onChange={v => updateComponent(component.id, {
            properties: { ...component.properties, quantity: Number(v) }
          })} />
        <div style={{
          marginTop: 6, padding: '6px 8px', borderRadius: 4,
          background: 'var(--color-primary-50)', fontSize: 12,
          fontWeight: 600, color: 'var(--color-primary)',
          fontFamily: 'var(--font-mono)',
        }}>
          小计: ¥{(component.properties.price * component.properties.quantity).toLocaleString()}
        </div>
      </Section>

      {/* Remark */}
      <Section icon={MessageSquare} title="备注">
        <textarea
          value={component.properties.remark}
          onChange={e => updateComponent(component.id, {
            properties: { ...component.properties, remark: e.target.value }
          })}
          placeholder="添加备注..."
          style={{
            width: '100%', minHeight: 60, padding: '6px 8px', fontSize: 12,
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
            resize: 'vertical', fontFamily: 'var(--font-sans)',
            background: 'var(--color-bg-panel)', color: 'var(--color-text-primary)',
            outline: 'none',
          }}
        />
      </Section>

      {/* Relations */}
      <Section icon={Link2} title="关系">
        <RelationEditor
          component={component}
          scene={scene}
          onAdd={addRelation}
          onRemove={removeRelation}
        />
      </Section>
    </div>
  );
}

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <div className="panel-section">
      <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Icon size={12} /> {title}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ label, value, suffix, onChange }: {
  label: string; value: number; suffix: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input input-sm input-mono"
        style={{ flex: 1 }}
      />
      <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 20, flexShrink: 0 }}>{suffix}</span>
    </div>
  );
}

function FieldText({ label, value, onChange }: {
  label: string; value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input input-sm"
        style={{ flex: 1 }}
      />
    </div>
  );
}

// ==================== Relation Editor ====================

const RELATION_TYPE_LABELS: Record<SceneRelationType, string> = {
  placed_on: '放置于',
  mounted_on: '安装于',
  controls: '控制',
  depends_on: '依赖',
  covers: '覆盖',
  contains: '包含',
};

function RelationEditor({ component, scene, onAdd, onRemove }: {
  component: SceneComponent;
  scene: Scene;
  onAdd: (relation: SceneRelation) => void;
  onRemove: (id: string) => void;
}) {
  const [addMode, setAddMode] = useState(false);
  const [relType, setRelType] = useState<SceneRelationType>('placed_on');
  const [targetId, setTargetId] = useState('');

  const relations = getRelationsForComponent(scene, component.id);
  const otherComponents = scene.components.filter(c => c.id !== component.id);

  const handleAdd = () => {
    if (!targetId) return;
    onAdd({
      id: generateId(),
      type: relType,
      sourceId: component.id,
      targetId,
    });
    setAddMode(false);
    setTargetId('');
  };

  return (
    <div>
      {relations.length === 0 && !addMode && (
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
          暂无关系
        </div>
      )}

      {relations.map(rel => {
        const otherId = rel.sourceId === component.id ? rel.targetId : rel.sourceId;
        const otherComp = scene.components.find(c => c.id === otherId);
        const direction = rel.sourceId === component.id ? '→' : '←';
        return (
          <div key={rel.id} style={{
            display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4,
            fontSize: 11, color: 'var(--color-text-secondary)',
          }}>
            <span style={{ color: 'var(--color-primary)', fontWeight: 500, flexShrink: 0 }}>
              {RELATION_TYPE_LABELS[rel.type]}
            </span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {direction} {otherComp?.name ?? otherId}
            </span>
            <button
              onClick={() => onRemove(rel.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: 2 }}
            >
              <Trash2 size={11} />
            </button>
          </div>
        );
      })}

      {addMode ? (
        <div style={{ marginTop: 4, padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <select
              value={relType}
              onChange={e => setRelType(e.target.value as SceneRelationType)}
              className="input input-sm"
              style={{ flex: 1, fontSize: 11 }}
            >
              {Object.entries(RELATION_TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="input input-sm"
              style={{ flex: 1, fontSize: 11 }}
            >
              <option value="">选择目标组件...</option>
              {otherComponents.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.id}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={handleAdd}
              disabled={!targetId}
              style={{
                flex: 1, padding: '3px 6px', fontSize: 11, fontWeight: 500,
                background: targetId ? 'var(--color-primary)' : 'var(--color-bg-hover)',
                color: targetId ? 'white' : 'var(--color-text-tertiary)',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                cursor: targetId ? 'pointer' : 'default',
              }}
            >
              添加
            </button>
            <button
              onClick={() => { setAddMode(false); setTargetId(''); }}
              style={{
                flex: 1, padding: '3px 6px', fontSize: 11, fontWeight: 500,
                background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddMode(true)}
          disabled={otherComponents.length === 0}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            width: '100%', padding: '4px 6px', fontSize: 11, fontWeight: 500,
            background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Plus size={12} /> 添加关系
        </button>
      )}
    </div>
  );
}

// ==================== Room Editor ====================

const WALL_LABELS: Record<string, string> = {
  north: '北墙 (顶)',
  south: '南墙 (底)',
  east: '东墙 (右)',
  west: '西墙 (左)',
};

const PRESET_COLORS = [
  '#F1F5F9', '#E2E8F0', '#CBD5E1', '#FEF3C7', '#ECFCCB',
  '#D5F0E5', '#DBEAFE', '#F3E8FF', '#FFE4E6', '#FFF7ED',
  '#FAFAFA', '#F5F5F4', '#D4B896', '#8B7355', '#5C4033',
];

function RoomEditor() {
  const { scene, updateRoom } = useSceneStore();
  const { room } = scene;

  const addDoorWindow = (type: 'door' | 'window') => {
    const item: DoorWindow = {
      id: generateId(),
      type,
      wall: 'south',
      position: type === 'door' ? 3000 : 1500,
      width: type === 'door' ? 1000 : 1500,
      height: type === 'door' ? 2100 : 1200,
    };
    if (type === 'door') {
      updateRoom({ doors: [...room.doors, item] });
    } else {
      updateRoom({ windows: [...room.windows, item] });
    }
  };

  const updateDoorWindow = (id: string, updates: Partial<DoorWindow>, isDoor: boolean) => {
    if (isDoor) {
      updateRoom({
        doors: room.doors.map(d => d.id === id ? { ...d, ...updates } : d),
      });
    } else {
      updateRoom({
        windows: room.windows.map(w => w.id === id ? { ...w, ...updates } : w),
      });
    }
  };

  const removeDoorWindow = (id: string, isDoor: boolean) => {
    if (isDoor) {
      updateRoom({ doors: room.doors.filter(d => d.id !== id) });
    } else {
      updateRoom({ windows: room.windows.filter(w => w.id !== id) });
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Home size={14} color="var(--color-primary)" />
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>教室设置</div>
      </div>

      {/* Room Dimensions */}
      <Section icon={Ruler} title="教室尺寸">
        <FieldRow
          label="宽度"
          value={room.width}
          suffix="mm"
          onChange={v => updateRoom({ width: Math.max(2000, Number(v)) })}
        />
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: -4, marginBottom: 6, marginLeft: 42 }}>
          = {(room.width / 1000).toFixed(1)}m
        </div>
        <FieldRow
          label="深度"
          value={room.height}
          suffix="mm"
          onChange={v => updateRoom({ height: Math.max(2000, Number(v)) })}
        />
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: -4, marginBottom: 6, marginLeft: 42 }}>
          = {(room.height / 1000).toFixed(1)}m
        </div>
        <FieldRow
          label="层高"
          value={room.ceilingHeight}
          suffix="mm"
          onChange={v => updateRoom({ ceilingHeight: Math.max(2000, Number(v)) })}
        />
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: -4, marginBottom: 6, marginLeft: 42 }}>
          = {(room.ceilingHeight / 1000).toFixed(1)}m
        </div>

        {/* Area display */}
        <div style={{
          marginTop: 4, padding: '6px 10px', borderRadius: 6,
          background: 'var(--color-primary-50)', fontSize: 12,
          color: 'var(--color-primary)', fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}>
          面积: {((room.width / 1000) * (room.height / 1000)).toFixed(1)} m²
        </div>
      </Section>

      {/* Colors */}
      <Section icon={Palette} title="外观颜色">
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>地板颜色</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {PRESET_COLORS.map(c => (
              <button
                key={`floor-${c}`}
                onClick={() => updateRoom({ floorColor: c })}
                style={{
                  width: 20, height: 20, borderRadius: 4, border: room.floorColor === c ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: c, cursor: 'pointer', padding: 0,
                  boxShadow: room.floorColor === c ? 'var(--shadow-glow)' : 'none',
                }}
              />
            ))}
            <input
              type="color"
              value={room.floorColor}
              onChange={e => updateRoom({ floorColor: e.target.value })}
              style={{ width: 20, height: 20, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 4 }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>墙面颜色</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {PRESET_COLORS.map(c => (
              <button
                key={`wall-${c}`}
                onClick={() => updateRoom({ wallColor: c })}
                style={{
                  width: 20, height: 20, borderRadius: 4, border: room.wallColor === c ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: c, cursor: 'pointer', padding: 0,
                  boxShadow: room.wallColor === c ? 'var(--shadow-glow)' : 'none',
                }}
              />
            ))}
            <input
              type="color"
              value={room.wallColor}
              onChange={e => updateRoom({ wallColor: e.target.value })}
              style={{ width: 20, height: 20, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 4 }}
            />
          </div>
        </div>
      </Section>

      {/* Doors & Windows */}
      <Section icon={DoorOpen} title="门窗管理">
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <button
            onClick={() => addDoorWindow('door')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '5px 8px', fontSize: 11, fontWeight: 500,
              background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)',
            }}
          >
            <Plus size={12} /> 添加门
          </button>
          <button
            onClick={() => addDoorWindow('window')}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '5px 8px', fontSize: 11, fontWeight: 500,
              background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--color-text-secondary)',
            }}
          >
            <Plus size={12} /> 添加窗
          </button>
        </div>

        {/* Door list */}
        {room.doors.map((door, i) => (
          <DoorWindowItem
            key={door.id}
            item={door}
            index={i}
            isDoor={true}
            onUpdate={(updates) => updateDoorWindow(door.id, updates, true)}
            onRemove={() => removeDoorWindow(door.id, true)}
          />
        ))}

        {/* Window list */}
        {room.windows.map((win, i) => (
          <DoorWindowItem
            key={win.id}
            item={win}
            index={i}
            isDoor={false}
            onUpdate={(updates) => updateDoorWindow(win.id, updates, false)}
            onRemove={() => removeDoorWindow(win.id, false)}
          />
        ))}

        {room.doors.length === 0 && room.windows.length === 0 && (
          <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '8px 0' }}>
            点击上方按钮添加门或窗
          </div>
        )}
      </Section>
    </div>
  );
}

function DoorWindowItem({ item, index, isDoor, onUpdate, onRemove }: {
  item: DoorWindow; index: number; isDoor: boolean;
  onUpdate: (updates: Partial<DoorWindow>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const label = isDoor ? `门 ${index + 1}` : `窗 ${index + 1}`;

  return (
    <div style={{
      marginBottom: 6, border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)', overflow: 'hidden',
    }}>
      {/* Title row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 8px', cursor: 'pointer', fontSize: 12, fontWeight: 500,
          background: expanded ? 'var(--color-bg-hover)' : 'transparent',
          color: 'var(--color-text-primary)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isDoor ? '🚪' : '🪟'} {label} — {WALL_LABELS[item.wall]}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: 2 }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded fields */}
      {expanded && (
        <div style={{ padding: '6px 8px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>墙面</label>
            <select
              value={item.wall}
              onChange={e => onUpdate({ wall: e.target.value as DoorWindow['wall'] })}
              className="input input-sm"
              style={{ flex: 1 }}
            >
              <option value="north">北墙 (顶)</option>
              <option value="south">南墙 (底)</option>
              <option value="east">东墙 (右)</option>
              <option value="west">西墙 (左)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>位置</label>
            <input type="number" value={item.position} onChange={e => onUpdate({ position: Number(e.target.value) })}
              className="input input-sm input-mono" style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>mm</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <label style={{ fontSize: 11, color: 'var(--color-text-tertiary)', width: 36, flexShrink: 0 }}>宽度</label>
            <input type="number" value={item.width} onChange={e => onUpdate({ width: Number(e.target.value) })}
              className="input input-sm input-mono" style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>mm</span>
          </div>
        </div>
      )}
    </div>
  );
}
