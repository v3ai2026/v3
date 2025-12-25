/**
 * 广告笔记本服务
 * Ad Notebook Service - Manage advertising records and notes
 */

export interface AdNote {
  id: string;
  campaignId?: string;
  title: string;
  content: string;
  category: 'idea' | 'performance' | 'strategy' | 'creative' | 'general';
  tags: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AdRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  platform: string;
  date: string;
  metrics: {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpa: number;
    roas: number;
  };
  notes?: string;
  status: 'success' | 'warning' | 'error';
}

export class AdNotebookService {
  private notes: Map<string, AdNote> = new Map();
  private records: Map<string, AdRecord> = new Map();

  /**
   * 创建广告笔记
   */
  async createNote(input: Omit<AdNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdNote> {
    const note: AdNote = {
      ...input,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notes.set(note.id, note);
    console.log('📝 创建笔记:', note.title);
    return note;
  }

  /**
   * 获取笔记
   */
  async getNote(id: string): Promise<AdNote | null> {
    return this.notes.get(id) || null;
  }

  /**
   * 列出所有笔记
   */
  async listNotes(filters?: {
    campaignId?: string;
    category?: AdNote['category'];
    tags?: string[];
  }): Promise<AdNote[]> {
    let notes = Array.from(this.notes.values());

    if (filters?.campaignId) {
      notes = notes.filter(n => n.campaignId === filters.campaignId);
    }

    if (filters?.category) {
      notes = notes.filter(n => n.category === filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      notes = notes.filter(n => 
        filters.tags!.some(tag => n.tags.includes(tag))
      );
    }

    return notes.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * 更新笔记
   */
  async updateNote(id: string, updates: Partial<AdNote>): Promise<AdNote | null> {
    const note = this.notes.get(id);
    if (!note) return null;

    const updated = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.notes.set(id, updated);
    return updated;
  }

  /**
   * 删除笔记
   */
  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  /**
   * 记录广告数据
   */
  async recordCampaignData(record: Omit<AdRecord, 'id'>): Promise<AdRecord> {
    const newRecord: AdRecord = {
      ...record,
      id: this.generateId()
    };

    this.records.set(newRecord.id, newRecord);
    console.log('📊 记录广告数据:', newRecord.campaignName);
    return newRecord;
  }

  /**
   * 获取广告记录
   */
  async getRecords(filters?: {
    campaignId?: string;
    platform?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AdRecord[]> {
    let records = Array.from(this.records.values());

    if (filters?.campaignId) {
      records = records.filter(r => r.campaignId === filters.campaignId);
    }

    if (filters?.platform) {
      records = records.filter(r => r.platform === filters.platform);
    }

    if (filters?.startDate) {
      records = records.filter(r => r.date >= filters.startDate!);
    }

    if (filters?.endDate) {
      records = records.filter(r => r.date <= filters.endDate!);
    }

    return records.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  /**
   * 搜索笔记
   */
  async searchNotes(query: string): Promise<AdNote[]> {
    const queryLower = query.toLowerCase();
    const notes = Array.from(this.notes.values());

    return notes.filter(note =>
      note.title.toLowerCase().includes(queryLower) ||
      note.content.toLowerCase().includes(queryLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  /**
   * 生成广告总结报告
   */
  async generateSummaryReport(campaignId: string): Promise<{
    campaign: string;
    totalNotes: number;
    recordsSummary: {
      totalSpend: number;
      avgCTR: number;
      avgROAS: number;
    };
    keyInsights: string[];
  }> {
    const notes = await this.listNotes({ campaignId });
    const records = await this.getRecords({ campaignId });

    const totalSpend = records.reduce((sum, r) => sum + r.metrics.spend, 0);
    const avgCTR = records.length > 0
      ? records.reduce((sum, r) => sum + r.metrics.ctr, 0) / records.length
      : 0;
    const avgROAS = records.length > 0
      ? records.reduce((sum, r) => sum + r.metrics.roas, 0) / records.length
      : 0;

    return {
      campaign: campaignId,
      totalNotes: notes.length,
      recordsSummary: {
        totalSpend,
        avgCTR,
        avgROAS
      },
      keyInsights: [
        `共记录 ${notes.length} 条笔记`,
        `总花费 ¥${totalSpend.toFixed(2)}`,
        `平均点击率 ${avgCTR.toFixed(2)}%`,
        `平均ROAS ${avgROAS.toFixed(2)}x`
      ]
    };
  }

  /**
   * 导出笔记为 Markdown
   */
  async exportToMarkdown(campaignId?: string): Promise<string> {
    const notes = campaignId 
      ? await this.listNotes({ campaignId })
      : await this.listNotes();

    let markdown = '# 广告笔记本\n\n';
    markdown += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;

    for (const note of notes) {
      markdown += `## ${note.title}\n\n`;
      markdown += `**分类**: ${note.category}\n`;
      markdown += `**标签**: ${note.tags.join(', ')}\n`;
      markdown += `**创建时间**: ${new Date(note.createdAt).toLocaleString('zh-CN')}\n\n`;
      markdown += `${note.content}\n\n`;
      markdown += '---\n\n';
    }

    return markdown;
  }

  private generateId(): string {
    return `note-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * 加载示例数据
   */
  async seedExampleData(): Promise<void> {
    await this.createNote({
      title: '夏季促销广告策略',
      content: '针对25-45岁女性用户，主推夏季连衣裙。建议在抖音和小红书平台投放，预算每日500元。',
      category: 'strategy',
      tags: ['夏季', '促销', '女装'],
      createdBy: '营销团队'
    });

    await this.createNote({
      title: 'Google Ads 效果分析',
      content: 'CPA从¥45降到¥32，ROAS提升到4.2x。建议继续优化关键词定向。',
      category: 'performance',
      tags: ['Google Ads', '效果分析'],
      createdBy: '数据分析师'
    });

    await this.createNote({
      title: '新创意灵感',
      content: 'AR试穿功能可以提升用户互动。考虑制作3D产品模型。',
      category: 'idea',
      tags: ['AR', '创意', '互动'],
      createdBy: '创意总监'
    });

    console.log('✅ 广告笔记本示例数据已加载');
  }
}
