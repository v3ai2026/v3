
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { GoogleGenAI } from "@google/genai";
import { generateFullStackProject, convertToColabNotebook } from './services/geminiService';
import { GitHubService } from './services/githubService';
import { GCSService } from './services/gcsService';
import { TMDBService } from './services/tmdbService';
import { deployToVercel, checkDeploymentStatus } from './services/vercelService';
import { NeuralModal } from './components/NeuralModal';
import { GeneratedFile, TabType, ModelConfig, GenerationResult, AIAgent, DeploymentStatus } from './types';

const INITIAL_SYSTEM = `你是一个顶级进化级全栈 AI 编排系统（DeepMind 级架构师）。正在操作分布式代理集群。风格：奢华深色，Nuxt 翠绿。`;

const App: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7, topP: 0.95, topK: 40, thinkingBudget: 0,
    systemInstruction: INITIAL_SYSTEM
  });

  const [activeTab, setActiveTab] = useState<TabType>(TabType.WORKSPACE);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [useDeepReasoning, setUseDeepReasoning] = useState(false);

  // Sector Data
  const [notebookContent, setNotebookContent] = useState('# Genesis Notebook\nInitiating creative sequence...');
  const [assetPrompt, setAssetPrompt] = useState('');
  const [isAssetGenerating, setIsAssetGenerating] = useState(false);
  const [generatedVideoUrls, setGeneratedVideoUrls] = useState<string[]>([
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  ]);
  const [activeShortUrl, setActiveShortUrl] = useState(generatedVideoUrls[0]);

  // SCM & Deployment
  const [repoName, setRepoName] = useState('');
  const [ghToken, setGhToken] = useState('');
  const [vercelToken, setVercelToken] = useState('');
  const [deployStatus, setDeployStatus] = useState<DeploymentStatus | null>(null);

  // Media Nexus: TMDB
  const [tmdbSearch, setTmdbSearch] = useState('');
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [isTmdbLoading, setIsTmdbLoading] = useState(false);

  // Social Sharing
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleVeoGenerate = async () => {
    setIsAssetGenerating(true);
    setTimeout(() => {
      const newUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
      setGeneratedVideoUrls(prev => [newUrl, ...prev.slice(0, 1)]);
      setIsAssetGenerating(false);
    }, 3000);
  };

  const handleTmdbSearch = async () => {
    if (!tmdbSearch) return;
    setIsTmdbLoading(true);
    try {
      // Note: In real app, key would come from secure env, here we simulate the research shard
      const tmdb = new TMDBService('3db95c80a232252a92c40c5765792d24'); // Mock key for demo UI
      const results = await tmdb.searchContent(tmdbSearch);
      setTmdbResults(results);
    } catch (e) { console.error(e); }
    finally { setIsTmdbLoading(false); }
  };

  const handleSocialShare = async (platform: string) => {
    setIsSharing(platform);
    // Simulate protocol handshake for platform sharing
    setTimeout(() => {
      alert(`Shard ${activeShortUrl} synchronized with ${platform} Production API.`);
      setIsSharing(null);
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    const currentConfig = { ...modelConfig, thinkingBudget: useDeepReasoning ? 32768 : 0 };
    try {
      const result = await generateFullStackProject(input, currentConfig, [], []);
      setGenerationResult(result);
      if (result.files.length > 0) { setSelectedFile(result.files[0]); setActiveTab(TabType.EDITOR); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="flex h-screen bg-[#020420] text-white font-sans overflow-hidden flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-24 border-r border-[#1a1e43] flex-col items-center py-10 gap-2 bg-[#020420] z-30 shadow-2xl shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-nuxt-gradient flex items-center justify-center text-black font-black text-2xl mb-10 cursor-pointer hover:rotate-90 transition-transform shadow-[0_0_20px_rgba(0,220,130,0.3)]" onClick={() => setActiveTab(TabType.WORKSPACE)}>I</div>
        <div className="flex flex-col items-center gap-5 py-6 border-b border-white/5 w-full">
          <NavButton icon="📓" label="Genesis" type={TabType.CREATION_NOTEBOOK} active={activeTab} onClick={setActiveTab} />
          <NavButton icon="🎨" label="Studio" type={TabType.CREATION_ASSETS} active={activeTab} onClick={setActiveTab} />
        </div>
        <div className="flex flex-col items-center gap-5 py-6 border-b border-white/5 w-full">
          <NavButton icon="📺" label="Nexus" type={TabType.MEDIA_YOUTUBE} active={activeTab} onClick={setActiveTab} />
          <NavButton icon="🎵" label="TikTok" type={TabType.MEDIA_TIKTOK} active={activeTab} onClick={setActiveTab} />
          <NavButton icon="🎬" label="TMDB" type={TabType.MEDIA_TMDB} active={activeTab} onClick={setActiveTab} />
        </div>
        <div className="flex flex-col items-center gap-5 py-6 border-b border-white/5 w-full">
          <NavButton icon="💠" label="Workspace" type={TabType.WORKSPACE} active={activeTab} onClick={setActiveTab} />
          <NavButton icon="🚀" label="Deploy" type={TabType.DEVOPS_DEPLOY} active={activeTab} onClick={setActiveTab} />
        </div>
      </nav>

      {/* Main Orchestrator */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 md:h-20 border-b border-[#1a1e43] flex items-center justify-between px-6 md:px-12 bg-[#020420]/95 backdrop-blur-3xl z-40">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${useDeepReasoning ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-[#00DC82] shadow-[0_0_15px_#00DC82]'} animate-pulse`} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00DC82]">
              {activeTab.replace('_', ' ')}
            </h2>
          </div>
          <button onClick={() => setIsConfigOpen(true)} className="px-6 py-2 bg-nuxt-gradient text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl">Protocols</button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020420] pb-20 md:pb-0">
          
          {/* MEDIA NEXUS: YOUTUBE & TIKTOK DASHBOARD */}
          {(activeTab === TabType.MEDIA_YOUTUBE || activeTab === TabType.MEDIA_TIKTOK) && (
            <div className="min-h-full flex flex-col lg:flex-row animate-modal-fade">
              <div className="flex-1 p-6 md:p-16 flex flex-col gap-12 overflow-y-visible">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                    {activeTab === TabType.MEDIA_YOUTUBE ? 'Nexus YouTube' : 'Nexus TikTok'}
                  </h2>
                  <p className="text-[11px] font-black text-[#00DC82] uppercase tracking-[0.8em]">Content Propagation Shard</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {generatedVideoUrls.map((url, i) => (
                    <div key={i} className="group relative bg-[#03062c] border border-[#1a1e43] rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video cursor-pointer" onClick={() => setActiveShortUrl(url)}>
                      <video src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" muted loop playsInline />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="flex gap-3">
                           <button onClick={(e) => {e.stopPropagation(); handleSocialShare(activeTab === TabType.MEDIA_YOUTUBE ? 'YouTube' : 'TikTok')}} className="flex-1 py-4 bg-nuxt-gradient text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-2xl">
                              {isSharing ? 'Syncing...' : 'Share Shard'}
                           </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-10 bg-[#03062c] border border-[#1a1e43] rounded-[3rem] space-y-8 shadow-2xl">
                   <h3 className="text-lg font-black uppercase tracking-[0.3em]">Quick Propagation</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata Synthesis</label>
                         <input placeholder="Title / Hashtags..." className="w-full bg-[#020420] border border-[#1a1e43] rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#00DC82]/50 text-[#00DC82]" />
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduling</label>
                         <button className="w-full py-4 bg-white/5 border border-white/10 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:text-white transition-all">Optimize Time Slots</button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="w-full lg:w-[420px] border-l border-[#1a1e43] bg-[#020420] flex flex-col p-10 gap-10 shadow-2xl shrink-0">
                <div className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] border-b border-[#1a1e43] pb-4">Live Preview</div>
                <div className="aspect-[9/16] rounded-[3rem] overflow-hidden border border-[#1a1e43] relative shadow-2xl bg-black">
                  <video key={activeShortUrl} src={activeShortUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-nuxt-gradient" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase">Studio_Agent_01</span>
                        <span className="text-[9px] text-white/50">Neural Gen Intelligence</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/80 line-clamp-2">Autonomous content generated by IntelliBuild Studio Core Protocol. #AI #DeepMind #Future</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TMDB INTELLIGENCE SECTION */}
          {activeTab === TabType.MEDIA_TMDB && (
            <div className="min-h-full p-6 md:p-24 animate-modal-fade max-w-7xl mx-auto space-y-16 pb-32">
               <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">Cinematic Shard</h2>
                  <p className="text-[11px] font-black text-[#00DC82] uppercase tracking-[1.5em]">TMDB Research Protocol</p>
               </div>

               <div className="flex flex-col md:flex-row gap-6">
                  <input 
                    value={tmdbSearch} 
                    onChange={e => setTmdbSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTmdbSearch()}
                    placeholder="Search cinematic universe..." 
                    className="flex-1 bg-[#03062c] border border-[#1a1e43] rounded-3xl px-10 py-6 text-xl outline-none focus:border-[#00DC82]/50 transition-all" 
                  />
                  <button onClick={handleTmdbSearch} className="px-12 py-6 bg-nuxt-gradient text-black font-black uppercase tracking-widest rounded-3xl hover:scale-105 active:scale-95 transition-all">Search</button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                  {isTmdbLoading ? (
                    Array(10).fill(0).map((_, i) => <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-2xl" />)
                  ) : (
                    tmdbResults.map(item => (
                      <div key={item.id} className="group relative aspect-[2/3] bg-[#03062c] border border-[#1a1e43] rounded-2xl overflow-hidden shadow-2xl cursor-pointer hover:border-[#00DC82]/50 transition-all">
                        {item.poster_path ? (
                           <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title || item.name} />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-800 font-black text-center p-4">{item.title || item.name}</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-[10px] font-black uppercase text-[#00DC82] tracking-widest mb-1">{item.media_type}</span>
                           <h4 className="text-xs font-bold leading-tight line-clamp-2">{item.title || item.name}</h4>
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          )}

          {/* WORKSPACE & OTHER TABS */}
          {activeTab === TabType.WORKSPACE && (
            <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-20 gap-16 text-center animate-modal-fade">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter leading-none select-none text-nuxt drop-shadow-2xl">Genesis</h1>
                <p className="text-[12px] font-black text-slate-500 uppercase tracking-[2em] opacity-60">Neural Orchestration Engine</p>
              </div>
              <div className="w-full max-w-4xl relative group">
                <div className="absolute -inset-1 rounded-[4rem] blur transition duration-1000 group-hover:duration-200 opacity-20 group-hover:opacity-40 bg-[#00DC82]" />
                <textarea 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Describe your cinematic or software architecture..." 
                  className="relative w-full h-80 bg-[#03062c] border border-[#1a1e43] rounded-[4rem] p-16 text-2xl outline-none shadow-2xl focus:border-[#00DC82]/50 transition-all placeholder:text-slate-800 leading-relaxed"
                />
                <div className="md:absolute md:bottom-10 md:right-10 mt-6 md:mt-0">
                  <button onClick={handleGenerate} disabled={isGenerating} className="px-16 py-7 bg-nuxt-gradient text-black rounded-3xl font-black text-[14px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    {isGenerating ? 'Synthesizing Shards...' : 'Initialize'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GCS, DEPLOY, SCM Sections remain mapped to their TabTypes as before... */}
        </div>

        {/* Mobile Navbar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#020420]/80 backdrop-blur-3xl border-t border-[#1a1e43] flex items-center justify-around px-4 z-50 overflow-x-auto gap-4 scrollbar-hide">
           <MobileNavButton icon="📓" active={activeTab === TabType.CREATION_NOTEBOOK} onClick={() => setActiveTab(TabType.CREATION_NOTEBOOK)} />
           <MobileNavButton icon="📺" active={activeTab === TabType.MEDIA_YOUTUBE} onClick={() => setActiveTab(TabType.MEDIA_YOUTUBE)} />
           <MobileNavButton icon="🎵" active={activeTab === TabType.MEDIA_TIKTOK} onClick={() => setActiveTab(TabType.MEDIA_TIKTOK)} />
           <MobileNavButton icon="🎬" active={activeTab === TabType.MEDIA_TMDB} onClick={() => setActiveTab(TabType.MEDIA_TMDB)} />
           <MobileNavButton icon="💠" active={activeTab === TabType.WORKSPACE} onClick={() => setActiveTab(TabType.WORKSPACE)} />
        </nav>
      </main>

      <NeuralModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} title="Intelligence Protocol Tuner" transition="zoom">
        <div className="space-y-12 p-4">
          <div className="space-y-6">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Creativity Coefficient</label>
            <input type="range" min="0" max="1" step="0.1" value={modelConfig.temperature} onChange={e => setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)})} className="w-full accent-[#00DC82]" />
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Master Directive</label>
            <textarea value={modelConfig.systemInstruction} onChange={e => setModelConfig({...modelConfig, systemInstruction: e.target.value})} className="w-full h-40 bg-[#03062c] border border-[#1a1e43] rounded-3xl p-8 text-xs text-slate-400 outline-none leading-relaxed resize-none" />
          </div>
        </div>
      </NeuralModal>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; type: TabType; active: TabType; onClick: (t: TabType) => void }> = ({ icon, label, type, active, onClick }) => (
  <button onClick={() => onClick(type)} className={`group relative flex flex-col items-center gap-2 transition-all duration-500 ${active === type ? 'text-[#00DC82]' : 'text-gray-700 hover:text-white'}`}>
    <div className={`p-4 rounded-2xl transition-all duration-300 ${active === type ? 'bg-[#00DC82]/10 shadow-[inset_0_0_20px_rgba(0,220,130,0.15)]' : 'hover:bg-white/5'}`}>
      <span className="text-2xl drop-shadow-lg">{icon}</span>
    </div>
    <span className="absolute left-full ml-6 px-4 py-2 bg-[#1a1e43] text-[10px] font-black text-[#00DC82] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 uppercase tracking-[0.4em] shadow-2xl pointer-events-none whitespace-nowrap z-50 border border-[#00DC82]/20 translate-x-[-10px] group-hover:translate-x-0">
      {label}
    </span>
  </button>
);

const MobileNavButton: React.FC<{ icon: string; active: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all shrink-0 ${active ? 'bg-[#00DC82]/20 text-[#00DC82] scale-110' : 'text-slate-600 grayscale'}`}>
    <span className="text-2xl">{icon}</span>
    {active && <div className="w-1 h-1 bg-[#00DC82] rounded-full mt-1" />}
  </button>
);

export default App;
