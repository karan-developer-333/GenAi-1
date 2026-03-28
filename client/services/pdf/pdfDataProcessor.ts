import { Mistral } from '@mistralai/mistralai';
import { cleanText, formatReadingTime, formatItemDate, getDomain, isYouTubeUrl } from './pdfTheme';

export interface ProcessedItem {
  id: string;
  title: string;
  text: string;
  cleanText: string;
  tags: string[];
  url: string;
  domain: string;
  imageUrl: string | null;
  sourceType: string;
  type: string;
  timestamp: string;
  formattedDate: string;
  readingTime: number;
  wordCount: number;
  isVideo: boolean;
  videoId: string | null;
  importance: 'high' | 'medium' | 'low';
  category: string;
  summary: string;
  keyInsights: string[];
  excerpt: string;
}

export interface PDFSection {
  type: 'cover' | 'introduction' | 'featured' | 'article' | 'grid' | 'summary' | 'toc';
  title?: string;
  subtitle?: string;
  items: ProcessedItem[];
  pageNumber: number;
}

export interface PDFExportData {
  items: ProcessedItem[];
  metadata: {
    totalItems: number;
    totalWords: number;
    totalReadingTime: number;
    dateRange: {
      start: string;
      end: string;
    };
    categories: {
      name: string;
      count: number;
      percentage: number;
    }[];
    sourceTypes: {
      type: string;
      count: number;
    }[];
    topTags: {
      tag: string;
      count: number;
    }[];
    hasImages: boolean;
    hasVideos: boolean;
  };
  narrative: {
    introduction: string;
    themes: string[];
    connections: {
      item1Id: string;
      item2Id: string;
      connection: string;
    }[];
    insights: string[];
    conclusion: string;
  };
  layout: {
    sections: PDFSection[];
    flow: 'chronological' | 'thematic' | 'importance' | 'mixed';
  };
}

const mistralApiKey = process.env.MISTRAL_API_KEY;

const mistral = mistralApiKey ? new Mistral({ apiKey: mistralApiKey }) : null;

export const processItem = (item: any): ProcessedItem => {
  const text = item.text || '';
  const clean = cleanText(text);
  const words = clean.split(/\s+/).filter(Boolean);
  
  const { isVideo, videoId } = isYouTubeUrl(item.url || '');
  
  const tags = item.tags 
    ? item.tags.split(' ').filter(Boolean).slice(0, 8)
    : [];
  
  const category = tags[0] || item.sourceType || 'Article';
  
  let importance: 'high' | 'medium' | 'low' = 'medium';
  if (clean.length > 1000) importance = 'high';
  else if (clean.length < 100) importance = 'low';
  
  let summary = '';
  let keyInsights: string[] = [];
  let excerpt = '';
  
  if (clean.length > 50) {
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    summary = sentences.slice(0, 3).join(' ').substring(0, 300);
    if (summary.length === 300) summary += '...';
    
    excerpt = clean.substring(0, 150) + (clean.length > 150 ? '...' : '');
    
    if (sentences.length > 2) {
      keyInsights = sentences.slice(0, 2).map(s => s.trim()).filter(s => s.length > 20);
    }
  }
  
  return {
    id: item._id,
    title: cleanText(item.title, 100),
    text: text,
    cleanText: clean,
    tags,
    url: item.url || '',
    domain: getDomain(item.url || ''),
    imageUrl: item.imageUrl || (isVideo && videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null),
    sourceType: item.sourceType || 'article',
    type: item.type || 'text',
    timestamp: item.timestamp,
    formattedDate: formatItemDate(item.timestamp),
    readingTime: formatReadingTime(clean),
    wordCount: words.length,
    isVideo,
    videoId,
    importance,
    category,
    summary,
    keyInsights,
    excerpt,
  };
};

export const calculateMetadata = (items: ProcessedItem[]) => {
  const totalWords = items.reduce((sum, item) => sum + item.wordCount, 0);
  const totalReadingTime = Math.ceil(totalWords / 200);
  
  const categoryCounts: Record<string, number> = {};
  const sourceTypeCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  
  let hasImages = false;
  let hasVideos = false;
  let earliestDate = '';
  let latestDate = '';
  
  items.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    sourceTypeCounts[item.sourceType] = (sourceTypeCounts[item.sourceType] || 0) + 1;
    
    item.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    if (item.imageUrl) hasImages = true;
    if (item.isVideo) hasVideos = true;
    
    if (!earliestDate || item.timestamp < earliestDate) {
      earliestDate = item.timestamp;
    }
    if (!latestDate || item.timestamp > latestDate) {
      latestDate = item.timestamp;
    }
  });
  
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / items.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
  
  const sourceTypes = Object.entries(sourceTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalItems: items.length,
    totalWords,
    totalReadingTime,
    dateRange: {
      start: earliestDate ? formatItemDate(earliestDate) : '',
      end: latestDate ? formatItemDate(latestDate) : '',
    },
    categories,
    sourceTypes,
    topTags,
    hasImages,
    hasVideos,
  };
};

