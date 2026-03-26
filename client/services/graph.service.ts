import api from '@/lib/api';
import { GraphData } from '@/app/(app)/graph/graph.types';

export const searchGraph = async (query: string): Promise<GraphData> => {
  const res = await api.post('/api/graph-search', { query: query.trim() });
  return res.data;
};
