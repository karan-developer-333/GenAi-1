const { Mistral } = require('@mistralai/mistralai');
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

const SYSTEM_PROMPT_FOR_TAG_GENERATION = `
You are an Expert ai for generating tags suggestions for save in our app user saves a data then you have to analyse it and generate tags suggestions for it you have to provide only tags in the response not any other text Example : 

Input : 
{
  url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
  title: 'Artificial intelligence - Wikipedia',
  sourceType: 'article',
  selectedText: 'Artificial intelligence (AI) is the capability of computational systems to perform tasks typically associated with human intelligence, such as learning, reasoning, problem-solving, perception, and decision-making. It is a field of research in computer science that develops and studies methods and software that enable machines to perceive their environment and use learning and intelligence to take actions that maximize their chances of achieving defined goals.[1]',
  note: null, <--- this was the tag containing field
}

(output must be a string of tags separated by spaces)
Output : 
artificial-intelligence ai machine-learning computer-science intelligent-systems learning reasoning problem-solving perception decision-making automation computational-systems technology research software-development

`

const SYSTEM_PROMPT_FOR_TAG_SUGGESTIONS = `
You are an expert technical tag generator.

TASK:
Analyze the input tags and generate a list of UNIQUE, high-value related tags that expand knowledge.

STRICT RULES:
- Output ONLY tags separated by spaces. No explanations, no bullets, no extra text.
- Generate MAXIMUM 10-15 suggestions TOTAL for the entire input.
- Each suggestion should be 1-3 keywords.
- Use lowercase words separated by spaces.
- Do NOT repeat or rephrase input tags.
- Tags must be closely related but introduce NEW concepts.
- Focus on technical, educational, or advanced topics.

EXAMPLE:

Input: ["react", "frontend", "seo"]
Output: nextjs virtual-dom core-web-vitals server-components hydration client-side-rendering sematic-html metadata-optimization
`;

const completionArgs = {
    temperature: 0.7,
    maxTokens: 200,
    topP: 1
};


async function generateTags(itemData) {
  const messages = [
    {
        "role": "user",
        "content": JSON.stringify(itemData)
    }
  ];
  const response = await client.beta.conversations.start({
    inputs: messages,
    model: 'devstral-medium-latest',
    instructions: SYSTEM_PROMPT_FOR_TAG_GENERATION,
    ...completionArgs,
  });
  console.log(response.outputs[0].content)
  return response.outputs[0].content;
}

async function getRelatedTags(tags) {
  const messages = [
    {
        "role": "user",
        "content": JSON.stringify(tags)
    }
  ];
  const response = await client.beta.conversations.start({
    inputs: messages,
    model: 'devstral-medium-latest',
    instructions: SYSTEM_PROMPT_FOR_TAG_SUGGESTIONS,
    ...completionArgs,
  });
  console.log(response.outputs[0].content)
  return response.outputs[0].content;
}

module.exports = {
  generateTags,
  getRelatedTags
};

