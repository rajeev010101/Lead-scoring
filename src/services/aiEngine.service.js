import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAILeadScore = async (lead, offer) => {
  const prompt = `
You are a lead scoring assistant.
Return JSON like this:
{
  "intent": "High | Medium | Low",
  "score": number,
  "reasoning": "short explanation"
}
Lead: ${JSON.stringify(lead)}
Offer: ${JSON.stringify(offer)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a lead scoring expert." },
        { role: "user", content: prompt },
      ],
    });

    let raw = response.choices?.[0]?.message?.content?.trim() || "";

    console.log("🔹 Raw Groq AI response:", raw);

    // ✅ Clean code fences
    raw = raw.replace(/```json|```/g, "").trim();

    // ✅ Extract only the JSON part (if extra text)
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const jsonString = raw.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(jsonString);
    return parsed;

  } catch (error) {
    console.error("❌ Groq AI error:", error.message);
    return {
      intent: "Medium",
      score: 70,
      reasoning: "AI service unavailable or invalid JSON format.",
    };
  }
};
