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
        <h1 className="text-h1 text-foreground flex items-center justify-center gap-3">
          <span className="text-accent">Knowledge</span> Graph
        </h1>
        <p className="graph-subtitle text-body text-muted-foreground mt-4 max-w-xl mx-auto">
          Explore how your saved content connects. Search to discover semantic relationships and hidden patterns.
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
            placeholder="Ask a question about your knowledge..."
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
          {loading ? 'Searching...' : 'Explore'}
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
            <p className="text-label text-accent mt-6">Analyzing connections...</p>
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
               <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
               <Sparkles className="graph-empty-icon relative z-10 text-accent" size={64} />
            </div>
            <p className="text-body text-muted-foreground mt-6">Start by searching above to visualize connections</p>
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
                <span className="graph-dot graph-dot-query" /> Your Query
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-high" /> High Relevance
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-mid" /> Related
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-low" /> Mentioned
              </span>
            </div>
            <ForceGraph data={graphData} onNodeClick={reQuery} />
            <div className="graph-hint flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Info className="w-4 h-4 text-accent" />
              <span>Click nodes to explore • Drag to move • Scroll to zoom</span>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
