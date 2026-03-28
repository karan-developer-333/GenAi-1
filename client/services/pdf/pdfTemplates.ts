import { ProcessedItem, PDFExportData } from './pdfDataProcessor';
import { PDFSection } from './pdfLayoutEngine';
import { formatExportDate, cleanText, getDomain } from './pdfTheme';
import { 
  svgComponents, 
  getSvgAsDataUri, 
  createDivider, 
  createTag, 
  createStatBox,
  createSectionHeader 
} from './svgComponents';

export const generateCoverPage = (data: PDFExportData): string => {
  const dateInfo = formatExportDate();
  const { metadata, narrative } = data;
  
  return `
    <div class="cover-page">
      <div class="cover-bg-pattern">
        <div class="pattern-circle circle-1"></div>
        <div class="pattern-circle circle-2"></div>
        <div class="pattern-lines"></div>
      </div>
      
      <div class="cover-header">
        <div class="cover-logo">
          <img src="${getSvgAsDataUri(svgComponents.logoDark)}" alt="MNEMOAI" />
        </div>
        <div class="cover-badge">KNOWLEDGE DIGEST</div>
      </div>
      
      <div class="cover-hero">
        <div class="cover-eyebrow">YOUR PERSONAL LIBRARY</div>
        <h1 class="cover-title">Knowledge<br/>Collection</h1>
        <div class="cover-ai-icon">
          <img src="${getSvgAsDataUri(svgComponents.neuralNetwork)}" alt="AI" />
        </div>
      </div>
      
      ${narrative.introduction ? `
        <div class="cover-intro">
          <p>${narrative.introduction}</p>
        </div>
      ` : ''}
      
      <div class="cover-stats">
        <div class="stat-card">
          <div class="stat-value">${metadata.totalItems}</div>
          <div class="stat-label">Articles</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-value">${metadata.totalReadingTime}</div>
          <div class="stat-label">Min Read</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${metadata.categories.length}</div>
          <div class="stat-label">Topics</div>
        </div>
      </div>
      
      ${metadata.categories.length > 0 ? `
        <div class="cover-categories">
          <div class="category-label">COLLECTION FOCUS</div>
          <div class="category-tags">
            ${metadata.categories.slice(0, 4).map(c => 
              `<span class="category-tag">${c.name}</span>`
            ).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="cover-footer">
        <div class="footer-date">${dateInfo.full}</div>
        <div class="footer-brand">MNEMOAI</div>
        <div class="footer-tagline">SAVE • ORGANIZE • REMEMBER</div>
      </div>
    </div>
  `;
};

export const generateIntroductionPage = (data: PDFExportData): string => {
  const { metadata, narrative } = data;
  
  return `
    <div class="content-page introduction-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">INTRODUCTION</div>
      </div>
      
      <div class="intro-content">
        <div class="intro-section">
          <h2 class="intro-title">Your Learning Journey</h2>
          ${createDivider('gradient')}
          
          ${narrative.introduction ? `
            <p class="intro-text">${narrative.introduction}</p>
          ` : ''}
          
          <div class="intro-meta">
            <div class="meta-item">
              <span class="meta-label">Date Range</span>
              <span class="meta-value">${metadata.dateRange.start} - ${metadata.dateRange.end}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Reading Time</span>
              <span class="meta-value">~${metadata.totalReadingTime} minutes</span>
            </div>
          </div>
        </div>
        
        ${narrative.themes.length > 0 ? `
          <div class="intro-section">
            <h3 class="section-title">Key Themes</h3>
            ${createDivider()}
            <div class="theme-list">
              ${narrative.themes.map((theme, i) => `
                <div class="theme-item">
                  <div class="theme-number">${String(i + 1).padStart(2, '0')}</div>
                  <div class="theme-text">${theme}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${narrative.insights.length > 0 ? `
          <div class="intro-section">
            <h3 class="section-title">Insights</h3>
            ${createDivider()}
            <div class="insights-list">
              ${narrative.insights.map(insight => `
                <div class="insight-item">
                  <div class="insight-icon">${svgComponents.checkmark}</div>
                  <div class="insight-text">${insight}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">Knowledge Digest</div>
      </div>
    </div>
  `;
};

export const generateTOCPage = (items: ProcessedItem[]): string => {
  return `
    <div class="content-page toc-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">TABLE OF CONTENTS</div>
      </div>
      
      <div class="toc-content">
        <div class="toc-header">
          <h2 class="toc-title">In This Issue</h2>
          <div class="toc-count">${items.length} articles</div>
        </div>
        
        ${createDivider('dots')}
        
        <div class="toc-list">
          ${items.map((item, i) => `
            <div class="toc-item ${i < 3 ? 'featured' : ''}">
              <div class="toc-number">${String(i + 1).padStart(2, '0')}</div>
              <div class="toc-info">
                <div class="toc-item-title">${cleanText(item.title, 60)}</div>
                <div class="toc-item-meta">
                  <span class="toc-category">${item.category}</span>
                  <span class="toc-dot">•</span>
                  <span class="toc-time">${item.readingTime} min</span>
                </div>
              </div>
              ${item.isVideo ? `<div class="toc-video-badge">VIDEO</div>` : ''}
            </div>
          `).join('')}
        </div>
        
        <div class="toc-footer-section">
          ${svgComponents.knowledgeGraph}
        </div>
      </div>
      
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">${items.length} Articles</div>
      </div>
    </div>
  `;
};

export const generateFeaturedPage = (
  item: ProcessedItem,
  index: number,
  total: number,
  allItems: ProcessedItem[]
): string => {
  const engagementHook = item.keyInsights[0] || item.excerpt.substring(0, 100);
  
  return `
    <div class="content-page featured-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">FEATURED • ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
      </div>
      
      <div class="featured-content">
        <div class="featured-label">
          <div class="featured-badge">FEATURED</div>
          <div class="featured-category">${item.category}</div>
        </div>
        
        <h1 class="featured-title">${cleanText(item.title, 120)}</h1>
        
        <div class="featured-hook">"${engagementHook}"</div>
        
        ${item.imageUrl ? `
          <div class="featured-image">
            <img src="${item.imageUrl}" alt="${item.title}" />
            <div class="image-overlay"></div>
          </div>
        ` : ''}
        
        <div class="featured-meta">
          <div class="meta-info">
            <span class="meta-date">${item.formattedDate}</span>
            <span class="meta-dot">•</span>
            <span class="meta-reading">${item.readingTime} min read</span>
          </div>
        </div>
        
        <div class="featured-body">
          <div class="body-columns">
            <div class="body-column">
              <p class="body-text">${cleanText(item.cleanText, 500)}</p>
            </div>
            <div class="body-column">
              ${item.cleanText.length > 500 ? `
                <p class="body-text">${cleanText(item.cleanText.substring(500), 500)}</p>
              ` : ''}
            </div>
          </div>
        </div>
        
        ${item.tags.length > 0 ? `
          <div class="featured-tags">
            ${item.tags.slice(0, 5).map(tag => createTag(tag)).join('')}
          </div>
        ` : ''}
        
        ${item.keyInsights.length > 1 ? `
          <div class="featured-insights">
            <div class="insights-label">KEY INSIGHTS</div>
            ${item.keyInsights.slice(1, 3).map(insight => `
              <div class="insight-point">
                <div class="insight-icon">${svgComponents.bulletPoint}</div>
                <div class="insight-text">${cleanText(insight, 150)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div class="page-footer">
        <div class="footer-left">${item.domain}</div>
        <div class="footer-rule"></div>
        <div class="footer-right">FEATURED ${String(index + 1).padStart(2, '0')}</div>
      </div>
    </div>
  `;
};

export const generateArticlePage = (
  item: ProcessedItem,
  index: number,
  total: number,
  allItems: ProcessedItem[]
): string => {
  return `
    <div class="content-page article-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
      </div>
      
      <div class="article-layout">
        <div class="article-sidebar-left">
          <div class="sidebar-category">${item.category}</div>
          <div class="sidebar-date">${item.formattedDate}</div>
          ${item.isVideo ? `<div class="sidebar-badge">VIDEO</div>` : ''}
          <div class="sidebar-reading">${item.readingTime} min</div>
        </div>
        
        <div class="article-main">
          <h1 class="article-title">${cleanText(item.title, 100)}</h1>
          
          ${item.imageUrl ? `
            <div class="article-image">
              <img src="${item.imageUrl}" alt="${item.title}" />
            </div>
          ` : ''}
          
          ${item.cleanText ? `
            <div class="article-pullquote">
              <div class="quote-icon">${svgComponents.quoteIcon}</div>
              <p>"${cleanText(item.cleanText, 180)}"</p>
            </div>
            
            <div class="article-body">
              <div class="body-columns">
                <div class="body-column">
                  <p class="body-text">${cleanText(item.cleanText, 600)}</p>
                </div>
                <div class="body-column">
                  ${item.cleanText.length > 600 ? `
                    <p class="body-text">${cleanText(item.cleanText.substring(600), 600)}</p>
                  ` : ''}
                </div>
              </div>
            </div>
          ` : `
            <div class="article-empty">
              <div class="empty-icon">${svgComponents.documentIcon}</div>
              <p>Content saved. Visit the source link to read the full article.</p>
            </div>
          `}
          
          ${item.tags.length > 0 ? `
            <div class="article-tags">
              ${item.tags.slice(0, 4).map(tag => createTag(tag)).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="article-sidebar-right">
          <div class="toc-mini">
            <div class="toc-mini-label">IN THIS ISSUE</div>
            ${createDivider()}
            <div class="toc-mini-list">
              ${allItems.slice(0, 6).map((it, i) => `
                <div class="toc-mini-item ${i === index ? 'active' : ''}">
                  <span class="toc-mini-num">${String(i + 1).padStart(2, '0')}</span>
                  <span class="toc-mini-title">${cleanText(it.title, 25)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${item.url ? `
            <div class="source-box">
              <div class="source-label">SOURCE</div>
              ${createDivider()}
              <div class="source-domain">${item.domain}</div>
              <a href="${item.url}" class="source-link">${cleanText(item.url, 40)}</a>
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
};

export const generateGridPage = (
  items: ProcessedItem[],
  sectionTitle?: string
): string => {
  const [primary, ...secondary] = items;
  
  return `
    <div class="content-page grid-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">QUICK READS</div>
      </div>
      
      <div class="grid-content">
        <div class="grid-header">
          <div class="grid-label">${sectionTitle || 'QUICK READS'}</div>
          <div class="grid-count">${items.length} articles</div>
        </div>
        
        ${createDivider()}
        
        <div class="grid-layout">
          ${primary ? `
            <div class="grid-main">
              <div class="grid-main-category">${primary.category}</div>
              <h2 class="grid-main-title">${cleanText(primary.title, 80)}</h2>
              
              ${primary.imageUrl ? `
                <div class="grid-main-image">
                  <img src="${primary.imageUrl}" alt="${primary.title}" />
                </div>
              ` : ''}
              
              <p class="grid-main-text">${cleanText(primary.cleanText, 350)}</p>
              
              <div class="grid-main-meta">
                <span class="meta-reading">${primary.readingTime} min read</span>
                ${primary.url ? `<a href="${primary.url}" class="grid-source">${primary.domain}</a>` : ''}
              </div>
            </div>
          ` : ''}
          
          <div class="grid-side">
            ${secondary.slice(0, 3).map(item => `
              <div class="grid-card">
                <div class="grid-card-category">${item.category}</div>
                <h3 class="grid-card-title">${cleanText(item.title, 50)}</h3>
                <p class="grid-card-text">${cleanText(item.cleanText, 100)}</p>
                <div class="grid-card-footer">
                  <span class="grid-card-time">${item.readingTime} min</span>
                  ${item.isVideo ? `<span class="grid-card-badge">VIDEO</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">QUICK READS</div>
      </div>
    </div>
  `;
};

export const generateSummaryPage = (data: PDFExportData): string => {
  const { metadata, narrative } = data;
  
  return `
    <div class="content-page summary-page">
      <div class="page-header">
        <div class="header-brand">MNEMOAI</div>
        <div class="header-rule"></div>
        <div class="header-nav">SUMMARY</div>
      </div>
      
      <div class="summary-content">
        <h2 class="summary-title">Collection Summary</h2>
        ${createDivider('gradient')}
        
        <div class="summary-stats">
          ${createStatBox(metadata.totalItems, 'Total Articles', true)}
          ${createStatBox(metadata.totalWords.toLocaleString(), 'Words', false)}
          ${createStatBox(metadata.totalReadingTime, 'Min Reading', true)}
        </div>
        
        ${narrative.conclusion ? `
          <div class="summary-section">
            <h3 class="section-title">Final Thoughts</h3>
            <p class="summary-text">${narrative.conclusion}</p>
          </div>
        ` : ''}
        
        <div class="summary-section">
          <h3 class="section-title">Content Breakdown</h3>
          ${createDivider()}
          
          <div class="breakdown-grid">
            <div class="breakdown-column">
              <div class="breakdown-label">By Category</div>
              ${metadata.categories.slice(0, 5).map(c => `
                <div class="breakdown-item">
                  <span class="breakdown-name">${c.name}</span>
                  <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width: ${c.percentage}%"></div>
                  </div>
                  <span class="breakdown-count">${c.count}</span>
                </div>
              `).join('')}
            </div>
            
            <div class="breakdown-column">
              <div class="breakdown-label">Top Tags</div>
              ${metadata.topTags.slice(0, 5).map(t => `
                <div class="breakdown-tag">
                  ${createTag(t.tag)}
                  <span class="tag-count">${t.count}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="summary-cta">
          <div class="cta-icon">${svgComponents.aiIcon}</div>
          <div class="cta-text">
            <p>Continue building your knowledge library with MNEMOAI</p>
            <a href="#" class="cta-link">Open App →</a>
          </div>
        </div>
      </div>
      
      <div class="page-footer">
        <div class="footer-left">MNEMOAI</div>
        <div class="footer-rule"></div>
        <div class="footer-right">END OF DIGEST</div>
      </div>
    </div>
  `;
};

export const generatePageFromSection = (
  section: PDFSection,
  data: PDFExportData,
  globalIndex: number
): string => {
  switch (section.type) {
    case 'cover':
      return generateCoverPage(data);
    
    case 'introduction':
      return generateIntroductionPage(data);
    
    case 'toc':
      return generateTOCPage(section.items.length > 0 ? section.items : data.items.slice(0, 12));
    
    case 'featured':
      return generateFeaturedPage(
        section.items[0],
        globalIndex,
        data.items.length,
        data.items
      );
    
    case 'article':
      return generateArticlePage(
        section.items[0],
        globalIndex,
        data.items.length,
        data.items
      );
    
    case 'grid':
      return generateGridPage(section.items, section.title);
    
    case 'summary':
      return generateSummaryPage(data);
    
    default:
      return '';
  }
};
