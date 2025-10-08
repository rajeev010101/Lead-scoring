import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) console.warn('OPENAI_API_KEY is not set; AI calls will fail.');

const client = new OpenAI({ apiKey: OPENAI_KEY });

/**
 * Ask the AI to classify intent and return mapped points & reasoning.
 * Maps: High=50, Medium=30, Low=10
 */
export const getAIIntent = async (lead, offer) => {
  // Build a concise prompt
  const prompt = `
You are an expert sales assistant. Given the Offer and Prospect data below,
classify the prospect's buying intent as exactly one of: High, Medium, or Low.
Then provide a one-sentence reasoning.

Offer:
Name: ${offer.name}
Value Props: ${(offer.value_props || []).join(', ')}
Ideal Use Cases: ${(offer.ideal_use_cases || []).join(', ')}

Prospect:
${JSON.stringify({
    name: lead.name,
    role: lead.role,
    company: lead.company,
    industry: lead.industry,
    location: lead.location,
    linkedin_bio: lead.linkedin_bio
  }, null, 2)}

Reply in the following format (only this):
Intent: <High|Medium|Low>
Reason: <one sentence explanation>
`;

  try {
    // Use chat completions (OpenAI SDK); model string can be adjusted per availability.
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // change if not available in your account
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    const text = response.choices?.[0]?.message?.content?.trim() || '';
    // parse Intent
    const intentMatch = text.match(/Intent:\s*(High|Medium|Low)/i);
    const intent = intentMatch ? intentMatch[1] : (/(High|Medium|Low)/i.exec(text) || ['Medium'])[0];

    const reasonMatch = text.match(/Reason:\s*(.*)/i);
    const reasoning = reasonMatch ? reasonMatch[1].trim() : text;

    const aiPoints = intent.toLowerCase() === 'high' ? 50 : intent.toLowerCase() === 'medium' ? 30 : 10;
    return { intent, aiPoints, reasoning };
  } catch (err) {
    console.error('AI error', err?.message || err);
    // Fallback default: Medium intent
    return { intent: 'Medium', aiPoints: 30, reasoning: 'AI error or timeout — defaulted to Medium' };
  }
};
