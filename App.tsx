
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { generateFullStackProject, convertToColabNotebook } from './services/geminiService';
import { deployToVercel } from './services/vercelService';
import { GitHubService } from './services/githubService';
import { GCSService } from './services/gcsService';
import { COMPONENT_LIBRARY } from './services/library';
import { NeuralModal, ModalTransition } from './components/NeuralModal';
import { PLUGIN_REGISTRY, getActiveInstructions } from './services/extensionService';
import { GeneratedFile, TabType, DeploymentStatus, ModelConfig, Extension } from './types';

const INITIAL_SYSTEM = `你是一个顶级进化级全栈 AI 编排 system (IntelliBuild Studio Core)。你正在操作一个分布式的代理集群。风格：极致简约、企业级、奢华。`;

const App: React.FC = () => {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    thinkingBudget: 0,
    systemInstruction: INITIAL_SYSTEM
  });

  const [extensions, setExtensions] = useState<Extension[]>(PLUGIN_REGISTRY);
  const [modalTransition, setModalTransition] = useState<ModalTransition>('slide');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<GeneratedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.WORKSPACE);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  
  // Deployment Credentials
  const [vercelToken, setVercelToken] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [githubIsPrivate, setGithubIsPrivate] = useState(true);
  const [githubInitReadme, setGithubInitReadme] = useState(true);
  const [githubStatus, setGithubStatus] = useState<string>('');
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);
  const [vercelStatus, setVercelStatus] = useState<string>('');
  
  const [projectName, setProjectName] = useState('agent-' + Math.floor(Math.random() * 1000));
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Command Palette Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRun = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setAgentLogs([]);
    
    try {
      const result = await generateFullStackProject(input, modelConfig, COMPONENT_LIBRARY);
      setCurrentFiles(result.files);
      setAgentLogs(result.agentLogs);
      setProjectName(result.projectName || projectName);
      setActiveTab(TabType.EDITOR);
    } catch (e: any) {
      alert("System Overload: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVercelDeploy = async () => {
    if (!vercelToken) return alert('Vercel API Token is required.');
    if (currentFiles.length === 0) return alert('No protocol files detected for synchronization.');
    
    setIsGenerating(true);
    setVercelStatus('Synchronizing with Vercel Cloud...');
    try {
      const status = await deployToVercel(currentFiles, vercelToken, projectName);
      setDeployment(status);
      setVercelStatus(`Node Established: ${status.url}`);
    } catch (err: any) {
      setVercelStatus(`Sync Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGitHubPush = async () => {
    if (!githubToken || !githubRepoName || !githubOwner) return alert('GitHub credentials required for source control.');
    if (currentFiles.length === 0) return alert('Generate code files before pushing to repository.');
    
    setIsGenerating(true);
    setGithubStatus('Provisioning Repository...');
    setGithubRepoUrl(null);
    try {
      const service = new GitHubService(githubToken);
      
      // Attempt to create the repository, ignore if it already exists
      try {
        await service.createRepository(githubRepoName, githubIsPrivate);
      } catch (e: any) {
        console.warn("Target repository may already exist, proceeding with push synchronization.");
      }

      const filesToPush = [...currentFiles];
      if (githubInitReadme) {
        filesToPush.push({ 
          path: 'README.md', 
          content: `# ${githubRepoName}\n\nAutomated delivery by Studio Agent Core. Optimized for enterprise performance and neural scalability.`, 
          type: 'config' 
        });
      }

      await service.initializeAndPush(githubOwner, githubRepoName, filesToPush);
      const url = `https://github.com/${githubOwner}/${githubRepoName}`;
      setGithubRepoUrl(url);
      setGithubStatus('Source Synchronized Successfully.');
    } catch (err: any) {
      setGithubStatus(`Pipeline Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#D1D1D1] font-sans overflow-hidden">
      {/* Sidebar - Antigravity Style */}
      <aside className="w-[72px] lg:w-64 border-r border-[#151515] flex flex-col bg-[#080808] transition-all duration-500 shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-[#151515] justify-center lg:justify-between overflow-hidden bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gold-gradient rounded flex items-center justify-center font-black text-[10px] text-black shadow-lg shadow-[#D4AF37]/20">A</div>
            <span className="hidden lg:block font-bold text-[11px] tracking-[0.2em] text-white">STUDIO AGENT</span>
          </div>
          <div className="hidden lg:block text-[9px] text-[#444] font-mono font-bold tracking-tighter">OS_V4</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-hide">
          <div className="px-4">
             <div className="hidden lg:block px-4 py-1 text-[8px] font-black text-[#333] uppercase tracking-[0.3em] mb-3">Communication</div>
             <SidebarItem active={activeTab === TabType.INBOX} onClick={() => setActiveTab(TabType.INBOX)} label="Inbox" icon={<InboxIcon />} />
             <SidebarItem active={activeTab === TabType.WORKSPACE} onClick={() => setActiveTab(TabType.WORKSPACE)} label="Playground" icon={<TerminalIcon />} />
          </div>

          <div className="px-4">
             <div className="hidden lg:block px-4 py-1 text-[8px] font-black text-[#333] uppercase tracking-[0.3em] mb-3">Development</div>
             <SidebarItem active={activeTab === TabType.EDITOR} onClick={() => setActiveTab(TabType.EDITOR)} label="Source Code" icon={<CodeIcon />} />
             <SidebarItem active={activeTab === TabType.BROWSER} onClick={() => setActiveTab(TabType.BROWSER)} label="Runtime View" icon={<BrowserIcon />} />
             <SidebarItem active={activeTab === TabType.KNOWLEDGE} onClick={() => setActiveTab(TabType.KNOWLEDGE)} label="Intelligence" icon={<BookIcon />} />
          </div>

          <div className="px-4">
             <div className="hidden lg:block px-4 py-1 text-[8px] font-black text-[#333] uppercase tracking-[0.3em] mb-3">Infrastructure</div>
             <SidebarItem active={activeTab === TabType.DEPLOY} onClick={() => setActiveTab(TabType.DEPLOY)} label="Deployment" icon={<RocketIcon />} />
             <SidebarItem active={activeTab === TabType.LOGS} onClick={() => setActiveTab(TabType.LOGS)} label="Telemetry" icon={<ActivityIcon />} />
             <SidebarItem active={activeTab === TabType.PLUGINS} onClick={() => setActiveTab(TabType.PLUGINS)} label="Core Modules" icon={<PuzzleIcon />} />
          </div>
        </nav>

        <div className="p-4 border-t border-[#151515] bg-black/20">
           <SidebarItem active={false} onClick={() => setShowInfoModal(true)} label="System Status" icon={<StatusDot active={!isGenerating} />} />
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-[#050505]">
        <header className="h-16 border-b border-[#151515] flex items-center px-8 justify-between bg-black/60 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3 text-[11px] font-bold tracking-widest text-[#555]">
             <span className="hover:text-white cursor-pointer transition-colors duration-300">{projectName.toUpperCase()}</span>
             <span className="text-[#222]">/</span>
             <span className="text-white bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">{activeTab}</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setShowCommandPalette(true)} className="flex items-center space-x-3 px-4 py-2 bg-[#0D0D0D] rounded-lg border border-[#1A1A1A] text-[10px] text-[#444] hover:border-[#D4AF37]/40 transition-all duration-500 gold-glow">
               <SearchIcon />
               <span className="tracking-widest">COMMAND CENTER</span>
               <span className="bg-[#1A1A1A] px-2 py-0.5 rounded font-black text-[#333] border border-[#222]">⌘K</span>
            </button>
            <div className="h-4 w-[1px] bg-[#1A1A1A]"></div>
            <button className="p-1 hover:text-[#D4AF37] transition-colors"><BellIcon /></button>
            <div className="w-8 h-8 rounded-lg bg-gold-gradient p-[1px]">
               <div className="w-full h-full bg-black rounded-lg flex items-center justify-center font-bold text-[10px] text-[#D4AF37]">SA</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === TabType.WORKSPACE && (
            <div className="h-full flex flex-col p-10 lg:p-16 max-w-6xl mx-auto w-full">
              <div className="flex-1 flex flex-col space-y-12">
                <div className="space-y-4">
                  <h1 className="text-4xl font-black text-white tracking-tighter">Evolve New Protocol</h1>
                  <p className="text-[#666] text-sm tracking-wide max-w-xl leading-relaxed uppercase font-bold text-[10px] opacity-60">Leverage distributed intelligence to architect, compile, and deploy professional-grade software systems.</p>
                </div>

                <div className="relative group p-1 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-[2.5rem] gold-glow">
                   <div className="bg-[#080808] border border-[#1A1A1A] rounded-[2.2rem] p-10 transition-all duration-700 group-focus-within:border-[#D4AF37]/50">
                      <textarea 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="w-full bg-transparent border-none text-xl lg:text-2xl min-h-[260px] outline-none text-white placeholder:text-[#222] font-medium resize-none tracking-tight leading-snug"
                        placeholder="Define the scope of the next iteration..."
                      />
                      <div className="flex justify-between items-center mt-6">
                         <div className="flex space-x-2">
                            <span className="text-[9px] font-black text-[#333] border border-[#111] px-2 py-1 rounded uppercase tracking-[0.2em]">Ready for Inference</span>
                         </div>
                         <button 
                            onClick={handleRun}
                            disabled={isGenerating || !input.trim()}
                            className="group flex items-center space-x-3 px-8 py-4 bg-gold-gradient text-black font-black text-[11px] rounded-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:grayscale uppercase tracking-[0.3em] shadow-2xl shadow-[#D4AF37]/20"
                          >
                            <span>{isGenerating ? 'Synthesizing...' : 'Execute Task'}</span>
                            {!isGenerating && <ArrowRightIcon />}
                         </button>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <LuxuryCard title="BROWSER SYNC" desc="Synchronize runtime state with local agent." icon={<VideoIcon />} />
                   <LuxuryCard title="NEURAL KNOWLEDGE" desc="Inject local documentation into agent context." icon={<BookIcon />} />
                   <LuxuryCard title="AGENT SWARM" desc="Coordinate multi-stage production pipelines." icon={<UsersIcon />} />
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.BROWSER && (
             <div className="h-full flex flex-col bg-[#050505]">
                <div className="h-12 border-b border-[#151515] bg-[#0A0A0A] flex items-center px-6 space-x-4">
                   <div className="flex items-center space-x-2">
                      <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors"><ChevronLeftIcon /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors"><ChevronRightIcon /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-md transition-colors"><RefreshIcon /></button>
                   </div>
                   <div className="flex-1 bg-black/60 border border-[#1A1A1A] rounded-lg px-4 py-1.5 text-[10px] text-[#444] flex items-center space-x-3 font-mono">
                      <span className="text-[#D4AF37]/60 font-black">HTTPS://</span>
                      <span className="tracking-widest">STUDIO-AGENT.INTERNAL/RUNTIME</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></div>
                      <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">CONTROL_ACTIVE</span>
                   </div>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.03)_0%,_transparent_70%)]"></div>
                   <div className="text-center space-y-6 z-10">
                      <div className="w-20 h-20 border-2 border-[#151515] border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
                      <p className="text-[10px] text-[#333] font-black uppercase tracking-[0.4em]">Linking Sub-Agent Viewport...</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === TabType.EDITOR && (
             <div className="h-full flex">
                <div className="w-64 border-r border-[#151515] bg-[#080808] flex flex-col">
                   <div className="p-4 text-[9px] font-black text-[#333] uppercase tracking-[0.3em] border-b border-[#151515] bg-black/20">Explorer</div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                      {currentFiles.length === 0 ? (
                        <div className="p-6 text-[9px] text-[#222] text-center font-bold italic uppercase tracking-widest">Protocol Empty</div>
                      ) : currentFiles.map((f, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedFileIndex(i)}
                          className={`w-full text-left px-4 py-2.5 text-[10px] font-bold rounded-lg truncate transition-all duration-300 border ${selectedFileIndex === i ? 'bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37]/30 shadow-lg' : 'text-[#444] border-transparent hover:bg-white/5 hover:text-[#888]'}`}
                        >
                          {f.path.split('/').pop()}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex-1 flex flex-col bg-[#050505]">
                   <div className="h-12 bg-[#080808] border-b border-[#151515] flex items-center px-6 justify-between">
                      <div className="flex items-center space-x-3">
                         <span className="text-[10px] font-mono font-bold text-[#333] uppercase tracking-widest">{currentFiles[selectedFileIndex]?.path || 'No Selection'}</span>
                         {currentFiles[selectedFileIndex] && <span className="w-1 h-1 rounded-full bg-[#333]"></span>}
                         <span className="text-[9px] font-black text-[#222] uppercase tracking-widest">{currentFiles[selectedFileIndex]?.type}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button className="px-4 py-1.5 bg-[#0D0D0D] hover:bg-[#151515] rounded-lg text-[9px] font-black uppercase tracking-widest text-[#444] border border-[#1A1A1A] transition-all">Audit</button>
                        <button className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#D4AF37]/20 transition-all">Refactor</button>
                      </div>
                   </div>
                   <div className="flex-1 relative border-t border-[#151515]/50">
                      <Editor 
                        height="100%" 
                        theme="vs-dark" 
                        defaultLanguage="typescript" 
                        value={currentFiles[selectedFileIndex]?.content || "// Establish a protocol to view synthesized source code"} 
                        options={{ 
                          fontSize: 13, 
                          minimap: { enabled: false }, 
                          padding: { top: 24 },
                          backgroundColor: '#050505'
                        }}
                      />
                   </div>
                </div>
             </div>
          )}

          {activeTab === TabType.DEPLOY && (
            <div className="h-full p-12 lg:p-20 overflow-y-auto custom-scrollbar bg-[#050505]">
               <div className="max-w-5xl mx-auto space-y-16">
                  <header className="space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Infrastructure Pipeline</h2>
                    <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.4em] max-w-lg leading-relaxed">Automate the production cycle from studio synthesis to global edge delivery.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="bg-[#080808] border border-[#151515] rounded-3xl p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                        <h3 className="flex items-center space-x-4 text-white font-black text-xs uppercase tracking-[0.3em]"><RocketIcon /> <span>Vercel Edge</span></h3>
                        <div className="space-y-6">
                           <InputField label="Inference Token" type="password" value={vercelToken} onChange={setVercelToken} placeholder="sk_..." />
                        </div>
                        <button 
                          onClick={handleVercelDeploy}
                          disabled={isGenerating || !vercelToken}
                          className="w-full py-5 bg-gold-gradient text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-[#D4AF37]/20 disabled:opacity-10"
                        >
                          {isGenerating ? 'SYNCHRONIZING...' : 'PROVISION TO EDGE'}
                        </button>
                        {vercelStatus && (
                          <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                             <p className="text-[9px] font-mono text-center text-[#444] uppercase tracking-widest break-all leading-relaxed">{vercelStatus}</p>
                             {deployment?.url && (
                               <a 
                                 href={`https://${deployment.url}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="block text-center text-[10px] font-black text-[#D4AF37] hover:text-white underline uppercase tracking-[0.3em] transition-colors"
                               >
                                 Open Production Deployment
                               </a>
                             )}
                          </div>
                        )}
                     </div>

                     <div className="bg-[#080808] border border-[#151515] rounded-3xl p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                        <h3 className="flex items-center space-x-4 text-white font-black text-xs uppercase tracking-[0.3em]"><CodeIcon /> <span>GitHub SCM</span></h3>
                        <div className="space-y-5">
                           <InputField label="Auth Token" type="password" value={githubToken} onChange={setGithubToken} placeholder="ghp_..." />
                           <div className="grid grid-cols-2 gap-5">
                              <InputField label="Namespace" value={githubOwner} onChange={setGithubOwner} placeholder="owner-name" />
                              <InputField label="Artifact ID" value={githubRepoName} onChange={setGithubRepoName} placeholder="repo-name" />
                           </div>
                           <div className="flex space-x-6 pt-2">
                             <Toggle label="Private Protocol" active={githubIsPrivate} onToggle={() => setGithubIsPrivate(!githubIsPrivate)} />
                             <Toggle label="Bootstrap README" active={githubInitReadme} onToggle={() => setGithubInitReadme(!githubInitReadme)} />
                           </div>
                        </div>
                        <button 
                          onClick={handleGitHubPush} 
                          disabled={isGenerating || !githubToken}
                          className="w-full py-5 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10 transition-all shadow-xl active:scale-95 disabled:opacity-10"
                        >
                          {isGenerating ? 'SYNCHRONIZING...' : 'SYNCHRONIZE SOURCE'}
                        </button>
                        {githubStatus && (
                          <div className="space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
                             <p className="text-[9px] font-mono text-center text-[#333] uppercase tracking-widest">{githubStatus}</p>
                             {githubRepoUrl && (
                               <a 
                                 href={githubRepoUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="block text-center text-[10px] font-black text-[#D4AF37] hover:text-white underline uppercase tracking-[0.3em] transition-colors"
                               >
                                 View on GitHub
                               </a>
                             )}
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === TabType.INBOX && <PlaceholderView title="Communications" icon={<InboxIcon />} desc="Consolidated data streams from distributed agent instances and webhooks." />}
          {activeTab === TabType.KNOWLEDGE && <PlaceholderView title="Neural Corpus" icon={<BookIcon />} desc="RAG-enabled knowledge base for deep architectural context." />}
          {activeTab === TabType.LOGS && <PlaceholderView title="Telemetry Streams" icon={<ActivityIcon />} desc="Real-time audit logs and hardware performance telemetry." />}
          {activeTab === TabType.PLUGINS && <PlaceholderView title="Core Extensions" icon={<PuzzleIcon />} desc="Expand the capabilities of the Studio Agent Core protocol." />}

        </div>
      </main>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4">
           <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowCommandPalette(false)}></div>
           <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-modal-zoom border-gold-subtle gold-glow">
              <div className="flex items-center px-6 py-6 border-b border-[#1A1A1A]">
                 <SearchIcon />
                 <input 
                   autoFocus
                   value={commandInput}
                   onChange={e => setCommandInput(e.target.value)}
                   className="flex-1 bg-transparent border-none outline-none text-xl px-5 text-white placeholder:text-[#222] font-medium tracking-tight" 
                   placeholder="Enter directive or search modules..."
                 />
                 <span className="text-[9px] text-[#444] font-black border border-[#1A1A1A] px-2 py-1 rounded uppercase tracking-widest">ESC</span>
              </div>
              <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-3">
                 <CommandItem label="Initiate Cloud Deployment" shortcut="⌘D" icon={<RocketIcon />} onClick={() => { setActiveTab(TabType.DEPLOY); setShowCommandPalette(false); }} />
                 <CommandItem label="Inspect Source Protocol" shortcut="⌘A" icon={<CodeIcon />} onClick={() => { setActiveTab(TabType.EDITOR); setShowCommandPalette(false); }} />
                 <CommandItem label="Toggle Deep Dark UI" shortcut="⇧D" icon={<MoonIcon />} />
                 <CommandItem label="Export to Jupyter Lab" shortcut="⌥C" icon={<BookIcon />} />
                 <CommandItem label="Reinitialize Git Pipeline" shortcut="G" icon={<TerminalIcon />} />
              </div>
           </div>
        </div>
      )}

      <NeuralModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        title="CORE DIAGNOSTICS" 
        transition={modalTransition}
        content={
          <div className="space-y-6">
             <div className="p-6 bg-black/60 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-[#333]">Inference Engine</span>
                   <span className="text-[#D4AF37]">GEMINI-3-PRO-ULTRA</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-[#333]">Communication Layer</span>
                   <span className="text-white">ENCRYPTED_SSL/TLS_V1.3</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span className="text-[#333]">Memory Buffer</span>
                   <span className="text-white">128K TOKENS ACTIVE</span>
                </div>
             </div>
             <p className="text-[10px] text-[#444] font-bold leading-relaxed uppercase tracking-widest">Studio Agent OS is operating at peak efficiency. Current latency is sub-10ms for local orchestration.</p>
          </div>
        } 
      />
    </div>
  );
};

