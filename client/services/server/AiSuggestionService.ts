import Item from '@/models/Item';
import dbConnect from '@/lib/database';

export const getTagsByUserId = async (userId: string) => {
  await dbConnect();
  // Get latest 30 items for the specific user to extract tags from
  const items = await Item.find({ userId }).sort({ timestamp: -1 }).limit(30);
  const tagsSet = new Set<string>();
  
  items.forEach(item => {
    if (item.tags && typeof item.tags === 'string') {
      const splittedTags = item.tags.split(" ");
      splittedTags.forEach(tag => {
        if (tag.trim()) tagsSet.add(tag.trim());
      });
    }
  });

  return Array.from(tagsSet).slice(0, 20); // Limit to top 20 latest unique tags
};

export const generateSuggestionsByTags = async (tags: string[]) => {
  // Move AI suggestion logic here if needed (e.g. LLM calls)
  // For now, I'll check the original /suggestions/ route logic.
};
