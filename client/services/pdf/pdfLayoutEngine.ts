import { ProcessedItem, PDFSection, PDFExportData, selectFeaturedItems, groupByCategory } from './pdfDataProcessor';

export type { PDFSection };

export type StoryFlow = 'chronological' | 'thematic' | 'importance' | 'mixed';

export interface LayoutConfig {
  flow: StoryFlow;
  itemsPerGridPage: number;
  showToc: boolean;
  showNarrative: boolean;
  featuredCount: number;
  includeStats: boolean;
}

export const defaultLayoutConfig: LayoutConfig = {
  flow: 'mixed',
  itemsPerGridPage: 4,
  showToc: true,
  showNarrative: true,
  featuredCount: 3,
  includeStats: true,
};

export const createLayoutPlan = (
  items: ProcessedItem[],
  config: LayoutConfig = defaultLayoutConfig
): PDFSection[] => {
  const sections: PDFSection[] = [];
  let pageNumber = 1;
  
  sections.push({
    type: 'cover',
    pageNumber: pageNumber++,
    items: [],
  });
  
  if (config.showNarrative) {
    sections.push({
      type: 'introduction',
      pageNumber: pageNumber++,
      items: [],
    });
  }
  
  if (config.showToc && items.length > 3) {
    sections.push({
      type: 'toc',
      pageNumber: pageNumber++,
      items: items.slice(0, 12),
    });
  }
  
  const featuredItems = selectFeaturedItems(items, config.featuredCount);
  featuredItems.forEach(item => {
    sections.push({
      type: 'featured',
      title: 'Featured',
      items: [item],
      pageNumber: pageNumber++,
    });
  });
  
  const remainingItems = items.filter(
    item => !featuredItems.some(f => f.id === item.id)
  );
  
  switch (config.flow) {
    case 'thematic':
      sections.push(...createThematicSections(remainingItems, config, pageNumber));
      break;
    
    case 'importance':
      sections.push(...createImportanceSections(remainingItems, config, pageNumber));
      break;
    
    case 'mixed':
      sections.push(...createMixedSections(remainingItems, config, pageNumber));
      break;
    
    case 'chronological':
    default:
      sections.push(...createChronologicalSections(remainingItems, config, pageNumber));
      break;
  }
  
  if (config.includeStats) {
    sections.push({
      type: 'summary',
      pageNumber: pageNumber++,
      items: [],
    });
  }
  
  return sections;
};

const createChronologicalSections = (
  items: ProcessedItem[],
  config: LayoutConfig,
  startPage: number
): PDFSection[] => {
  const sections: PDFSection[] = [];
  let pageNumber = startPage;
  
  const sorted = [...items].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  sorted.forEach((item, index) => {
    if (index > 0 && index % 3 === 0 && index < sorted.length - 1) {
      const gridItems = sorted.slice(index, Math.min(index + config.itemsPerGridPage, sorted.length));
      sections.push({
        type: 'grid',
        title: 'Quick Reads',
        items: gridItems,
        pageNumber: pageNumber++,
      });
    } else {
      sections.push({
        type: 'article',
        title: item.category,
        items: [item],
        pageNumber: pageNumber++,
      });
    }
  });
  
  return sections;
};

const createThematicSections = (
  items: ProcessedItem[],
  config: LayoutConfig,
  startPage: number
): PDFSection[] => {
  const sections: PDFSection[] = [];
  const groups = groupByCategory(items);
  let pageNumber = startPage;
  
  Object.entries(groups).forEach(([category, categoryItems]) => {
    sections.push({
      type: 'introduction',
      title: category,
      subtitle: `${categoryItems.length} articles`,
      items: [],
      pageNumber: pageNumber++,
    });
    
    categoryItems.forEach((item, index) => {
      if (index > 0 && index % 2 === 0 && index < categoryItems.length - 1) {
        const gridItems = categoryItems.slice(index, Math.min(index + config.itemsPerGridPage, categoryItems.length));
        sections.push({
          type: 'grid',
          title: `${category} Highlights`,
          items: gridItems,
          pageNumber: pageNumber++,
        });
      } else {
        sections.push({
          type: 'article',
          title: category,
          items: [item],
          pageNumber: pageNumber++,
        });
      }
    });
  });
  
  return sections;
};

