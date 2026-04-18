import React, { useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection as FlowConnection,
  ReactFlowProvider,
  type NodeChange,
  type EdgeChange,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSceneStore } from '@/store/sceneStore';
import { DeviceNode, type DeviceNodeType } from './nodes/DeviceNode';
import { ExternalNodeNode, type ExternalNodeType } from './nodes/ExternalNodeNode';
import { SignalEdge } from './edges/SignalEdge';
import { TopologyToolbar } from './TopologyToolbar';
import { getAssetById } from '@/features/component-library/assets-data';
import { generateId } from '@/shared/utils/id';
import { useUIStore } from '@/store/uiStore';

// Union type for all node types in the topology
type AppNode = DeviceNodeType | ExternalNodeType;

// Edge type
type AppEdge = Edge<{
  type: string;
  label: string;
  lineStyle: 'bezier' | 'step';
  bandwidth: string;
}>;

const nodeTypes = {
  device: DeviceNode,
  external: ExternalNodeNode,
};

const edgeTypes = {
  signal: SignalEdge,
};

function TopologyFlow() {
  const { scene, setScene, selectComponents, clearSelection, addConnection } = useSceneStore();
  const { filterTypes, lineStyle } = scene.viewState.topology;
  const { setHighlightedComponent } = useUIStore();

  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);

  // Sync scene data to Flow state
  useEffect(() => {
    // 1. Convert SceneComponents to Nodes (Filtering out non-electrical/non-network by checking properties/category)
    const deviceNodes: DeviceNodeType[] = scene.components
      .filter((comp) => {
        const asset = getAssetById(comp.assetId);
        // Exclude simple furniture that doesn't belong in topology
        if (asset?.category === 'furniture' && (!asset.defaultProperties.interfaces || asset.defaultProperties.interfaces.length === 0) && !asset.defaultProperties.power) {
          return false;
        }
        return true;
      })
      .map((comp) => ({
        id: comp.id,
        type: 'device' as const,
        position: comp.topologyPosition || { x: comp.position.x / 10, y: comp.position.y / 10 },
        data: { component: comp },
      }));

    // 2. Convert ExternalNodes to Nodes
    const extNodes: ExternalNodeType[] = scene.externalNodes.map((ext) => ({
      id: ext.id,
      type: 'external' as const,
      position: ext.position,
      data: { node: ext },
    }));

    setNodes([...deviceNodes, ...extNodes]);
  }, [scene.components, scene.externalNodes, setNodes]);

  useEffect(() => {
    // 3. Convert Connections to Edges, filtering by filterTypes
    const flowEdges: AppEdge[] = scene.connections
      .filter((c) => filterTypes.includes(c.type))
      .map((c) => ({
        id: c.id,
        source: c.sourceId,
        target: c.targetId,
        type: 'signal',
        data: {
          type: c.type,
          label: c.label,
          lineStyle: lineStyle,
          bandwidth: c.bandwidth,
        },
        sourceHandle: c.type,
        targetHandle: c.type,
      }));

    setEdges(flowEdges);
  }, [scene.connections, filterTypes, lineStyle, setEdges]);

  // Handle Graph Logic updates
  const onConnect = useCallback(
    (params: FlowConnection) => {
      const handleType = params.targetHandle || params.sourceHandle || 'network';
      
      const newConnection = {
        id: generateId(),
        sourceId: params.source,
        targetId: params.target,
        type: handleType as any,
        label: handleType.toUpperCase(),
        bandwidth: '',
        protocol: '',
        style: { color: '', dashArray: '', lineWidth: 2, animated: true }
      };

      addConnection(newConnection);
    },
    [addConnection]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange<AppNode>[]) => {
      onNodesChange(changes);
      
      // Sync moved positions back to sceneStore if it's a dragging change
      const draggedChange = changes.find(c => c.type === 'position' && c.dragging === false);
      if (draggedChange && draggedChange.type === 'position' && draggedChange.position) {
         const compNode = scene.components.find(c => c.id === draggedChange.id);
         if (compNode) {
           setScene({
             ...scene,
             components: scene.components.map(c => 
               c.id === draggedChange.id 
                 ? { ...c, topologyPosition: draggedChange.position } 
                 : c
             )
           });
         } else {
           const extNode = scene.externalNodes.find(c => c.id === draggedChange.id);
           if (extNode) {
              setScene({
                ...scene,
                externalNodes: scene.externalNodes.map(c => 
                  c.id === draggedChange.id 
                    ? { ...c, position: draggedChange.position! } 
                    : c
                )
              });
           }
         }
      }
    },
    [scene, onNodesChange, setScene]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<AppEdge>[]) => {
      onEdgesChange(changes);
      const removedEdges = changes.filter(c => c.type === 'remove');
      if (removedEdges.length > 0) {
        const removedIds = removedEdges.map(c => c.id);
        setScene({
          ...scene,
          connections: scene.connections.filter(c => !removedIds.includes(c.id))
        });
      }
    },
    [scene, onEdgesChange, setScene]
  );

  return (
    <ReactFlow<AppNode, AppEdge>
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onConnect={onConnect}
      onNodeClick={(_, node) => {
        // Set highlight for cross-view linking
        setHighlightedComponent(node.id);
        selectComponents([node.id]);
      }}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      attributionPosition="bottom-right"
      style={{ background: 'var(--color-bg-canvas)' }}
    >
      <Background color="var(--color-border)" gap={32} size={1} />
      <Controls />
      <MiniMap 
        nodeColor={(n) => {
          if (n.type === 'external') return '#0EA5E9';
          return '#38BDF8';
        }}
        maskColor="rgba(0,0,0,0.2)"
        style={{ background: 'var(--color-bg-panel)', border: '1px solid var(--color-border)' }}
      />
      <TopologyToolbar />
    </ReactFlow>
  );
}

export default function TopologyView() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%' }}>
        <TopologyFlow />
      </div>
    </ReactFlowProvider>
  );
}
