
// @google/genai guidelines followed: Always use process.env.API_KEY directly for API calls.
import React, { useState, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { generateFullStackProject } from './services/geminiService';
import { deployToVercel } from './services/vercelService';
import { performNeuralCrawl, ScrapeResult } from './services/scraperService';
import { COMPONENT_LIBRARY, TEMPLATE_LIBRARY } from './services/library';
import { NeuralModal, ModalTransition } from './components/NeuralModal';
import { PLUGIN_REGISTRY, getActiveInstructions } from './services/extensionService';
import { GeneratedFile, TabType, DeploymentStatus, ModelConfig, Extension, GenerationResult } from './types';

const INITIAL_SYSTEM = `你是一个顶级进化级全栈 AI 编排 system (IntelliBuild Studio Core)。你正在操作一个分布式的代理集群。风格：极致简约、企业级、奢华金。`;

const App: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    thinkingBudget: 0,
    systemInstruction: INITIAL_SYSTEM
  });

  const [extensions, setExtensions] = useState<Extension[]>(PLUGIN_REGISTRY);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.WORKSPACE);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [deployStatus, setDeployStatus] = useState<DeploymentStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTransition, setModalTransition] = useState<ModalTransition>('fadeSlideIn');
  const [vercelToken, setVercelToken] = useState('');

  // Browser & Knowledge State
  const [browserInput, setBrowserInput] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<ScrapeResult | null>(null);
  const [knowledgeVault, setKnowledgeVault] = useState<(ScrapeResult & { selected: boolean })[]>([]);

  const selectedShards = useMemo(() => 
    knowledgeVault.filter(s => s.selected).map(s => `[SHARD]: ${s.summary}`), 
  [knowledgeVault]);

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      const instructions = getActiveInstructions(extensions);
      const result = await generateFullStackProject(input, modelConfig, COMPONENT_LIBRARY, selectedShards);
      setGenerationResult(result);
      if (result.files.length > 0) {
        setSelectedFile(result.files[0]);
        setActiveTab(TabType.EDITOR);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNeuralCrawl = async () => {
    if (!browserInput) return;
    setIsCrawling(true);
    try {
      const result = await performNeuralCrawl(browserInput);
      setCrawlResult(result);
      setKnowledgeVault(prev => [{ ...result, selected: true }, ...prev]);
    } catch (error) {
      alert('Neural Crawl failed.');
    } finally {
      setIsCrawling(false);
    }
  };

  const toggleShardSelection = (index: number) => {
    setKnowledgeVault(prev => prev.map((s, i) => i === index ? { ...s, selected: !s.selected } : s));
  };

  const handleDeploy = async () => {
    if (!generationResult || !vercelToken) return;
    try {
      const status = await deployToVercel(generationResult.files, vercelToken, generationResult.projectName);
      setDeployStatus(status);
      setActiveTab(TabType.DEPLOY);
    } catch (error) {
      alert('Deployment failed.');
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-20 border-r border-[#222] flex flex-col items-center py-8 gap-8 bg-[#0a0a0a] relative z-20">
        <div className="w-10 h-10 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center text-black font-black text-lg mb-4 cursor-pointer" onClick={() => setActiveTab(TabType.WORKSPACE)}>I</div>
        {(Object.keys(TabType) as Array<keyof typeof TabType>).map((key) => {
          const tab = TabType[key];
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`p-3 rounded-xl transition-all ${activeTab === tab ? 'bg-white/10 text-[#D4AF37]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`} title={key}>
              <div className="w-5 h-5 flex items-center justify-center text-[10px] font-black tracking-tighter">{key.substring(0, 2)}</div>
            </button>
          );
        })}
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-[#222] flex items-center justify-between px-10 bg-black/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Protocol: {activeTab}</span>
            {selectedShards.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">{selectedShards.length} CONTEXT SHARDS INJECTED</span>
              </div>
            )}
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black tracking-widest uppercase hover:bg-white/10 transition-colors">Config</button>
        </header>

        <div className="flex-1 overflow-hidden bg-[#0a0a0a]">
          {activeTab === TabType.WORKSPACE && (
            <div className="h-full flex flex-col items-center justify-center p-10 max-w-4xl mx-auto text-center gap-10 animate-modal-fade">
              <div className="space-y-4">
                <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gold-gradient">IntelliBuild</h1>
                <p className="text-gray-500 text-[10px] font-black tracking-[0.6em] uppercase">Enterprise SaaS Orchestrator</p>
              </div>
              <div className="w-full relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Define your SaaS vision (e.g., 'Modern bento-grid analytics dashboard for crypto')..."
                  className="w-full h-48 bg-[#0a0a0a] border border-[#222] rounded-[2.5rem] p-10 text-xl outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/5 transition-all resize-none shadow-2xl"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="absolute bottom-8 right-8 px-10 py-4 bg-gold-gradient text-black rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-gold active:scale-95 transition-all"
                >
                  {isGenerating ? 'Synthesizing...' : 'Initialize Build'}
                </button>
              </div>
              <div className="flex gap-4 flex-wrap justify-center opacity-60">
                {TEMPLATE_LIBRARY.map(tpl => (
                  <button key={tpl.id} onClick={() => setInput(tpl.description)} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:border-[#D4AF37]/30 transition-all">{tpl.name}</button>
                ))}
              </div>
            </div>
          )}

          {activeTab === TabType.BROWSER && (
            <div className="h-full flex flex-col p-12 max-w-6xl mx-auto gap-8 animate-modal-fade">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Neural Browser</h2>
                  <p className="text-[10px] font-black text-gray-600 tracking-[0.4em] uppercase">Playwright-Optimized Intelligent Crawling</p>
                </div>
                <button onClick={() => setActiveTab(TabType.KNOWLEDGE)} className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest underline decoration-[#D4AF37]/30">Open Vault</button>
              </div>
              <div className="flex gap-4 p-1.5 bg-[#121212] border border-[#222] rounded-[2rem]">
                <input 
                  type="text" 
                  value={browserInput}
                  onChange={e => setBrowserInput(e.target.value)}
                  placeholder="Target URL or Intelligence Topic..."
                  className="flex-1 bg-transparent px-8 py-5 text-sm outline-none font-medium"
                />
                <button 
                  onClick={handleNeuralCrawl}
                  disabled={isCrawling}
                  className="px-10 py-5 bg-gold-gradient text-black rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-gold"
                >
                  {isCrawling ? 'PROBING...' : 'SCRAPE DATA'}
                </button>
              </div>

              {crawlResult && (
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 animate-modal-slide">
                  <div className="p-10 bg-[#121212] border border-[#222] rounded-[2.5rem] relative group border-gold-subtle shadow-2xl">
                    <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-6 border-b border-[#222] pb-4">Synthesized Logic Shard</h3>
                    <div className="text-sm text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{crawlResult.summary}</div>
                    <button 
                      onClick={() => { setInput(`Based on this data: ${crawlResult.summary}\nBuild a UI that visualizes this information.`); setActiveTab(TabType.WORKSPACE); }}
                      className="mt-8 px-8 py-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
                    >
                      GENERATE FROM SCRAPE
                    </button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-4">Grounding Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {crawlResult.sources.map((src, i) => (
                        <a key={i} href={src.uri} target="_blank" className="p-5 bg-[#121212] border border-[#222] rounded-2xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
                          <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#D4AF37] truncate max-w-[200px]">{src.title}</span>
                          <span className="text-[9px] font-black text-[#D4AF37]/40 uppercase">Open Site</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === TabType.KNOWLEDGE && (
            <div className="h-full p-16 max-w-6xl mx-auto overflow-y-auto custom-scrollbar animate-modal-fade">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Intelligence Vault</h2>
                  <p className="text-[10px] font-black text-gray-600 tracking-[0.4em] uppercase">Contextual Memory Injection</p>
                </div>
                {knowledgeVault.length === 0 ? (
                  <div className="p-32 border-2 border-dashed border-[#222] rounded-[3rem] text-center flex flex-col items-center gap-6">
                    <div className="text-[10px] font-black text-[#222] uppercase tracking-[0.4em]">Vault Synchronizing...</div>
                    <button onClick={() => setActiveTab(TabType.BROWSER)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white">Begin Scrape Protocol</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {knowledgeVault.map((shard, i) => (
                      <div key={i} onClick={() => toggleShardSelection(i)} className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${shard.selected ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-gold' : 'bg-[#121212] border-[#222] hover:border-[#D4AF37]/40'}`}>
                        <div className="flex justify-between items-center mb-6">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${shard.selected ? 'bg-[#D4AF37] text-black border-transparent' : 'bg-black/40 text-[#D4AF37] border-[#D4AF37]/20'}`}>
                            {shard.selected ? 'INJECTED' : 'VAULTED'}
                          </span>
                          <span className="text-[8px] font-bold text-gray-700 uppercase tracking-tighter">{shard.sources.length} VERIFIED SOURCES</span>
                        </div>
                        <p className={`text-xs leading-relaxed font-medium line-clamp-4 ${shard.selected ? 'text-white' : 'text-gray-500'}`}>{shard.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === TabType.EDITOR && generationResult && (
            <div className="h-full flex overflow-hidden animate-modal-fade">
              <div className="w-72 border-r border-[#222] bg-[#050505] overflow-y-auto">
                <div className="p-6 text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-[#222]">Project Shards</div>
                {generationResult.files.map(file => (
                  <button key={file.path} onClick={() => setSelectedFile(file)} className={`w-full text-left px-8 py-4 text-xs font-bold border-l-2 transition-all ${selectedFile?.path === file.path ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}>
                    {file.path.split('/').pop()}
                  </button>
                ))}
              </div>
              <div className="flex-1">
                <Editor height="100%" theme="vs-dark" path={selectedFile?.path} defaultLanguage="typescript" value={selectedFile?.content} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 } }} />
              </div>
            </div>
          )}

          {activeTab === TabType.DEPLOY && (
            <div className="h-full flex flex-col items-center justify-center p-10 max-w-2xl mx-auto text-center gap-10 animate-modal-fade">
              <div className="w-20 h-20 bg-gold-gradient rounded-3xl shadow-gold flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase">Vercel Deployment</h2>
              {!deployStatus ? (
                <div className="w-full space-y-6 bg-[#0a0a0a] border border-[#222] p-10 rounded-[3rem] shadow-2xl">
                  <input type="password" placeholder="Vercel API Token" value={vercelToken} onChange={(e) => setVercelToken(e.target.value)} className="w-full bg-black border border-[#222] rounded-2xl px-8 py-5 text-sm outline-none focus:border-[#D4AF37]/50 transition-all" />
                  <button onClick={handleDeploy} className="w-full py-6 bg-gold-gradient text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl shadow-gold hover:scale-[1.02] transition-transform">Deploy to Production</button>
                </div>
              ) : (
                <div className="w-full p-10 bg-[#0a0a0a] border border-[#222] rounded-[3rem] text-left shadow-gold-subtle">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Protocol URL</span>
                    <a href={`https://${deployStatus.url}`} target="_blank" rel="noopener noreferrer" className="block text-[#D4AF37] font-mono text-xl hover:underline">{deployStatus.url}</a>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-8">Status: <span className="text-[#D4AF37]">{deployStatus.state}</span></p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <NeuralModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Studio Core Configuration" transition={modalTransition} size="lg">
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Temperature</label>
              <input type="range" min="0" max="1" step="0.1" value={modelConfig.temperature} onChange={(e) => setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)})} className="w-full accent-[#D4AF37] bg-white/5 h-1.5 rounded-full appearance-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reasoning Shards</label>
              <select value={modelConfig.thinkingBudget} onChange={(e) => setModelConfig({...modelConfig, thinkingBudget: parseInt(e.target.value)})} className="w-full bg-black border border-[#222] rounded-2xl px-6 py-4 text-[11px] font-bold text-gray-300 outline-none">
                <option value="0">Standard Inference</option>
                <option value="16384">Balanced Reasoning</option>
                <option value="32768">Deep Reasoning</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Instruction Protocol</label>
            <textarea value={modelConfig.systemInstruction} onChange={(e) => setModelConfig({...modelConfig, systemInstruction: e.target.value})} className="w-full h-32 bg-black border border-[#222] rounded-2xl p-6 text-xs font-mono text-gray-400 outline-none resize-none" />
          </div>
        </div>
      </NeuralModal>
    </div>
  );
};

export default App;
