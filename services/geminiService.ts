
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;

export const aiService = {
  async getModelResponse(prompt: string, imageBase64?: string, language: string = 'English') {
    if (!apiKey) throw new Error("API Key is missing");
    const ai = new GoogleGenAI({ apiKey });
    
    const parts: any[] = [{ text: `Respond in ${language}. ${prompt}` }];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.split(',')[1] || imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    
    return response.text;
  },

  async generateSummary(text: string, imageBase64?: string) {
    const prompt = `Please provide a concise and clear summary of the following content. Highlight key concepts and learning points: \n\n${text}`;
    return this.getModelResponse(prompt, imageBase64);
  },

  async generateQuiz(text: string, count: number = 5): Promise<any[]> {
    if (!apiKey) throw new Error("API Key is missing");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a quiz with ${count} multiple choice questions based on the following text. Return as JSON array of objects with 'question', 'options' (array of 4 strings), and 'correctAnswer' (index 0-3). \n\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  },

  async generateFlashcards(text: string): Promise<any[]> {
    if (!apiKey) throw new Error("API Key is missing");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 flashcards from the following text. Return as JSON array of objects with 'front' and 'back'. \n\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING },
              back: { type: Type.STRING }
            },
            required: ["front", "back"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse flashcards JSON", e);
      return [];
    }
  }
};