const createImportanceSections = (
  items: ProcessedItem[],
  config: LayoutConfig,
  startPage: number
): PDFSection[] => {
  const sections: PDFSection[] = [];
  const pageNumber = { current: startPage };
  
  const high = items.filter(i => i.importance === 'high');
  const medium = items.filter(i => i.importance === 'medium');
  const low = items.filter(i => i.importance === 'low');
  
  if (high.length > 0) {
    sections.push({
      type: 'introduction',
      title: 'Deep Dives',
      subtitle: 'In-depth articles and comprehensive reads',
      items: [],
      pageNumber: pageNumber.current++,
    });
    
    high.forEach(item => {
      sections.push({
        type: 'featured',
        title: 'Deep Dive',
        items: [item],
        pageNumber: pageNumber.current++,
      });
    });
  }
  
  if (medium.length > 0) {
    sections.push({
      type: 'introduction',
      title: 'Essential Reading',
      subtitle: 'Core knowledge and important references',
      items: [],
      pageNumber: pageNumber.current++,
    });
    
    for (let i = 0; i < medium.length; i += 2) {
      const gridItems = medium.slice(i, Math.min(i + 2, medium.length));
      if (gridItems.length > 1) {
        sections.push({
          type: 'grid',
          title: 'Essential Reads',
          items: gridItems,
          pageNumber: pageNumber.current++,
        });
      } else {
        sections.push({
          type: 'article',
          title: 'Essential',
          items: gridItems,
          pageNumber: pageNumber.current++,
        });
      }
    }
  }
  
  if (low.length > 0) {
    const gridItems = low.slice(0, config.itemsPerGridPage);
    sections.push({
      type: 'grid',
      title: 'Quick References',
      subtitle: 'Brief notes and quick reads',
      items: gridItems,
      pageNumber: pageNumber.current++,
    });
  }
  
  return sections;
};

const createMixedSections = (
  items: ProcessedItem[],
  config: LayoutConfig,
  startPage: number
): PDFSection[] => {
  const sections: PDFSection[] = [];
  const pageNumber = { current: startPage };
  
  const sortedByImportance = [...items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.importance] - order[b.importance];
  });
  
  let articleCount = 0;
  
  sortedByImportance.forEach((item, index) => {
    const shouldShowGrid = 
      articleCount > 0 && 
      articleCount % 4 === 0 && 
      index < sortedByImportance.length - 2;
    
    if (shouldShowGrid) {
      const gridItems = sortedByImportance.slice(
        index, 
        Math.min(index + config.itemsPerGridPage, sortedByImportance.length)
      );
      
      if (gridItems.length > 1) {
        sections.push({
          type: 'grid',
          title: 'More Reads',
          items: gridItems,
          pageNumber: pageNumber.current++,
        });
        articleCount += gridItems.length;
        return;
      }
    }
    
    sections.push({
      type: 'article',
      title: item.category,
      items: [item],
      pageNumber: pageNumber.current++,
    });
    articleCount++;
  });
  
  return sections;
};

export const createNarrativeFlow = (
  data: PDFExportData,
  sections: PDFSection[]
): string => {
  const narrativeSections: string[] = [];
  
  narrativeSections.push(`
    <div class="narrative-flow">
      <div class="flow-indicator">
        ${svgComponents.timelineDot(true)}
        <div class="flow-line"></div>
        ${sections.filter(s => s.type === 'article' || s.type === 'featured').length > 1 ? svgComponents.timelineDot(false) : ''}
      </div>
    </div>
  `);
  
  return narrativeSections.join('');
};

export const getNextSection = (
  currentIndex: number,
  sections: PDFSection[]
): PDFSection | null => {
  return sections[currentIndex + 1] || null;
};

export const getPreviousSection = (
  currentIndex: number,
  sections: PDFSection[]
): PDFSection | null => {
  return sections[currentIndex - 1] || null;
};

export const calculateTotalPages = (sections: PDFSection[]): number => {
  return sections.length;
};

export const getSectionProgress = (
  currentIndex: number,
  totalSections: number
): { current: number; total: number; percentage: number } => {
  return {
    current: currentIndex + 1,
    total: totalSections,
    percentage: Math.round(((currentIndex + 1) / totalSections) * 100),
  };
};

export const groupItemsForGrid = (
  items: ProcessedItem[],
  groupSize: number = 4
): ProcessedItem[][] => {
  const groups: ProcessedItem[][] = [];
  
  for (let i = 0; i < items.length; i += groupSize) {
    groups.push(items.slice(i, Math.min(i + groupSize, items.length)));
  }
  
  return groups;
};

const svgComponents = {
  timelineDot: (active: boolean) => `
    <div style="
      width: ${active ? '12' : '8'}px; 
      height: ${active ? '12' : '8'}px; 
      border-radius: 50%; 
      background: ${active ? '#2655C7' : 'rgba(83, 154, 233, 0.3)'};
      ${active ? 'box-shadow: 0 0 12px rgba(38, 85, 199, 0.5);' : ''}
    "></div>
  `,
};
