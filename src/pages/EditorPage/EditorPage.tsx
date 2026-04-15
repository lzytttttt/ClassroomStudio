import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Toolbar from '@/features/toolbar/Toolbar';
import ComponentLibrary from '@/features/component-library/ComponentLibrary';
import PropertyPanel from '@/features/property-panel/PropertyPanel';
import Canvas2D from '@/engine/canvas2d/Canvas2D';
import Canvas25D from '@/engine/canvas25d/Canvas25D';
import TopologyView from '@/engine/topology/TopologyView';
import BOMView from '@/features/bom-view/BOMView';
import StatusBar from '@/features/statusbar/StatusBar';
import ViewTabs from '@/features/toolbar/ViewTabs';
import { useSceneStore } from '@/store/sceneStore';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/projectStore';
import { getProject } from '@/lib/db';

export default function EditorPage() {
  const { projectId } = useParams();
  const { scene, removeComponents, copySelected, pasteClipboard, selectAll, clearSelection, setScene } = useSceneStore();
  const { leftSidebarOpen, rightSidebarOpen } = useUIStore();
  const { currentProject, setCurrentProject } = useProjectStore();
  const activeView = scene.viewState.activeView;

  // Load project on mount if projectId is present
  useEffect(() => {
    async function load() {
      if (projectId && (!currentProject || currentProject.id !== projectId)) {
        const proj = await getProject(projectId);
        if (proj) {
          setCurrentProject(proj);
          const activeScheme = proj.schemes.find(s => s.id === proj.activeSchemeId);
          if (activeScheme) {
            setScene(activeScheme.scene);
          }
        }
      }
    }
    load();
  }, [projectId, currentProject, setCurrentProject, setScene]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          copySelected();
          break;
        case 'v':
          e.preventDefault();
          pasteClipboard();
          break;
        case 'a':
          e.preventDefault();
          selectAll();
          break;
      }
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (scene.viewState.selectedIds.length > 0) {
        e.preventDefault();
        removeComponents(scene.viewState.selectedIds);
      }
    }

    if (e.key === 'Escape') {
      clearSelection();
    }
  }, [scene.viewState.selectedIds, copySelected, pasteClipboard, selectAll, removeComponents, clearSelection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg-app)',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <Toolbar />

      {/* View Tabs */}
      <ViewTabs />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Left Sidebar: Component Library */}
        {leftSidebarOpen && activeView === '2d' && (
          <div style={{
            width: 'var(--sidebar-width)',
            minWidth: 'var(--sidebar-width)',
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.15s ease',
          }}>
            <ComponentLibrary />
          </div>
        )}

        {/* Canvas / View Area */}
        <div style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-bg-canvas)',
        }}>
          {activeView === '2d' && <Canvas2D />}
          {activeView === 'bom' && <BOMView />}
          {activeView === '2.5d' && <Canvas25D />}
          {activeView === 'topology' && <TopologyView />}
        </div>

        {/* Right Sidebar: Property Panel */}
        {rightSidebarOpen && activeView === '2d' && (
          <div style={{
            width: 'var(--panel-width)',
            minWidth: 'var(--panel-width)',
            borderLeft: '1px solid var(--color-border)',
            background: 'var(--color-bg-panel)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.15s ease',
          }}>
            <PropertyPanel />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
