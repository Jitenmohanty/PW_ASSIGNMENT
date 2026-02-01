import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSmartTags(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Act as a personal knowledge assistant. Analyze the following note and suggest 3-5 relevant, short organizational tags. 
    Return ONLY a comma-separated list of tags. Do not include numbered lists, quotes, or conversational text.
    
    Content: "${content}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log("Gemini Raw response (Tags):", text);

    // Filter out potential markdown formatting or prefix text
    const cleanText = text.replace(/[^a-zA-Z0-9,\s]/g, "");
    const tags = cleanText
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 5);
    
    return tags;
  } catch (error) {
    console.error("Gemini Error (Tags):", error);
    return [];
  }
}

export async function generateIdeaSummary(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Provide a concise one-sentence summary for the following thought/idea: "${content}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    return text.replace(/^["']|["']$/g, ''); // Remove outer quotes if any
  } catch (error) {
    console.error("Gemini Error (Summary):", error);
    return "";
  }
}
