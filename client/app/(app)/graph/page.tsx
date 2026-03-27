'use client';

import { motion } from 'framer-motion';
import ForceGraph from './ForceGraph';
import { useGraph } from '@/hooks/useGraph';
import '@/styles/graph.css';
import { Search, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function GraphPage() {
  const {
    query,
    graphData,
    loading,
    error,
    handleInputChange,
    handleSubmit,
    clearSearch,
    reQuery,
  } = useGraph();

  return (
    <div className="graph-page">
      {/* Ambient orbs */}
      <div className="graph-orb graph-orb-1" />
      <div className="graph-orb graph-orb-2" />

      {/* Header */}
      <motion.header
        className="graph-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="flex items-center justify-center gap-3">
          <span className="text-[#539AE9]">Knowledge</span> Systems
        </h1>
        <p className="graph-subtitle">
          Explore semantic relationships and neural connections across your entire saved knowledge base.
        </p>
      </motion.header>

      {/* Search */}
      <motion.form
        className="graph-search-bar"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="graph-search-wrapper">
          <Search className="graph-search-icon" />
          <input
            type="text"
            id="graph-search-input"
            placeholder="Search your knowledge base..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="graph-clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="graph-search-btn"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Synthesizing...' : 'Visualize'}
        </button>
      </motion.form>

      {/* Error */}
      {error && (
        <motion.div
          className="graph-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-5 h-5" /> 
          <span>{error}</span>
        </motion.div>
      )}

      {/* Main */}
      <main className="graph-main">
        {loading && (
          <div className="graph-loader-overlay">
            <div className="graph-pulse-loader">
              <div />
              <div />
              <div />
            </div>
            <p className="font-bold tracking-widest text-xs uppercase text-[#539AE9]">Analyzing Neural Vectors...</p>
          </div>
        )}

        {!loading && !graphData && !error && (
          <motion.div
            className="graph-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
               <div className="absolute inset-0 bg-[#539AE9]/20 blur-3xl rounded-full" />
               <Sparkles className="graph-empty-icon relative z-10 text-[#539AE9]" size={64} />
            </div>
            <p className="text-[#A8B3CF] font-medium">Type a query above to visualize semantic connections</p>
          </motion.div>
        )}

        {graphData && graphData.nodes && graphData.nodes.length > 0 && (
          <motion.div
            className="graph-content-wrapper"
            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="graph-legend">
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-query" /> Neural Seed
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-high" /> High Relevance
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-mid" /> Correlated
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-low" /> Distant Match
              </span>
            </div>
            <ForceGraph data={graphData} onNodeClick={reQuery} />
            <div className="graph-hint flex items-center justify-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#539AE9]" />
              <span>Click nodes to re-query • Drag to reorganize • Scroll to zoom</span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}