/**
 * Marketing Automation Workflow Service
 * Handles automated marketing sequences and triggers
 */

export interface WorkflowTrigger {
  id: string;
  type: 'user_signup' | 'purchase' | 'cart_abandonment' | 'inactivity' | 'birthday' | 'anniversary';
  conditions: Record<string, any>;
}

export interface WorkflowAction {
  id: string;
  type: 'send_email' | 'send_sms' | 'send_push' | 'create_ad_campaign' | 'send_coupon' | 'wait';
  delay?: number; // in hours
  params?: Record<string, any>;
}

export interface MarketingWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  status: 'active' | 'paused' | 'draft';
  createdAt: string;
  updatedAt: string;
  stats: {
    triggered: number;
    completed: number;
    conversionRate: number;
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  status: 'running' | 'completed' | 'failed';
  currentStep: number;
  startedAt: string;
  completedAt?: string;
}

export class MarketingAutomationService {
  private workflows: Map<string, MarketingWorkflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();

  // Workflow Management
  async createWorkflow(input: Omit<MarketingWorkflow, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<MarketingWorkflow> {
    const workflow: MarketingWorkflow = {
      ...input,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        triggered: 0,
        completed: 0,
        conversionRate: 0
      }
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async listWorkflows(): Promise<MarketingWorkflow[]> {
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: string): Promise<MarketingWorkflow | null> {
    return this.workflows.get(id) || null;
  }

  async updateWorkflow(id: string, updates: Partial<MarketingWorkflow>): Promise<MarketingWorkflow | null> {
    const workflow = this.workflows.get(id);
    if (!workflow) return null;

    const updated = {
      ...workflow,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.workflows.set(id, updated);
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    return this.workflows.delete(id);
  }

  // Workflow Execution
  async triggerWorkflow(workflowId: string, userId: string, context?: Record<string, any>): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || workflow.status !== 'active') {
      throw new Error('Workflow not found or not active');
    }

    const execution: WorkflowExecution = {
      id: this.generateId(),
      workflowId,
      userId,
      status: 'running',
      currentStep: 0,
      startedAt: new Date().toISOString()
    };

    this.executions.set(execution.id, execution);

    // Update workflow stats
    workflow.stats.triggered += 1;
    this.workflows.set(workflowId, workflow);

    // Execute workflow asynchronously
    this.executeWorkflow(execution, workflow, context);

    return execution;
  }

  private async executeWorkflow(
    execution: WorkflowExecution,
    workflow: MarketingWorkflow,
    context?: Record<string, any>
  ): Promise<void> {
    try {
      for (let i = 0; i < workflow.actions.length; i++) {
        const action = workflow.actions[i];
        
        // Update current step
        execution.currentStep = i;
        this.executions.set(execution.id, execution);

        // Wait if delay is specified
        if (action.delay && action.delay > 0) {
          await this.delay(action.delay * 3600 * 1000); // Convert hours to milliseconds
        }

        // Execute action
        await this.executeAction(action, { userId: execution.userId, ...context });
      }

      // Mark as completed
      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
      this.executions.set(execution.id, execution);

      // Update workflow stats
      workflow.stats.completed += 1;
      workflow.stats.conversionRate = workflow.stats.completed / workflow.stats.triggered;
      this.workflows.set(workflow.id, workflow);

    } catch (error) {
      execution.status = 'failed';
      this.executions.set(execution.id, execution);
      console.error('Workflow execution failed:', error);
    }
  }

  private async executeAction(action: WorkflowAction, context: Record<string, any>): Promise<void> {
    console.log(`Executing action: ${action.type}`, { params: action.params, context });

    switch (action.type) {
      case 'send_email':
        await this.sendEmail(action.params, context);
        break;
      case 'send_sms':
        await this.sendSMS(action.params, context);
        break;
      case 'send_push':
        await this.sendPushNotification(action.params, context);
        break;
      case 'send_coupon':
        await this.sendCoupon(action.params, context);
        break;
      case 'create_ad_campaign':
        await this.createRetargetingCampaign(action.params, context);
        break;
      case 'wait':
        // Wait action is handled by delay in executeWorkflow
        break;
    }
  }

  private async sendEmail(params: Record<string, any>, context: Record<string, any>): Promise<void> {
    // Mock email sending
    console.log('Sending email:', {
      to: context.userId,
      subject: params.subject,
      template: params.template
    });
  }

  private async sendSMS(params: Record<string, any>, context: Record<string, any>): Promise<void> {
    // Mock SMS sending
    console.log('Sending SMS:', {
      to: context.userId,
      message: params.message
    });
  }

  private async sendPushNotification(params: Record<string, any>, context: Record<string, any>): Promise<void> {
    // Mock push notification
    console.log('Sending push notification:', {
      to: context.userId,
      title: params.title,
      body: params.body
    });
  }

  private async sendCoupon(params: Record<string, any>, context: Record<string, any>): Promise<void> {
    // Mock coupon generation
    console.log('Sending coupon:', {
      to: context.userId,
      code: params.code,
      discount: params.discount
    });
  }

  private async createRetargetingCampaign(params: Record<string, any>, context: Record<string, any>): Promise<void> {
    // Mock retargeting campaign creation
    console.log('Creating retargeting campaign:', {
      userId: context.userId,
      platform: params.platform,
      budget: params.budget
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Pre-built Workflow Templates
  async createWelcomeFlow(): Promise<MarketingWorkflow> {
    return this.createWorkflow({
      name: '新用户欢迎流程',
      description: '新用户注册后的自动化欢迎序列',
      trigger: {
        id: this.generateId(),
        type: 'user_signup',
        conditions: {}
      },
      actions: [
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '欢迎加入！',
            template: 'welcome_email'
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 24
        },
        {
          id: this.generateId(),
          type: 'send_coupon',
          params: {
            code: 'WELCOME10',
            discount: 10
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 72
        },
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '为您推荐热门产品',
            template: 'product_recommendations'
          }
        }
      ],
      status: 'active'
    });
  }

  async createCartAbandonmentFlow(): Promise<MarketingWorkflow> {
    return this.createWorkflow({
      name: '购物车放弃挽回',
      description: '用户放弃购物车后的自动跟进',
      trigger: {
        id: this.generateId(),
        type: 'cart_abandonment',
        conditions: { minCartValue: 100 }
      },
      actions: [
        {
          id: this.generateId(),
          type: 'wait',
          delay: 2
        },
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '您的购物车还在等您！',
            template: 'cart_reminder'
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 24
        },
        {
          id: this.generateId(),
          type: 'send_coupon',
          params: {
            code: 'COMEBACK15',
            discount: 15
          }
        },
        {
          id: this.generateId(),
          type: 'create_ad_campaign',
          params: {
            platform: 'facebook_ads',
            budget: 50
          }
        }
      ],
      status: 'active'
    });
  }

  async createPostPurchaseFlow(): Promise<MarketingWorkflow> {
    return this.createWorkflow({
      name: '购买后跟进',
      description: '客户完成购买后的自动化服务序列',
      trigger: {
        id: this.generateId(),
        type: 'purchase',
        conditions: {}
      },
      actions: [
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '感谢您的订单！',
            template: 'order_confirmation'
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 72
        },
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '您的包裹已发货',
            template: 'shipping_notification'
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 168 // 7 days
        },
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '分享您的体验',
            template: 'review_request'
          }
        },
        {
          id: this.generateId(),
          type: 'wait',
          delay: 720 // 30 days
        },
        {
          id: this.generateId(),
          type: 'send_email',
          params: {
            subject: '您可能还喜欢这些',
            template: 'repurchase_recommendations'
          }
        }
      ],
      status: 'active'
    });
  }

  // Execution Monitoring
  async getExecution(id: string): Promise<WorkflowExecution | null> {
    return this.executions.get(id) || null;
  }

  async listExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    let executions = Array.from(this.executions.values());
    
    if (workflowId) {
      executions = executions.filter(e => e.workflowId === workflowId);
    }

    return executions.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Seed templates for testing
  async seedTemplates(): Promise<void> {
    await this.createWelcomeFlow();
    await this.createCartAbandonmentFlow();
    await this.createPostPurchaseFlow();
  }
}
