/**
 * AI Copywriting Service
 * Generates ad copy, headlines, descriptions, and CTAs using Gemini AI
 */

import { GoogleGenAI, Type } from "@google/genai";
import { AdType, AdPlatform } from "../../types";

export interface CopywritingInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sellingPoints: string[];
  platform: AdPlatform;
  adType: AdType;
  tone?: 'professional' | 'casual' | 'urgent' | 'emotional';
  language?: string;
}

export interface GeneratedCopy {
  headlines: string[];
  descriptions: string[];
  callToActions: string[];
  longFormCopy?: string;
}

export class AICopywritingService {
  private ai: GoogleGenAI;

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });
  }

  async generateAdCopy(input: CopywritingInput): Promise<GeneratedCopy> {
    const prompt = this.buildCopywritingPrompt(input);

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "10 attention-grabbing headlines"
            },
            descriptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "10 compelling descriptions"
            },
            callToActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "10 persuasive CTAs"
            },
            longFormCopy: {
              type: Type.STRING,
              description: "Extended marketing copy"
            }
          },
          required: ["headlines", "descriptions", "callToActions"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }

  private buildCopywritingPrompt(input: CopywritingInput): string {
    const tone = input.tone || 'professional';
    const language = input.language || 'Chinese (Simplified)';
    
    return `You are a world-class advertising copywriter specializing in ${input.platform} ${input.adType} ads.

Product: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Key Selling Points: ${input.sellingPoints.join(', ')}
Tone: ${tone}
Language: ${language}

Generate high-converting ad copy optimized for ${input.platform}:

1. **Headlines** (10 variations):
   - Attention-grabbing
   - Highlight main benefit
   - Include power words
   - 30-60 characters for ${input.platform}

2. **Descriptions** (10 variations):
   - Emphasize unique value propositions
   - Address customer pain points
   - Create urgency or scarcity
   - Platform-optimized length

3. **Call-to-Actions** (10 variations):
   - Action-oriented
   - Create urgency
   - Platform-specific best practices

4. **Long-form Copy** (1 version):
   - Comprehensive product story
   - Emotional connection
   - Social proof elements
   - Strong closing

Make it native to the language and culturally appropriate. For Chinese market, use persuasive techniques that resonate with local consumers.`;
  }

  async translateCopy(copy: GeneratedCopy, targetLanguages: string[]): Promise<Record<string, GeneratedCopy>> {
    const translations: Record<string, GeneratedCopy> = {};

    for (const language of targetLanguages) {
      const prompt = `Translate and localize the following ad copy to ${language}. 
Maintain persuasive power and cultural appropriateness:

Headlines: ${copy.headlines.join('\n')}
Descriptions: ${copy.descriptions.join('\n')}
CTAs: ${copy.callToActions.join('\n')}

Return the translations in the same JSON format.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
              descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
              callToActions: { type: Type.ARRAY, items: { type: Type.STRING } },
              longFormCopy: { type: Type.STRING }
            }
          }
        }
      });

      translations[language] = JSON.parse(response.text || '{}');
    }

    return translations;
  }

  async optimizeCopy(originalCopy: string, performanceData: { ctr: number, conversions: number }): Promise<string> {
    const prompt = `You are an ad optimization expert. Analyze this ad copy and its performance:

Original Copy: ${originalCopy}
Click-Through Rate: ${performanceData.ctr}%
Conversions: ${performanceData.conversions}

Generate an improved version that addresses weaknesses and amplifies what works.
Focus on increasing engagement and conversions.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.8 }
    });

    return response.text || originalCopy;
  }
}