// UI Components
const SidebarItem: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center lg:space-x-4 p-3 rounded-xl transition-all duration-300 ${active ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5' : 'text-[#444] hover:bg-white/5 hover:text-[#888] border border-transparent'}`}>
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] truncate">{label}</span>
  </button>
);

const CommandItem: React.FC<{ label: string; shortcut?: string; icon: React.ReactNode; onClick?: () => void }> = ({ label, shortcut, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between px-5 py-4 rounded-xl hover:bg-white/5 transition-all text-left text-[#555] hover:text-white group">
     <div className="flex items-center space-x-5">
        <span className="text-[#222] group-hover:text-[#D4AF37] transition-colors">{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
     </div>
     {shortcut && <span className="text-[9px] font-mono font-black text-[#222] tracking-tighter">{shortcut}</span>}
  </button>
);

const LuxuryCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="p-8 bg-[#080808] border border-[#151515] rounded-3xl hover:border-[#D4AF37]/30 transition-all duration-500 cursor-pointer group shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#D4AF37]/10 transition-all"></div>
     <div className="text-[#D4AF37]/40 mb-5 group-hover:text-[#D4AF37] group-hover:scale-110 transition-all duration-500">{icon}</div>
     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-3">{title}</h3>
     <p className="text-[9px] text-[#444] leading-relaxed uppercase font-bold tracking-widest">{desc}</p>
  </div>
);

const InputField: React.FC<{ label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#333] mb-3 block">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-black/60 border border-[#1A1A1A] rounded-xl p-4 text-[11px] font-mono focus:border-[#D4AF37]/50 focus:bg-black outline-none transition-all duration-300 text-white placeholder:text-[#222]" 
      placeholder={placeholder} 
    />
  </div>
);

const Toggle: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <button onClick={onToggle} className="flex items-center space-x-3 group">
    <div className={`w-9 h-5 rounded-full relative transition-all duration-500 ${active ? 'bg-gold-gradient shadow-lg shadow-[#D4AF37]/20' : 'bg-[#151515]'}`}>
       <div className={`absolute top-1 w-3 h-3 rounded-full bg-black transition-all duration-500 ${active ? 'left-5' : 'left-1'}`} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#333] group-hover:text-white transition-colors">{label}</span>
  </button>
);

const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode; desc: string }> = ({ title, icon, desc }) => (
  <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
     <div className="text-5xl text-[#111] animate-pulse">{icon}</div>
     <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h2>
     <p className="text-[10px] text-[#444] max-w-sm leading-relaxed uppercase font-bold tracking-[0.2em]">{desc}</p>
     <button className="px-10 py-3 bg-[#0D0D0D] border border-[#1A1A1A] hover:border-[#D4AF37]/40 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-[#333] transition-all duration-500">INITIALIZE MODULE</button>
  </div>
);

const StatusDot: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={`w-2 h-2 rounded-full ${active ? 'bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]' : 'bg-[#151515] animate-pulse'}`}></div>
);

// Icons
const InboxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const TerminalIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const CodeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const BrowserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const BookIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const RocketIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const PuzzleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M12.87 15.07l-2.09-2.09"></path><path d="M18.74 9.12l-2.09-2.09"></path></svg>;
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>;
const MoonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ChevronLeftIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const RefreshIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path></svg>;
const VideoIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const ArrowRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

export default App;
