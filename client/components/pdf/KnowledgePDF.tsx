'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { Item } from '@/hooks/useCollections';

// ─── Professional Color Palette ───────────────────────────────────────────────
const colors = {
  ink:        '#0D0D0D',   // near-black for headings
  charcoal:   '#2C2C2C',   // body text
  slate:      '#5A6472',   // secondary / muted
  fog:        '#9AA3AD',   // tertiary / rules
  smoke:      '#E8EAED',   // light borders
  paper:      '#F5F3EF',   // warm off-white backgrounds
  cream:      '#FAFAF8',   // page background
  gold:       '#B08D57',   // accent — warm editorial gold
  goldLight:  '#E8D9B8',   // accent tint
  white:      '#FFFFFF',
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_H = 52;
const MARGIN_V = 48;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Shared ──────────────────────────────────────────
  page: {
    backgroundColor: colors.cream,
    fontFamily: 'Times-Roman',
    paddingHorizontal: MARGIN_H,
    paddingTop: MARGIN_V,
    paddingBottom: MARGIN_V,
  },

  ruleGold: {
    height: 2,
    backgroundColor: colors.gold,
  },
  ruleThin: {
    height: 0.75,
    backgroundColor: colors.smoke,
  },
  ruleInk: {
    height: 1,
    backgroundColor: colors.ink,
  },

  // ── Running Header ────────────────────────────────
  runningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  runningBrand: {
    fontSize: 7,
    letterSpacing: 3,
    color: colors.slate,
    fontFamily: 'Helvetica',
    width: '33%',
  },
  runningTitle: {
    fontSize: 7,
    letterSpacing: 2,
    color: colors.slate,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    width: '34%',
  },
  runningRight: {
    fontSize: 7,
    letterSpacing: 1,
    color: colors.fog,
    fontFamily: 'Helvetica',
    textAlign: 'right',
    width: '33%',
  },

  // ── Running Footer ────────────────────────────────
  runningFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 18,
  },
  footerLeft: {
    fontSize: 7,
    color: colors.fog,
    fontFamily: 'Helvetica',
    width: '33%',
  },
  footerCenter: {
    fontSize: 7,
    color: colors.gold,
    letterSpacing: 3,
    fontFamily: 'Helvetica',
    textAlign: 'center',
    width: '34%',
  },
  footerRight: {
    fontSize: 7,
    color: colors.fog,
    fontFamily: 'Helvetica',
    textAlign: 'right',
    width: '33%',
  },

  // ── COVER PAGE ───────────────────────────────────
  coverPage: {
    backgroundColor: colors.ink,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  coverTop: {
    paddingHorizontal: MARGIN_H,
    paddingTop: 44,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  coverEyebrow: {
    fontSize: 8,
    letterSpacing: 5,
    color: colors.gold,
    fontFamily: 'Helvetica',
    marginBottom: 22,
  },
  coverTitle: {
    fontSize: 68,
    fontWeight: 'bold',
    color: colors.cream,
    fontFamily: 'Times-Roman',
    lineHeight: 1.05,
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontSize: 13,
    color: colors.fog,
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    marginTop: 16,
    lineHeight: 1.6,
  },

  coverMeta: {
    paddingHorizontal: MARGIN_H,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  coverMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  coverMetaLabel: {
    fontSize: 6,
    letterSpacing: 2.5,
    color: colors.slate,
    fontFamily: 'Helvetica',
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 15,
    color: colors.cream,
    fontFamily: 'Times-Roman',
    letterSpacing: 1,
  },
  coverMetaDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#2A2A2A',
  },

  coverGoldBar: {
    height: 3,
    backgroundColor: colors.gold,
    marginHorizontal: MARGIN_H,
    marginTop: 28,
  },

  coverFeature: {
    paddingHorizontal: MARGIN_H,
    paddingVertical: 28,
    flex: 1,
  },
  coverFeatureLabel: {
    fontSize: 7,
    letterSpacing: 4,
    color: colors.gold,
    fontFamily: 'Helvetica',
    marginBottom: 14,
  },
  coverFeatureDesc: {
    fontSize: 14,
    color: colors.fog,
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    lineHeight: 1.7,
    maxWidth: 360,
  },

  coverBottom: {
    paddingHorizontal: MARGIN_H,
    paddingBottom: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverBrand: {
    fontSize: 22,
    letterSpacing: 8,
    color: colors.cream,
    fontFamily: 'Times-Roman',
  },
  coverTagline: {
    fontSize: 7,
    letterSpacing: 3,
    color: colors.slate,
    fontFamily: 'Helvetica',
    textAlign: 'right',
  },

  // ── ARTICLE PAGE ─────────────────────────────────
  articleBody: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
  },

  articleMainCol: {
    flex: 1,
    paddingRight: 20,
    borderRightWidth: 0.75,
    borderRightColor: colors.smoke,
  },

  sectionLabel: {
    fontSize: 7,
    letterSpacing: 3.5,
    color: colors.gold,
    fontFamily: 'Helvetica',
    marginBottom: 8,
  },

  articleTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.ink,
    fontFamily: 'Times-Roman',
    lineHeight: 1.18,
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  articleByline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  bylineDate: {
    fontSize: 8,
    color: colors.slate,
    fontFamily: 'Helvetica',
    letterSpacing: 1,
  },
  bylineDot: {
    fontSize: 8,
    color: colors.fog,
    fontFamily: 'Helvetica',
  },
  bylineType: {
    fontSize: 8,
    color: colors.slate,
    fontFamily: 'Helvetica',
    letterSpacing: 1,
  },

  articleLead: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.charcoal,
    lineHeight: 1.65,
    marginBottom: 16,
    fontFamily: 'Times-Roman',
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingLeft: 12,
  },

  articleColumns: {
    flexDirection: 'row',
    gap: 16,
  },
  articleCol: {
    flex: 1,
  },
  bodyText: {
    fontSize: 9.5,
    lineHeight: 1.85,
    color: colors.charcoal,
    fontFamily: 'Times-Roman',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 9.5,
    fontStyle: 'italic',
    color: colors.fog,
    fontFamily: 'Times-Roman',
    backgroundColor: colors.paper,
    padding: 14,
    lineHeight: 1.7,
  },

  pullQuote: {
    marginVertical: 18,
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderTopWidth: 1.5,
    borderTopColor: colors.gold,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gold,
  },
  pullQuoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.ink,
    fontFamily: 'Times-Roman',
    lineHeight: 1.55,
    textAlign: 'center',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 18,
  },
  tag: {
    fontSize: 7,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: colors.paper,
    borderWidth: 0.5,
    borderColor: colors.smoke,
    letterSpacing: 1.5,
    color: colors.slate,
    fontFamily: 'Helvetica',
  },

  // ── Sidebar ───────────────────────────────────────
  sidebarCol: {
    width: 108,
  },
  sidebarSection: {
    marginBottom: 22,
  },
  sidebarHeading: {
    fontSize: 6.5,
    letterSpacing: 3,
    color: colors.gold,
    fontFamily: 'Helvetica',
    marginBottom: 7,
  },
  sidebarDivider: {
    height: 0.75,
    backgroundColor: colors.smoke,
    marginBottom: 10,
  },

  tocRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
    gap: 7,
  },
  tocNum: {
    fontSize: 8,
    color: colors.gold,
    fontFamily: 'Helvetica',
    width: 16,
  },
  tocText: {
    fontSize: 8,
    color: colors.slate,
    fontFamily: 'Helvetica',
    flex: 1,
    lineHeight: 1.4,
  },
  tocTextActive: {
    color: colors.ink,
    fontFamily: 'Helvetica-Bold',
  },
  tocNumActive: {
    color: colors.gold,
    fontFamily: 'Helvetica-Bold',
  },

  sourceUrl: {
    fontSize: 7,
    color: colors.gold,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    textDecoration: 'none',
  },
  sourceDomain: {
    fontSize: 7,
    color: colors.slate,
    fontFamily: 'Helvetica',
    marginTop: 4,
    lineHeight: 1.4,
  },

  statBox: {
    backgroundColor: colors.paper,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  statNum: {
    fontSize: 22,
    color: colors.gold,
    fontFamily: 'Times-Roman',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: colors.slate,
    fontFamily: 'Helvetica',
    marginTop: 3,
  },

  // ── GRID PAGE ─────────────────────────────────────
  gridLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
  },
  gridMain: {
    flex: 1,
    paddingRight: 20,
    borderRightWidth: 0.75,
    borderRightColor: colors.smoke,
  },
  gridMainTitle: {
    fontSize: 22,
    color: colors.ink,
    fontFamily: 'Times-Roman',
    lineHeight: 1.3,
    marginBottom: 10,
  },
  gridMainText: {
    fontSize: 9.5,
    lineHeight: 1.8,
    color: colors.charcoal,
    fontFamily: 'Times-Roman',
  },
  gridSourceLink: {
    fontSize: 7,
    color: colors.gold,
    marginTop: 10,
    fontFamily: 'Helvetica',
    textDecoration: 'none',
  },

  gridSide: {
    width: 150,
    flexDirection: 'column',
  },
  gridCard: {
    backgroundColor: colors.paper,
    padding: 12,
    marginBottom: 14,
    borderTopWidth: 2,
    borderTopColor: colors.gold,
  },
  gridCardCategory: {
    fontSize: 6.5,
    letterSpacing: 2.5,
    color: colors.gold,
    fontFamily: 'Helvetica',
    marginBottom: 5,
  },
  gridCardTitle: {
    fontSize: 11,
    color: colors.ink,
    fontFamily: 'Times-Roman',
    lineHeight: 1.3,
    marginBottom: 6,
  },
  gridCardText: {
    fontSize: 8.5,
    color: colors.slate,
    fontFamily: 'Times-Roman',
    lineHeight: 1.6,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatShortDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

const cleanText = (text: string, maxChars?: number): string => {
  if (!text) return '';
  const cleaned = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (maxChars && cleaned.length > maxChars) {
    return cleaned.substring(0, maxChars).trimEnd() + '…';
  }
  return cleaned;
};

const getDomain = (url: string): string => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url.substring(0, 30); }
};

