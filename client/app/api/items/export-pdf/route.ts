import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { getAuthUserId, unauthorizedResponse } from '@/lib/auth';
import { getAllItems } from '@/services/server/ItemService';

const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/google-chrome';

const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatShortDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const cleanText = (text: string, maxChars?: number): string => {
  if (!text) return '';
  const cleaned = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (maxChars && cleaned.length > maxChars) {
    return cleaned.substring(0, maxChars).trim() + '...';
  }
  return cleaned;
};

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const isYouTube = (url: string) => url?.includes('youtube') || url?.includes('youtu.be');

const generateCoverPage = (itemCount: number, exportDate: string) => {
  const month = new Date().toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  return `
    <div class="cover-page">
      <div class="cover-masthead">
        <div class="cover-line"></div>
        <h1 class="cover-title">THE CURATED<br/>EDIT</h1>
        <div class="cover-line"></div>
      </div>
      
      <div class="cover-layout">
        <div class="cover-left">
          <div class="cover-issue-info">
            <span class="issue-label">ISSUE</span>
            <span class="issue-vol">VOL 01</span>
            <div class="issue-line"></div>
            <span class="issue-date">${month} ${new Date().getFullYear()}</span>
            <div class="issue-line"></div>
            <span class="issue-count">${itemCount} ARTICLES</span>
          </div>
        </div>
        
        <div class="cover-center">
          <div class="cover-featured">
            <div class="featured-badge">FEATURED</div>
            <h2 class="featured-title">YOUR KNOWLEDGE<br/>COLLECTION</h2>
            <p class="featured-subtitle">Curated reads from your digital library</p>
          </div>
        </div>
        
        <div class="cover-right">
          <div class="toc-preview">
            <h3 class="toc-heading">IN THIS ISSUE</h3>
            <div class="toc-line"></div>
          </div>
        </div>
      </div>
      
      <div class="cover-footer">
        <span class="cover-brand">MNEMOAI</span>
        <span class="cover-tagline">SAVE • ORGANIZE • REMEMBER</span>
      </div>
    </div>
  `;
};

