import { useState, useRef } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { builtinAssets } from './assets-data';
import { CATEGORY_LABELS, CATEGORY_ICONS, type AssetCategory } from '@/shared/types/constants';
import type { Asset } from '@/shared/types';
import { useUIStore } from '@/store/uiStore';
import { Asset25DView } from '@/graphics';

const categories = Object.keys(CATEGORY_LABELS) as AssetCategory[];

export default function ComponentLibrary() {
  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(categories));
  const { setDraggingAsset } = useUIStore();

  const toggleCategory = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const filteredAssets = search
    ? builtinAssets.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some(t => t.includes(search))
      )
    : builtinAssets;

  const groupedAssets = categories.reduce((acc, cat) => {
    acc[cat] = filteredAssets.filter(a => a.category === cat);
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
          组件库
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-tertiary)',
          }} />
          <input
            type="text"
            placeholder="搜索组件..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-sm"
            style={{ paddingLeft: 28, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Category List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
        {categories.map(cat => {
          const assets = groupedAssets[cat];
          if (assets.length === 0) return null;
          const isExpanded = expandedCats.has(cat);

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', fontSize: 12, fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--color-bg-hover)'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{CATEGORY_LABELS[cat]}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                  {assets.length}
                </span>
              </button>
              {isExpanded && (
                <div style={{ padding: '0 8px 4px' }}>
                  {assets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssetItem({ asset }: { asset: Asset }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/asset-id', asset.id);
    e.dataTransfer.effectAllowed = 'copy';
    useUIStore.getState().setDraggingAsset(asset.id);
  };

  const handleDragEnd = () => {
    useUIStore.getState().setDraggingAsset(null);
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 10px', marginBottom: 2, borderRadius: 6,
        cursor: 'grab', transition: 'all var(--transition-fast)',
        border: '1px solid transparent',
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = 'var(--color-bg-hover)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* 2.5D SVG Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 6, flexShrink: 0,
        background: 'var(--color-bg-canvas)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}>
        <Asset25DView assetId={asset.id} width={28} height={28} />
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {asset.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          {asset.defaultProperties.brand || asset.subcategory}
          {asset.defaultProperties.price ? ` · ¥${asset.defaultProperties.price}` : ''}
        </div>
      </div>
    </div>
  );
}
