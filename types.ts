
export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerationResult {
  componentName: string;
  files: GeneratedFile[];
}

export interface DeploymentStatus {
  id: string;
  url: string;
  state: 'INITIALIZING' | 'ANALYZING' | 'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR';
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  files?: GeneratedFile[];
  componentName?: string;
}

export enum TabType {
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW',
  DEPLOY = 'DEPLOY'
}
