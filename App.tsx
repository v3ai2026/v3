
// @google/genai guidelines followed: Always use process.env.API_KEY directly for API calls.
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { GoogleGenAI } from "@google/genai";
import { generateFullStackProject } from './services/geminiService';
import { deployToVercel, checkDeploymentStatus } from './services/vercelService';
import { GitHubService } from './services/githubService';
import { GCSService } from './services/gcsService';
import { GoogleDriveService } from './services/googleDriveService';
import { COMPONENT_LIBRARY } from './services/library';
import { NeuralModal } from './components/NeuralModal';
import { GeneratedFile, TabType, DeploymentStatus, ModelConfig, GenerationResult, AIAgent } from './types';

const INITIAL_SYSTEM = `你是一个顶级进化级全栈 AI 编排系统（IntelliBuild Studio Core）。你正在操作一个分布式的代理集群。风格：极致简约、企业级、奢华深色、Nuxt 翠绿风格。
你负责生成高质量的代码、图像和网站。`;

const App: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    thinkingBudget: 0,
    systemInstruction: INITIAL_SYSTEM
  });

  // Initializing active tab to GITHUB as requested
  const [activeTab, setActiveTab] = useState<TabType>(TabType.GITHUB);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [deployStatus, setDeployStatus] = useState<DeploymentStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [vercelToken, setVercelToken] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // --- Google Authentication States ---
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');

  // --- GitHub Orchestration States ---
  const [ghToken, setGhToken] = useState('');
  const [ghRepoName, setGhRepoName] = useState('');
  const [ghDescription, setGhDescription] = useState('Initialized via IntelliBuild Studio');
  const [ghIsProvisioning, setGhIsProvisioning] = useState(false);
  const [ghLogs, setGhLogs] = useState<string[]>([]);

  // --- GCS Orchestration States ---
  const [gcsProjectId, setGcsProjectId] = useState('');
  const [gcsBuckets, setGcsBuckets] = useState<any[]>([]);
  const [gcsObjects, setGcsObjects] = useState<any[]>([]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [gcsIsLoading, setGcsIsLoading] = useState(false);
  const [gcsLogs, setGcsLogs] = useState<string[]>([]);
  const [gcsSearch, setGcsSearch] = useState('');
  const [newBucketName, setNewBucketName] = useState('');

  // --- Google Drive Orchestration States ---
  const [driveIsLoading, setDriveIsLoading] = useState(false);
  const [driveLogs, setDriveLogs] = useState<string[]>([]);
  const [driveFolders, setDriveFolders] = useState<any[]>([]);
  const [selectedDriveFolder, setSelectedDriveFolder] = useState('');

  // --- Website Generation States ---
  const [webPrompt, setWebPrompt] = useState('');
  const [isWebGenLoading, setIsWebGenLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // --- Image Generation States ---
  const [imagePrompt, setImagePrompt] = useState('');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // --- Agent Manager State ---
  const [agents, setAgents] = useState<AIAgent[]>([
    { id: '1', name: 'Nuxt-Architect', role: 'System Orchestrator', model: 'gemini-3-pro-preview', instruction: 'Primary architecture strategy focused on performance and modern green aesthetics.', status: 'active' },
    { id: '2', name: 'Vibrant-UI', role: 'Aesthetic Specialist', model: 'gemini-3-flash-preview', instruction: 'Ensures Nuxt Green and Deep Navy aesthetics.', status: 'idle' }
  ]);

  // Google OAuth Initialization
  useEffect(() => {
    // @ts-ignore
    if (window.google) {
      // @ts-ignore
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '439600021319-33on7g6a29g3r6poh8t1v4p0a3b04c0r.apps.googleusercontent.com', // Placeholder Client ID
        scope: 'openid profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/devstorage.full_control',
        callback: (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            fetchUserInfo(response.access_token);
          }
        },
      });
      // Store client in a ref or local if needed for recurring requests
    }
  }, []);

  const handleGoogleLogin = () => {
    // @ts-ignore
    const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '439600021319-33on7g6a29g3r6poh8t1v4p0a3b04c0r.apps.googleusercontent.com',
        scope: 'openid profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/devstorage.full_control',
        callback: (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            fetchUserInfo(response.access_token);
          }
        },
      });
    client.requestAccessToken();
  };

  const fetchUserInfo = async (token: string) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.ok ? await res.json() : null;
      setGoogleUser(data);
    }
  };

  // Sync suggestion
  useEffect(() => {
    if (generationResult && !ghRepoName) {
      setGhRepoName(generationResult.projectName.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [generationResult]);

  // Update Preview for Website Gen
  useEffect(() => {
    if (generatedHtml && previewRef.current && activeTab === TabType.WEBSITE_GEN) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generatedHtml);
        doc.close();
      }
    }
  }, [generatedHtml, activeTab]);

  // Deployment Polling
  useEffect(() => {
    let interval: number;
    if (deployStatus && (deployStatus.state !== 'READY' && deployStatus.state !== 'ERROR')) {
      interval = window.setInterval(async () => {
        try {
          const status = await checkDeploymentStatus(deployStatus.id, vercelToken);
          setDeployStatus(status);
        } catch (e) {
          console.error("Status check failed", e);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [deployStatus, vercelToken]);

  const addGhLog = (msg: string) => setGhLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  const addGcsLog = (msg: string) => setGcsLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  const addDriveLog = (msg: string) => setDriveLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  const handleGitHubSync = async () => {
    if (!ghToken || !ghRepoName || !generationResult) return;
    setGhIsProvisioning(true);
    setGhLogs([]);
    addGhLog("Initiating SCM Provisioning Protocol...");
    try {
      const ghService = new GitHubService(ghToken);
      const repo = await ghService.provisionProject(ghRepoName, ghDescription);
      addGhLog(`Repository verified: ${repo.html_url}`);
      await ghService.pushAtomicUpdate(repo.owner.login, ghRepoName, generationResult.files);
      addGhLog("Synchronization complete.");
    } catch (error: any) {
      addGhLog(`PROTOCOL ERROR: ${error.message}`);
    } finally {
      setGhIsProvisioning(false);
    }
  };

  // --- GCS Handlers ---
  const handleGCSFetchBuckets = async () => {
    if (!accessToken || !gcsProjectId) {
      alert("Google Login and Project ID required.");
      return;
    }
    setGcsIsLoading(true);
    addGcsLog(`Querying Projects for ${gcsProjectId}...`);
    try {
      const gcsService = new GCSService(accessToken);
      const buckets = await gcsService.listBuckets(gcsProjectId);
      setGcsBuckets(buckets);
      addGcsLog(`Discovered ${buckets.length} buckets.`);
    } catch (error: any) {
      addGcsLog(`FETCH ERROR: ${error.message}`);
    } finally {
      setGcsIsLoading(false);
    }
  };

  /**
   * Orchestrates the creation of a new Cloud Storage bucket.
   */
  const handleGCSCreateBucket = async () => {
    if (!accessToken || !gcsProjectId || !newBucketName) return;
    setGcsIsLoading(true);
    addGcsLog(`Provisioning new bucket: ${newBucketName}...`);
    try {
      const gcsService = new GCSService(accessToken);
      await gcsService.createBucket(gcsProjectId, newBucketName);
      addGcsLog(`Bucket ${newBucketName} created successfully.`);
      setNewBucketName('');
      await handleGCSFetchBuckets();
    } catch (error: any) {
      addGcsLog(`CREATION ERROR: ${error.message}`);
    } finally {
      setGcsIsLoading(false);
    }
  };

  /**
   * Indexes objects within a selected GCS bucket.
   */
  const handleGCSFetchObjects = async (bucketName: string) => {
    if (!accessToken || !bucketName) return;
    setGcsIsLoading(true);
    addGcsLog(`Scanning objects in ${bucketName}...`);
    try {
      const gcsService = new GCSService(accessToken);
      const objects = await gcsService.listObjects(bucketName);
      setGcsObjects(objects);
      addGcsLog(`Indexed ${objects.length} objects.`);
    } catch (error: any) {
      addGcsLog(`INDEX ERROR: ${error.message}`);
    } finally {
      setGcsIsLoading(false);
    }
  };

  const handleGCSUpload = async () => {
    if (!accessToken || !selectedBucket || !generationResult) return;
    setGcsIsLoading(true);
    addGcsLog(`Syncing to GCS bucket: ${selectedBucket}...`);
    try {
      const gcsService = new GCSService(accessToken);
      await gcsService.uploadProject(selectedBucket, generationResult.files, generationResult.projectName.toLowerCase().replace(/\s+/g, '-'));
      addGcsLog(`GCS Upload Successful.`);
      await handleGCSFetchObjects(selectedBucket);
    } catch (error: any) {
      addGcsLog(`UPLOAD ERROR: ${error.message}`);
    } finally {
      setGcsIsLoading(false);
    }
  };

  // --- Drive Handlers ---
  const handleDriveFetchFolders = async () => {
    if (!accessToken) {
      alert("Please login with Google first.");
      return;
    }
    setDriveIsLoading(true);
    addDriveLog("Connecting to Google Drive Intelligence...");
    try {
      const driveService = new GoogleDriveService(accessToken);
      const folders = await driveService.listFolders();
      setDriveFolders(folders);
      addDriveLog(`Indexed ${folders.length} Drive folders.`);
    } catch (error: any) {
      addDriveLog(`DRIVE ERROR: ${error.message}`);
    } finally {
      setDriveIsLoading(false);
    }
  };

  const handleDriveSync = async () => {
    if (!accessToken || !generationResult) return;
    setDriveIsLoading(true);
    addDriveLog(`Pushing shards to Google Drive: ${generationResult.projectName}...`);
    try {
      const driveService = new GoogleDriveService(accessToken);
      await driveService.syncProject(generationResult.projectName, generationResult.files, selectedDriveFolder || undefined);
      addDriveLog("Cloud Drive Synchronization Complete.");
    } catch (error: any) {
      addDriveLog(`SYNC ERROR: ${error.message}`);
    } finally {
      setDriveIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      const result = await generateFullStackProject(input, modelConfig, COMPONENT_LIBRARY);
      setGenerationResult(result);
      if (result.files.length > 0) {
        setSelectedFile(result.files[0]);
        setActiveTab(TabType.EDITOR);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Triggers the Vercel deployment pipeline for the current project shards.
   */
  const handleDeploy = async () => {
    if (!generationResult) {
      alert("No project generated to deploy.");
      return;
    }
    if (!vercelToken) {
      setActiveTab(TabType.DEPLOY);
      alert("Please provide a Vercel API token in the Deploy tab.");
      return;
    }
    setIsDeploying(true);
    try {
      const status = await deployToVercel(generationResult.files, vercelToken, generationResult.projectName);
      setDeployStatus(status);
      setActiveTab(TabType.DEPLOY);
    } catch (error: any) {
      console.error('Deployment failed:', error);
      alert(`Deployment failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  /**
   * Generates visual artifacts using the Gemini 2.5 Flash Image model.
   */
  const handleImageGen = async () => {
    if (!imagePrompt) return;
    setIsImageGenerating(true);
    setGeneratedImageUrl(null);
    try {
      // @google/genai: Always initialize with apiKey from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: imagePrompt }],
        },
      });
      
      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          // Find the image part as per @google/genai guidelines
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImageUrl(`data:image/png;base64,${base64EncodeString}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsImageGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#020420] text-white font-sans overflow-hidden">
      {/* Side Navigation */}
      <nav className="w-24 border-r border-[#1a1e43] flex flex-col items-center py-12 gap-10 bg-[#020420] z-30 shadow-2xl">
        <div 
          className="w-14 h-14 rounded-2xl bg-nuxt-gradient shadow-[0_0_25px_rgba(0,220,130,0.4)] flex items-center justify-center text-black font-black text-2xl mb-4 cursor-pointer hover:scale-110 transition-transform active:scale-95"
          onClick={() => setActiveTab(TabType.WORKSPACE)}
        >
          N
        </div>
        {[
          { type: TabType.WORKSPACE, icon: '🏠', label: 'Studio' },
          { type: TabType.WEBSITE_GEN, icon: '🎨', label: 'Web Gen' },
          { type: TabType.IMAGE_GEN, icon: '🖼️', label: 'Artifacts' },
          { type: TabType.EDITOR, icon: '📂', label: 'Editor' },
          { type: TabType.GITHUB, icon: '🐙', label: 'GitHub' },
          { type: TabType.GCS, icon: '☁️', label: 'GCS' },
          { type: TabType.DRIVE, icon: '📂', label: 'Drive' },
          { type: TabType.AGENT_MANAGER, icon: '🤖', label: 'Agents' },
          { type: TabType.DEPLOY, icon: '🚀', label: 'Deploy' },
        ].map((item) => (
          <button 
            key={item.type}
            onClick={() => setActiveTab(item.type)} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative group ${activeTab === item.type ? 'text-[#00DC82]' : 'text-gray-600 hover:text-white'}`}
          >
            <div className={`p-4 rounded-2xl transition-all ${activeTab === item.type ? 'bg-[#00DC82]/10 shadow-inner' : 'hover:bg-white/5'}`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 border-b border-[#1a1e43] flex items-center justify-between px-12 bg-[#020420]/95 backdrop-blur-3xl z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00DC82] animate-pulse shadow-[0_0_8px_#00DC82]" />
              <span className="text-[10px] font-black text-[#00DC82] uppercase tracking-[0.5em]">System Core: {activeTab}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {generationResult ? `Project: ${generationResult.projectName}` : 'Standby Mode'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {googleUser ? (
              <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                <img src={googleUser.picture} className="w-8 h-8 rounded-full border border-[#00DC82]/30" alt="Avatar" />
                <div className="hidden md:block">
                  <div className="text-[10px] font-black uppercase text-[#00DC82] tracking-widest">Authenticated</div>
                  <div className="text-[11px] font-bold text-slate-300">{googleUser.name}</div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4" />
                Login with Google
              </button>
            )}
            <button 
              onClick={() => setIsConfigOpen(true)} 
              className="px-6 py-2.5 rounded-xl bg-nuxt-gradient text-black text-[10px] font-black tracking-[0.3em] uppercase shadow-xl hover:scale-105 transition-all"
            >
              Parameters
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00DC82 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {activeTab === TabType.WORKSPACE && (
            <div className="h-full flex flex-col items-center justify-center p-10 max-w-5xl mx-auto text-center gap-16 animate-modal-fade relative z-10">
              <div className="space-y-6">
                <h1 className="text-[10rem] leading-none font-black tracking-tighter text-nuxt drop-shadow-[0_0_30px_rgba(0,220,130,0.2)]">IntelliBuild</h1>
                <p className="text-slate-500 text-[12px] font-black tracking-[1.2em] uppercase">Enterprise Agent Orchestration</p>
              </div>
              <div className="w-full relative group max-w-4xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your Next.js Full-Stack evolution..."
                  className="relative w-full h-72 bg-[#03062c] border border-[#1a1e43] rounded-[3.5rem] p-14 text-2xl outline-none focus:border-[#00DC82]/50 transition-all shadow-2xl placeholder:text-slate-800 font-medium custom-scrollbar"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute bottom-12 right-12 px-16 py-6 bg-nuxt-gradient text-black rounded-2xl font-black text-[14px] tracking-[0.2em] uppercase shadow-[0_0_40px_rgba(0,220,130,0.5)] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Synthesizing...' : 'Initialize Build'}
                </button>
              </div>
            </div>
          )}

          {activeTab === TabType.DRIVE && (
            <div className="h-full flex flex-col p-12 gap-8 animate-modal-fade overflow-y-auto custom-scrollbar max-w-[1400px] mx-auto">
               <div className="flex flex-col items-center text-center gap-4 mb-8">
                 <h2 className="text-7xl font-black tracking-tighter uppercase text-[#00DC82]">Drive Intelligence</h2>
                 <p className="text-[12px] font-black text-slate-500 tracking-[1em] uppercase">Cloud Drive Synchronization Protocol</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
                  <div className="p-12 bg-[#03062c] border border-[#1a1e43] rounded-[4rem] space-y-10 shadow-2xl flex flex-col">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Orchestration Setup</div>
                    
                    {!googleUser ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-20 text-center">
                        <div className="text-5xl opacity-20">🔐</div>
                        <p className="text-slate-500 font-medium">Authentication required to access Drive Shards.</p>
                        <button onClick={handleGoogleLogin} className="px-10 py-5 bg-nuxt-gradient text-black font-black uppercase tracking-widest rounded-2xl">Connect Google Account</button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Target Cloud Directory</label>
                          <div className="flex gap-4">
                            <select 
                              value={selectedDriveFolder} 
                              onChange={e => setSelectedDriveFolder(e.target.value)}
                              className="flex-1 bg-[#020420] border border-[#1a1e43] rounded-2xl px-8 py-5 text-sm outline-none focus:border-[#00DC82]/50 appearance-none"
                            >
                              <option value="">Root Drive (/) </option>
                              {driveFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                            </select>
                            <button onClick={handleDriveFetchFolders} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Refresh</button>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex flex-col gap-6">
                           <div className="flex items-center justify-between px-2">
                             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Integrity</div>
                             <div className="text-[10px] font-bold text-[#00DC82]">{generationResult?.files.length || 0} Files Detected</div>
                           </div>
                           <button 
                             onClick={handleDriveSync}
                             disabled={driveIsLoading || !generationResult}
                             className="w-full py-8 bg-nuxt-gradient text-black font-black uppercase tracking-[0.3em] text-[13px] rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-30"
                           >
                             {driveIsLoading ? 'Syncing...' : 'Start Cloud Sync'}
                           </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-10 bg-[#020420] border border-[#1a1e43] rounded-[4rem] shadow-2xl flex flex-col overflow-hidden">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] border-b border-white/5 pb-6 mb-6">Drive Protocol Stream</div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[12px] space-y-4 pr-4">
                       {driveLogs.length === 0 ? <div className="text-slate-800 italic opacity-40">Ready for synchronization...</div> : driveLogs.map((log, i) => <div key={i} className={log.includes('ERROR') ? 'text-red-400' : 'text-[#00DC82]'}>{log}</div>)}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === TabType.GCS && (
            <div className="h-full flex flex-col p-12 gap-8 animate-modal-fade overflow-y-auto custom-scrollbar">
               <div className="flex flex-col items-center text-center gap-4 mb-8">
                 <h2 className="text-7xl font-black tracking-tighter uppercase text-[#00DC82]">Cloud Orchestration</h2>
                 <p className="text-[12px] font-black text-slate-500 tracking-[1em] uppercase leading-relaxed">GCS Enterprise Asset Management Protocol</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1700px] mx-auto w-full h-full min-h-[650px]">
                 <div className="p-10 bg-[#03062c] border border-[#1a1e43] rounded-[3.5rem] space-y-10 shadow-2xl flex flex-col h-fit">
                    {!googleUser ? (
                       <div className="text-center py-10 space-y-6">
                         <div className="text-4xl opacity-20">☁️</div>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Connect Google to manage Cloud Shards</p>
                         <button onClick={handleGoogleLogin} className="w-full py-4 bg-nuxt-gradient text-black font-black uppercase rounded-2xl">Connect</button>
                       </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Project Identifier</label>
                          <div className="flex gap-3">
                            <input type="text" value={gcsProjectId} onChange={e => setGcsProjectId(e.target.value)} className="flex-1 bg-[#020420] border border-[#1a1e43] rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00DC82]/50" placeholder="my-gcp-project" />
                            <button onClick={handleGCSFetchBuckets} disabled={gcsIsLoading || !gcsProjectId} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Scan</button>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Bucket Provisioning</div>
                          <div className="flex gap-3">
                            <input type="text" value={newBucketName} onChange={e => setNewBucketName(e.target.value)} placeholder="new-bucket-alias" className="flex-1 bg-[#020420] border border-[#1a1e43] rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00DC82]/50" />
                            <button onClick={handleGCSCreateBucket} disabled={gcsIsLoading || !newBucketName} className="px-5 py-2 bg-[#00DC82] text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Create</button>
                          </div>
                        </div>
                      </>
                    )}
                 </div>

                 <div className="lg:col-span-3 flex flex-col gap-8 h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-[#03062c] border border-[#1a1e43] rounded-[3rem] shadow-xl flex flex-col gap-4">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Bucket Target</div>
                          <select 
                            value={selectedBucket} 
                            onChange={e => {
                              setSelectedBucket(e.target.value);
                              handleGCSFetchObjects(e.target.value);
                            }} 
                            className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-6 py-4 text-xs outline-none focus:border-[#00DC82]/50"
                          >
                            <option value="">Select deployment target...</option>
                            {gcsBuckets.map(b => <option key={b.id} value={b.name}>{b.name} ({b.location})</option>)}
                          </select>
                          <button 
                            onClick={handleGCSUpload}
                            disabled={gcsIsLoading || !selectedBucket || !generationResult}
                            className="mt-2 w-full py-4 bg-nuxt-gradient text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-30"
                          >
                            {gcsIsLoading ? 'Synchronizing Shards...' : 'Deploy Project Shards to GCS'}
                          </button>
                       </div>
                    </div>

                    <div className="flex-1 p-10 bg-[#020420] border border-[#1a1e43] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col relative">
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                           {gcsObjects.length === 0 ? (
                             <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-6 opacity-30">
                                <div className="text-8xl">📦</div>
                                <div className="text-[12px] font-black uppercase tracking-[0.6em] text-center">No objects found in current namespace</div>
                             </div>
                           ) : (
                             gcsObjects.map((obj) => (
                               <div key={obj.id} className="flex items-center justify-between p-5 bg-[#03062c]/40 border border-white/5 rounded-[2rem] group hover:border-[#00DC82]/20 hover:bg-[#03062c]/80 transition-all">
                                  <div className="flex items-center gap-6">
                                    <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-lg">📄</div>
                                    <div className="space-y-1">
                                      <div className="text-sm font-bold text-slate-300 group-hover:text-[#00DC82] transition-colors">{obj.name}</div>
                                      <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                                        <span>Size: {(parseInt(obj.size) / 1024).toFixed(2)} KB</span>
                                        <span>Updated: {new Date(obj.updated).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === TabType.EDITOR && generationResult && (
            <div className="h-full flex animate-modal-fade">
              <div className="w-96 border-r border-[#1a1e43] bg-[#020420] flex flex-col shadow-2xl">
                <div className="p-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-[#1a1e43]">Project Shards</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
                  {generationResult.files.map(file => (
                    <button key={file.path} onClick={() => setSelectedFile(file)} className={`w-full text-left px-12 py-6 text-[11px] font-bold border-l-4 transition-all ${selectedFile?.path === file.path ? 'bg-[#00DC82]/5 border-[#00DC82] text-[#00DC82]' : 'border-transparent text-slate-500 hover:text-white'}`}>
                      {file.path.split('/').pop()}
                    </button>
                  ))}
                </div>
                <div className="p-8 border-t border-[#1a1e43] bg-black/40 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Production Pipeline</span>
                    <div className={`w-2 h-2 rounded-full ${deployStatus?.state === 'READY' ? 'bg-[#00DC82]' : deployStatus ? 'bg-[#00DC82] animate-pulse' : 'bg-slate-800'}`} />
                  </div>
                  <button 
                    onClick={handleDeploy} 
                    disabled={isDeploying} 
                    className="w-full py-4 bg-nuxt-gradient text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    {isDeploying ? 'Deploying Shards...' : 'Launch to Vercel'}
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#020420]">
                <Editor height="100%" theme="vs-dark" path={selectedFile?.path} defaultLanguage="typescript" value={selectedFile?.content} options={{ minimap: { enabled: false }, fontSize: 16 }} />
              </div>
            </div>
          )}

          {activeTab === TabType.GITHUB && (
            <div className="h-full flex flex-col items-center justify-center p-20 max-w-5xl mx-auto gap-12 animate-modal-fade">
               <div className="text-center space-y-6">
                 <h2 className="text-7xl font-black tracking-tighter uppercase text-[#00DC82]">SCM Orchestration</h2>
                 <p className="text-[11px] font-black text-slate-500 tracking-[0.8em] uppercase leading-relaxed">GitHub Atomic Sync Protocol</p>
               </div>
               
               <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="p-12 bg-[#03062c] border border-[#1a1e43] rounded-[3.5rem] space-y-8 shadow-2xl">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Access Token</label>
                        <input type="password" value={ghToken} onChange={e => setGhToken(e.target.value)} className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-8 py-5 text-sm outline-none focus:border-[#00DC82]/50" placeholder="ghp_..." />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Repository Name</label>
                        <input type="text" value={ghRepoName} onChange={e => setGhRepoName(e.target.value)} className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-8 py-5 text-sm outline-none focus:border-[#00DC82]/50" placeholder="my-awesome-evolution" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Repository Description</label>
                        <input type="text" value={ghDescription} onChange={e => setGhDescription(e.target.value)} className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-8 py-5 text-sm outline-none focus:border-[#00DC82]/50" placeholder="Description of your evolution..." />
                      </div>
                    </div>
                    <button 
                      onClick={handleGitHubSync}
                      disabled={ghIsProvisioning || !ghToken || !ghRepoName || !generationResult}
                      className="w-full py-6 bg-nuxt-gradient text-black font-black uppercase tracking-[0.3em] text-[12px] rounded-2xl shadow-xl transition-all disabled:opacity-30"
                    >
                      {ghIsProvisioning ? 'Syncing...' : 'Push to GitHub'}
                    </button>
                 </div>
                 
                 <div className="p-10 bg-[#020420] border border-[#1a1e43] rounded-[3.5rem] flex flex-col gap-6 shadow-2xl overflow-hidden">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-[#1a1e43] pb-4">Log Sequence</div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-3 pr-2">
                       {ghLogs.length === 0 ? <div className="text-slate-800 italic">Protocol idle...</div> : ghLogs.map((log, i) => <div key={i} className={log.includes('ERROR') ? 'text-red-500' : 'text-[#00DC82]'}>{log}</div>)}
                    </div>
                 </div>
               </div>
            </div>
          )}
          
          {activeTab === TabType.IMAGE_GEN && (
            <div className="h-full flex flex-col items-center justify-center p-24 animate-modal-fade max-w-5xl mx-auto gap-16">
               <h2 className="text-7xl font-black uppercase text-[#00DC82]">Visual Artifacts</h2>
               <div className="w-full flex gap-6 p-2 bg-[#03062c] border border-[#1a1e43] rounded-[2.5rem] shadow-2xl">
                 <input type="text" value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} className="flex-1 bg-transparent px-10 py-6 text-xl outline-none" placeholder="Describe artifact..." />
                 <button onClick={handleImageGen} disabled={isImageGenerating} className="px-14 py-6 bg-nuxt-gradient text-black font-black uppercase text-[13px] rounded-3xl">Generate</button>
               </div>
               {generatedImageUrl && <img src={generatedImageUrl} className="w-full rounded-[4rem] border border-[#1a1e43] shadow-2xl" alt="Artifact" />}
               {isImageGenerating && <div className="animate-pulse text-[#00DC82] font-black uppercase tracking-[0.5em]">Synthesizing Neural Art...</div>}
            </div>
          )}

          {activeTab === TabType.DEPLOY && (
            <div className="h-full flex flex-col items-center justify-center p-20 max-w-4xl mx-auto gap-16 animate-modal-fade text-center">
              <div className="w-40 h-40 bg-nuxt-gradient rounded-[3rem] flex items-center justify-center shadow-[0_0_60px_rgba(0,220,130,0.3)] animate-pulse">
                <span className="text-7xl">⚡</span>
              </div>
              <h2 className="text-7xl font-black uppercase text-[#00DC82]">Production Pipeline</h2>
              {!deployStatus ? (
                <div className="w-full space-y-12 bg-[#03062c] border border-[#1a1e43] p-20 rounded-[4rem] shadow-2xl nuxt-glow">
                  <input type="password" placeholder="Vercel API Token" value={vercelToken} onChange={(e) => setVercelToken(e.target.value)} className="w-full bg-[#020420] border border-[#1a1e43] rounded-[1.5rem] px-12 py-7 text-sm outline-none text-center" />
                  <button onClick={handleDeploy} disabled={isDeploying || !vercelToken || !generationResult} className="w-full py-8 bg-nuxt-gradient text-black font-black uppercase text-[14px] rounded-3xl">
                    {isDeploying ? 'Deploying...' : 'Initialize Vercel Deploy'}
                  </button>
                </div>
              ) : (
                <div className="w-full p-20 bg-[#03062c] border border-[#00DC82]/30 rounded-[4rem] space-y-12">
                   <p className="text-5xl font-black text-[#00DC82] uppercase">{deployStatus.state}</p>
                   <a href={`https://${deployStatus.url}`} target="_blank" rel="noopener noreferrer" className="block p-10 bg-[#020420] border border-[#1a1e43] rounded-[2rem] text-[#00DC82] font-mono text-2xl truncate">
                     {deployStatus.url}
                   </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <NeuralModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} title="Studio Protocol Config" size="lg">
        <div className="space-y-16">
          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase">Creativity Gain</label>
              <input type="range" min="0" max="1" step="0.1" value={modelConfig.temperature} onChange={(e) => setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)})} className="w-full" />
            </div>
            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-500 uppercase">Reasoning Depth</label>
              <select value={modelConfig.thinkingBudget} onChange={(e) => setModelConfig({...modelConfig, thinkingBudget: parseInt(e.target.value)})} className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-8 py-5 text-[12px] text-[#00DC82]">
                <option value="0">Standard</option>
                <option value="16384">Balanced</option>
                <option value="32768">Deep Neural</option>
              </select>
            </div>
          </div>
          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-500 uppercase">System Protocol</label>
             <textarea value={modelConfig.systemInstruction} onChange={(e) => setModelConfig({...modelConfig, systemInstruction: e.target.value})} className="w-full h-56 bg-[#020420] border border-[#1a1e43] rounded-3xl p-8 text-[13px] text-slate-400 outline-none resize-none custom-scrollbar" />
          </div>
        </div>
      </NeuralModal>
    </div>
  );
};

export default App;
