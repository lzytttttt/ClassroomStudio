import { useSceneStore } from '@/store/sceneStore';
import { getAssetById } from '@/features/component-library/assets-data';
import type { SceneComponent } from '@/shared/types';
import { CATEGORY_LABELS } from '@/shared/types/constants';
import { Settings2, Package, Ruler, Plug, DollarSign, MessageSquare } from 'lucide-react';

export default function PropertyPanel() {
  const { scene, updateComponent } = useSceneStore();
  const selectedIds = scene.viewState.selectedIds;

  if (selectedIds.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>属性</div>
        </div>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 8, color: 'var(--color-text-tertiary)', padding: 20,
        }}>
          <Settings2 size={28} strokeWidth={1.5} style={{ opacity: 0.3 }} />
          <span style={{ fontSize: 12, textAlign: 'center' }}>选择一个组件<br/>查看和编辑属性</span>
        </div>
      </div>
    );
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
