import { PDFExportData, ProcessedItem } from './pdfDataProcessor';

export interface AIPromptConfig {
  includeNarrative: boolean;
  includeInsights: boolean;
  includeConnections: boolean;
  storytellingStyle: 'professional' | 'casual' | 'academic' | 'creative';
  tone: 'formal' | 'friendly' | 'enthusiastic' | 'neutral';
  highlightKeywords: boolean;
}

export const defaultPromptConfig: AIPromptConfig = {
  includeNarrative: true,
  includeInsights: true,
  includeConnections: true,
  storytellingStyle: 'professional',
  tone: 'friendly',
  highlightKeywords: true,
};

export const generateSystemPrompt = (
  config: AIPromptConfig = defaultPromptConfig
): string => {
  const styleInstructions = getStyleInstructions(config.storytellingStyle);
  const toneInstructions = getToneInstructions(config.tone);
  
  return `You are an expert knowledge curator and editorial designer for a premium PDF magazine-style knowledge digest called MNEMOAI.

${styleInstructions}

${toneInstructions}

Your role is to transform raw knowledge items into an engaging, narrative-driven document that tells a story about the user's learning journey.

KEY PRINCIPLES:
1. Create a coherent narrative flow - each section should naturally lead to the next
2. Highlight connections between different pieces of knowledge
3. Use the user's saved content to reveal patterns and themes in their learning
4. Balance depth (featured articles) with breadth (quick reads)
5. Make the document feel personal and curated, not just a dump of links

STRUCTURE GUIDELINES:
- Cover page: Set the stage with a compelling overview
- Introduction: Present the "story" of this collection
- Featured articles: Deep dives into the most important content
- Quick reads: Efficient browsing of additional content
- Summary: Key takeaways and reflections

OUTPUT FORMAT:
Always return valid JSON when generating content summaries or narratives.
Use concise, magazine-style writing.
Maximum 2-3 sentences for summaries.
Bullet points should be brief (under 15 words).

THEME COLORS (for design reference):
- Primary: #2655C7 (deep blue)
- Accent: #539AE9 (sky blue)
- Background: #F5F8FF (light) / #010419 (dark)
- Text: #09153C (dark) / #FFFFFF (light)

Keep all generated content within these constraints.`;
};

export const generateItemAnalysisPrompt = (item: ProcessedItem): string => {
  return `Analyze this knowledge item for the PDF export:

Title: ${item.title}
Category: ${item.category}
Tags: ${item.tags.join(', ')}
Excerpt: ${item.excerpt.substring(0, 300)}

Return JSON with:
{
  "engagementHook": "1 sentence that captures attention (use as subheading)",
  "keyPoints": ["array of 2-3 key takeaways"],
  "whyItMatters": "1 sentence explaining relevance to the broader collection",
  "relatedThemes": ["array of 2-3 themes this connects to"]
}

Keep language concise and engaging.`;
};

export const generateCollectionInsightsPrompt = (
  items: ProcessedItem[],
  metadata: PDFExportData['metadata']
): string => {
  const topItems = items.slice(0, 5).map((item, i) => 
    `${i + 1}. "${item.title}" - ${item.category}`
  ).join('\n');
  
  return `Analyze this knowledge collection and generate insights:

Collection Stats:
- Total items: ${metadata.totalItems}
- Categories: ${metadata.categories.map(c => `${c.name} (${c.count})`).join(', ')}
- Date range: ${metadata.dateRange.start} to ${metadata.dateRange.end}
- Reading time: ~${metadata.totalReadingTime} minutes

Top Items:
${topItems}

Return JSON:
{
  "collectionStory": "2-3 sentences telling the story of this collection",
  "keyThemes": ["array of 3-4 main themes"],
  "unexpectedConnections": ["array of 2-3 interesting connections between items"],
  "growthAreas": ["array of 2-3 observations about areas of focus"],
  "recommendations": ["array of 2-3 suggestions for future learning"]
}

Make insights actionable and specific to this collection.`;
};

