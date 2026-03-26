'use client';

import { motion } from 'framer-motion';
import ForceGraph from './ForceGraph';
import { useGraph } from '@/hooks/useGraph';
import '@/styles/graph.css';

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
        <h1>
          <span className="text-gradient-gold">Knowledge</span> Graph
        </h1>
        <p className="graph-subtitle">
          Explore semantic relationships from your saved knowledge
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
          <svg
            className="graph-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="graph-search-input"
            placeholder="Search your knowledge base…"
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
          {loading ? 'Searching…' : 'Search'}
        </button>
      </motion.form>

      {/* Error */}
      {error && (
        <motion.div
          className="graph-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>⚠</span> {error}
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
            <p>Searching vectors…</p>
          </div>
        )}

        {!loading && !graphData && !error && (
          <motion.div
            className="graph-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="graph-empty-icon">🔍</div>
            <p>Type a query to visualize semantic connections</p>
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
                <span className="graph-dot graph-dot-query" /> Query
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-high" /> High Match ≥0.8
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-mid" /> Medium ≥0.5
              </span>
              <span className="graph-legend-item">
                <span className="graph-dot graph-dot-low" /> Low &lt;0.5
              </span>
            </div>
            <ForceGraph data={graphData} onNodeClick={reQuery} />
            <p className="graph-hint">
              💡 Click any result node to re-query • Drag nodes • Scroll to zoom
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}