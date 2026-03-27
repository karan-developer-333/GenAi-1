/**
 * Graph Transformer
 * Converts Pinecone search results into D3-compatible graph format
 * with dynamic clustering based on similarity score thresholds.
 */

/**
 * Assign a group number based on similarity score.
 */
function scoreToGroup(score: number): number {
  if (score >= 0.8) return 2;
  if (score >= 0.5) return 3;
  return 4;
}

export interface GraphNode {
  id: string;
  group: number;
  label: string;
  score?: number;
  url?: string;
  type?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

/**
 * Transform a query string and Pinecone matches into a D3 graph.
 */
export function toGraph(query: string, matches: any[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [{ id: query, group: 1, label: query }];
  const links: GraphLink[] = [];
  const seen = new Set([query.toLowerCase()]);

  matches.forEach((m) => {
    const label =
      (m.metadata && m.metadata.title) ||
      (m.metadata && m.metadata.text) ||
      m.id;

    const key = label.toLowerCase();
    if (seen.has(key)) return; // deduplicate
    seen.add(key);

    nodes.push({
      id: label,
      group: scoreToGroup(m.score),
      label,
      score: m.score,
      url: m.metadata && m.metadata.url,
      type: m.metadata && m.metadata.type,
    });

    links.push({
      source: query,
      target: label,
      value: m.score,
    });
  });

  return { nodes, links };
}
