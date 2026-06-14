
import { GoogleGenAI } from "@google/genai";

export const generateIcebreaker = async (name: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a single, engaging, and unique icebreaker question for a person named "${name}" who is introducing themselves to a group. 
  The question should be friendly, creative, and encourage a memorable answer. 
  Avoid generic questions like "what do you do". Instead, ask about passions, interesting experiences, or unique perspectives.
  Format: Return only the question text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "If you could have any superpower for just one hour, what would it be and why?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "What is one thing you're currently curious about or learning?";
  }
};
