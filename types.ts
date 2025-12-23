
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'frontend' | 'backend' | 'test' | 'config';
}

export interface GenerationResult {
  projectName: string;
  files: GeneratedFile[];
  agentLogs: {
    agent: string;
    action: string;
    status: 'complete' | 'working';
  }[];
}

export interface ModelConfig {
  temperature: number;
  topP: number;
  topK: number;
  thinkingBudget: number;
  systemInstruction: string;
}

export type ExtensionCategory = 'COMPILER' | 'INTERFACE' | 'PROTOCOL';

export interface Extension {
  id: string;
  name: string;
  description: string;
  category: ExtensionCategory;
  version: string;
  author: string;
  enabled: boolean;
  manifest: string;
}

export interface DeploymentStatus {
  id: string;
  url: string;
  state: 'INITIALIZING' | 'ANALYZING' | 'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR';
  createdAt: number;
}

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'component' | 'api';
  previewColor: string;
  codeSnippet?: string;
}

export enum TabType {
  INBOX = 'INBOX',
  WORKSPACE = 'WORKSPACE',
  EDITOR = 'EDITOR',
  KNOWLEDGE = 'KNOWLEDGE',
  BROWSER = 'BROWSER',
  AGENT_MANAGER = 'AGENT_MANAGER',
  LOGS = 'LOGS',
  DEPLOY = 'DEPLOY',
  COLAB = 'COLAB',
  PLUGINS = 'PLUGINS',
  GCS = 'GCS'
}
