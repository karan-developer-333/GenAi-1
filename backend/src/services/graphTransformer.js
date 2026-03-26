/**
 * Graph Transformer
 * Converts Pinecone search results into D3-compatible graph format
 * with dynamic clustering based on similarity score thresholds.
 */

/**
 * Assign a group number based on similarity score.
 * group 1 = query node (handled separately)
 * group 2 = high similarity  (score >= 0.8)
 * group 3 = medium similarity (score >= 0.5)
 * group 4 = low similarity   (score < 0.5)
 */
function scoreToGroup(score) {
    if (score >= 0.8) return 2;
    if (score >= 0.5) return 3;
    return 4;
}

/**
 * Transform a query string and Pinecone matches into a D3 graph.
 *
 * @param {string} query - The original query text
 * @param {Array}  matches - Array of Pinecone match objects
 *   Each match: { id, score, metadata: { title, url, imageUrl, type } }
 * @returns {{ nodes: Array, links: Array }}
 */
function toGraph(query, matches) {
    const nodes = [{ id: query, group: 1, label: query }];
    const links = [];
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

module.exports = { toGraph };
