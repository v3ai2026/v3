import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Analytics } from '@vercel/analytics/react';
import { GoogleGenAI } from "@google/genai";
import { generateFullStackProject, convertToColabNotebook, transcribeAudio, generateSpeech } from './services/geminiService';
import { FigmaService } from './services/figmaService';
import { deployToVercel, checkDeploymentStatus } from './services/vercelService';
import { GCSService } from './services/gcsService';
import { NeuralModal } from './components/NeuralModal';
import { 
  NeuralButton, 
  NeuralInput, 
  NeuralTextArea, 
  SidebarItem, 
  NeuralBadge, 
  NeuralSwitch, 
  GlassCard, 
  NeuralSpinner,
  ProgressBar
} from './components/UIElements';
import { GeneratedFile, TabType, ModelConfig, GenerationResult, AIAgent, DeploymentStatus } from './types';
import { AdsDashboard } from './components/ads/AdsDashboard';
import { AIAdCreator } from './components/ads/AIAdCreator';
import { UnifiedAdsService } from './services/ads/unifiedAdsService';
import { AICopywritingService } from './services/ads/aiCopywritingService';

const INITIAL_SYSTEM = `你是一个顶级进化级全栈 AI 编排系统（DeepMind 级架构师）。正在操作分布式代理集群。风格：奢华深色，Nuxt 翠绿。优先移动端适配。`;

