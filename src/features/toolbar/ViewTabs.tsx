import { useSceneStore } from '@/store/sceneStore';
import { VIEW_LABELS, type ViewMode } from '@/shared/types/constants';
import { PenLine, Box, Network, TableProperties } from 'lucide-react';

const VIEW_ICONS: Record<ViewMode, React.ElementType> = {
  '2d': PenLine,
  '2.5d': Box,
  'topology': Network,
  'bom': TableProperties,
};

export default function ViewTabs() {
  const { scene, setActiveView } = useSceneStore();
  const activeView = scene.viewState.activeView;

  return (
    <div style={{
      height: 'var(--tab-height)',
      minHeight: 'var(--tab-height)',
      display: 'flex',
      alignItems: 'stretch',
      background: 'var(--color-bg-panel)',
      borderBottom: '1px solid var(--color-border)',
      paddingLeft: 12,
      userSelect: 'none',
    }}>
      {(Object.keys(VIEW_LABELS) as ViewMode[]).map(view => {
        const Icon = VIEW_ICONS[view];
        const isActive = view === activeView;
        return (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 16px',
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              background: 'none', border: 'none',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Icon size={14} />
            {VIEW_LABELS[view]}
          </button>
        );
      })}
    </div>
  );
}
