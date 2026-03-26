import api from '@/lib/api';

export interface AgentSource {
  title: string;
  url: string;
}

export interface AgentResponse {
  answer: string;
  sources: {
    knowledge: AgentSource[];
    web: AgentSource[];
  };
}

export const sendMessage = async (query: string): Promise<AgentResponse> => {
  const res = await api.post('/api/agent/chat', { query });
  return res.data;
};
