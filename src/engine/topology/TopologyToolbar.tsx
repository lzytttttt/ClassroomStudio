import React, { useState } from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import dagre from 'dagre';
import { useSceneStore } from '@/store/sceneStore';
import { Settings2, Zap, Wifi, MonitorPlay, Cpu, Cable, LayoutGrid } from 'lucide-react';
import type { ConnectionType } from '@/shared/types/constants';
import { generateId } from '@/shared/utils/id';
import { generateAutoWiring } from './auto-wiring';

export function TopologyToolbar() {
  const { scene, setScene } = useSceneStore();
  const { filterTypes, lineStyle } = scene.viewState.topology;
  const { setNodes, getNodes, getEdges, fitView } = useReactFlow();
  const [wiringCount, setWiringCount] = useState<number | null>(null);

  const toggleFilter = (type: ConnectionType) => {
    const newFilters = filterTypes.includes(type)
      ? filterTypes.filter(t => t !== type)
      : [...filterTypes, type];
    
    // update sceneStore
    setScene({
      ...scene,
      viewState: {
        ...scene.viewState,
        topology: {
          ...scene.viewState.topology,
          filterTypes: newFilters,
        }
      }
    });
  };

  const toggleLineStyle = () => {
    setScene({
      ...scene,
      viewState: {
        ...scene.viewState,
        topology: {
          ...scene.viewState.topology,
          lineStyle: lineStyle === 'bezier' ? 'step' : 'bezier',
        }
      }
    });
  };

  const addExternalNode = (type: string, name: string) => {
    const newNode = {
      id: generateId(),
      name,
      type: type as any,
      icon: '',
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      description: '新增外部节点'
    };
    setScene({
      ...scene,
      externalNodes: [...scene.externalNodes, newNode]
    });
  };

  const autoLayout = () => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 60 });
    g.setDefaultEdgeLabel(() => ({}));

    const nodes = getNodes();
    const edges = getEdges();

    nodes.forEach((node) => {
      // 假设节点宽高
      g.setNode(node.id, { width: 200, height: 80 });
    });

    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    // Apply layout to nodes and update sceneStore with new topologyPositions
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - 100,
          y: nodeWithPosition.y - 40,
        },
      };
    });

    setNodes(layoutedNodes);
    
    window.requestAnimationFrame(() => {
      fitView({ duration: 800, padding: 0.2 });
    });

    // Write back to sceneStore
    const updatedComponents = scene.components.map(comp => {
      const rNode = layoutedNodes.find(n => n.id === comp.id);
      if (rNode) {
        return { ...comp, topologyPosition: { ...rNode.position } };
      }
      return comp;
    });

    const updatedExternal = scene.externalNodes.map(ext => {
      const rNode = layoutedNodes.find(n => n.id === ext.id);
      if (rNode) {
        return { ...ext, position: { ...rNode.position } };
      }
      return ext;
    });

    setScene({
      ...scene,
      components: updatedComponents,
      externalNodes: updatedExternal
    });
  };

  /**
   * Auto-wiring: generate recommended connections based on device roles.
   * Then auto-layout the graph for best visual representation.
   */
  const handleAutoWiring = () => {
    const newConnections = generateAutoWiring(scene.components, scene.connections);
    
    if (newConnections.length === 0) {
      setWiringCount(0);
      setTimeout(() => setWiringCount(null), 2000);
      return;
    }

    // Add new connections to the scene
    const updatedScene = {
      ...scene,
      connections: [...scene.connections, ...newConnections],
    };
    setScene(updatedScene);
    setWiringCount(newConnections.length);
    setTimeout(() => setWiringCount(null), 3000);

    // Auto-layout after wiring for better visual
    setTimeout(() => autoLayout(), 300);
  };

  return (
    <Panel position="top-right" style={{ display: 'flex', gap: '8px', zIndex: 10, flexWrap: 'wrap', maxWidth: '100%' }}>
      {/* Node Addition */}
      <div style={{ background: 'var(--color-bg-panel)', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', gap: 6 }}>
        <button onClick={() => addExternalNode('internet', '公网')} className="btn-sm" style={{ padding: '4px 8px' }}>+ 公网</button>
        <button onClick={() => addExternalNode('campus-network', '校园网')} className="btn-sm" style={{ padding: '4px 8px' }}>+ 校园网</button>
        <button onClick={() => addExternalNode('cloud-server', '云服务')} className="btn-sm" style={{ padding: '4px 8px' }}>+ 云平台</button>
      </div>

      {/* Toolbox */}
      <div style={{ background: 'var(--color-bg-panel)', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Auto-wiring button */}
        <button
          onClick={handleAutoWiring}
          className="btn-sm"
          style={{
            padding: '4px 12px',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'linear-gradient(135deg, #7C3AED20, #2563EB20)',
            border: '1px solid #7C3AED40',
            color: '#7C3AED',
            fontWeight: 600,
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title="根据设备角色自动生成推荐接线"
        >
          <Cable size={14} />
          自动接线
        </button>

        <button onClick={autoLayout} className="btn-primary" style={{ padding: '4px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          <LayoutGrid size={14} />
          一键排版
        </button>

        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
        <button onClick={toggleLineStyle} className="btn-sm" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Settings2 size={14} />
          {lineStyle === 'bezier' ? '平滑线' : '折线'}
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
        
        {/* Filters */}
        <button onClick={() => toggleFilter('network')} style={{ opacity: filterTypes.includes('network') ? 1 : 0.4, color: '#2563EB', background: 'transparent', border: 'none', cursor: 'pointer' }} title="切换网络线">
          <Wifi size={18} />
        </button>
        <button onClick={() => toggleFilter('av')} style={{ opacity: filterTypes.includes('av') ? 1 : 0.4, color: '#7C3AED', background: 'transparent', border: 'none', cursor: 'pointer' }} title="切换音视频线">
          <MonitorPlay size={18} />
        </button>
        <button onClick={() => toggleFilter('control')} style={{ opacity: filterTypes.includes('control') ? 1 : 0.4, color: '#0891B2', background: 'transparent', border: 'none', cursor: 'pointer' }} title="切换控制线">
          <Cpu size={18} />
        </button>
        <button onClick={() => toggleFilter('power')} style={{ opacity: filterTypes.includes('power') ? 1 : 0.4, color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer' }} title="切换电源线">
          <Zap size={18} />
        </button>
      </div>

      {/* Wiring result toast */}
      {wiringCount !== null && (
        <div style={{
          position: 'fixed',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: wiringCount > 0
            ? 'linear-gradient(135deg, #7C3AED, #2563EB)'
            : 'rgba(100, 116, 139, 0.9)',
          color: 'white',
          padding: '8px 20px',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 9999,
          animation: 'fadeInUp 0.3s ease-out',
          pointerEvents: 'none',
        }}>
          {wiringCount > 0
            ? `✅ 已自动生成 ${wiringCount} 条接线参考`
            : '📋 所有推荐接线已存在，无需新增'}
        </div>
      )}
    </Panel>
  );
}
