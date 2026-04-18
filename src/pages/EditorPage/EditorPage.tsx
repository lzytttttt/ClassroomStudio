import { useCallback, useEffect, useRef, useState } from 'react';
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
import CanvasContextMenu from '@/features/context-menu/CanvasContextMenu';

export default function EditorPage() {
  const { projectId } = useParams();
  const { scene, removeComponents, copySelected, pasteClipboard, selectAll, clearSelection, setScene, groupSelected, ungroupSelected } = useSceneStore();
  const { leftSidebarOpen, rightSidebarOpen } = useUIStore();
  const { currentProject, setCurrentProject, saveCurrentProject } = useProjectStore();
  const { addToast } = useUIStore();
  const activeView = scene.viewState.activeView;
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sceneVersionRef = useRef(0);
  const initialLoadDone = useRef(false);

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
    initialLoadDone.current = true;
  }, [projectId, currentProject, setCurrentProject, setScene]);

  // Auto-save: watch scene changes with 3s debounce
  useEffect(() => {
    if (!initialLoadDone.current || !currentProject) return;
    // Skip the first render (initial scene load)
    if (sceneVersionRef.current === 0) {
      sceneVersionRef.current = 1;
      return;
    }

    setSaveStatus('unsaved');

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await saveCurrentProject(scene);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('unsaved');
      }
    }, 3000);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [scene, currentProject, saveCurrentProject]);

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
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            useSceneStore.temporal.getState().redo();
          } else {
            useSceneStore.temporal.getState().undo();
          }
          break;
        case 'y':
          e.preventDefault();
          useSceneStore.temporal.getState().redo();
          break;
        case 'g':
          e.preventDefault();
          if (e.shiftKey) {
            ungroupSelected();
          } else {
            groupSelected();
          }
          break;
      }
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (scene.viewState.selectedIds.length > 0) {
        e.preventDefault();
        removeComponents(scene.viewState.selectedIds);
      }
    }

    // Tool shortcuts
    if (!e.ctrlKey && !e.metaKey) {
      if (e.key === 'v' || e.key === 'V') { useUIStore.getState().setActiveTool('select'); }
      if (e.key === 'h' || e.key === 'H') { useUIStore.getState().setActiveTool('pan'); }
      if (e.key === 'c' && !e.ctrlKey) { useUIStore.getState().setActiveTool('connect'); }
    }

    if (e.key === 'Escape') {
      useUIStore.getState().setConnectionSource(null);
      useUIStore.getState().setActiveTool('select');
      clearSelection();
    }
  }, [scene.viewState.selectedIds, copySelected, pasteClipboard, selectAll, removeComponents, clearSelection, groupSelected, ungroupSelected]);

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
      <Toolbar saveStatus={saveStatus} onSaveStatusChange={setSaveStatus} />

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
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--color-bg-canvas)',
          }}
          onContextMenu={(e) => {
            if (activeView === '2d') {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY });
            }
          }}
        >
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

      {/* Context Menu */}
      <CanvasContextMenu
        x={contextMenu?.x ?? 0}
        y={contextMenu?.y ?? 0}
        visible={contextMenu !== null}
        onClose={() => setContextMenu(null)}
      />

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
