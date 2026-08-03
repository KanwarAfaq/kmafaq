import { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { supabase } from '../lib/supabase';

export default function ResearchGraph() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const graphRef = useRef();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        
        // Fetch nodes and edges in parallel
        const [nodesRes, edgesRes] = await Promise.all([
          supabase.from('graph_nodes').select('*'),
          supabase.from('graph_edges').select('*')
        ]);

        if (nodesRes.data && edgesRes.data) {
          const mappedNodes = nodesRes.data.map(n => ({ 
            id: String(n.id), 
            label: n.label, 
            group: n.group_id 
          }));

          const mappedLinks = edgesRes.data.map(e => ({ 
            source: String(e.source), 
            target: String(e.target) 
          }));

          // Strict validation check to filter out ghost links pointing to missing nodes
          const verifiedLinks = mappedLinks.filter(link => {
            const sourceExists = mappedNodes.some(node => node.id === link.source);
            const targetExists = mappedNodes.some(node => node.id === link.target);
            return sourceExists && targetExists;
          });

          setGraphData({
            nodes: mappedNodes,
            links: verifiedLinks
          });
        }
      } catch (err) {
        console.error("Failed to load research network graph:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  // Apply subtle structural center gravity forces once the dataset settles
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-40);
      graphRef.current.d3Force('link').distance(60);
    }
  }, [graphData]);

  if (loading || !graphData || graphData.nodes.length === 0) {
    return (
      <div className="h-[450px] w-full border border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/50 dark:bg-gray-950/50 flex flex-col items-center justify-center backdrop-blur-md">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mb-3"></div>
        <p className="text-xs text-gray-400 font-mono tracking-wider">Calibrating neural canvas...</p>
      </div>
    );
  }

  return (
    <div className="h-[450px] w-full border border-gray-200/60 dark:border-gray-800/60 rounded-3xl overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 shadow-inner relative group">
      
      {/* Modern overlay HUD label */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500 shadow-sm">
        Interactive Knowledge Mesh
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        enablePointerInteraction={true}
        
        // Permanent Fluid Kinetic Motion settings
        cooldownTicks={Infinity}
        cooldownTime={Infinity}
        velocityDecay={0.06} 
        
        // Premium Link Matrix Styles
        linkColor={() => 'rgba(212, 6, 147, 0.06)'} 
        linkWidth={10}
        linkDirectionalParticles={5}
        linkDirectionalParticleSpeed={0.002}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleColor={() => '#22d3ee'} 
        
        // Advanced Custom Node Shape Rendering with Safe Fallbacks
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.label || '';
          
          const themeColors = [
            { core: '#06b6d4', glow: 'rgba(6, 182, 212, 0.15)' }, // Cyan
            { core: '#3b82f6', glow: 'rgba(59, 130, 246, 0.15)' }, // Blue
            { core: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.15)' }, // Purple
            { core: '#ec4899', glow: 'rgba(236, 72, 153, 0.15)' }  // Pink
          ];
          
          // Compute index and safely fall back to position [0] if group is missing/undefined
          const colorIndex = parseInt(node.group || node.id) % themeColors.length;
          const colorTheme = themeColors[isNaN(colorIndex) ? 0 : colorIndex] || themeColors[0];
          
          const radius = 5;

          // 1. Draw Aura Outer Glowing Ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 1.8, 0, 2 * Math.PI, false);
          ctx.fillStyle = colorTheme.glow;
          ctx.fill();

          // 2. Draw Solid Core Dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 0.7, 0, 2 * Math.PI, false);
          ctx.fillStyle = colorTheme.core;
          ctx.fill();

          // 3. Render Modern Text Typography Labels
          const fontSize = 11 / Math.max(1, globalScale * 0.35);
          ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(156, 163, 175, 0.85)'; 
          ctx.fillText(label, node.x, node.y + radius + fontSize + 2);
        }}
        backgroundColor="transparent"
      />
    </div>
  );
}