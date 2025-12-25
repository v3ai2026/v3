
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
  CREATION_BUILDER = 'CREATION_BUILDER',
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

  // Sector 4: Design & Multimodal
  DESIGN_FIGMA = 'DESIGN_FIGMA',
  
  // Sector 5: DevOps Shard (Automation)
  DEVOPS_WORKFLOW = 'DEVOPS_WORKFLOW',
  DEVOPS_DEPLOY = 'DEVOPS_DEPLOY',
  DEVOPS_GCS = 'DEVOPS_GCS',
  EDITOR = 'EDITOR',
  WORKSPACE = 'WORKSPACE',
  GITHUB = 'GITHUB',
  BLOB = 'BLOB',
  
  // Sector 6: 3D/AR Virtual Store
  AR_VIRTUAL_STORE = 'AR_VIRTUAL_STORE',
  AR_TRY_ON = 'AR_TRY_ON',
  PRODUCT_3D_VIEWER = 'PRODUCT_3D_VIEWER',
}

// 3D/AR Related Types
export interface Product3D {
  id: string;
  name: string;
  description: string;
  modelUrl: string;
  modelFormat: 'GLB' | 'GLTF' | 'OBJ' | 'FBX';
  thumbnailUrl?: string;
  variants: ProductVariant[];
  category: 'clothing' | 'accessories' | 'furniture' | 'electronics';
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'material' | 'size' | 'texture';
  value: string;
  modelUrl?: string;
  textureUrl?: string;
  hexColor?: string;
}

export interface ARSession {
  id: string;
  type: 'try-on' | 'furniture' | 'measurement';
  status: 'idle' | 'active' | 'paused' | 'ended';
  startTime: number;
  endTime?: number;
  capturedImages?: string[];
}

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface BodyPose {
  landmarks: FaceLandmark[];
  confidence: number;
}

export interface ARProduct extends Product3D {
  arEnabled: boolean;
  arType: 'face' | 'body' | 'hand' | 'ground';
  scale: [number, number, number];
  offset: [number, number, number];
}

export interface VirtualStore {
  id: string;
  name: string;
  theme: 'luxury' | 'sport' | 'home' | 'tech';
  sceneUrl: string;
  products: Product3D[];
  layout: StoreLayout;
}

export interface StoreLayout {
  shelves: ShelfPosition[];
  displays: DisplayPosition[];
  lighting: LightingConfig;
}

export interface ShelfPosition {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  products: string[]; // product IDs
}

export interface DisplayPosition {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  type: 'featured' | 'window' | 'podium';
  productId: string;
}

export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    intensity: number;
    color: string;
    position: [number, number, number];
  }[];
  environment: 'studio' | 'indoor' | 'outdoor';
}