const generateArticlePage = (item: any, index: number, totalItems: number) => {
  const metaLine = item.tags ? item.tags.split(' ').slice(0, 3).join(' / ').toUpperCase() : 'ARTICLE';
  const isVideo = isYouTube(item.url);
  const videoId = isVideo ? getYouTubeVideoId(item.url) : null;
  const videoThumbnail = isVideo && videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  const imageSrc = videoThumbnail || item.imageUrl;
  const articleNum = String(index + 1).padStart(2, '0');
  
  return `
    <div class="article-page">
      <!-- Header -->
      <div class="article-header">
        <div class="header-left">
          <span class="masthead">THE CURATED EDIT</span>
        </div>
        <div class="header-center">
          <div class="header-rule"></div>
        </div>
        <div class="header-right">
          <span class="page-indicator">${articleNum} / ${String(totalItems).padStart(2, '0')}</span>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="article-layout">
        <!-- Left Sidebar -->
        <div class="article-sidebar-left">
          <div class="sidebar-meta">
            <span class="sidebar-category">${metaLine}</span>
            <div class="sidebar-line"></div>
            <span class="sidebar-date">${item.timestamp ? formatShortDate(item.timestamp) : ''}</span>
            <div class="sidebar-line"></div>
            ${isVideo ? '<span class="sidebar-badge">VIDEO</span>' : ''}
            <span class="sidebar-type">${item.type?.toUpperCase() || 'ARTICLE'}</span>
          </div>
        </div>
        
        <!-- Main Article -->
        <div class="article-main">
          <h1 class="article-title">${item.title}</h1>
          
          ${imageSrc ? `
            <div class="article-hero-image">
              <img src="${imageSrc}" alt="${item.imageAlt || item.title}" />
            </div>
          ` : ''}
          
          <!-- Two Column Body -->
          <div class="article-body">
            ${item.text ? `
              <div class="body-column">
                <p class="body-text">${cleanText(item.text, 600)}</p>
              </div>
              <div class="body-column">
                <p class="body-text">${cleanText(item.text.substring(600), 600)}</p>
              </div>
            ` : `
              <div class="body-column full">
                <p class="body-text empty-note">Content saved. Visit the source link to view the full article.</p>
              </div>
            `}
          </div>
          
          <!-- Pull Quote -->
          ${item.text && item.text.length > 100 ? `
            <div class="pull-quote">
              <p>"${cleanText(item.text, 150)}"</p>
            </div>
          ` : ''}
          
          <!-- Tags -->
          ${item.tags ? `
            <div class="article-tags">
              ${item.tags.split(' ').slice(0, 5).map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Right Sidebar -->
        <div class="article-sidebar-right">
          <div class="sidebar-toc">
            <h4 class="toc-title">INSIDE THIS ISSUE</h4>
            <div class="toc-divider"></div>
            <div class="toc-items">
              ${Array.from({length: Math.min(totalItems, 8)}, (_, i) => `
                <div class="toc-item ${i === index ? 'active' : ''}">
                  <span class="toc-num">${String(i + 1).padStart(2, '0')}</span>
                  <span class="toc-text">${i === index ? item.title.substring(0, 30) : 'Article ' + (i + 1)}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${item.url ? `
            <div class="source-box">
              <span class="source-label">SOURCE</span>
              <a href="${item.url}" class="source-link">${cleanText(item.url, 40)}</a>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Footer -->
      <div class="article-footer">
        <span class="footer-brand">MNEMOAI</span>
        <div class="footer-rule"></div>
        <span class="footer-issue">ISSUE 01</span>
      </div>
    </div>
  `;
};

const generateGridPage = (items: any[], startIndex: number) => {
  const [primary, ...secondary] = items;
  
  return `
    <div class="grid-page">
      <!-- Header -->
      <div class="article-header">
        <div class="header-left">
          <span class="masthead">THE CURATED EDIT</span>
        </div>
        <div class="header-center">
          <div class="header-rule"></div>
        </div>
        <div class="header-right">
          <span class="page-indicator">QUICK READS</span>
        </div>
      </div>
      
      <!-- Grid Layout -->
      <div class="grid-layout">
        <div class="grid-main">
          <span class="grid-category">${primary.tags?.split(' ')[0]?.toUpperCase() || 'FEATURED'}</span>
          <h2 class="grid-main-title">${primary.title}</h2>
          
          ${primary.imageUrl ? `
            <div class="grid-main-image">
              <img src="${primary.imageUrl}" alt="${primary.imageAlt || primary.title}" />
            </div>
          ` : ''}
          
          ${primary.text ? `
            <p class="grid-main-text">${cleanText(primary.text, 350)}</p>
          ` : ''}
          
          ${primary.url ? `
            <a href="${primary.url}" class="grid-source">${cleanText(primary.url, 50)}</a>
          ` : ''}
        </div>
        
        <div class="grid-side">
          ${secondary.slice(0, 2).map(item => `
            <div class="grid-side-item">
              <span class="grid-side-category">${item.tags?.split(' ')[0]?.toUpperCase() || 'ARTICLE'}</span>
              <h3 class="grid-side-title">${cleanText(item.title, 50)}</h3>
              ${item.text ? `<p class="grid-side-text">${cleanText(item.text, 100)}</p>` : ''}
              <div class="grid-side-line"></div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Footer -->
      <div class="article-footer">
        <span class="footer-brand">MNEMOAI</span>
        <div class="footer-rule"></div>
        <span class="footer-issue">ISSUE 01</span>
      </div>
    </div>
  `;
};

const generateHTML = (items: any[]) => {
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let pagesHTML = generateCoverPage(items.length, exportDate);
  
  let articleIndex = 0;
  for (let i = 0; i < items.length; i++) {
    if (i % 4 === 2 && i + 1 < items.length) {
      const gridItems = items.slice(i, i + Math.min(3, items.length - i));
      pagesHTML += generateGridPage(gridItems, articleIndex);
      i += gridItems.length - 1;
    } else {
      pagesHTML += generateArticlePage(items[i], articleIndex, items.length);
    }
    articleIndex++;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #fff;
      color: #1a1a1a;
    }
    
    .cover-page {
      width: 210mm;
      height: 297mm;
      padding: 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #fafafa;
    }
    
    .cover-masthead {
      text-align: center;
      margin-bottom: 40px;
    }
    .cover-line {
      width: 60%;
      height: 1px;
      background: #1a1a1a;
      margin: 15px auto;
    }
    .cover-title {
      font-size: 42px;
      font-weight: normal;
      letter-spacing: 8px;
      color: #1a1a1a;
      line-height: 1.2;
    }
    
    .cover-layout {
      flex: 1;
      display: flex;
      margin-top: 20px;
    }
    .cover-left {
      width: 15%;
      border-right: 1px solid #ddd;
      padding-right: 15px;
    }
    .cover-issue-info {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 10px;
      letter-spacing: 2px;
    }
    .issue-label {
      color: #888;
    }
    .issue-vol {
      font-size: 14px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .issue-line {
      width: 1px;
      height: 20px;
      background: #ccc;
    }
    .issue-date, .issue-count {
      color: #666;
      font-size: 9px;
    }
    
    .cover-center {
      width: 55%;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cover-featured {
      text-align: center;
    }
    .featured-badge {
      font-size: 8px;
      letter-spacing: 3px;
      color: #888;
      margin-bottom: 20px;
    }
    .featured-title {
      font-size: 36px;
      font-weight: normal;
      letter-spacing: 4px;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    .featured-subtitle {
      font-size: 12px;
      color: #888;
      letter-spacing: 1px;
    }
    
    .cover-right {
      width: 30%;
      padding-left: 20px;
      border-left: 1px solid #ddd;
    }
    .toc-heading {
      font-size: 10px;
      letter-spacing: 2px;
      color: #888;
      margin-bottom: 10px;
    }
    .toc-line {
      width: 100%;
      height: 1px;
      background: #ddd;
    }
    
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      border-top: 1px solid #ddd;
      margin-top: auto;
    }
    .cover-brand {
      font-size: 18px;
      letter-spacing: 6px;
      font-weight: normal;
    }
    .cover-tagline {
      font-size: 9px;
      letter-spacing: 3px;
      color: #888;
    }
    
    /* Article Page */
    .article-page {
      width: 210mm;
      height: 297mm;
      padding: 40px 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      page-break-after: always;
    }
    
    .article-header {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
    }
    .header-left {
      width: 20%;
    }
    .masthead {
      font-size: 9px;
      letter-spacing: 2px;
      color: #1a1a1a;
    }
    .header-center {
      width: 60%;
      padding: 0 20px;
    }
    .header-rule {
      height: 1px;
      background: #1a1a1a;
    }
    .header-right {
      width: 20%;
      text-align: right;
    }
    .page-indicator {
      font-size: 9px;
      letter-spacing: 1px;
      color: #888;
    }
    
    .article-layout {
      flex: 1;
      display: flex;
      gap: 20px;
    }
    
    .article-sidebar-left {
      width: 8%;
    }
    .sidebar-meta {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      font-size: 7px;
      letter-spacing: 1px;
      color: #888;
    }
    .sidebar-line {
      width: 1px;
      height: 15px;
      background: #ddd;
    }
    .sidebar-category {
      color: #1a1a1a;
      font-weight: bold;
    }
    .sidebar-badge {
      background: #1a1a1a;
      color: #fff;
      padding: 2px 4px;
      font-size: 6px;
    }
    
    .article-main {
      width: 57%;
      padding-right: 20px;
      border-right: 1px solid #eee;
    }
    .article-title {
      font-size: 28px;
      font-weight: normal;
      line-height: 1.2;
      color: #1a1a1a;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }
    
    .article-hero-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .article-hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .article-body {
      display: flex;
      gap: 20px;
    }
    .body-column {
      width: 50%;
    }
    .body-column.full {
      width: 100%;
    }
    .body-text {
      font-size: 10px;
      line-height: 1.8;
      color: #444;
      margin-bottom: 12px;
      font-family: Georgia, serif;
    }
    .body-text.empty-note {
      font-style: italic;
      color: #888;
      background: #f5f5f5;
      padding: 15px;
      border-left: 2px solid #ddd;
    }
    
    .pull-quote {
      margin: 25px 0;
      padding: 20px;
      border-left: 3px solid #1a1a1a;
      background: #fafafa;
    }
    .pull-quote p {
      font-size: 14px;
      font-style: italic;
      line-height: 1.6;
      color: #1a1a1a;
    }
    
    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
    }
    .tag {
      font-size: 8px;
      padding: 4px 10px;
      background: #f0f0f0;
      letter-spacing: 1px;
      color: #666;
    }
    
    .article-sidebar-right {
      width: 15%;
      padding-left: 15px;
    }
    .sidebar-toc {
      margin-bottom: 30px;
    }
    .toc-title {
      font-size: 8px;
      letter-spacing: 1.5px;
      color: #888;
      margin-bottom: 8px;
      font-family: Arial, sans-serif;
    }
    .toc-divider {
      height: 1px;
      background: #ddd;
      margin-bottom: 10px;
    }
    .toc-items {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .toc-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 8px;
    }
    .toc-item.active {
      color: #1a1a1a;
    }
    .toc-item:not(.active) {
      color: #aaa;
    }
    .toc-num {
      font-weight: bold;
    }
    .toc-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .source-box {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }
    .source-label {
      font-size: 7px;
      letter-spacing: 1px;
      color: #888;
      display: block;
      margin-bottom: 5px;
    }
    .source-link {
      font-size: 7px;
      color: #666;
      text-decoration: none;
      word-break: break-all;
    }
    
    .article-footer {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-top: 20px;
      margin-top: auto;
    }
    .footer-brand {
      font-size: 12px;
      letter-spacing: 4px;
    }
    .footer-rule {
      flex: 1;
      height: 1px;
      background: #ddd;
    }
    .footer-issue {
      font-size: 9px;
      color: #888;
      letter-spacing: 1px;
    }
    
    /* Grid Page */
    .grid-page {
      width: 210mm;
      height: 297mm;
      padding: 40px 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      page-break-after: always;
    }
    
    .grid-layout {
      flex: 1;
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }
    
    .grid-main {
      width: 60%;
      padding-right: 25px;
      border-right: 1px solid #eee;
    }
    .grid-category {
      font-size: 8px;
      letter-spacing: 2px;
      color: #888;
      display: block;
      margin-bottom: 10px;
    }
    .grid-main-title {
      font-size: 22px;
      font-weight: normal;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 15px;
    }
    .grid-main-image {
      width: 100%;
      height: 160px;
      overflow: hidden;
      margin-bottom: 15px;
    }
    .grid-main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .grid-main-text {
      font-size: 10px;
      line-height: 1.7;
      color: #444;
      font-family: Georgia, serif;
    }
    .grid-source {
      font-size: 7px;
      color: #888;
      text-decoration: none;
      margin-top: 10px;
      display: block;
    }
    
    .grid-side {
      width: 40%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .grid-side-item {
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }
    .grid-side-item:last-child {
      border-bottom: none;
    }
    .grid-side-category {
      font-size: 7px;
      letter-spacing: 1px;
      color: #888;
      display: block;
      margin-bottom: 5px;
    }
    .grid-side-title {
      font-size: 14px;
      font-weight: normal;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .grid-side-text {
      font-size: 9px;
      line-height: 1.6;
      color: #666;
      font-family: Georgia, serif;
    }
    .grid-side-line {
      height: 1px;
      background: #eee;
      margin-top: 10px;
    }
  </style>
</head>
<body>
${pagesHTML}
</body>
</html>
  `;
};

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId(req);
  if (!userId) return unauthorizedResponse();

  try {
    const items = await getAllItems(userId);
    
    if (items.length === 0) {
      return NextResponse.json({ error: 'No items to export' }, { status: 400 });
    }

    const formattedItems = items.map(item => ({
      _id: item._id,
      type: item.type,
      sourceType: item.sourceType,
      url: item.url,
      title: item.title,
      text: item.text,
      tags: item.tags,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      timestamp: item.timestamp,
    }));

    const html = generateHTML(formattedItems);

    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mnemoai-export-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