const App: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7, topP: 0.95, topK: 40, thinkingBudget: 0,
    systemInstruction: INITIAL_SYSTEM
  });

  const [activeTab, setActiveTab] = useState<TabType>(TabType.CREATION_BUILDER);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [useDeepReasoning, setUseDeepReasoning] = useState(false);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Builder Specific State
  const [builderMode, setBuilderMode] = useState<'CHOOSING' | 'ARCHITECT' | 'INSTANT'>('CHOOSING');
  const [architectType, setArchitectType] = useState<'SaaS' | 'ECommerce' | 'Portfolio' | 'Marketplace'>('SaaS');
  const [architectFeatures, setArchitectFeatures] = useState<string[]>([]);

  // Agent Manager State
  const [agents, setAgents] = useState<AIAgent[]>([
    { id: '1', name: 'Architect Prime', role: 'Lead Architect', model: 'gemini-3-pro-preview', instruction: 'Oversee system design.', status: 'idle' },
    { id: '2', name: 'UX Oracle', role: 'UI/UX Specialist', model: 'gemini-3-flash-preview', instruction: 'Evaluate accessibility and luxury aesthetics.', status: 'idle' }
  ]);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [agentForm, setAgentForm] = useState<Partial<AIAgent>>({ 
    name: '', 
    role: '', 
    model: 'gemini-3-flash-preview', 
    instruction: '' 
  });

  // GCS Integration State
  const [gcsToken, setGcsToken] = useState('');
  const [gcsProjectId, setGcsProjectId] = useState('');
  const [gcsBuckets, setGcsBuckets] = useState<any[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [bucketObjects, setBucketObjects] = useState<any[]>([]);
  const [isGcsLoading, setIsGcsLoading] = useState(false);
  const [isBucketCreating, setIsBucketCreating] = useState(false);
  const [newBucketName, setNewBucketName] = useState('');

  // SCM & Deployment
  const [vercelToken, setVercelToken] = useState('');
  const [deployStatus, setDeployStatus] = useState<DeploymentStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  // Figma Integration Shard
  const [figmaToken, setFigmaToken] = useState('');
  const [figmaFileUrl, setFigmaFileUrl] = useState('');
  const [figmaFileData, setFigmaFileData] = useState<any>(null);
  const [figmaExportedImages, setFigmaExportedImages] = useState<Record<string, string>>({}); // ID to base64
  const [isFigmaLoading, setIsFigmaLoading] = useState(false);
  const [selectedFigmaNodes, setSelectedFigmaNodes] = useState<string[]>([]);
  const [isExportingDesign, setIsExportingDesign] = useState(false);

  // Audio Processing
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Advertising System State
  const [adsService] = useState(() => new UnifiedAdsService());
  const [copywritingService] = useState(() => new AICopywritingService());
  const [adsView, setAdsView] = useState<'dashboard' | 'create'>('dashboard');
  const [adsInitialized, setAdsInitialized] = useState(false);

  // Initialize ads system with mock data on first load
  useEffect(() => {
    if (!adsInitialized && activeTab === TabType.MEDIA_ADS) {
      adsService.seedMockData().then(() => {
        setAdsInitialized(true);
      });
    }
  }, [activeTab, adsInitialized]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const text = await transcribeAudio(base64Audio, 'audio/webm');
          setInput(prev => prev + ' ' + text);
        };
      };
      recorder.start();
      setIsRecording(true);
    } catch (e) { console.error("Mic access failed", e); }
  };

  const stopRecording = () => { mediaRecorderRef.current?.stop(); setIsRecording(false); };

  const handleGenerate = async (overriddenPrompt?: string) => {
    const finalPrompt = overriddenPrompt || input;
    if (!finalPrompt) return;
    setIsGenerating(true);
    const currentConfig = { ...modelConfig, thinkingBudget: useDeepReasoning ? 32768 : 0 };
    
    const images = Object.values(figmaExportedImages).map(data => ({
      data,
      mimeType: 'image/png'
    }));

    const contextShards = [];
    if (figmaFileData) {
      contextShards.push(`Figma Design Context: ${figmaFileData.name}. Nodes selected: ${selectedFigmaNodes.join(', ')}`);
    }

    try {
      const result = await generateFullStackProject(finalPrompt, currentConfig, [], contextShards, images);
      setGenerationResult(result);
      if (result.files.length > 0) { 
        setSelectedFile(result.files[0]); 
        setActiveTab(TabType.EDITOR); 
      }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const executeArchitectBuild = () => {
    const prompt = `Build a high-end ${architectType} platform. Features required: ${architectFeatures.join(', ')}. Context: ${input}`;
    handleGenerate(prompt);
  };

  const handleVercelDeploy = async () => {
    if (!vercelToken || !generationResult) return;
    setIsDeploying(true);
    try {
      const status = await deployToVercel(generationResult.files, vercelToken, generationResult.projectName);
      setDeployStatus(status);
      if (status.state === 'INITIALIZING') {
        const poll = setInterval(async () => {
          const updated = await checkDeploymentStatus(status.id, vercelToken);
          setDeployStatus(updated);
          if (updated.state === 'READY' || updated.state === 'ERROR') clearInterval(poll);
        }, 5000);
      }
    } catch (e: any) { alert(e.message); } finally { setIsDeploying(false); }
  };

  // GCS Handlers
  const handleGcsConnect = async () => {
    if (!gcsToken || !gcsProjectId) return;
    setIsGcsLoading(true);
    try {
      const gcs = new GCSService(gcsToken);
      const buckets = await gcs.listBuckets(gcsProjectId);
      setGcsBuckets(buckets);
    } catch (e: any) { alert(e.message); }
    finally { setIsGcsLoading(false); }
  };

  const handleSelectBucket = async (bucketName: string) => {
    setSelectedBucket(bucketName);
    setIsGcsLoading(true);
    try {
      const gcs = new GCSService(gcsToken);
      const objects = await gcs.listObjects(bucketName);
      setBucketObjects(objects);
    } catch (e: any) { alert(e.message); }
    finally { setIsGcsLoading(false); }
  };

  const handleCreateBucket = async () => {
    if (!newBucketName || !gcsProjectId) return;
    setIsBucketCreating(true);
    try {
      const gcs = new GCSService(gcsToken);
      await gcs.createBucket(gcsProjectId, newBucketName);
      await handleGcsConnect();
      setNewBucketName('');
    } catch (e: any) { alert(e.message); }
    finally { setIsBucketCreating(false); }
  };

  const handleGcsDeploy = async () => {
    if (!selectedBucket || !generationResult || !gcsToken) return;
    setIsGcsLoading(true);
    try {
      const gcs = new GCSService(gcsToken);
      await gcs.uploadProject(selectedBucket, generationResult.files);
      await handleSelectBucket(selectedBucket);
      alert('Project shards successfully synchronized to GCS bucket.');
    } catch (e: any) { alert(e.message); }
    finally { setIsGcsLoading(false); }
  };

  const handleDownloadColab = () => {
    if (!generationResult) return;
    const notebookJson = convertToColabNotebook(generationResult.files, generationResult.projectName);
    const blob = new Blob([notebookJson], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generationResult.projectName.toLowerCase().replace(/\s+/g, '-')}.ipynb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFigmaSync = async () => {
    if (!figmaToken || !figmaFileUrl) return;
    setIsFigmaLoading(true);
    try {
      const figma = new FigmaService(figmaToken);
      const fileKey = figmaFileUrl.match(/file\/([a-zA-Z0-9]+)/)?.[1] || figmaFileUrl;
      const data = await figma.getFile(fileKey);
      setFigmaFileData(data);
    } catch (e: any) { alert(e.message); }
    finally { setIsFigmaLoading(false); }
  };

  const handleExportFigmaNodes = async () => {
    if (!figmaToken || !figmaFileData || selectedFigmaNodes.length === 0) return;
    setIsExportingDesign(true);
    try {
      const figma = new FigmaService(figmaToken);
      const fileKey = figmaFileUrl.match(/file\/([a-zA-Z0-9]+)/)?.[1] || figmaFileUrl;
      const imageUrls = await figma.getImages(fileKey, selectedFigmaNodes.join(','));
      
      const base64Map: Record<string, string> = {};
      for (const [id, url] of Object.entries(imageUrls as Record<string, string>)) {
        if (!url) continue;
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(blob);
        });
        base64Map[id] = base64;
      }
      setFigmaExportedImages(prev => ({ ...prev, ...base64Map }));
    } catch (e: any) { alert(e.message); }
    finally { setIsExportingDesign(false); }
  };

  const figmaTopLevelNodes = useMemo(() => {
    if (!figmaFileData) return [];
    const nodes: { id: string, name: string }[] = [];
    figmaFileData.document.children.forEach((page: any) => {
      page.children.forEach((child: any) => {
        nodes.push({ id: child.id, name: child.name });
      });
    });
    return nodes;
  }, [figmaFileData]);

  // Agent Manager Handlers
  const handleSaveAgent = () => {
    if (!agentForm.name || !agentForm.role) return;
    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...a, ...agentForm as AIAgent } : a));
    } else {
      const newAgentItem: AIAgent = {
        id: Math.random().toString(36).substr(2, 9),
        name: agentForm.name!,
        role: agentForm.role!,
        model: agentForm.model!,
        instruction: agentForm.instruction!,
        status: 'idle'
      };
      setAgents(prev => [...prev, newAgentItem]);
    }
    setIsAgentModalOpen(false);
    setEditingAgent(null);
    setAgentForm({ name: '', role: '', model: 'gemini-3-flash-preview', instruction: '' });
  };

  const handleEditAgent = (agent: AIAgent) => {
    setEditingAgent(agent);
    setAgentForm(agent);
    setIsAgentModalOpen(true);
  };

  const handleRemoveAgent = (id: string) => {
    if (confirm('Verify agent decommissioning?')) {
      setAgents(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-[#020420] text-white font-sans overflow-hidden flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <nav className="w-24 border-r border-[#1a1e43] flex flex-col items-center py-10 gap-2 bg-[#020420] z-30 shadow-2xl shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-nuxt-gradient flex items-center justify-center text-black font-black text-2xl mb-10 cursor-pointer shadow-[0_0_20px_rgba(0,220,130,0.3)]" onClick={() => setActiveTab(TabType.CREATION_BUILDER)}>I</div>
          <SidebarItem icon="✨" label="Build" active={activeTab === TabType.CREATION_BUILDER} onClick={() => setActiveTab(TabType.CREATION_BUILDER)} />
          <SidebarItem icon="🤖" label="Agents" active={activeTab === TabType.AGENT_MANAGER} onClick={() => setActiveTab(TabType.AGENT_MANAGER)} />
          <SidebarItem icon="📢" label="Ads" active={activeTab === TabType.MEDIA_ADS} onClick={() => setActiveTab(TabType.MEDIA_ADS)} />
          <SidebarItem icon="🎨" label="Figma" active={activeTab === TabType.DESIGN_FIGMA} onClick={() => setActiveTab(TabType.DESIGN_FIGMA)} />
          <SidebarItem icon="☁️" label="GCS" active={activeTab === TabType.DEVOPS_GCS} onClick={() => setActiveTab(TabType.DEVOPS_GCS)} />
          <SidebarItem icon="💠" label="Workspace" active={activeTab === TabType.WORKSPACE} onClick={() => setActiveTab(TabType.WORKSPACE)} />
          <SidebarItem icon="🚀" label="Deploy" active={activeTab === TabType.DEVOPS_DEPLOY} onClick={() => setActiveTab(TabType.DEVOPS_DEPLOY)} />
          <div className="mt-auto">
            <SidebarItem icon="⚙️" label="Config" active={false} onClick={() => setIsConfigOpen(true)} />
          </div>
        </nav>
      )}

      {/* MOBILE BOTTOM NAV */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#020420]/90 backdrop-blur-xl border-t border-[#1a1e43] z-[100] flex items-center justify-around px-2 mobile-safe-bottom">
          <SidebarItem icon="✨" label="Build" collapsed active={activeTab === TabType.CREATION_BUILDER} onClick={() => setActiveTab(TabType.CREATION_BUILDER)} />
          <SidebarItem icon="🤖" label="Agents" collapsed active={activeTab === TabType.AGENT_MANAGER} onClick={() => setActiveTab(TabType.AGENT_MANAGER)} />
          <SidebarItem icon="📢" label="Ads" collapsed active={activeTab === TabType.MEDIA_ADS} onClick={() => setActiveTab(TabType.MEDIA_ADS)} />
          <SidebarItem icon="☁️" label="GCS" collapsed active={activeTab === TabType.DEVOPS_GCS} onClick={() => setActiveTab(TabType.DEVOPS_GCS)} />
        </nav>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 md:h-20 border-b border-[#1a1e43] flex items-center justify-between px-4 md:px-12 bg-[#020420]/95 backdrop-blur-3xl z-40 shrink-0">
          <div className="flex items-center gap-2">
            <NeuralBadge variant="primary" pulse={true}>{isMobile ? activeTab.split('_').pop() : activeTab.replace('_', ' ')}</NeuralBadge>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {!isMobile && <NeuralSwitch checked={useDeepReasoning} onChange={setUseDeepReasoning} label="Deep Reasoning" />}
            <NeuralButton onClick={() => setIsAgentModalOpen(true)} size="xs" variant="primary" className={activeTab === TabType.AGENT_MANAGER ? '' : 'hidden'}>Add Agent</NeuralButton>
            {activeTab === TabType.MEDIA_ADS && (
              <div className="flex gap-2">
                <NeuralButton 
                  onClick={() => setAdsView('dashboard')} 
                  size="xs" 
                  variant={adsView === 'dashboard' ? 'primary' : 'secondary'}
                >
                  仪表板
                </NeuralButton>
                <NeuralButton 
                  onClick={() => setAdsView('create')} 
                  size="xs" 
                  variant={adsView === 'create' ? 'primary' : 'secondary'}
                >
                  创建广告
                </NeuralButton>
              </div>
            )}
            <NeuralButton onClick={() => setIsConfigOpen(true)} size="sm" variant="ghost" className="hidden md:block">Protocols</NeuralButton>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto custom-scrollbar bg-[#020420] ${isMobile ? 'pb-20' : ''}`}>
          
          {/* ADS TAB */}
          {activeTab === TabType.MEDIA_ADS && (
            <div className="h-full">
              {adsView === 'dashboard' ? (
                <AdsDashboard adsService={adsService} />
              ) : (
                <div className="p-4 md:p-12">
                  <AIAdCreator 
                    adsService={adsService} 
                    copywritingService={copywritingService}
                    onCampaignCreated={() => setAdsView('dashboard')}
                  />
                </div>
              )}
            </div>
          )}

          {/* GCS TAB */}
          {activeTab === TabType.DEVOPS_GCS && (
            <div className="p-4 md:p-12 animate-modal-fade max-w-7xl mx-auto space-y-8 md:space-y-12">
               <div className="text-center md:text-left space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Cloud Storage Shard</h2>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Orchestrate assets on Google Cloud Storage Infrastructure</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <GlassCard className="space-y-6 lg:col-span-1 h-fit">
                    <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">Authentication Protocol</h3>
                    <NeuralInput label="Access Token (Bearer)" type="password" value={gcsToken} onChange={e => setGcsToken(e.target.value)} placeholder="OAuth2 Token" />
                    <NeuralInput label="Project ID" value={gcsProjectId} onChange={e => setGcsProjectId(e.target.value)} placeholder="google-project-id" />
                    <NeuralButton onClick={handleGcsConnect} loading={isGcsLoading} className="w-full">Sync Intelligence Shards</NeuralButton>
                  </GlassCard>

                  <div className="lg:col-span-2 space-y-8">
                    {gcsBuckets.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Buckets</h3>
                           <NeuralBadge>{gcsBuckets.length} Total</NeuralBadge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {gcsBuckets.map(bucket => (
                             <GlassCard 
                               key={bucket.name} 
                               onClick={() => handleSelectBucket(bucket.name)}
                               className={`p-6 border-l-4 transition-all cursor-pointer ${selectedBucket === bucket.name ? 'border-[#00DC82] bg-[#00DC82]/5' : 'border-transparent active:bg-white/5'}`}
                             >
                               <div className="flex items-center justify-between">
                                  <span className="font-bold text-sm truncate">{bucket.name}</span>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{bucket.location}</span>
                               </div>
                             </GlassCard>
                           ))}
                           <div className="relative group">
                              <NeuralInput value={newBucketName} onChange={e => setNewBucketName(e.target.value)} placeholder="New bucket name..." className="!rounded-2xl" />
                              <NeuralButton 
                                onClick={handleCreateBucket} 
                                loading={isBucketCreating} 
                                size="xs" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 !rounded-xl"
                              >
                                Create
                              </NeuralButton>
                           </div>
                        </div>
                      </div>
                    )}

                    {selectedBucket && (
                      <GlassCard className="space-y-6 animate-modal-slide">
                         <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <h4 className="text-lg font-black text-white">{selectedBucket}</h4>
                               <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Bucket Inspection Node</p>
                            </div>
                            <div className="flex gap-2">
                               {generationResult && (
                                 <NeuralButton onClick={handleGcsDeploy} variant="primary" size="sm" loading={isGcsLoading}>Deploy Project</NeuralButton>
                               )}
                               <NeuralButton onClick={() => setSelectedBucket(null)} variant="secondary" size="sm">Close</NeuralButton>
                            </div>
                         </div>
                         
                         <div className="max-h-80 overflow-y-auto custom-scrollbar border-t border-white/5 pt-4 space-y-2">
                            {bucketObjects.length === 0 && !isGcsLoading && <p className="text-center py-8 text-xs text-slate-600">No objects detected in this shard.</p>}
                            {bucketObjects.map(obj => (
                              <div key={obj.name} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                 <span className="text-xs font-mono text-slate-300 truncate">{obj.name}</span>
                                 <NeuralBadge variant="secondary" className="text-[7px]">{Math.round(obj.size / 1024)} KB</NeuralBadge>
                              </div>
                            ))}
                         </div>
                      </GlassCard>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* AGENT MANAGER TAB */}
          {activeTab === TabType.AGENT_MANAGER && (
            <div className="p-4 md:p-12 animate-modal-fade max-w-7xl mx-auto space-y-8 md:space-y-12">
               <div className="text-center md:text-left space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Neural Registry</h2>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Manage distributed autonomous intelligence shards</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agents.map(agent => (
                    <GlassCard key={agent.id} className="relative group p-8 space-y-6">
                      <div className="flex items-start justify-between">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">🤖</div>
                         <NeuralBadge variant={agent.status === 'active' ? 'primary' : 'secondary'} pulse={agent.status === 'active'}>{agent.status}</NeuralBadge>
                      </div>
                      <div className="space-y-1">
                         <h3 className="text-xl font-black text-white">{agent.name}</h3>
                         <p className="text-[#00DC82] text-[10px] font-bold uppercase tracking-widest">{agent.role}</p>
                      </div>
                      <div className="pt-4 border-t border-white/5 space-y-3">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                           <span>Model Specification</span>
                           <span className="text-slate-300">{agent.model}</span>
                         </div>
                         <p className="text-slate-400 text-xs line-clamp-2 italic">"{agent.instruction}"</p>
                      </div>
                      <div className="flex gap-2 pt-4">
                         <NeuralButton onClick={() => handleEditAgent(agent)} variant="secondary" size="xs" className="flex-1">Configure</NeuralButton>
                         <NeuralButton onClick={() => handleRemoveAgent(agent.id)} variant="danger" size="xs">Decommission</NeuralButton>
                      </div>
                    </GlassCard>
                  ))}
                  
                  <button 
                    onClick={() => { setEditingAgent(null); setAgentForm({ name: '', role: '', model: 'gemini-3-flash-preview', instruction: '' }); setIsAgentModalOpen(true); }}
                    className="border-2 border-dashed border-[#1a1e43] rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-600 hover:border-[#00DC82]/50 hover:text-[#00DC82] transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">+</div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Initialize New Entity</span>
                  </button>
               </div>
            </div>
          )}

          {/* GENESIS BUILDER WIZARD */}
          {activeTab === TabType.CREATION_BUILDER && (
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-20 animate-modal-fade">
              {builderMode === 'CHOOSING' && (
                <div className="max-w-6xl w-full space-y-8 md:space-y-16">
                  <div className="text-center space-y-2 md:space-y-4">
                    <h1 className="text-4xl md:text-8xl font-black tracking-tighter text-nuxt drop-shadow-2xl uppercase">Genesis</h1>
                    <p className="text-slate-500 font-black uppercase tracking-[0.5em] md:tracking-[1em] text-[8px] md:text-[10px]">Select your creation protocol</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                    <GlassCard className="group cursor-pointer p-6 md:p-12 text-left space-y-4 md:space-y-8" onClick={() => setBuilderMode('ARCHITECT')}>
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] bg-nuxt-gradient flex items-center justify-center text-black text-2xl md:text-4xl shadow-2xl transition-transform group-hover:rotate-12">🏗️</div>
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-xl md:text-3xl font-black text-white group-hover:text-[#00DC82] transition-colors">Master Architect</h3>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">Full-stack intelligence. Design sophisticated E-commerce, SaaS, or marketplaces.</p>
                      </div>
                    </GlassCard>

                    <GlassCard className="group cursor-pointer p-6 md:p-12 text-left space-y-4 md:space-y-8" onClick={() => setBuilderMode('INSTANT')}>
                      <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-4xl shadow-2xl transition-transform group-hover:scale-110">⚡</div>
                      <div className="space-y-2 md:space-y-3">
                        <h3 className="text-xl md:text-3xl font-black text-white group-hover:text-[#00DC82] transition-colors">Instant Synthesis</h3>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed">Simple prompt execution. One sentence vision manifestation.</p>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}

              {builderMode === 'ARCHITECT' && (
                <div className="max-w-4xl w-full space-y-6 md:space-y-12 animate-modal-slide">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setBuilderMode('CHOOSING')} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 text-slate-500 hover:text-white transition-all">←</button>
                    <NeuralBadge>Architect Mode</NeuralBadge>
                  </div>
                  
                  <GlassCard className="space-y-6 md:space-y-12 p-6 md:p-16">
                    <div className="space-y-4 md:space-y-6">
                      <label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Classification</label>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        {['SaaS', 'ECommerce', 'Portfolio', 'Marketplace'].map((type: any) => (
                          <button 
                            key={type} 
                            onClick={() => setArchitectType(type)}
                            className={`py-4 md:py-6 rounded-2xl md:rounded-3xl border transition-all text-[10px] font-black uppercase tracking-widest ${architectType === type ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]' : 'bg-black/40 border-white/5 text-slate-500'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Intelligence Shards</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                        {['Auth & Security', 'Payment Gateway', 'Real-time Analytics', 'AI Support Shard'].map(label => (
                          <button 
                            key={label}
                            onClick={() => setArchitectFeatures(prev => prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label])}
                            className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border text-left transition-all ${architectFeatures.includes(label) ? 'bg-[#00DC82]/5 border-[#00DC82]/30 text-[#00DC82]' : 'bg-black/40 border-white/5 text-slate-500'}`}
                          >
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <NeuralTextArea 
                      label="Directives"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Specify branding or unique logic..."
                      className="h-24 md:h-40"
                    />

                    <NeuralButton onClick={executeArchitectBuild} loading={isGenerating} size="lg" className="w-full !rounded-2xl md:!rounded-[2rem]">
                      Initialize Build
                    </NeuralButton>
                  </GlassCard>
                </div>
              )}

              {builderMode === 'INSTANT' && (
                <div className="max-w-4xl w-full space-y-6 md:space-y-12 animate-modal-slide">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setBuilderMode('CHOOSING')} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 text-slate-500">←</button>
                    <NeuralBadge>Instant Mode</NeuralBadge>
                  </div>
                  
                  <div className="relative group">
                    <NeuralTextArea 
                      value={input} 
                      onChange={e => setInput(e.target.value)} 
                      placeholder="Manifest your vision..." 
                      className="h-48 md:h-80 !rounded-3xl md:!rounded-[4rem] !p-8 md:!p-16 text-lg md:text-2xl shadow-2xl"
                    />
                    <div className="mt-4 md:absolute md:bottom-10 md:right-10 flex gap-2">
                       <NeuralButton onClick={() => handleGenerate()} loading={isGenerating} size="lg" className="w-full md:w-auto !rounded-2xl md:!rounded-3xl">
                         Synthesis
                       </NeuralButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === TabType.WORKSPACE && (
            <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-20 gap-8 md:gap-12 text-center animate-modal-fade">
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-4xl md:text-[8rem] font-black tracking-tighter leading-none text-nuxt drop-shadow-2xl">Genesis</h1>
                <p className="text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-[1em] md:tracking-[2em] opacity-60">Neural Agent OS</p>
              </div>
              <div className="w-full max-w-4xl relative group">
                <NeuralTextArea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe your architecture..." className="h-48 md:h-80 !rounded-3xl md:!rounded-[4rem] !p-8 md:!p-16 text-lg md:text-2xl" />
                <div className="mt-4 md:absolute md:bottom-10 md:right-10 flex gap-2 md:gap-4">
                  <button onClick={isRecording ? stopRecording : startRecording} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/5'}`}>
                    <span className="text-xl md:text-2xl">{isRecording ? '🛑' : '🎤'}</span>
                  </button>
                  <NeuralButton onClick={() => handleGenerate()} loading={isGenerating} size="lg" className="flex-1 md:flex-none !rounded-2xl md:!rounded-3xl">Initialize</NeuralButton>
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.EDITOR && generationResult && (
            <div className="h-full flex flex-col md:flex-row animate-modal-fade overflow-hidden">
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[#1a1e43] flex flex-col shrink-0 bg-[#020420] max-h-[40vh] md:max-h-none overflow-hidden">
                <div className="p-4 text-[10px] font-black text-slate-500 uppercase border-b border-[#1a1e43] tracking-widest">Protocol Shards</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  {generationResult.files.map(file => (
                    <button key={file.path} onClick={() => setSelectedFile(file)} className={`w-full text-left px-4 py-3 text-[10px] md:text-[11px] font-bold border-l-2 md:border-l-4 transition-all mb-1 rounded-r-lg md:rounded-r-xl ${selectedFile?.path === file.path ? 'bg-[#00DC82]/5 border-[#00DC82] text-[#00DC82]' : 'border-transparent text-slate-600 hover:text-white'}`}>
                      <span className="truncate">{file.path.split('/').pop()}</span>
                    </button>
                  ))}
                </div>
                {!isMobile && (
                  <div className="p-4 border-t border-[#1a1e43] bg-black/40 space-y-2">
                    <NeuralButton onClick={handleVercelDeploy} loading={isDeploying} className="w-full" size="sm">Deploy</NeuralButton>
                    <NeuralButton onClick={handleDownloadColab} variant="secondary" className="w-full" size="sm">Notebook</NeuralButton>
                  </div>
                )}
              </div>
              <div className="flex-1 relative overflow-hidden">
                {selectedFile ? (
                  <Editor 
                    height="100%" 
                    theme="vs-dark" 
                    path={selectedFile.path} 
                    defaultLanguage="typescript" 
                    value={selectedFile.content} 
                    options={{ 
                      minimap: { enabled: false }, 
                      fontSize: isMobile ? 12 : 16, 
                      lineHeight: isMobile ? 20 : 28, 
                      fontFamily: 'JetBrains Mono',
                      padding: { top: isMobile ? 10 : 40 },
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      wordWrap: 'on'
                    }} 
                  />
                ) : null}
                {isMobile && (
                  <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <NeuralButton onClick={handleVercelDeploy} loading={isDeploying} variant="primary" size="xs" className="shadow-2xl !rounded-full w-12 h-12">🚀</NeuralButton>
                    <NeuralButton onClick={handleDownloadColab} variant="secondary" size="xs" className="shadow-2xl !rounded-full w-12 h-12">📓</NeuralButton>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === TabType.DESIGN_FIGMA && (
            <div className="min-h-full p-4 md:p-24 animate-modal-fade max-w-7xl mx-auto space-y-8 md:space-y-16 pb-32">
              <div className="text-center space-y-2 md:space-y-4">
                <h2 className="text-3xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">Design</h2>
                <NeuralBadge variant="primary">Figma Orchestrator</NeuralBadge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12">
                <GlassCard className="space-y-6 md:space-y-10 h-fit p-8 md:p-12">
                  <div className="space-y-2">
                    <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">Access Protocols</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Synchronize visual architecture from Figma nodes</p>
                  </div>
                  
                  <NeuralInput 
                    value={figmaToken} 
                    onChange={e => setFigmaToken(e.target.value)} 
                    type="password" 
                    label="API Token (Personal Access)" 
                    placeholder="figd_..."
                  />
                  <NeuralInput 
                    value={figmaFileUrl} 
                    onChange={e => setFigmaFileUrl(e.target.value)} 
                    label="File URL" 
                    placeholder="https://www.figma.com/file/..."
                  />
                  
                  <NeuralButton 
                    onClick={handleFigmaSync} 
                    loading={isFigmaLoading} 
                    className="w-full !rounded-2xl" 
                    size="lg"
                  >
                    Sync Figma Data
                  </NeuralButton>
                </GlassCard>

                {figmaFileData && (
                  <GlassCard className="space-y-6 md:space-y-8 flex flex-col max-h-[60vh] md:max-h-[70vh] p-8 md:p-12 animate-modal-slide">
                    <div className="space-y-1 border-b border-white/5 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-white truncate">{figmaFileData.name}</h4>
                        <NeuralBadge variant="secondary">{figmaTopLevelNodes.length} Nodes</NeuralBadge>
                      </div>
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Select nodes for multimodal synthesis</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                      {figmaTopLevelNodes.length === 0 ? (
                        <p className="text-center py-10 text-xs text-slate-600">No renderable nodes detected.</p>
                      ) : (
                        figmaTopLevelNodes.map(node => (
                          <div 
                            key={node.id} 
                            onClick={() => setSelectedFigmaNodes(prev => prev.includes(node.id) ? prev.filter(id => id !== node.id) : [...prev, node.id])}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${selectedFigmaNodes.includes(node.id) ? 'bg-[#00DC82]/10 border-[#00DC82] text-[#00DC82]' : 'bg-black/40 border-white/5 text-slate-500'}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[14px] opacity-40">🖼️</span>
                              <span className="text-[11px] font-bold truncate pr-4">{node.name}</span>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedFigmaNodes.includes(node.id) ? 'bg-[#00DC82] border-[#00DC82]' : 'border-slate-700'}`}>
                               {selectedFigmaNodes.includes(node.id) && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 space-y-3">
                      <NeuralButton 
                        onClick={handleExportFigmaNodes} 
                        loading={isExportingDesign} 
                        disabled={selectedFigmaNodes.length === 0} 
                        className="w-full !rounded-2xl"
                      >
                        Export Shards ({selectedFigmaNodes.length})
                      </NeuralButton>
                      <p className="text-center text-[8px] font-black text-slate-600 uppercase tracking-widest">Multimodal analysis will trigger post-export</p>
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* EXPORT PREVIEW GALLERY */}
              {Object.keys(figmaExportedImages).length > 0 && (
                <div className="animate-modal-fade-slide-in space-y-6 md:space-y-10 mt-12 md:mt-24">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="text-center md:text-left">
                      <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">Neural Shard Gallery</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Design assets ready for architectural manifestation</p>
                    </div>
                    <div className="flex gap-2">
                       <NeuralButton onClick={() => handleGenerate()} size="sm" variant="primary">Manifest Synthesis</NeuralButton>
                       <NeuralButton onClick={() => setFigmaExportedImages({})} variant="ghost" size="xs">Clear Protocol</NeuralButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.entries(figmaExportedImages).map(([id, base64]) => (
                      <GlassCard key={id} className="group p-2 !rounded-3xl overflow-hidden bg-black/40 border-white/5 hover:border-[#00DC82]/30 transition-all">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#020420]">
                          <img 
                            src={`data:image/png;base64,${base64}`} 
                            alt="Figma Export" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                             <span className="text-[9px] font-black text-white uppercase tracking-widest truncate">
                               {figmaTopLevelNodes.find(n => n.id === id)?.name || 'Design Fragment'}
                             </span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <NeuralModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} title="System Protocols" transition="slide" size={isMobile ? 'full' : 'md'}>
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Neural Temperature</label>
            <input type="range" min="0" max="1" step="0.1" value={modelConfig.temperature} onChange={e => setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)})} className="w-full accent-[#00DC82]" />
          </div>
          <NeuralTextArea value={modelConfig.systemInstruction} onChange={e => setModelConfig({...modelConfig, systemInstruction: e.target.value})} label="System Instruction" className="h-32 md:h-48" />
          <NeuralSwitch checked={useDeepReasoning} onChange={setUseDeepReasoning} label="Deep Reasoning" description="Complex logic synthesis" />
          <NeuralButton onClick={() => setIsConfigOpen(false)} className="w-full">Save Protocols</NeuralButton>
        </div>
      </NeuralModal>

      {/* AGENT CONFIG MODAL */}
      <NeuralModal 
        isOpen={isAgentModalOpen} 
        onClose={() => setIsAgentModalOpen(false)} 
        title={editingAgent ? "Configure Neural Entity" : "Initialize Intelligence Shard"}
        size={isMobile ? 'full' : 'md'}
      >
        <div className="space-y-6">
           <NeuralInput 
             label="Agent Name" 
             value={agentForm.name || ''} 
             onChange={e => setAgentForm({...agentForm, name: e.target.value})} 
             placeholder="e.g. Scribe Alpha"
           />
           <NeuralInput 
             label="Primary Role" 
             value={agentForm.role || ''} 
             onChange={e => setAgentForm({...agentForm, role: e.target.value})} 
             placeholder="e.g. Documentation Lead"
           />
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Core LLM Protocol</label>
              <select 
                value={agentForm.model} 
                onChange={e => setAgentForm({...agentForm, model: e.target.value})}
                className="w-full bg-black/40 border border-[#1a1e43] rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#00DC82]/50"
              >
                <option value="gemini-3-flash-preview">Gemini 3 Flash (High Velocity)</option>
                <option value="gemini-3-pro-preview">Gemini 3 Pro (Complex Reasoning)</option>
                <option value="gemini-flash-lite-latest">Gemini Flash Lite (Efficiency)</option>
              </select>
           </div>
           <NeuralTextArea 
             label="Instruction Set" 
             value={agentForm.instruction || ''} 
             onChange={e => setAgentForm({...agentForm, instruction: e.target.value})} 
             placeholder="Define behavioral directives..."
             className="h-32"
           />
           <NeuralButton onClick={handleSaveAgent} className="w-full">{editingAgent ? "Update Protocol" : "Manifest Shard"}</NeuralButton>
        </div>
      </NeuralModal>
      <Analytics />
    </div>
  );
};

export default App;