// ─── Components ───────────────────────────────────────────────────────────────

const RunningHeader = ({ brand, center, right }: { brand: string; center?: string; right?: string }) => (
  <>
    <View style={styles.runningHeader}>
      <Text style={styles.runningBrand}>{brand}</Text>
      {center && <Text style={styles.runningTitle}>{center}</Text>}
      {right && <Text style={styles.runningRight}>{right}</Text>}
    </View>
    <View style={styles.ruleGold} />
  </>
);

const RunningFooter = ({ left, center, right }: { left?: string; center?: string; right?: string }) => (
  <>
    <View style={styles.ruleThin} />
    <View style={styles.runningFooter}>
      <Text style={styles.footerLeft}>{left ?? ''}</Text>
      <Text style={styles.footerCenter}>{center ?? 'MNEMOAI'}</Text>
      <Text style={styles.footerRight}>{right ?? ''}</Text>
    </View>
  </>
);

// ── Cover ─────────────────────────────────────────────────────────────────────
const CoverPage = ({ itemCount }: { itemCount: number }) => {
  const month = new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = new Date().getFullYear();

  return (
    <Page size="A4" style={[styles.page, styles.coverPage]}>
      <View style={styles.coverTop}>
        <Text style={styles.coverEyebrow}>THE CURATED EDIT  ·  KNOWLEDGE DIGEST</Text>
        <Text style={styles.coverTitle}>{'YOUR\nKNOWLEDGE\nCOLLECTION'}</Text>
        <Text style={styles.coverSubtitle}>
          A curated digest of your saved articles, reads, and digital discoveries.
        </Text>
      </View>

      <View style={styles.coverMeta}>
        <View style={styles.coverMetaItem}>
          <Text style={styles.coverMetaLabel}>ISSUE</Text>
          <Text style={styles.coverMetaValue}>VOL 01</Text>
        </View>
        <View style={styles.coverMetaDivider} />
        <View style={styles.coverMetaItem}>
          <Text style={styles.coverMetaLabel}>DATE</Text>
          <Text style={styles.coverMetaValue}>{month} {year}</Text>
        </View>
        <View style={styles.coverMetaDivider} />
        <View style={styles.coverMetaItem}>
          <Text style={styles.coverMetaLabel}>ARTICLES</Text>
          <Text style={styles.coverMetaValue}>{itemCount}</Text>
        </View>
      </View>

      <View style={styles.coverGoldBar} />

      <View style={styles.coverFeature}>
        <Text style={styles.coverFeatureLabel}>INSIDE THIS ISSUE</Text>
        <Text style={styles.coverFeatureDesc}>
          Every article you've saved, beautifully typeset into a personal magazine.
          Read, revisit, and rediscover your curated knowledge at your own pace.
        </Text>
      </View>

      <View style={styles.coverBottom}>
        <Text style={styles.coverBrand}>MNEMOAI</Text>
        <Text style={styles.coverTagline}>{'SAVE · ORGANISE · REMEMBER'}</Text>
      </View>
    </Page>
  );
};

