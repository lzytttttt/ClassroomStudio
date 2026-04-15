import { useSceneStore } from '@/store/sceneStore';
import { getAssetById } from '@/features/component-library/assets-data';
import { CATEGORY_LABELS } from '@/shared/types/constants';
import { Download, Table, Edit3 } from 'lucide-react';

export default function BOMView() {
  const { scene, updateComponentsByAssetId } = useSceneStore();
  const components = scene.components;

  // Group by assetId and sum quantities
  const bomMap = new Map<string, { assetId: string; name: string; brand: string; model: string; price: number; count: number; category: string; power: number }>();

  components.forEach(c => {
    const asset = getAssetById(c.assetId);
    const key = c.assetId;
    const existing = bomMap.get(key);
    if (existing) {
      existing.count += c.properties.quantity;
    } else {
      bomMap.set(key, {
        assetId: c.assetId,
        name: c.name,
        brand: c.properties.brand,
        model: c.properties.model,
        price: c.properties.price,
        count: c.properties.quantity,
        category: asset ? CATEGORY_LABELS[asset.category] : '未知',
        power: c.properties.power,
      });
    }
  });

  const bomList = Array.from(bomMap.values());
  const totalPrice = bomList.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalPower = bomList.reduce((sum, item) => sum + item.power * item.count, 0);
  const totalCount = bomList.reduce((sum, item) => sum + item.count, 0);

  const exportCSV = () => {
    const header = '序号,名称,品牌,型号,分类,功耗(W),单价(元),数量,小计(元)\n';
    const rows = bomList.map((item, i) =>
      `${i + 1},${item.name},${item.brand},${item.model},${item.category},${item.power},${item.price},${item.count},${item.price * item.count}`
    ).join('\n');
    const footer = `\n,,,,,,总计,${totalCount},${totalPrice}`;
    const csv = '\uFEFF' + header + rows + footer;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '设备清单_BOM.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-panel)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Table size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>设备清单 (BOM)</span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 10,
            background: 'var(--color-primary-50)', color: 'var(--color-primary)',
            fontWeight: 500,
          }}>
            {totalCount} 台/套
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginLeft: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Edit3 size={12} /> 品牌、型号与单价支持点击修改，将全局生效
          </span>
        </div>
        <button onClick={exportCSV} className="btn btn-secondary" style={{ fontSize: 12 }}>
          <Download size={14} /> 导出 CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 24px' }}>
        {bomList.length === 0 ? (
          <div style={{
            height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, color: 'var(--color-text-tertiary)',
          }}>
            <Table size={36} strokeWidth={1} style={{ opacity: 0.2 }} />
            <span style={{ fontSize: 13 }}>暂无设备，请在2D编辑视图中添加组件</span>
          </div>
        ) : (
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontSize: 13,
            marginTop: 8,
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['#', '名称', '品牌', '型号', '分类', '功耗', '单价(元)', '数量', '小计'].map(h => (
                  <th key={h} style={{
                    padding: '10px 8px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: 'var(--color-text-tertiary)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bomList.map((item, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid var(--color-border)',
                  transition: 'background var(--transition-fast)',
                }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 8px', color: 'var(--color-text-tertiary)', fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '6px 8px' }}>
                     <input
                      className="input input-sm"
                      style={{ width: '100px', padding: '4px 6px', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed var(--color-border)' }}
                      value={item.brand}
                      onChange={e => updateComponentsByAssetId(item.assetId, { properties: { brand: e.target.value } })}
                    />
                  </td>
                  <td style={{ padding: '6px 8px' }}>
                     <input
                      className="input input-sm input-mono"
                      style={{ width: '120px', padding: '4px 6px', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed var(--color-border)' }}
                      value={item.model}
                      onChange={e => updateComponentsByAssetId(item.assetId, { properties: { model: e.target.value } })}
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 4,
                      background: 'var(--color-bg-hover)', color: 'var(--color-text-secondary)',
                    }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.power}W</td>
                  <td style={{ padding: '6px 8px' }}>
                     <input
                      type="number"
                      className="input input-sm input-mono"
                      style={{ width: '80px', padding: '4px 6px', background: 'transparent', border: '1px solid transparent', borderBottom: '1px dashed var(--color-border)' }}
                      value={item.price}
                      onChange={e => updateComponentsByAssetId(item.assetId, { properties: { price: Number(e.target.value) } })}
                    />
                  </td>
                  <td style={{ padding: '10px 8px', fontWeight: 500 }}>{item.count}</td>
                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}>
                    ¥{(item.price * item.count).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--color-border)' }}>
                <td colSpan={5} style={{ padding: '12px 8px', fontWeight: 600, fontSize: 13 }}>合计</td>
                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{totalPower}W</td>
                <td style={{ padding: '12px 8px' }}></td>
                <td style={{ padding: '12px 8px', fontWeight: 600 }}>{totalCount}</td>
                <td style={{
                  padding: '12px 8px', fontFamily: 'var(--font-mono)',
                  fontSize: 14, fontWeight: 700, color: 'var(--color-primary)',
                }}>
                  ¥{totalPrice.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