export const generateNarrativeWithAI = async (items: ProcessedItem[], metadata: any): Promise<{
  introduction: string;
  themes: string[];
  connections: { item1Id: string; item2Id: string; connection: string }[];
  insights: string[];
  conclusion: string;
}> => {
  if (!mistral || items.length === 0) {
    return generateFallbackNarrative(items, metadata);
  }
  
  try {
    const itemsSummary = items.slice(0, 10).map(item => ({
      title: item.title,
      tags: item.tags,
      excerpt: item.excerpt.substring(0, 200),
    }));
    
    const prompt = `You are an AI knowledge curator creating a compelling narrative for a knowledge collection PDF export.
    
You are creating a PDF export for a user's personal knowledge library. The PDF will be a beautifully designed magazine-style document.

CONTEXT:
- Total items: ${metadata.totalItems}
- Categories: ${metadata.categories.map((c: any) => `${c.name} (${c.count})`).join(', ')}
- Date range: ${metadata.dateRange.start} to ${metadata.dateRange.end}
- Total reading time: ~${metadata.totalReadingTime} minutes

ITEMS (top 10):
${itemsSummary.map((item, i) => `${i + 1}. "${item.title}" - Tags: ${item.tags.join(', ')} - ${item.excerpt.substring(0, 100)}...`).join('\n')}

Generate a JSON response with this exact structure:
{
  "introduction": "2-3 sentences welcoming the user to their knowledge collection, mentioning what types of content they have saved",
  "themes": ["array of 3-4 main themes/topics that emerge from the collection"],
  "connections": ["array of 2-3 interesting connections between items in the collection"],
  "insights": ["array of 3-4 interesting observations about the collection"],
  "conclusion": "2-3 sentences wrapping up the collection, encouraging the user to continue learning"
}

Keep everything concise and magazine-style. Return ONLY valid JSON.`;

    const chatResponse = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'system',
          content: 'You are a creative knowledge curator. Generate engaging, magazine-style content introductions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 800,
    });
    
    const rawContent = chatResponse.choices?.[0]?.message?.content;
    const content = typeof rawContent === 'string' ? rawContent : '';
    
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          introduction: parsed.introduction || '',
          themes: Array.isArray(parsed.themes) ? parsed.themes : [],
          connections: Array.isArray(parsed.connections) 
            ? parsed.connections.map((c: string, i: number) => ({ item1Id: items[0]?.id || '', item2Id: items[1]?.id || '', connection: c }))
            : [],
          insights: Array.isArray(parsed.insights) ? parsed.insights : [],
          conclusion: parsed.conclusion || '',
        };
      }
    }
  } catch (error) {
    console.error('AI narrative generation failed:', error);
  }
  
  return generateFallbackNarrative(items, metadata);
};

const generateFallbackNarrative = (items: ProcessedItem[], metadata: any) => {
  const topCategories = metadata.categories.slice(0, 3);
  
  const introduction = `Welcome to your curated knowledge collection. This digest brings together ${metadata.totalItems} saved items from your personal library, spanning ${topCategories.map((c: any) => c.name).join(', ')} and covering approximately ${metadata.totalReadingTime} minutes of reading material.`;
  
  const themes = topCategories.map((c: any) => c.name);
  
  const insights = [
    `Your collection contains ${metadata.totalItems} items across ${metadata.categories.length} different categories.`,
    metadata.hasVideos ? 'You have saved video content alongside articles, showing a diverse approach to learning.' : 'Your collection focuses primarily on written content.',
    metadata.totalReadingTime > 30 
      ? `With approximately ${metadata.totalReadingTime} minutes of content, this represents a substantial body of knowledge.` 
      : `A focused collection perfect for quick reference and review.`,
  ];
  
  const conclusion = `This collection represents your ongoing journey of learning and discovery. Continue building your knowledge library to uncover more connections and insights.`;
  
  return {
    introduction,
    themes,
    connections: [],
    insights,
    conclusion,
  };
};

