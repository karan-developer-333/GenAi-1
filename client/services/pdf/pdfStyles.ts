export const generatePDFStyles = (): string => {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
    
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
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #fff;
      color: #09153C;
      line-height: 1.6;
    }
    
    /* ═══════════════════════════════════════════
       COVER PAGE
       ═══════════════════════════════════════════ */
    .cover-page {
      width: 210mm;
      height: 297mm;
      padding: 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #010419 0%, #09153C 100%);
      overflow: hidden;
    }
    
    .cover-bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    
    .pattern-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(83, 154, 233, 0.1);
    }
    
    .circle-1 {
      width: 400px;
      height: 400px;
      top: -100px;
      right: -100px;
      background: radial-gradient(circle, rgba(38, 85, 199, 0.1) 0%, transparent 70%);
    }
    
    .circle-2 {
      width: 300px;
      height: 300px;
      bottom: -50px;
      left: -50px;
      background: radial-gradient(circle, rgba(83, 154, 233, 0.1) 0%, transparent 70%);
    }
    
    .pattern-lines {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(90deg, transparent 49.5%, rgba(83, 154, 233, 0.05) 49.5%, rgba(83, 154, 233, 0.05) 50.5%, transparent 50.5%),
        linear-gradient(0deg, transparent 49.5%, rgba(83, 154, 233, 0.05) 49.5%, rgba(83, 154, 233, 0.05) 50.5%, transparent 50.5%);
      background-size: 60px 60px;
    }
    
    .cover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }
    
    .cover-logo img {
      height: 40px;
      width: auto;
    }
    
    .cover-badge {
      font-size: 8px;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }
    
    .cover-hero {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .cover-eyebrow {
      font-size: 10px;
      letter-spacing: 4px;
      color: #539AE9;
      margin-bottom: 20px;
      font-weight: 500;
    }
    
    .cover-title {
      font-family: 'Poppins', sans-serif;
      font-size: 52px;
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
      letter-spacing: -1px;
      margin-bottom: 30px;
    }
    
    .cover-ai-icon {
      margin-top: 20px;
      opacity: 0.4;
    }
    
    .cover-ai-icon img {
      width: 200px;
      height: auto;
    }
    
    .cover-intro {
      max-width: 500px;
      margin: 0 auto 40px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .cover-intro p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
      font-style: italic;
    }
    
    .cover-stats {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }
    
    .stat-card {
      text-align: center;
      padding: 20px 30px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(83, 154, 233, 0.2);
      border-radius: 12px;
    }
    
    .stat-card.highlight {
      background: linear-gradient(135deg, rgba(38, 85, 199, 0.3), rgba(83, 154, 233, 0.2));
      border-color: rgba(83, 154, 233, 0.4);
    }
    
    .stat-value {
      font-family: 'Poppins', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 9px;
      letter-spacing: 2px;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
    }
    
    .cover-categories {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }
    
    .category-label {
      font-size: 8px;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.4);
      margin-bottom: 12px;
    }
    
    .category-tags {
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .category-tag {
      padding: 6px 14px;
      background: rgba(83, 154, 233, 0.15);
      border: 1px solid rgba(83, 154, 233, 0.3);
      border-radius: 20px;
      font-size: 10px;
      color: #539AE9;
      font-weight: 500;
    }
    
    .cover-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      border-top: 1px solid rgba(83, 154, 233, 0.2);
      position: relative;
      z-index: 1;
    }
    
    .footer-date {
      font-size: 9px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .footer-brand {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 4px;
    }
    
    .footer-tagline {
      font-size: 8px;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.4);
    }
    
    /* ═══════════════════════════════════════════
       CONTENT PAGES (shared styles)
       ═══════════════════════════════════════════ */
    .content-page {
      width: 210mm;
      height: 297mm;
      padding: 40px 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #F5F8FF;
      page-break-after: always;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(83, 154, 233, 0.2);
    }
    
    .header-brand {
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #2655C7;
      letter-spacing: 2px;
      width: 20%;
    }
    
    .header-rule {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(83, 154, 233, 0.3), transparent);
    }
    
    .header-nav {
      font-size: 8px;
      letter-spacing: 2px;
      color: #4B6C8F;
      width: 20%;
      text-align: right;
    }
    
    .page-footer {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-top: 15px;
      margin-top: auto;
      border-top: 1px solid rgba(83, 154, 233, 0.15);
    }
    
    .footer-left {
      font-size: 9px;
      color: #4B6C8F;
      width: 30%;
    }
    
    .footer-right {
      font-size: 9px;
      color: #4B6C8F;
      width: 30%;
      text-align: right;
    }
    
    .footer-rule {
      flex: 1;
      height: 1px;
      background: rgba(83, 154, 233, 0.2);
    }
    
    /* ═══════════════════════════════════════════
       INTRODUCTION PAGE
       ═══════════════════════════════════════════ */
    .introduction-page .intro-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .intro-section {
      margin-bottom: 20px;
    }
    
    .intro-title {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 600;
      color: #09153C;
      margin-bottom: 15px;
    }
    
    .intro-text {
      font-size: 12px;
      color: #4B6C8F;
      line-height: 1.8;
      margin-bottom: 20px;
    }
    
    .intro-meta {
      display: flex;
      gap: 40px;
    }
    
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .meta-label {
      font-size: 8px;
      letter-spacing: 2px;
      color: #7A8BA3;
      text-transform: uppercase;
    }
    
    .meta-value {
      font-size: 12px;
      color: #2655C7;
      font-weight: 500;
    }
    
    .section-title {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: #09153C;
      margin-bottom: 12px;
    }
    
    .theme-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .theme-item {
      display: flex;
      align-items: baseline;
      gap: 15px;
    }
    
    .theme-number {
      font-family: 'Poppins', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #2655C7;
      opacity: 0.5;
    }
    
    .theme-text {
      font-size: 11px;
      color: #4B6C8F;
    }
    
    .insights-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .insight-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .insight-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }
    
    .insight-text {
      font-size: 10px;
      color: #4B6C8F;
      line-height: 1.6;
    }
    
    /* ═══════════════════════════════════════════
       TABLE OF CONTENTS
       ═══════════════════════════════════════════ */
    .toc-page .toc-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .toc-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 20px;
    }
    
    .toc-title {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      font-weight: 600;
      color: #09153C;
    }
    
    .toc-count {
      font-size: 10px;
      color: #7A8BA3;
    }
    
    .toc-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .toc-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 12px 15px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    
    .toc-item.featured {
      background: linear-gradient(135deg, rgba(38, 85, 199, 0.05), rgba(83, 154, 233, 0.05));
      border-left-color: #2655C7;
    }
    
    .toc-number {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #2655C7;
      opacity: 0.6;
      width: 30px;
    }
    
    .toc-info {
      flex: 1;
    }
    
    .toc-item-title {
      font-size: 11px;
      color: #09153C;
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .toc-item-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 8px;
      color: #7A8BA3;
    }
    
    .toc-dot {
      opacity: 0.5;
    }
    
    .toc-video-badge {
      font-size: 7px;
      padding: 3px 8px;
      background: #2655C7;
      color: #fff;
      border-radius: 4px;
      font-weight: 600;
    }
    
    .toc-footer-section {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      opacity: 0.3;
    }
    
    /* ═══════════════════════════════════════════
       FEATURED PAGE
       ═══════════════════════════════════════════ */
    .featured-page .featured-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .featured-label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }
    
    .featured-badge {
      font-size: 8px;
      letter-spacing: 2px;
      color: #fff;
      background: linear-gradient(135deg, #2655C7, #539AE9);
      padding: 4px 12px;
      border-radius: 4px;
      font-weight: 600;
    }
    
    .featured-category {
      font-size: 9px;
      letter-spacing: 2px;
      color: #539AE9;
      font-weight: 500;
    }
    
    .featured-title {
      font-family: 'Poppins', sans-serif;
      font-size: 32px;
      font-weight: 600;
      color: #09153C;
      line-height: 1.2;
      margin-bottom: 15px;
    }
    
    .featured-hook {
      font-size: 14px;
      font-style: italic;
      color: #2655C7;
      margin-bottom: 20px;
      padding-left: 15px;
      border-left: 3px solid #539AE9;
    }
    
    .featured-image {
      width: 100%;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
      position: relative;
    }
    
    .featured-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(transparent, rgba(9, 21, 60, 0.3));
    }
    
    .featured-meta {
      margin-bottom: 20px;
    }
    
    .featured-body {
      flex: 1;
    }
    
    .featured-insights {
      margin-top: 20px;
      padding: 15px;
      background: rgba(38, 85, 199, 0.05);
      border-radius: 8px;
    }
    
    .insights-label {
      font-size: 8px;
      letter-spacing: 2px;
      color: #2655C7;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .insight-point {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .insight-point .insight-icon {
      width: 12px;
      height: 12px;
    }
    
    .insight-point .insight-text {
      font-size: 9px;
      color: #4B6C8F;
    }
    
    /* ═══════════════════════════════════════════
       ARTICLE PAGE
       ═══════════════════════════════════════════ */
    .article-page .article-layout {
      flex: 1;
      display: flex;
      gap: 25px;
    }
    
    .article-sidebar-left {
      width: 8%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      padding-top: 10px;
    }
    
    .sidebar-category {
      font-size: 7px;
      letter-spacing: 1.5px;
      color: #2655C7;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-weight: 600;
    }
    
    .sidebar-date {
      font-size: 6px;
      color: #7A8BA3;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    
    .sidebar-badge {
      font-size: 6px;
      padding: 3px 6px;
      background: #2655C7;
      color: #fff;
      border-radius: 3px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    
    .sidebar-reading {
      font-size: 6px;
      color: #7A8BA3;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    
    .article-main {
      flex: 1;
      padding-right: 20px;
      border-right: 1px solid rgba(83, 154, 233, 0.15);
    }
    
    .article-title {
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 600;
      color: #09153C;
      line-height: 1.25;
      margin-bottom: 15px;
    }
    
    .article-image {
      width: 100%;
      height: 140px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 15px;
    }
    
    .article-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .article-pullquote {
      background: linear-gradient(135deg, rgba(38, 85, 199, 0.05), rgba(83, 154, 233, 0.05));
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    
    .quote-icon {
      flex-shrink: 0;
      width: 30px;
      opacity: 0.5;
    }
    
    .article-pullquote p {
      font-size: 11px;
      font-style: italic;
      color: #2655C7;
      line-height: 1.6;
    }
    
    .article-empty {
      text-align: center;
      padding: 30px;
      background: rgba(83, 154, 233, 0.05);
      border-radius: 8px;
    }
    
    .empty-icon {
      margin-bottom: 10px;
      opacity: 0.3;
    }
    
    .article-empty p {
      font-size: 10px;
      color: #7A8BA3;
      font-style: italic;
    }
    
    .article-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 15px;
    }
    
    .article-sidebar-right {
      width: 18%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .toc-mini-label {
      font-size: 7px;
      letter-spacing: 2px;
      color: #2655C7;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .toc-mini-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .toc-mini-item {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 7px;
    }
    
    .toc-mini-item.active {
      color: #09153C;
      font-weight: 500;
    }
    
    .toc-mini-item:not(.active) {
      color: #7A8BA3;
    }
    
    .toc-mini-num {
      font-weight: 600;
      color: #2655C7;
      opacity: 0.7;
    }
    
    .toc-mini-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .source-box {
      margin-top: auto;
    }
    
    .source-label {
      font-size: 7px;
      letter-spacing: 2px;
      color: #2655C7;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .source-domain {
      font-size: 8px;
      color: #4B6C8F;
      margin-bottom: 4px;
    }
    
    .source-link {
      font-size: 7px;
      color: #539AE9;
      text-decoration: none;
      word-break: break-all;
      display: block;
    }
    
    /* ═══════════════════════════════════════════
       GRID PAGE
       ═══════════════════════════════════════════ */
    .grid-page .grid-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .grid-label {
      font-size: 10px;
      letter-spacing: 2px;
      color: #2655C7;
      font-weight: 600;
    }
    
    .grid-count {
      font-size: 9px;
      color: #7A8BA3;
    }
    
    .grid-layout {
      flex: 1;
      display: flex;
      gap: 30px;
    }
    
    .grid-main {
      flex: 1.2;
      padding-right: 25px;
      border-right: 1px solid rgba(83, 154, 233, 0.15);
    }
    
    .grid-main-category {
      font-size: 8px;
      letter-spacing: 2px;
      color: #2655C7;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .grid-main-title {
      font-family: 'Poppins', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #09153C;
      line-height: 1.3;
      margin-bottom: 15px;
    }
    
    .grid-main-image {
      width: 100%;
      height: 120px;
      border-radius: 8px;
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
      color: #4B6C8F;
      line-height: 1.7;
      margin-bottom: 15px;
    }
    
    .grid-main-meta {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .meta-reading {
      font-size: 8px;
      color: #7A8BA3;
    }
    
    .grid-source {
      font-size: 8px;
      color: #539AE9;
      text-decoration: none;
    }
    
    .grid-side {
      flex: 0.8;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .grid-card {
      padding: 15px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 8px;
      border-top: 2px solid #2655C7;
    }
    
    .grid-card-category {
      font-size: 7px;
      letter-spacing: 1.5px;
      color: #539AE9;
      margin-bottom: 6px;
      font-weight: 600;
    }
    
    .grid-card-title {
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #09153C;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    
    .grid-card-text {
      font-size: 9px;
      color: #4B6C8F;
      line-height: 1.6;
      margin-bottom: 10px;
    }
    
    .grid-card-footer {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .grid-card-time {
      font-size: 7px;
      color: #7A8BA3;
    }
    
    .grid-card-badge {
      font-size: 6px;
      padding: 2px 6px;
      background: #2655C7;
      color: #fff;
      border-radius: 3px;
    }
    
    /* ═══════════════════════════════════════════
       SUMMARY PAGE
       ═══════════════════════════════════════════ */
    .summary-page .summary-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .summary-title {
      font-family: 'Poppins', sans-serif;
      font-size: 28px;
      font-weight: 600;
      color: #09153C;
      margin-bottom: 15px;
    }
    
    .summary-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-section {
      margin-bottom: 25px;
    }
    
    .summary-text {
      font-size: 11px;
      color: #4B6C8F;
      line-height: 1.8;
    }
    
    .breakdown-grid {
      display: flex;
      gap: 40px;
    }
    
    .breakdown-column {
      flex: 1;
    }
    
    .breakdown-label {
      font-size: 8px;
      letter-spacing: 2px;
      color: #2655C7;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .breakdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    
    .breakdown-name {
      font-size: 9px;
      color: #4B6C8F;
      width: 80px;
    }
    
    .breakdown-bar {
      flex: 1;
      height: 4px;
      background: rgba(83, 154, 233, 0.1);
      border-radius: 2px;
    }
    
    .breakdown-fill {
      height: 100%;
      background: linear-gradient(90deg, #2655C7, #539AE9);
      border-radius: 2px;
    }
    
    .breakdown-count {
      font-size: 8px;
      color: #7A8BA3;
      width: 20px;
      text-align: right;
    }
    
    .breakdown-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    .tag-count {
      font-size: 8px;
      color: #7A8BA3;
    }
    
    .summary-cta {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(38, 85, 199, 0.1), rgba(83, 154, 233, 0.05));
      border-radius: 12px;
      margin-top: auto;
    }
    
    .cta-icon {
      flex-shrink: 0;
    }
    
    .cta-text {
      flex: 1;
    }
    
    .cta-text p {
      font-size: 11px;
      color: #09153C;
      margin-bottom: 8px;
    }
    
    .cta-link {
      font-size: 10px;
      color: #2655C7;
      text-decoration: none;
      font-weight: 500;
    }
    
    /* ═══════════════════════════════════════════
       SHARED UTILITIES
       ═══════════════════════════════════════════ */
    .body-columns {
      display: flex;
      gap: 20px;
    }
    
    .body-column {
      flex: 1;
    }
    
    .body-text {
      font-size: 10px;
      color: #4B6C8F;
      line-height: 1.85;
      margin-bottom: 12px;
    }
    
    /* Tag styles */
    .tag {
      display: inline-block;
      padding: 3px 8px;
      background: rgba(83, 154, 233, 0.1);
      border: 1px solid rgba(83, 154, 233, 0.2);
      border-radius: 4px;
      font-size: 7px;
      letter-spacing: 1px;
      color: #539AE9;
    }
    
    /* Divider styles */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(83, 154, 233, 0.3), transparent);
      margin: 15px 0;
    }
    
    .divider-dots {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 15px 0;
    }
    
    .divider-dots::before,
    .divider-dots::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(83, 154, 233, 0.3));
    }
    
    .divider-dots::after {
      background: linear-gradient(90deg, rgba(83, 154, 233, 0.3), transparent);
    }
    
    .divider-gradient {
      height: 1px;
      background: linear-gradient(90deg, transparent, #539AE9, #2655C7, #539AE9, transparent);
      margin: 20px 0;
    }
  `;
};
