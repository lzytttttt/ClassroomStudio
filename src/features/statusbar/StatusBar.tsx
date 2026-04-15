import { useSceneStore } from '@/store/sceneStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function StatusBar() {
  const { scene, setZoom } = useSceneStore();
  const { canvas2d, selectedIds } = scene.viewState;
  const componentCount = scene.components.length;

  const zoomPercent = Math.round(canvas2d.zoom * 100);

  return (
    <div style={{
      height: 'var(--statusbar-height)',
      minHeight: 'var(--statusbar-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      background: 'var(--color-bg-panel)',
      borderTop: '1px solid var(--color-border)',
      fontSize: 11,
      color: 'var(--color-text-tertiary)',
      gap: 16,
      userSelect: 'none',
    }}>
      <span>
        教室: {scene.room.width / 1000}m × {scene.room.height / 1000}m
      </span>
      <span>组件: {componentCount}</span>
      {selectedIds.length > 0 && (
        <span style={{ color: 'var(--color-primary)' }}>
          已选: {selectedIds.length}
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Zoom controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={() => setZoom(canvas2d.zoom - 0.1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--color-text-tertiary)', display: 'flex' }}>
          <ZoomOut size={13} />
        </button>
        <span style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
          {zoomPercent}%
        </span>
        <button onClick={() => setZoom(canvas2d.zoom + 0.1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--color-text-tertiary)', display: 'flex' }}>
          <ZoomIn size={13} />
        </button>
        <button onClick={() => setZoom(1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--color-text-tertiary)', display: 'flex', marginLeft: 4 }}
          title="重置缩放">
          <Maximize size={13} />
        </button>
      </div>

      <span style={{ color: canvas2d.snapToGrid ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
        {canvas2d.snapToGrid ? '⊞ 吸附' : '⊞ 自由'}
      </span>
    </div>
  );
}
