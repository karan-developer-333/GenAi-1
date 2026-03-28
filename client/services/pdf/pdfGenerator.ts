import { PDFExportData } from './pdfDataProcessor';
import { PDFSection, createLayoutPlan, defaultLayoutConfig } from './pdfLayoutEngine';
import { generateCoverPage, generatePageFromSection } from './pdfTemplates';
import { generatePDFStyles } from './pdfStyles';

export interface PDFGeneratorOptions {
  useAI: boolean;
  includeTOC: boolean;
  includeNarrative: boolean;
  layoutFlow: 'chronological' | 'thematic' | 'importance' | 'mixed';
  featuredCount: number;
}

export const defaultGeneratorOptions: PDFGeneratorOptions = {
  useAI: true,
  includeTOC: true,
  includeNarrative: true,
  layoutFlow: 'mixed',
  featuredCount: 3,
};

export const generatePDF = async (
  data: PDFExportData,
  options: PDFGeneratorOptions = defaultGeneratorOptions
): Promise<string> => {
  const config = {
    ...defaultLayoutConfig,
    flow: options.layoutFlow,
    showToc: options.includeTOC,
    showNarrative: options.includeNarrative,
    featuredCount: options.featuredCount,
  };
  
  const sections = createLayoutPlan(data.items, config);
  
  const pages: string[] = [];
  
  sections.forEach((section, index) => {
    const pageHTML = generatePageFromSection(section, data, index);
    if (pageHTML) {
      pages.push(pageHTML);
    }
  });
  
  const html = generateHTMLDocument(pages);
  
  return html;
};