// ── Article ───────────────────────────────────────────────────────────────────
const ArticlePage = ({ item, index, total, allItems }: {
  item: Item; index: number; total: number; allItems: Item[];
}) => {
  const articleNum = String(index + 1).padStart(2, '0');
  const category   = item.tags?.split(' ')[0]?.toUpperCase() ?? 'ARTICLE';
  const dateStr    = item.timestamp ? formatShortDate(item.timestamp) : '';
  const typeStr    = item.type?.toUpperCase() ?? 'ARTICLE';

  const fullText  = item.text ? cleanText(item.text) : '';
  const mid       = Math.floor(fullText.length / 2);
  const col1      = fullText.substring(0, mid).trim();
  const col2      = fullText.substring(mid).trim();
  const pullQuote = fullText ? cleanText(fullText, 140) : '';

  return (
    <Page size="A4" style={styles.page}>
      <RunningHeader brand="MNEMOAI" center="THE CURATED EDIT" right={`${articleNum} / ${String(total).padStart(2, '0')}`} />

      <View style={styles.articleBody}>
        {/* ── Main Column ── */}
        <View style={styles.articleMainCol}>
          <Text style={styles.sectionLabel}>{category}</Text>
          <Text style={styles.articleTitle}>{cleanText(item.title, 120)}</Text>

          <View style={styles.articleByline}>
            {dateStr ? <Text style={styles.bylineDate}>{dateStr}</Text> : null}
            {dateStr ? <Text style={styles.bylineDot}>·</Text> : null}
            <Text style={styles.bylineType}>{typeStr}</Text>
          </View>

          <View style={styles.ruleInk} />
          <View style={{ height: 14 }} />

          {fullText ? (
            <>
              {pullQuote && (
                <Text style={styles.articleLead}>{pullQuote}</Text>
              )}
              <View style={styles.articleColumns}>
                <View style={styles.articleCol}>
                  <Text style={styles.bodyText}>{col1}</Text>
                </View>
                <View style={styles.articleCol}>
                  <Text style={styles.bodyText}>{col2}</Text>
                </View>
              </View>

              {pullQuote && (
                <View style={styles.pullQuote}>
                  <Text style={styles.pullQuoteText}>"{pullQuote}"</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>
              Content saved. Visit the source link in the sidebar to read the full article.
            </Text>
          )}

          {item.tags && (
            <View style={styles.tagsRow}>
              {item.tags.split(' ').slice(0, 6).map((tag, i) => (
                <Text key={i} style={styles.tag}>{tag.toUpperCase()}</Text>
              ))}
            </View>
          )}
        </View>

        {/* ── Sidebar ── */}
        <View style={styles.sidebarCol}>
          {/* Stats */}
          <View style={styles.sidebarSection}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{articleNum}</Text>
              <Text style={styles.statLabel}>OF {String(total).padStart(2, '0')} ARTICLES</Text>
            </View>
            {fullText && (
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{Math.ceil(fullText.split(' ').length / 200)}</Text>
                <Text style={styles.statLabel}>MIN READ</Text>
              </View>
            )}
          </View>

          {/* TOC */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>IN THIS ISSUE</Text>
            <View style={styles.sidebarDivider} />
            {allItems.slice(0, 8).map((it, i) => (
              <View key={i} style={styles.tocRow}>
                <Text style={i === index ? styles.tocNumActive : styles.tocNum}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={i === index ? [styles.tocText, styles.tocTextActive] : styles.tocText}>
                  {cleanText(it.title, 35)}
                </Text>
              </View>
            ))}
          </View>

          {/* Source */}
          {item.url && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>SOURCE</Text>
              <View style={styles.sidebarDivider} />
              <Text style={styles.sourceDomain}>{getDomain(item.url)}</Text>
              <Link src={item.url} style={styles.sourceUrl}>
                {cleanText(item.url, 45)}
              </Link>
            </View>
          )}
        </View>
      </View>

      <RunningFooter
        left={dateStr}
        center="MNEMOAI"
        right={`ISSUE 01  ·  ${category}`}
      />
    </Page>
  );
};

// ── Grid Page ─────────────────────────────────────────────────────────────────
const GridPage = ({ items, allItems }: { items: Item[]; allItems: Item[] }) => {
  const [primary, ...secondary] = items;
  const category = primary.tags?.split(' ')[0]?.toUpperCase() ?? 'FEATURED';

  return (
    <Page size="A4" style={styles.page}>
      <RunningHeader brand="MNEMOAI" center="QUICK READS" right="DIGEST" />

      <View style={styles.gridLayout}>
        {/* Main Story */}
        <View style={styles.gridMain}>
          <Text style={styles.sectionLabel}>{category}</Text>
          <Text style={styles.gridMainTitle}>{cleanText(primary.title, 100)}</Text>
          <View style={styles.ruleInk} />
          <View style={{ height: 12 }} />
          {primary.text && (
            <Text style={styles.gridMainText}>{cleanText(primary.text, 550)}</Text>
          )}
          {!primary.text && (
            <Text style={styles.emptyText}>Visit the source to read the full article.</Text>
          )}
          {primary.url && (
            <Link src={primary.url} style={styles.gridSourceLink}>
              {getDomain(primary.url)}
            </Link>
          )}
        </View>

        {/* Side Cards */}
        <View style={styles.gridSide}>
          {secondary.slice(0, 3).map((item) => (
            <View key={item._id} style={styles.gridCard}>
              <Text style={styles.gridCardCategory}>
                {item.tags?.split(' ')[0]?.toUpperCase() ?? 'ARTICLE'}
              </Text>
              <Text style={styles.gridCardTitle}>{cleanText(item.title, 55)}</Text>
              {item.text && (
                <Text style={styles.gridCardText}>{cleanText(item.text, 110)}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <RunningFooter left={`${items.length} ARTICLES`} center="MNEMOAI" right="ISSUE 01" />
    </Page>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
interface KnowledgePDFProps {
  items: Item[];
}

export const KnowledgePDF = ({ items }: KnowledgePDFProps) => {
  if (items.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.fog, fontFamily: 'Times-Roman', fontStyle: 'italic' }}>
              No knowledge items to export yet.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }

  const pages: React.ReactNode[] = [
    <CoverPage key="cover" itemCount={items.length} />,
  ];

  let articleIndex = 0;

  for (let i = 0; i < items.length; ) {
    // Every 4th article (after 3 individual ones), show a grid of next 3
    if (articleIndex > 0 && articleIndex % 3 === 0 && i + 1 < items.length) {
      const slice = items.slice(i, Math.min(i + 4, items.length));
      pages.push(<GridPage key={`grid-${i}`} items={slice} allItems={items} />);
      i += slice.length;
      articleIndex += slice.length;
    } else {
      pages.push(
        <ArticlePage
          key={items[i]._id}
          item={items[i]}
          index={articleIndex}
          total={items.length}
          allItems={items}
        />
      );
      i++;
      articleIndex++;
    }
  }

  return <Document>{pages}</Document>;
};