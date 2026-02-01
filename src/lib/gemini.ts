import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSmartTags(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Based on the following content, suggest 3-5 relevant short tags for organization. Return only the tags as a comma-separated list: "${content}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split(",").map(tag => tag.trim());
  } catch (error) {
    console.error("Gemini Error (Tags):", error);
    return [];
  }
}

export async function generateIdeaSummary(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Provide a concise one-sentence summary for the following thought/idea: "${content}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error("Gemini Error (Summary):", error);
    return "";
  }
}
