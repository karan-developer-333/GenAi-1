import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
  score?: number;
  url?: string;
  type?: string;
  sourceType?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ForceGraphProps {
  data: GraphData;
  onNodeClick?: (label: string) => void;
}