export const generateSectionTransitionPrompt = (
  previousSection: string,
  nextSection: string,
  itemCount: number
): string => {
  return `Generate a brief transition between PDF sections:

Coming from: ${previousSection} section
Going to: ${nextSection} section
Items remaining: ${itemCount}

Return JSON:
{
  "transitionText": "1-2 sentence transition (or null if no transition needed)",
  "continueStory": "boolean - should this transition be included"
}

The transition should maintain narrative flow and reader engagement.`;
};

export const generatePullQuotePrompt = (item: ProcessedItem): string => {
  return `Extract a compelling pull quote from this content:

Title: ${item.title}
Content: ${item.cleanText.substring(0, 800)}

Return JSON:
{
  "quote": "most impactful 1-2 sentences (max 100 chars)",
  "context": "brief context for the quote (or null if not needed)"
}

Choose quotes that are memorable and capture the essence of the content.`;
};

export const generateTableOfContentsPrompt = (
  items: ProcessedItem[],
  maxItems: number = 10
): string => {
  const previewItems = items.slice(0, maxItems).map(item => ({
    title: item.title.substring(0, 50),
    category: item.category,
  }));
  
  return `Create a compelling table of contents introduction:

Items in this collection:
${previewItems.map((item, i) => `${i + 1}. ${item.title} [${item.category}]`).join('\n')}

Return JSON:
{
  "tocIntro": "2-3 sentence introduction to the contents",
  "highlights": ["array of 3-5 items to highlight as must-reads"]
}

Make it inviting and help readers prioritize.`;
};

const getStyleInstructions = (style: AIPromptConfig['storytellingStyle']): string => {
  switch (style) {
    case 'professional':
      return `STYLE: Professional Editorial
- Clean, sophisticated language
- Focus on substance and clarity
- Magazine-quality presentation
- Balance depth with accessibility`;
    
    case 'casual':
      return `STYLE: Casual & Conversational
- Friendly, approachable tone
- Conversational language
- Make complex topics accessible
- Use relatable analogies`;
    
    case 'academic':
      return `STYLE: Academic & Thoughtful
- Rigorous analysis
- Focus on intellectual depth
- Cite connections and frameworks
- Challenge assumptions`;
    
    case 'creative':
      return `STYLE: Creative & Engaging
- Vivid descriptions
- Storytelling techniques
- Metaphors and imagery
- Emotional engagement`;
    
    default:
      return '';
  }
};

const getToneInstructions = (tone: AIPromptConfig['tone']): string => {
  switch (tone) {
    case 'formal':
      return `TONE: Formal
- Professional vocabulary
- Objective presentation
- Respectful distance
- Authoritative voice`;
    
    case 'friendly':
      return `TONE: Friendly
- Warm and approachable
- Inclusive language ("you", "your")
- Encouraging and supportive
- Personal connection`;
    
    case 'enthusiastic':
      return `TONE: Enthusiastic
- Energetic and dynamic
- Express genuine interest
- Celebrate discoveries
- Inspiring language`;
    
    case 'neutral':
      return `TONE: Neutral
- Balanced perspective
- Objective information
- Minimal emotional language
- Informational focus`;
    
    default:
      return '';
  }
};

export const createCustomInstructions = (
  userPreferences: Partial<AIPromptConfig>,
  additionalContext?: string
): string => {
  const basePrompt = generateSystemPrompt({
    ...defaultPromptConfig,
    ...userPreferences,
  });
  
  if (additionalContext) {
    return `${basePrompt}

ADDITIONAL CONTEXT:
${additionalContext}`;
  }
  
  return basePrompt;
};

export const PDF_AI_SYSTEM_PROMPT = generateSystemPrompt();

export const PDF_AI_USER_CONTEXT = `You are generating content for a premium PDF knowledge magazine. The document should feel like a curated publication, not a list of bookmarks. Every element should contribute to a cohesive narrative about the user's learning and discovery.`;
