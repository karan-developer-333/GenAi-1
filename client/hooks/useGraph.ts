'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { searchGraph } from '@/services/graph.service';
import { GraphData } from '@/app/(app)/graph/graph.types';

export const useGraph = () => {
  const [query, setQuery] = useState('');
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGraph = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setGraphData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchGraph(searchQuery);
      setGraphData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Search failed');
      setGraphData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchGraph(val);
    }, 400);
  };

  const clearSearch = () => {
    setQuery('');
    setGraphData(null);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const reQuery = (label: string) => {
    setQuery(label);
    fetchGraph(label);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    setQuery,
    graphData,
    loading,
    error,
    handleInputChange,
    handleSubmit: (e?: React.FormEvent) => {
      e?.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      fetchGraph(query);
    },
    clearSearch,
    reQuery,
  };
};
