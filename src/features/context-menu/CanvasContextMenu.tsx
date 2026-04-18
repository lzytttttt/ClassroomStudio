import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/sceneStore';
import {
  Copy, Trash2, ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown,
  Group, Ungroup, AlignStartHorizontal, AlignEndHorizontal,
  AlignCenterHorizontal, AlignStartVertical, AlignEndVertical,
  AlignCenterVertical, GalleryHorizontal, GalleryVertical,
  Lock, Unlock, Eye, EyeOff,
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}

export default function CanvasContextMenu({ x, y, visible, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    scene, removeComponents, duplicateComponents,
    bringToFront, sendToBack, bringForward, sendBackward,
    groupSelected, ungroupSelected,
    alignComponents, distributeComponents,
    updateComponent,
  } = useSceneStore();

  const selectedIds = scene.viewState.selectedIds;
  const hasSelection = selectedIds.length > 0;
  const multiSelect = selectedIds.length > 1;
  const tripleSelect = selectedIds.length >= 3;
  const selectedComps = scene.components.filter(c => selectedIds.includes(c.id));
  const hasGroup = selectedComps.some(c => c.groupId !== null);

  // Close on click outside
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, onClose]);

  if (!visible) return null;

  const menuItem = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
    disabled = false,
    danger = false,
  ) => (
    <button
      onClick={() => { action(); onClose(); }}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px', width: '100%',
        background: 'none', border: 'none',
        fontSize: 12, color: disabled ? 'var(--color-text-tertiary)' : danger ? '#EF4444' : 'var(--color-text-primary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 4, transition: 'background 0.1s',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
      onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
    >
      {icon}
      {label}
    </button>
  );

  const divider = () => (
    <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 8px' }} />
  );

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed', left: x, top: y, zIndex: 9999,
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 8, padding: '4px 0',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)',
        minWidth: 200,
        animation: 'fadeIn 0.1s ease',
      }}
    >
      {/* Edit */}
      {menuItem('复制', <Copy size={14} />, () => duplicateComponents(selectedIds), !hasSelection)}
      {menuItem('删除', <Trash2 size={14} />, () => removeComponents(selectedIds), !hasSelection, true)}

      {divider()}

      {/* Layer */}
      {menuItem('置于顶层', <ArrowUpToLine size={14} />, () => bringToFront(selectedIds), !hasSelection)}
      {menuItem('置于底层', <ArrowDownToLine size={14} />, () => sendToBack(selectedIds), !hasSelection)}
      {menuItem('上移一层', <ArrowUp size={14} />, () => bringForward(selectedIds), !hasSelection)}
      {menuItem('下移一层', <ArrowDown size={14} />, () => sendBackward(selectedIds), !hasSelection)}

      {divider()}

      {/* Group */}
      {menuItem('编组', <Group size={14} />, () => groupSelected(), !multiSelect)}
      {menuItem('解除编组', <Ungroup size={14} />, () => ungroupSelected(), !hasGroup)}

      {divider()}

      {/* Align (requires 2+) */}
      <div style={{ padding: '4px 12px', fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
        对齐
      </div>
      <div style={{ display: 'flex', gap: 2, padding: '0 8px 4px', flexWrap: 'wrap' }}>
        {[
          { dir: 'left' as const, icon: <AlignStartHorizontal size={14} />, title: '左对齐' },
          { dir: 'centerH' as const, icon: <AlignCenterHorizontal size={14} />, title: '水平居中' },
          { dir: 'right' as const, icon: <AlignEndHorizontal size={14} />, title: '右对齐' },
          { dir: 'top' as const, icon: <AlignStartVertical size={14} />, title: '顶对齐' },
          { dir: 'centerV' as const, icon: <AlignCenterVertical size={14} />, title: '垂直居中' },
          { dir: 'bottom' as const, icon: <AlignEndVertical size={14} />, title: '底对齐' },
        ].map(({ dir, icon, title }) => (
          <button
            key={dir}
            onClick={() => { alignComponents(dir); onClose(); }}
            disabled={!multiSelect}
            title={title}
            style={{
              padding: 5, borderRadius: 4, border: 'none', cursor: multiSelect ? 'pointer' : 'not-allowed',
              background: 'transparent', color: multiSelect ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
              opacity: multiSelect ? 1 : 0.4, transition: 'background 0.1s',
            }}
            onMouseOver={e => { if (multiSelect) e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Distribute (requires 3+) */}
      <div style={{ padding: '4px 12px', fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
        等距分布
      </div>
      <div style={{ display: 'flex', gap: 2, padding: '0 8px 4px' }}>
        {menuItem('水平分布', <GalleryHorizontal size={14} />, () => distributeComponents('horizontal'), !tripleSelect)}
        {menuItem('垂直分布', <GalleryVertical size={14} />, () => distributeComponents('vertical'), !tripleSelect)}
      </div>

      {divider()}

      {/* Visibility */}
      {selectedComps.length === 1 && (
        <>
          {menuItem(
            selectedComps[0].locked ? '解锁' : '锁定',
            selectedComps[0].locked ? <Unlock size={14} /> : <Lock size={14} />,
            () => updateComponent(selectedComps[0].id, { locked: !selectedComps[0].locked }),
          )}
          {menuItem(
            selectedComps[0].visible ? '隐藏' : '显示',
            selectedComps[0].visible ? <EyeOff size={14} /> : <Eye size={14} />,
            () => updateComponent(selectedComps[0].id, { visible: !selectedComps[0].visible }),
          )}
        </>
      )}
    </div>
  );
}
