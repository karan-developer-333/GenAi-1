'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { useTheme } from 'next-themes';
import { GraphNode, GraphLink, GraphData, ForceGraphProps } from './graph.types';

/* ─── Premium AI palette ─── */
const GROUP_COLORS: Record<number, string> = {
  1: '#539AE9', // query node — neon blue glow
  2: '#2655C7', // high similarity — accent blue
  3: '#153081', // medium similarity — primary blue
  4: '#4B6C8F', // low similarity — muted blue
};

export default function ForceGraph({ data, onNodeClick }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const { theme } = useTheme();

  // Theme-aware colors
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#09153C';
  const strokeColor = isDark ? '#FFFFFF' : '#09153C';
  const linkColor = isDark ? 'rgba(83,154,233,0.15)' : 'rgba(21,48,129,0.2)';
  const arrowColor = isDark ? 'rgba(83,154,233,0.3)' : 'rgba(21,48,129,0.4)';

  const destroySimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0) return;

    destroySimulation();

    const wrapper = wrapperRef.current!;
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    // Deep clone to avoid D3 mutating React state
    const nodes: GraphNode[] = data.nodes.map((d) => ({ ...d }));
    const links: GraphLink[] = data.links.map((d) => ({ ...d }));

    if (!svgRef.current) return;

    const svgEl = svgRef.current;
    const svg = d3
      .select(svgEl)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    // Zoom layer
    const g = svg.append('g');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'graph-arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', arrowColor);

    // Tooltip
    const tooltip = d3
      .select(wrapper)
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('opacity', 0);

    // Simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(140)
          .strength((d) => d.value || 0.5)
      )
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35))
      .alphaDecay(0.02);

    simulationRef.current = simulation;

    // Links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', linkColor)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.max(1, d.value * 5))
      .attr('marker-end', 'url(#graph-arrowhead)');

    // Link labels (scores)
    const linkLabel = g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', 10)
      .attr('fill', textColor)
      .attr('text-anchor', 'middle')
      .text((d) => (d.value ? d.value.toFixed(2) : ''));

    // Nodes
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(drag(simulation) as any);

    // Node circles
    node
      .append('circle')
      .attr('r', (d) => (d.group === 1 ? 18 : 12))
      .attr('fill', (d) => GROUP_COLORS[d.group] || '#8a8a8a')
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2.5)
      .style('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))');

    // Glow on query node
    node
      .filter((d) => d.group === 1)
      .select('circle')
      .style('filter', 'drop-shadow(0 0 15px rgba(83,154,233,0.8))');

    // Node labels
    node
      .append('text')
      .attr('dy', (d) => (d.group === 1 ? 30 : 24))
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .attr('font-size', (d) => (d.group === 1 ? 13 : 11))
      .attr('font-weight', (d) => (d.group === 1 ? 700 : 400))
      .text((d) => {
        const t = d.label || d.id;
        return t.length > 30 ? t.slice(0, 28) + '…' : t;
      });

    // Hover interactions
    node
      .on('mouseover', function (event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.group === 1 ? 22 : 16);

        tooltip
          .html(
            `<strong>${d.label || d.id}</strong>${d.score ? `<br/>Score: ${d.score.toFixed(4)}` : ''}${d.url ? `<br/><span class="url">${d.url}</span>` : ''}`
          )
          .style('left', event.offsetX + 12 + 'px')
          .style('top', event.offsetY - 10 + 'px')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseout', function (_event, d) {
        d3.select(this)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.group === 1 ? 18 : 12);

        tooltip.transition().duration(300).style('opacity', 0);
      })
      .on('click', (_event, d) => {
        if (d.group !== 1 && onNodeClick) {
          onNodeClick(d.label || d.id);
        }
      });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Responsive resize
    const resizeObserver = new ResizeObserver(() => {
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      svg.attr('viewBox', `0 0 ${w} ${h}`).attr('width', w).attr('height', h);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    });
    resizeObserver.observe(wrapper);

    return () => {
      destroySimulation();
      resizeObserver.disconnect();
      tooltip.remove();
    };
  }, [data, onNodeClick, destroySimulation, theme]);

  function drag(simulation: d3.Simulation<GraphNode, GraphLink>) {
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    return d3.drag<SVGGElement, GraphNode>().on('start', dragstarted).on('drag', dragged).on('end', dragended);
  }

  return (
    <div ref={wrapperRef} className="graph-vis-wrapper min-h-80">
      <svg ref={svgRef}></svg>
    </div>
  );
}