export const generateItemSummaryWithAI = async (item: ProcessedItem): Promise<{
  summary: string;
  keyInsights: string[];
}> => {
  if (!mistral || item.cleanText.length < 100) {
    return {
      summary: item.summary || item.excerpt,
      keyInsights: item.keyInsights,
    };
  }
  
  try {
    const prompt = `Summarize this content in 2-3 concise sentences, then extract 1-2 key insights or takeaways:

Title: ${item.title}
Content: ${item.cleanText.substring(0, 1000)}

Return JSON:
{
  "summary": "2-3 sentence summary",
  "keyInsights": ["insight 1", "insight 2"]
}`;

    const chatResponse = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      maxTokens: 300,
    });
    
    const rawContent = chatResponse.choices?.[0]?.message?.content;
    const content = typeof rawContent === 'string' ? rawContent : '';
    
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || item.summary,
          keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : item.keyInsights,
        };
      }
    }
  } catch (error) {
    console.error('AI item summary failed:', error);
  }
  
  return {
    summary: item.summary,
    keyInsights: item.keyInsights,
  };
};

export const processAllItems = (rawItems: any[]): ProcessedItem[] => {
  return rawItems.map(processItem);
};

export const sortItems = (
  items: ProcessedItem[],
  sortBy: 'chronological' | 'importance' | 'category' = 'chronological'
): ProcessedItem[] => {
  const sorted = [...items];
  
  switch (sortBy) {
    case 'chronological':
      return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    case 'importance':
      const importanceOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
    
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    
    default:
      return sorted;
  }
};

export const groupByCategory = (items: ProcessedItem[]): Record<string, ProcessedItem[]> => {
  return items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, ProcessedItem[]>);
};

export const selectFeaturedItems = (items: ProcessedItem[], count: number = 3): ProcessedItem[] => {
  const sorted = sortItems(items, 'importance');
  const featured = sorted.slice(0, Math.min(count, items.length));
  
  if (featured.length < count) {
    const remaining = sorted.slice(count);
    const chronological = sortItems(remaining, 'chronological');
    while (featured.length < count && chronological.length > 0) {
      featured.push(chronological.shift()!);
    }
  }
  
  return featured;
};

export const logDataFormats = (items: any[]) => {
  console.log('\n📊 PDF Export Data Analysis');
  console.log('═'.repeat(50));
  console.log(`Total items: ${items.length}`);
  
  if (items.length > 0) {
    const sample = items[0];
    console.log('\n📋 Sample Item Structure:');
    console.log('-'.repeat(30));
    Object.keys(sample).forEach(key => {
      const value = sample[key];
      const type = typeof value;
      let length = '';
      
      if (type === 'string') {
        length = ` (length: ${value.length})`;
      } else if (Array.isArray(value)) {
        length = ` (items: ${value.length})`;
      }
      
      console.log(`  ${key}: ${type}${length}`);
    });
    
    console.log('\n📈 Data Lengths:');
    console.log('-'.repeat(30));
    
    const textLengths = items.map(i => i.text?.length || 0);
    const titleLengths = items.map(i => i.title?.length || 0);
    const tagLengths = items.map(i => i.tags?.length || 0);
    
    console.log(`  Title lengths: min=${Math.min(...titleLengths)}, max=${Math.max(...titleLengths)}, avg=${Math.round(titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length)}`);
    console.log(`  Text lengths: min=${Math.min(...textLengths)}, max=${Math.max(...textLengths)}, avg=${Math.round(textLengths.reduce((a, b) => a + b, 0) / textLengths.length)}`);
    console.log(`  Tag lengths: min=${Math.min(...tagLengths)}, max=${Math.max(...tagLengths)}, avg=${Math.round(tagLengths.reduce((a, b) => a + b, 0) / tagLengths.length)}`);
    
    const sourceTypes = items.reduce((acc, i) => {
      acc[i.sourceType || 'unknown'] = (acc[i.sourceType || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📂 Source Types:');
    console.log('-'.repeat(30));
    Object.entries(sourceTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} items`);
    });
    
    const types = items.reduce((acc, i) => {
      acc[i.type || 'unknown'] = (acc[i.type || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📑 Content Types:');
    console.log('-'.repeat(30));
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} items`);
    });
    
    const totalWords = items.reduce((sum, i) => sum + (i.text?.split(/\s+/).length || 0), 0);
    const totalChars = items.reduce((sum, i) => sum + (i.text?.length || 0), 0);
    
    console.log('\n📝 Content Statistics:');
    console.log('-'.repeat(30));
    console.log(`  Total words: ${totalWords.toLocaleString()}`);
    console.log(`  Total characters: ${totalChars.toLocaleString()}`);
    console.log(`  Estimated reading time: ${Math.ceil(totalWords / 200)} minutes`);
  }
  
  console.log('\n' + '═'.repeat(50) + '\n');
};