const generateHTMLDocument = (pages: string[]): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knowledge Collection - MNEMOAI</title>
  <style>
    ${generatePDFStyles()}
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>
  `.trim();
};

export const generateQuickPDF = (data: PDFExportData): string => {
  const pages: string[] = [];
  
  pages.push(generateCoverPage(data));
  
  const tocItems = data.items.slice(0, 10);
  const tocHTML = `
    <div class="content-page toc-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">TABLE OF CONTENTS</div>
      </div>
      <div class="toc-content">
        <div class="toc-header">
          <h2 class="toc-title">In This Issue</h2>
          <div class="toc-count">${data.items.length} articles</div>
        </div>
        <div class="divider-dots"></div>
        <div class="toc-list">
          ${tocItems.map((item, i) => `
            <div class="toc-item ${i < 3 ? 'featured' : ''}">
              <div class="toc-number">${String(i + 1).padStart(2, '0')}</div>
              <div class="toc-info">
                <div class="toc-item-title">${item.title}</div>
                <div class="toc-item-meta">
                  <span class="toc-category">${item.category}</span>
                  <span class="toc-dot">•</span>
                  <span class="toc-time">${item.readingTime} min</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">${data.items.length} Articles</div>
      </div>
    </div>
  `;
  pages.push(tocHTML);
  
  data.items.forEach((item, index) => {
    const articleHTML = `
    <div class="content-page article-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">${String(index + 1).padStart(2, '0')} / ${String(data.items.length).padStart(2, '0')}</div>
      </div>
      
      <div class="article-layout">
        <div class="article-sidebar-left">
          <div class="sidebar-category">${item.category}</div>
          <div class="sidebar-date">${item.formattedDate}</div>
          ${item.isVideo ? '<div class="sidebar-badge">VIDEO</div>' : ''}
          <div class="sidebar-reading">${item.readingTime} min</div>
        </div>
        
        <div class="article-main">
          <h1 class="article-title">${item.title}</h1>
          
          ${item.imageUrl ? `
            <div class="article-image">
              <img src="${item.imageUrl}" alt="${item.title}" />
            </div>
          ` : ''}
          
          ${item.cleanText ? `
            <div class="article-pullquote">
              <div class="quote-icon">
                <svg width="48" height="40" viewBox="0 0 48 40" fill="none">
                  <path d="M12 8 L4 8 L4 16 C4 24 8 28 16 28 L12 32 C6 32 4 26 4 20 L12 20 L12 8 Z" fill="#539AE9" opacity="0.3"/>
                  <path d="M36 8 L28 8 L28 16 C28 24 32 28 40 28 L36 32 C30 32 28 26 28 20 L36 20 L36 8 Z" fill="#539AE9" opacity="0.3"/>
                </svg>
              </div>
              <p>"${item.cleanText.substring(0, 200)}..."</p>
            </div>
            
            <div class="body-columns">
              <div class="body-column">
                <p class="body-text">${item.cleanText.substring(0, Math.floor(item.cleanText.length / 2))}</p>
              </div>
              <div class="body-column">
                <p class="body-text">${item.cleanText.substring(Math.floor(item.cleanText.length / 2))}</p>
              </div>
            </div>
          ` : `
            <div class="article-empty">
              <p>Content saved. Visit the source link to read the full article.</p>
            </div>
          `}
          
          ${item.tags.length > 0 ? `
            <div class="article-tags">
              ${item.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="article-sidebar-right">
          <div class="toc-mini">
            <div class="toc-mini-label">IN THIS ISSUE</div>
            <div class="divider"></div>
            <div class="toc-mini-list">
              ${data.items.slice(0, 6).map((it, i) => `
                <div class="toc-mini-item ${i === index ? 'active' : ''}">
                  <span class="toc-mini-num">${String(i + 1).padStart(2, '0')}</span>
                  <span class="toc-mini-title">${it.title.substring(0, 25)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${item.url ? `
            <div class="source-box">
              <div class="source-label">SOURCE</div>
              <div class="divider"></div>
              <div class="source-domain">${item.domain}</div>
              <a href="${item.url}" class="source-link">${item.url.substring(0, 40)}...</a>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">ARTICLE ${String(index + 1).padStart(2, '0')}</div>
      </div>
    </div>
    `;
    pages.push(articleHTML);
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knowledge Collection - MNEMOAI</title>
  <style>
    ${generatePDFStyles()}
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>
  `.trim();
};

export const generateDebugReport = (data: PDFExportData): string => {
  return `
╔══════════════════════════════════════════════════════════════╗
║               PDF EXPORT DEBUG REPORT                       ║
╠══════════════════════════════════════════════════════════════╣
║ METADATA                                                     ║
║   Total Items: ${String(data.metadata.totalItems).padEnd(40)}║
║   Total Words: ${String(data.metadata.totalWords).padEnd(40)}║
║   Reading Time: ${String(data.metadata.totalReadingTime + ' minutes').padEnd(40)}║
║   Date Range: ${String(data.metadata.dateRange.start + ' - ' + data.metadata.dateRange.end).padEnd(40)}║
╠══════════════════════════════════════════════════════════════╣
║ CATEGORIES                                                   ║
${data.metadata.categories.map(c => `║   ${c.name}: ${String(c.count + ' (' + c.percentage + '%)').padEnd(46)}║`).join('')}
╠══════════════════════════════════════════════════════════════╣
║ TOP TAGS                                                     ║
${data.metadata.topTags.slice(0, 5).map(t => `║   #${t.tag}: ${String(t.count).padEnd(44)}║`).join('')}
╠══════════════════════════════════════════════════════════════╣
║ NARRATIVE                                                    ║
║   Introduction: ${data.narrative.introduction.substring(0, 38).padEnd(40)}║
${data.narrative.themes.map(t => `║   Theme: ${t.substring(0, 44).padEnd(46)}║`).join('')}
╠══════════════════════════════════════════════════════════════╣
║ ITEMS                                                        ║
${data.items.slice(0, 5).map((item, i) => `║   ${i + 1}. ${item.title.substring(0, 45).padEnd(47)}║`).join('')}
${data.items.length > 5 ? `║   ... and ${data.items.length - 5} more items`.padEnd(56) + '║' : ''}
╚══════════════════════════════════════════════════════════════╝
  `.trim();
};
