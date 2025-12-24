
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

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  model: string;
  instruction: string;
  status: 'idle' | 'active' | 'deploying';
}

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'component' | 'api';
  previewColor: string;
  codeSnippet?: string;
}

export interface DeploymentStatus {
  id: string;
  url: string;
  state: string;
  createdAt: number;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  enabled: boolean;
  manifest: string;
}

export enum TabType {
  // Sector 1: Genesis (Creation)
  CREATION_NOTEBOOK = 'CREATION_NOTEBOOK',
  CREATION_ASSETS = 'CREATION_ASSETS',
  
  // Sector 2: Neural Market (Discovery)
  MARKET_REGISTRY = 'MARKET_REGISTRY',
  AGENT_MANAGER = 'AGENT_MANAGER',
  
  // Sector 3: Media Nexus (Commerce & Content)
  MEDIA_YOUTUBE = 'MEDIA_YOUTUBE',
  MEDIA_TIKTOK = 'MEDIA_TIKTOK',
  MEDIA_TMDB = 'MEDIA_TMDB',
  MEDIA_ADS = 'MEDIA_ADS',
  
  // Sector 4: DevOps Shard (Automation)
  DEVOPS_WORKFLOW = 'DEVOPS_WORKFLOW',
  DEVOPS_DEPLOY = 'DEVOPS_DEPLOY',
  DEVOPS_GCS = 'DEVOPS_GCS',
  EDITOR = 'EDITOR',
  WORKSPACE = 'WORKSPACE',
  GITHUB = 'GITHUB',
  BLOB = 'BLOB'
}
