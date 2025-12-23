
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are a World-Class Senior Frontend Engineer specializing in React and Tailwind CSS.
Your goal is to generate high-quality, standalone React components based on user requirements.

Rules:
1. Always use TypeScript (.tsx).
2. Use Tailwind CSS for all styling. Do not use external CSS files.
3. Ensure the component is responsive, accessible, and follows best practices.
4. Provide the output as a JSON object containing:
   - 'componentName': The PascalCase name of the primary component.
   - 'files': An array of files. Usually, this is just one main file (e.g., ComponentName.tsx), but include others if supporting utilities or sub-components are needed.
5. Do not include markdown code blocks in your JSON response.
6. Use Lucide React icons for any iconography needs.
7. Focus on a single, well-defined component unless a full layout is explicitly requested.

Example Output Structure:
{
  "componentName": "PricingCard",
  "files": [
    { "path": "PricingCard.tsx", "content": "..." }
  ]
}
`;

export const generateFrontendProject = async (prompt: string): Promise<GenerationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            componentName: { 
              type: Type.STRING,
              description: "The name of the generated React component in PascalCase."
            },
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["componentName", "files"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"componentName": "Unknown", "files": []}');
    return data as GenerationResult;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
