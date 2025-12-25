/**
 * AI Chatbot Service for Customer Support
 * Provides automated customer service across multiple channels
 */

import { GoogleGenAI } from "@google/genai";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface CustomerContext {
  customerId?: string;
  customerName?: string;
  orderHistory?: any[];
  cartItems?: any[];
  currentUrl?: string;
  platform?: 'website' | 'facebook' | 'whatsapp' | 'wechat' | 'douyin';
}

export class AIChatbotService {
  private ai: GoogleGenAI;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor(apiKey?: string) {
    this.ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });
  }

  async chat(
    message: string,
    sessionId: string,
    context?: CustomerContext
  ): Promise<string> {
    // Get or create conversation history
    let history = this.conversationHistory.get(sessionId) || [];

    // Add system instruction if this is a new conversation
    if (history.length === 0) {
      history.push({
        id: this.generateId(),
        role: 'system',
        content: this.buildSystemInstruction(context),
        timestamp: new Date().toISOString()
      });
    }

    // Add user message
    history.push({
      id: this.generateId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Build conversation context
    const conversationText = history
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? '用户' : '客服'}: ${m.content}`)
      .join('\n');

    const prompt = `${history[0].content}

对话历史:
${conversationText}

请以专业、友好、有帮助的语气回复用户的最新消息。如果需要推荐产品，请基于用户的需求和上下文。`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.9
      }
    });

    const assistantMessage = response.text || '抱歉，我暂时无法回答这个问题。';

    // Add assistant message to history
    history.push({
      id: this.generateId(),
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date().toISOString()
    });

    // Store updated history (keep last 20 messages)
    this.conversationHistory.set(
      sessionId,
      history.slice(-20)
    );

    return assistantMessage;
  }

  private buildSystemInstruction(context?: CustomerContext): string {
    let instruction = `你是一个专业的电商客服 AI 助手，负责为客户提供优质的服务。

你的职责：
1. 回答产品相关问题（特性、价格、库存、配送等）
2. 协助订单查询和跟踪
3. 处理售后问题和投诉
4. 推荐合适的产品
5. 提供优惠券和促销信息

服务准则：
- 始终保持专业、友好、耐心
- 快速准确地回答问题
- 主动提供有用的信息
- 在合适的时候推荐相关产品
- 遇到无法处理的问题时，引导客户联系人工客服

回复风格：
- 使用简洁明了的语言
- 适当使用 emoji 增加亲和力
- 根据平台调整语气（微信更随和，企业客户更正式）`;

    if (context) {
      if (context.customerName) {
        instruction += `\n\n当前客户：${context.customerName}`;
      }
      if (context.platform) {
        instruction += `\n当前平台：${context.platform}`;
      }
      if (context.cartItems && context.cartItems.length > 0) {
        instruction += `\n客户购物车中有 ${context.cartItems.length} 件商品`;
      }
      if (context.orderHistory && context.orderHistory.length > 0) {
        instruction += `\n客户有 ${context.orderHistory.length} 笔历史订单，是老客户`;
      }
    }

    return instruction;
  }

  async suggestProduct(userQuery: string, products: any[]): Promise<any[]> {
    const productList = products.map(p => 
      `${p.name} - ${p.description} (¥${p.price})`
    ).join('\n');

    const prompt = `用户咨询：${userQuery}

可推荐的产品：
${productList}

请从以上产品中选择最合适的 3 个推荐给用户，并说明推荐理由。
以 JSON 格式返回，格式：[{"productName": "产品名", "reason": "推荐理由"}]`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch {
      return [];
    }
  }

  async analyzeIntent(message: string): Promise<{
    intent: 'product_inquiry' | 'order_status' | 'complaint' | 'general' | 'purchase_intent';
    confidence: number;
    entities: string[];
  }> {
    const prompt = `分析以下用户消息的意图：

用户消息：${message}

返回 JSON 格式：
{
  "intent": "product_inquiry | order_status | complaint | general | purchase_intent",
  "confidence": 0.0-1.0,
  "entities": ["提取的关键实体，如产品名、订单号等"]
}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });

    try {
      return JSON.parse(response.text || '{"intent": "general", "confidence": 0.5, "entities": []}');
    } catch {
      return { intent: 'general', confidence: 0.5, entities: [] };
    }
  }

  async generateFollowUp(
    customerInfo: CustomerContext,
    daysSinceLastInteraction: number
  ): Promise<string> {
    let prompt = `为客户生成一条友好的跟进消息。

客户信息：`;

    if (customerInfo.customerName) {
      prompt += `\n- 姓名：${customerInfo.customerName}`;
    }
    if (customerInfo.orderHistory && customerInfo.orderHistory.length > 0) {
      prompt += `\n- 历史订单：${customerInfo.orderHistory.length} 笔`;
    }
    if (customerInfo.cartItems && customerInfo.cartItems.length > 0) {
      prompt += `\n- 购物车：${customerInfo.cartItems.length} 件商品未结算`;
    }

    prompt += `\n- 距离上次互动：${daysSinceLastInteraction} 天

生成一条个性化的跟进消息，鼓励客户回访或完成购买。`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.8 }
    });

    return response.text || '您好！好久不见，有什么可以帮助您的吗？';
  }

  clearHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }

  getHistory(sessionId: string): ChatMessage[] {
    return this.conversationHistory.get(sessionId) || [];
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }
}
