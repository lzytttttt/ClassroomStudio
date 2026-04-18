import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/store/sceneStore';
import { useUIStore } from '@/store/uiStore';
import { useProjectStore } from '@/store/projectStore';
import {
  ArrowLeft, Save, Download, MousePointer2, Hand, Undo2, Redo2,
  Copy, Trash2, Grid3x3, Magnet, Play, ImageDown, Camera,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  GraduationCap, Cable, HelpCircle, X
} from 'lucide-react';
import { canvas2dScreenshotRef } from '@/engine/canvas2d/Canvas2D';

export default function Toolbar({ saveStatus, onSaveStatusChange }: { saveStatus: 'saved' | 'saving' | 'unsaved'; onSaveStatusChange: (s: 'saved' | 'saving' | 'unsaved') => void }) {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
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
      <button onClick={() => setActiveTool('connect')} style={activeTool === 'connect' ? {...btnActive, color: '#7C3AED'} : btnBase} title="连线工具 (C) — 连接两个设备">
        <Cable size={16} />
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

      {/* Screenshot */}
      <button
        onClick={() => {
          if (canvas2dScreenshotRef.current) {
            canvas2dScreenshotRef.current();
            addToast({ type: 'success', message: '截图已导出' });
          } else {
            addToast({ type: 'info', message: '请切换到 2D 视图进行截图' });
          }
        }}
        style={{...btnBase, gap: 5, padding: '6px 10px'}}
        title="导出截图 (PNG)"
      >
        <Camera size={15} />
        <span style={{ fontSize: 12 }}>截图</span>
      </button>

      {/* Right Actions */}
      <button onClick={() => setShowHelp(true)} style={btnBase} title="操作帮助">
        <HelpCircle size={16} />
      </button>
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
          onSaveStatusChange('saving');
          await saveCurrentProject(scene);
          onSaveStatusChange('saved');
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

      {/* Save Status Indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 11, marginLeft: 4, minWidth: 60,
        color: saveStatus === 'saved' ? '#10B981' : saveStatus === 'saving' ? '#F59E0B' : '#94A3B8',
        transition: 'color 0.3s ease',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: saveStatus === 'saved' ? '#10B981' : saveStatus === 'saving' ? '#F59E0B' : '#94A3B8',
          animation: saveStatus === 'saving' ? 'pulse 1s infinite' : 'none',
        }} />
        {saveStatus === 'saved' ? '已保存' : saveStatus === 'saving' ? '保存中...' : '未保存'}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 9998, backdropFilter: 'blur(2px)' }} 
            onClick={() => setShowHelp(false)} 
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-bg-panel)', padding: 24, borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg), 0 0 0 1px var(--color-border)',
            zIndex: 9999, width: 450, maxWidth: '90vw', color: 'var(--color-text-primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={20} color="var(--color-primary)" />
                操作指南
              </h2>
              <button 
                onClick={() => setShowHelp(false)} 
                style={{ ...btnBase, padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ padding: 12, background: 'var(--color-bg-app)', borderRadius: 'var(--radius-sm)' }}>
                <strong>基础操作</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, color: 'var(--color-text-secondary)' }}>
                  <li>从左侧组件库 <strong>拖出组件</strong> 或双击添加到画布上方</li>
                  <li>选中组件后，拖拽调整位置；在右侧属性面板调整方向与缩放</li>
                  <li>按住鼠标左键即可 <strong>框选多个设备</strong>，支持统一对齐和分布</li>
                </ul>
              </div>
              
              <div style={{ padding: 12, background: 'var(--color-bg-app)', borderRadius: 'var(--radius-sm)' }}>
                <strong>门窗控制</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, color: 'var(--color-text-secondary)' }}>
                  <li>在 2D 视图下，门窗周围会有隐形的响应区域</li>
                  <li>直接 <strong>拖拽门或窗户</strong>，它会受到防溢出保护，仅沿着自身所在的墙壁边缘滑动</li>
                </ul>
              </div>

              <div style={{ padding: 12, background: 'var(--color-bg-app)', borderRadius: 'var(--radius-sm)' }}>
                <strong>拓扑连线</strong>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, color: 'var(--color-text-secondary)' }}>
                  <li>点击顶部 <code>连线工具 (C)</code> 或按快捷键开启</li>
                  <li>分两次点击要连接的起始设备和目标设备，即可完成接线</li>
                  <li>使用 <code>选择工具 (V)</code> 返回常规拖拽模式</li>
                </ul>
              </div>

              <div style={{ padding: 12, background: 'var(--color-bg-app)', borderRadius: 'var(--radius-sm)' }}>
                <strong>常用快捷键</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', margin: '4px 0 0 0', color: 'var(--color-text-secondary)' }}>
                  <div><kbd style={kbdStyle}>V</kbd> 选择工具</div>
                  <div><kbd style={kbdStyle}>C</kbd> 连线工具</div>
                  <div><kbd style={kbdStyle}>H</kbd> 平移(拖拽画布)</div>
                  <div><kbd style={kbdStyle}>Delete</kbd> 删除选中</div>
                  <div><kbd style={kbdStyle}>Ctrl+C/V</kbd> 复制/粘贴</div>
                  <div><kbd style={kbdStyle}>Ctrl+D</kbd> 原地复制</div>
                  <div><kbd style={kbdStyle}>Ctrl+Z/Y</kbd> 撤销/重做</div>
                  <div><kbd style={kbdStyle}>Ctrl+G</kbd> 编组组件</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  background: 'var(--color-bg-toolbar)',
  border: '1px solid var(--color-border)',
  borderRadius: 3,
  padding: '1px 4px',
  fontSize: 11,
  boxShadow: '0 1px 0 var(--color-border)',
  marginRight: 4,
  fontFamily: 'monospace'
};
