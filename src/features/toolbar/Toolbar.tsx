import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/store/sceneStore';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/projectStore';
import {
  ArrowLeft, Save, Download, MousePointer2, Hand, Undo2, Redo2,
  Copy, Trash2, Grid3x3, Magnet, Play, ImageDown,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  GraduationCap,
} from 'lucide-react';

export default function Toolbar() {
  const navigate = useNavigate();
  const { scene, removeComponents, copySelected, duplicateComponents, toggleGrid, toggleSnap } = useSceneStore();
  const { undo, redo, pastStates, futureStates } = useSceneStore.temporal.getState();
  const canUndo = useSceneStore(state => useSceneStore.temporal.getState().pastStates.length > 0);
  const canRedo = useSceneStore(state => useSceneStore.temporal.getState().futureStates.length > 0);
  const { activeTool, setActiveTool, leftSidebarOpen, rightSidebarOpen, toggleLeftSidebar, toggleRightSidebar, addToast } = useUIStore();
  const { currentProject, saveCurrentProject } = useProjectStore();

  const selectedIds = scene.viewState.selectedIds;
  const hasSelection = selectedIds.length > 0;

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 6, borderRadius: 'var(--radius-sm)',
    border: 'none', cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    background: 'transparent', color: 'var(--color-text-secondary)',
  };

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: 'var(--color-primary-50)',
    color: 'var(--color-primary)',
  };

  const Divider = () => (
    <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 4px' }} />
  );

  return (
    <div style={{
      height: 'var(--toolbar-height)',
      minHeight: 'var(--toolbar-height)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      background: 'var(--color-bg-toolbar)',
      borderBottom: '1px solid var(--color-border)',
      gap: 2,
      userSelect: 'none',
    }}>
      {/* Logo & Back */}
      <button onClick={() => navigate('/')} style={{...btnBase, gap: 6, padding: '6px 10px', marginRight: 4 }}
        title="返回首页"
      >
        <GraduationCap size={18} color="var(--color-primary)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {currentProject?.name || 'ClassRoom Studio'}
        </span>
      </button>

      <Divider />

      {/* Tool Buttons */}
      <button onClick={() => setActiveTool('select')} style={activeTool === 'select' ? btnActive : btnBase} title="选择工具 (V)">
        <MousePointer2 size={16} />
      </button>
      <button onClick={() => setActiveTool('pan')} style={activeTool === 'pan' ? btnActive : btnBase} title="平移工具 (H)">
        <Hand size={16} />
      </button>

      <Divider />

      {/* Undo/Redo */}
      <button 
        onClick={() => canUndo && undo()}
        style={{...btnBase, opacity: canUndo ? 1 : 0.4, cursor: canUndo ? 'pointer' : 'not-allowed'}} 
        title="撤销 (Ctrl+Z)"
      >
        <Undo2 size={16} />
      </button>
      <button 
        onClick={() => canRedo && redo()}
        style={{...btnBase, opacity: canRedo ? 1 : 0.4, cursor: canRedo ? 'pointer' : 'not-allowed'}} 
        title="重做 (Ctrl+Y)"
      >
        <Redo2 size={16} />
      </button>

      <Divider />

      {/* Selection Actions */}
      <button
        onClick={() => hasSelection && duplicateComponents(selectedIds)}
        style={{...btnBase, opacity: hasSelection ? 1 : 0.35 }}
        title="复制选中 (Ctrl+D)"
      >
        <Copy size={16} />
      </button>
      <button
        onClick={() => hasSelection && removeComponents(selectedIds)}
        style={{...btnBase, opacity: hasSelection ? 1 : 0.35, color: hasSelection ? 'var(--color-error)' : undefined }}
        title="删除选中 (Delete)"
      >
        <Trash2 size={16} />
      </button>

      <Divider />

      {/* Canvas Controls */}
      <button onClick={toggleGrid} style={scene.viewState.canvas2d.showGrid ? btnActive : btnBase} title="切换网格">
        <Grid3x3 size={16} />
      </button>
      <button onClick={toggleSnap} style={scene.viewState.canvas2d.snapToGrid ? btnActive : btnBase} title="切换吸附">
        <Magnet size={16} />
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right Actions */}
      <button onClick={toggleLeftSidebar} style={btnBase} title="切换组件库">
        {leftSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>
      <button onClick={toggleRightSidebar} style={btnBase} title="切换属性面板">
        {rightSidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
      </button>

      <Divider />

      <button 
        onClick={() => {
          if (!currentProject) return;
          const data = JSON.stringify(currentProject, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${currentProject.name}.crs`;
          a.click();
          URL.revokeObjectURL(url);
          addToast({ type: 'info', message: '项目文件已导出' });
        }}
        style={{...btnBase, gap: 6, padding: '6px 10px'}} title="导出项目"
      >
        <ImageDown size={15} />
        <span style={{ fontSize: 12 }}>导出项目</span>
      </button>
      <button 
        onClick={async () => {
          await saveCurrentProject(scene);
          addToast({ type: 'success', message: '项目保存成功' });
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary)', border: 'none',
          color: 'white', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', transition: 'all var(--transition-fast)',
        }} title="保存项目"
      >
        <Save size={14} />
        保存
      </button>
    </div>
  );
}
