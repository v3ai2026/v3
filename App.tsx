
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
  const [modalTransition, setModalTransition] = useState<ModalTransition>('zoom');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<GeneratedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.WORKSPACE);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  
  // Deployment & SCM Credentials
  const [vercelToken, setVercelToken] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [githubIsPrivate, setGithubIsPrivate] = useState(true);
  const [githubInitReadme, setGithubInitReadme] = useState(true);
  const [githubStatus, setGithubStatus] = useState<string>('');
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);
  const [vercelStatus, setVercelStatus] = useState<string>('');
  
  const [projectName, setProjectName] = useState('AGENT-X-' + Math.floor(Math.random() * 1000));
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Sync state for GitHub
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);

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
    if (!githubToken) return alert('GitHub Personal Access Token is required.');
    if (!githubOwner) return alert('GitHub Namespace (Owner) is required.');
    if (!githubRepoName) return alert('Repository Name is required.');
    if (currentFiles.length === 0) return alert('Generate code files before pushing to repository.');
    
    setIsSyncingGithub(true);
    setGithubStatus('Provisioning Repository Shard...');
    setGithubRepoUrl(null);
    try {
      const service = new GitHubService(githubToken);
      
      // Step 1: Create Repository if it doesn't exist
      try {
        await service.createRepository(githubRepoName, githubIsPrivate);
        setGithubStatus('Repository Created. Initiating Shard Push...');
      } catch (e: any) {
        console.warn("Target repository may already exist or error occurred, proceeding with sync check.");
        setGithubStatus('Updating Existing Repository Shard...');
      }

      // Step 2: Prepare files
      const filesToPush = [...currentFiles];
      if (githubInitReadme) {
        filesToPush.push({ 
          path: 'README.md', 
          content: `# ${githubRepoName}\n\nAutomated delivery by Studio Agent Core.\n\nOptimized for enterprise performance and neural scalability.\n\n---\n*Generated by IntelliBuild Studio*`, 
          type: 'config' 
        });
      }

      // Step 3: Sequential Push (Safe for new/empty repos)
      await service.initializeAndPush(githubOwner, githubRepoName, filesToPush);
      
      const url = `https://github.com/${githubOwner}/${githubRepoName}`;
      setGithubRepoUrl(url);
      setGithubStatus('Source Synchronized Successfully.');
    } catch (err: any) {
      setGithubStatus(`Pipeline Error: ${err.message}`);
    } finally {
      setIsSyncingGithub(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#D1D1D1] font-sans overflow-hidden">
      {/* Sidebar - Premium Gold Trim */}
      <aside className="w-[72px] lg:w-64 border-r border-[#151515] flex flex-col bg-[#080808] transition-all duration-700 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#BF953F]/10 to-transparent"></div>
        <div className="h-16 flex items-center px-6 border-b border-[#151515] justify-center lg:justify-between overflow-hidden bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center font-black text-[11px] text-black shadow-lg shadow-[#BF953F]/10 transform hover:scale-105 transition-transform duration-500">A</div>
            <span className="hidden lg:block font-bold text-[10px] tracking-[0.4em] text-white opacity-80">STUDIO CORE</span>
          </div>
          <div className="hidden lg:block text-[9px] text-[#222] font-black tracking-widest uppercase">NX_04</div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 space-y-10 scrollbar-hide">
          <div className="px-5">
             <div className="hidden lg:block px-4 py-1 text-[7px] font-black text-[#222] uppercase tracking-[0.4em] mb-4">Neural Grid</div>
             <SidebarItem active={activeTab === TabType.INBOX} onClick={() => setActiveTab(TabType.INBOX)} label="Telemetry" icon={<InboxIcon />} />
             <SidebarItem active={activeTab === TabType.WORKSPACE} onClick={() => setActiveTab(TabType.WORKSPACE)} label="Playground" icon={<TerminalIcon />} />
          </div>

          <div className="px-5">
             <div className="hidden lg:block px-4 py-1 text-[7px] font-black text-[#222] uppercase tracking-[0.4em] mb-4">Architecture</div>
             <SidebarItem active={activeTab === TabType.EDITOR} onClick={() => setActiveTab(TabType.EDITOR)} label="Source Protocol" icon={<CodeIcon />} />
             <SidebarItem active={activeTab === TabType.BROWSER} onClick={() => setActiveTab(TabType.BROWSER)} label="Live Preview" icon={<BrowserIcon />} />
             <SidebarItem active={activeTab === TabType.KNOWLEDGE} onClick={() => setActiveTab(TabType.KNOWLEDGE)} label="Intelligence" icon={<BookIcon />} />
          </div>

          <div className="px-5">
             <div className="hidden lg:block px-4 py-1 text-[7px] font-black text-[#222] uppercase tracking-[0.4em] mb-4">Provisioning</div>
             <SidebarItem active={activeTab === TabType.DEPLOY} onClick={() => setActiveTab(TabType.DEPLOY)} label="Cloud Edge" icon={<RocketIcon />} />
             <SidebarItem active={activeTab === TabType.LOGS} onClick={() => setActiveTab(TabType.LOGS)} label="System Logs" icon={<ActivityIcon />} />
             <SidebarItem active={activeTab === TabType.PLUGINS} onClick={() => setActiveTab(TabType.PLUGINS)} label="Modules" icon={<PuzzleIcon />} />
          </div>
        </nav>

        <div className="p-5 border-t border-[#151515] bg-black/20">
           <SidebarItem active={false} onClick={() => setShowInfoModal(true)} label="System Core" icon={<StatusDot active={!isGenerating} />} />
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-[#050505]">
        <header className="h-16 border-b border-[#151515] flex items-center px-10 justify-between bg-black/60 backdrop-blur-xl z-10">
          <div className="flex items-center space-x-4 text-[10px] font-black tracking-[0.2em] text-[#444]">
             <span className="hover:text-white cursor-pointer transition-colors duration-500 uppercase">{projectName}</span>
             <span className="text-[#151515]">/</span>
             <span className="text-white bg-[#BF953F]/10 px-3 py-1 rounded-full border border-[#BF953F]/20 uppercase text-[9px] tracking-[0.3em] font-black">{activeTab}</span>
          </div>
          <div className="flex items-center space-x-8">
            <button onClick={() => setShowCommandPalette(true)} className="flex items-center space-x-4 px-5 py-2.5 bg-[#080808] rounded-xl border border-[#111] text-[9px] text-[#333] hover:border-[#BF953F]/40 transition-all duration-700 hover:bg-[#0a0a0a] gold-glow">
               <SearchIcon />
               <span className="tracking-[0.3em] font-black">COMMAND SYSTEM</span>
               <span className="bg-[#111] px-2 py-0.5 rounded font-black text-[#222] border border-[#151515]">⌘K</span>
            </button>
            <div className="h-4 w-[1px] bg-[#151515]"></div>
            <button className="p-1 hover:text-[#BF953F] transition-all duration-300"><BellIcon /></button>
            <div className="w-9 h-9 rounded-xl bg-gold-gradient p-[1px] shadow-lg shadow-black/50">
               <div className="w-full h-full bg-[#080808] rounded-xl flex items-center justify-center font-black text-[10px] text-[#BF953F]">SA</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === TabType.WORKSPACE && (
            <div className="h-full flex flex-col p-12 lg:p-24 max-w-7xl mx-auto w-full">
              <div className="flex-1 flex flex-col space-y-16">
                <div className="space-y-6">
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Architect & Compile</h1>
                  <p className="text-[#333] text-[9px] tracking-[0.5em] max-w-2xl leading-relaxed uppercase font-black opacity-80">Leverage distributed neural agents to synthesize enterprise ecosystems at the speed of thought.</p>
                </div>

                <div className="relative group p-[1px] bg-gradient-to-br from-[#BF953F]/30 to-transparent rounded-[3rem] gold-glow">
                   <div className="bg-[#080808] border border-[#111] rounded-[2.9rem] p-12 transition-all duration-1000 group-focus-within:border-[#BF953F]/40">
                      <textarea 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="w-full bg-transparent border-none text-2xl lg:text-3xl min-h-[280px] outline-none text-white placeholder:text-[#111] font-medium resize-none tracking-tight leading-snug custom-scrollbar"
                        placeholder="Define your next generation protocol..."
                      />
                      <div className="flex justify-between items-center mt-10">
                         <div className="flex items-center space-x-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BF953F] animate-pulse"></span>
                            <span className="text-[8px] font-black text-[#222] uppercase tracking-[0.4em]">Neural Core Ready</span>
                         </div>
                         <button 
                            onClick={handleRun}
                            disabled={isGenerating || !input.trim()}
                            className="group flex items-center space-x-4 px-10 py-5 bg-gold-gradient text-black font-black text-[11px] rounded-2xl transition-all duration-700 hover:scale-[1.03] active:scale-95 disabled:opacity-5 disabled:grayscale uppercase tracking-[0.4em] shadow-2xl shadow-[#BF953F]/20"
                          >
                            <span>{isGenerating ? 'Synthesizing...' : 'Initialize Build'}</span>
                            {!isGenerating && <ArrowRightIcon />}
                         </button>
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <LuxuryCard title="BROWSER SYNC" desc="Synchronize runtime state with core agent." icon={<VideoIcon />} />
                   <LuxuryCard title="NEURAL CORPUS" desc="Inject deep documentation into context." icon={<BookIcon />} />
                   <LuxuryCard title="AGENT SWARM" desc="Coordinate distributed production pipelines." icon={<UsersIcon />} />
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.BROWSER && (
             <div className="h-full flex flex-col bg-[#050505]">
                <div className="h-14 border-b border-[#151515] bg-[#070707] flex items-center px-8 space-x-6">
                   <div className="flex items-center space-x-3">
                      <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeftIcon /></button>
                      <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronRightIcon /></button>
                      <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><RefreshIcon /></button>
                   </div>
                   <div className="flex-1 bg-black/80 border border-[#111] rounded-xl px-6 py-2.5 text-[9px] text-[#333] flex items-center space-x-4 font-mono">
                      <span className="text-[#BF953F]/50 font-black">SECURE_LINK://</span>
                      <span className="tracking-[0.2em] font-bold">STUDIO.INTERNAL/OS_PREVIEW</span>
                   </div>
                   <div className="flex items-center space-x-3 bg-[#BF953F]/5 px-4 py-2 rounded-xl border border-[#BF953F]/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#BF953F] shadow-[0_0_10px_#BF953F]"></div>
                      <span className="text-[8px] text-[#BF953F] font-black uppercase tracking-[0.3em]">Runtime Active</span>
                   </div>
                </div>
                <div className="flex-1 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed opacity-50">
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                   <div className="text-center space-y-8 z-10">
                      <div className="w-24 h-24 border-2 border-[#111] border-t-[#BF953F] rounded-full animate-spin mx-auto shadow-2xl shadow-[#BF953F]/5"></div>
                      <p className="text-[9px] text-[#222] font-black uppercase tracking-[0.6em] animate-pulse">Establishing Sub-Agent Viewport...</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === TabType.EDITOR && (
             <div className="h-full flex">
                <div className="w-[280px] border-r border-[#151515] bg-[#070707] flex flex-col">
                   <div className="p-6 text-[8px] font-black text-[#222] uppercase tracking-[0.5em] border-b border-[#151515] bg-black/40">File Explorer</div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
                      {currentFiles.length === 0 ? (
                        <div className="p-10 text-[8px] text-[#151515] text-center font-black uppercase tracking-[0.3em]">Protocol Empty</div>
                      ) : currentFiles.map((f, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedFileIndex(i)}
                          className={`w-full text-left px-5 py-3.5 text-[10px] font-bold rounded-xl truncate transition-all duration-500 border ${selectedFileIndex === i ? 'bg-[#BF953F]/5 text-[#BF953F] border-[#BF953F]/30 shadow-2xl' : 'text-[#333] border-transparent hover:bg-white/5 hover:text-[#555]'}`}
                        >
                          {f.path.split('/').pop()}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex-1 flex flex-col bg-[#050505]">
                   <div className="h-14 bg-[#070707] border-b border-[#151515] flex items-center px-8 justify-between">
                      <div className="flex items-center space-x-4">
                         <span className="text-[10px] font-mono font-bold text-[#222] uppercase tracking-[0.3em]">{currentFiles[selectedFileIndex]?.path || 'System_IDLE'}</span>
                         {currentFiles[selectedFileIndex] && <span className="w-1 h-1 rounded-full bg-[#151515]"></span>}
                         <span className="text-[8px] font-black text-[#111] uppercase tracking-[0.4em]">{currentFiles[selectedFileIndex]?.type || 'WAITING'}</span>
                      </div>
                      <div className="flex space-x-4">
                        <button className="px-5 py-2 bg-[#080808] hover:bg-[#111] rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-[#333] border border-[#111] transition-all">Audit</button>
                        <button className="px-5 py-2 bg-[#BF953F]/10 text-[#BF953F] hover:bg-[#BF953F]/20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border border-[#BF953F]/20 transition-all">Refactor</button>
                      </div>
                   </div>
                   <div className="flex-1 relative border-t border-[#151515]/30">
                      <Editor 
                        height="100%" 
                        theme="vs-dark" 
                        defaultLanguage="typescript" 
                        value={currentFiles[selectedFileIndex]?.content || "// Establish source protocol to view synchronized logic."} 
                        options={{ 
                          fontSize: 14, 
                          minimap: { enabled: false }, 
                          padding: { top: 32, bottom: 32 },
                          fontFamily: 'JetBrains Mono',
                          lineNumbersMinChars: 4
                        }}
                      />
                   </div>
                </div>
             </div>
          )}

          {activeTab === TabType.DEPLOY && (
            <div className="h-full p-16 lg:p-32 overflow-y-auto custom-scrollbar bg-[#050505]">
               <div className="max-w-6xl mx-auto space-y-24">
                  <header className="space-y-6">
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Cloud SCM Pipeline</h2>
                    <p className="text-[9px] font-black text-[#222] uppercase tracking-[0.6em] max-w-xl leading-relaxed">Execute zero-latency deployment protocols for global distributed architecture.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     {/* VERCEL DEPLOY CARD */}
                     <div className="bg-[#080808] border border-[#111] rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group hover:border-[#BF953F]/20 transition-all duration-700">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BF953F]/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-[#BF953F]/10 transition-all duration-1000"></div>
                        <h3 className="flex items-center space-x-5 text-white font-black text-[10px] uppercase tracking-[0.4em]"><RocketIcon /> <span>Vercel Deploy</span></h3>
                        <div className="space-y-8">
                           <InputField label="Vercel Access Token" type="password" value={vercelToken} onChange={setVercelToken} placeholder="sk_..." />
                        </div>
                        <button 
                          onClick={handleVercelDeploy}
                          disabled={isGenerating || !vercelToken}
                          className="w-full py-6 bg-gold-gradient text-black font-black rounded-3xl text-[10px] uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#BF953F]/20 disabled:opacity-5"
                        >
                          {isGenerating ? 'SYNC_ACTIVE...' : 'PUSH TO EDGE'}
                        </button>
                        {vercelStatus && (
                          <div className="space-y-5 bg-black/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                             <p className="text-[9px] font-mono text-center text-[#444] uppercase tracking-[0.3em] break-all leading-relaxed">{vercelStatus}</p>
                             {deployment?.url && (
                               <a 
                                 href={`https://${deployment.url}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="block text-center text-[9px] font-black text-[#BF953F] hover:text-white underline uppercase tracking-[0.4em] transition-all"
                               >
                                 Access Artifact
                               </a>
                             )}
                          </div>
                        )}
                     </div>

                     {/* GITHUB SYNC CARD */}
                     <div className="bg-[#080808] border border-[#111] rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden group hover:border-[#BF953F]/20 transition-all duration-700">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BF953F]/5 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-[#BF953F]/10 transition-all duration-1000"></div>
                        <h3 className="flex items-center space-x-5 text-white font-black text-[10px] uppercase tracking-[0.4em]"><CodeIcon /> <span>GitHub Source Control</span></h3>
                        <div className="space-y-6">
                           <InputField label="Personal Access Token" type="password" value={githubToken} onChange={setGithubToken} placeholder="ghp_..." />
                           <div className="grid grid-cols-2 gap-6">
                              <InputField label="Namespace (Owner)" value={githubOwner} onChange={setGithubOwner} placeholder="OWNER" />
                              <InputField label="Repository Name" value={githubRepoName} onChange={setGithubRepoName} placeholder="REPO" />
                           </div>
                           <div className="flex flex-wrap gap-8 pt-4">
                             <Toggle label="Private Repository" active={githubIsPrivate} onToggle={() => setGithubIsPrivate(!githubIsPrivate)} />
                             <Toggle label="Auto-Generate README" active={githubInitReadme} onToggle={() => setGithubInitReadme(!githubInitReadme)} />
                           </div>
                        </div>
                        <button 
                          onClick={handleGitHubPush} 
                          disabled={isSyncingGithub || !githubToken || !githubOwner || !githubRepoName}
                          className="w-full py-6 border border-[#BF953F]/30 bg-[#BF953F]/5 text-[#BF953F] font-black rounded-3xl text-[10px] uppercase tracking-[0.5em] hover:bg-[#BF953F]/10 transition-all shadow-xl active:scale-95 disabled:opacity-20"
                        >
                          {isSyncingGithub ? 'PROVISIONING SHARD...' : 'SYNCHRONIZE SOURCE'}
                        </button>
                        {githubStatus && (
                          <div className="space-y-5 bg-black/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-md">
                             <div className="flex items-center justify-center space-x-3">
                               {isSyncingGithub && <span className="w-1.5 h-1.5 rounded-full bg-[#BF953F] animate-ping"></span>}
                               <p className="text-[9px] font-mono text-center text-[#999] uppercase tracking-[0.3em]">{githubStatus}</p>
                             </div>
                             {githubRepoUrl && (
                               <a 
                                 href={githubRepoUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="block text-center text-[9px] font-black text-[#BF953F] hover:text-white underline uppercase tracking-[0.4em] transition-all"
                               >
                                 Access Source Repository
                               </a>
                             )}
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === TabType.INBOX && <PlaceholderView title="Neural Stream" icon={<InboxIcon />} desc="Synchronized telemetry from distributed agent shards." />}
          {activeTab === TabType.KNOWLEDGE && <PlaceholderView title="Architecture Corpus" icon={<BookIcon />} desc="High-density knowledge base for RAG-enabled architectural reasoning." />}
          {activeTab === TabType.LOGS && <PlaceholderView title="System Telemetry" icon={<ActivityIcon />} desc="Real-time hardware and software audit metrics." />}
          {activeTab === TabType.PLUGINS && <PlaceholderView title="Core Modules" icon={<PuzzleIcon />} desc="Expand the capabilities of the Studio Agent Core environment." />}

        </div>
      </main>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
           <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowCommandPalette(false)}></div>
           <div className="relative w-full max-w-3xl bg-[#080808] border border-[#151515] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden animate-modal-zoom border-gold-subtle gold-glow">
              <div className="flex items-center px-8 py-8 border-b border-[#111]">
                 <SearchIcon />
                 <input 
                   autoFocus
                   value={commandInput}
                   onChange={e => setCommandInput(e.target.value)}
                   className="flex-1 bg-transparent border-none outline-none text-2xl px-6 text-white placeholder:text-[#111] font-medium tracking-tight" 
                   placeholder="Execute command or locate module..."
                 />
                 <span className="text-[8px] text-[#222] font-black border border-[#111] px-3 py-1.5 rounded-full uppercase tracking-[0.4em]">ESC</span>
              </div>
              <div className="max-h-[460px] overflow-y-auto custom-scrollbar p-4">
                 <CommandItem label="Initiate Deployment" shortcut="⌘D" icon={<RocketIcon />} onClick={() => { setActiveTab(TabType.DEPLOY); setShowCommandPalette(false); }} />
                 <CommandItem label="Inspect Protocols" shortcut="⌘A" icon={<CodeIcon />} onClick={() => { setActiveTab(TabType.EDITOR); setShowCommandPalette(false); }} />
                 <CommandItem label="Darkroom UI Toggle" shortcut="⇧D" icon={<MoonIcon />} />
                 <CommandItem label="Export Jupyter" shortcut="⌥C" icon={<BookIcon />} />
                 <CommandItem label="Reset Git Shard" shortcut="G" icon={<TerminalIcon />} />
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
          <div className="space-y-8">
             <div className="p-8 bg-black/80 rounded-[2rem] border border-white/5 space-y-6 shadow-2xl">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em]">
                   <span className="text-[#222]">Inference Node</span>
                   <span className="text-[#BF953F]">GEMINI-3-ULTRA-PREVIEW</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em]">
                   <span className="text-[#222]">Network Layer</span>
                   <span className="text-white">QUANTUM_SECURE/V2</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em]">
                   <span className="text-[#222]">Neural Buffer</span>
                   <span className="text-white">1.2M CONTEXT ACTIVE</span>
                </div>
             </div>

             <div className="space-y-4">
               <label className="text-[8px] font-black text-[#222] uppercase tracking-[0.4em]">Active Transition Protocol</label>
               <div className="grid grid-cols-2 gap-3">
                  {(['zoom', 'slide', 'fade', 'fadeSlideIn'] as ModalTransition[]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setModalTransition(t)}
                      className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${modalTransition === t ? 'bg-[#BF953F]/10 text-[#BF953F] border-[#BF953F]/40' : 'bg-black/40 text-[#333] border-[#111] hover:text-[#555]'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
             </div>
             
             <p className="text-[9px] text-[#333] font-black leading-relaxed uppercase tracking-[0.5em] text-center">Studio Agent Core is running at optimal synchronization levels.</p>
          </div>
        } 
      />
    </div>
  );
};

// UI Components
const SidebarItem: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center lg:space-x-5 p-3.5 rounded-2xl transition-all duration-700 ${active ? 'bg-[#BF953F]/10 text-[#BF953F] border border-[#BF953F]/30 shadow-2xl shadow-[#BF953F]/5' : 'text-[#222] hover:bg-white/5 hover:text-[#555] border border-transparent'}`}>
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.4em] truncate">{label}</span>
  </button>
);

const CommandItem: React.FC<{ label: string; shortcut?: string; icon: React.ReactNode; onClick?: () => void }> = ({ label, shortcut, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between px-6 py-5 rounded-2xl hover:bg-white/5 transition-all text-left text-[#333] hover:text-white group">
     <div className="flex items-center space-x-6">
        <span className="text-[#111] group-hover:text-[#BF953F] transition-all duration-500">{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-[0.4em]">{label}</span>
     </div>
     {shortcut && <span className="text-[8px] font-mono font-black text-[#151515] tracking-tighter">{shortcut}</span>}
  </button>
);

const LuxuryCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="p-10 bg-[#080808] border border-[#111] rounded-[2.5rem] hover:border-[#BF953F]/30 transition-all duration-1000 cursor-pointer group shadow-2xl relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-[#BF953F]/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:bg-[#BF953F]/10 transition-all duration-1000"></div>
     <div className="text-[#BF953F]/20 mb-6 group-hover:text-[#BF953F] group-hover:scale-110 transition-all duration-700">{icon}</div>
     <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-4">{title}</h3>
     <p className="text-[8px] text-[#222] leading-relaxed uppercase font-black tracking-[0.4em] opacity-80">{desc}</p>
  </div>
);

const InputField: React.FC<{ label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="text-[8px] font-black uppercase tracking-[0.5em] text-[#222] mb-4 block">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-black/60 border border-[#111] rounded-2xl p-5 text-[12px] font-mono focus:border-[#BF953F]/40 focus:bg-black outline-none transition-all duration-700 text-white placeholder:text-[#111]" 
      placeholder={placeholder} 
    />
  </div>
);

const Toggle: React.FC<{ label: string; active: boolean; onToggle: () => void }> = ({ label, active, onToggle }) => (
  <button onClick={onToggle} className="flex items-center space-x-4 group">
    <div className={`w-11 h-6 rounded-full relative transition-all duration-1000 ${active ? 'bg-gold-gradient shadow-2xl shadow-[#BF953F]/30' : 'bg-[#111]'}`}>
       <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-700 ${active ? 'left-6' : 'left-1'}`} />
    </div>
    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#222] group-hover:text-[#444] transition-colors duration-500">{label}</span>
  </button>
);

const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode; desc: string }> = ({ title, icon, desc }) => (
  <div className="h-full flex flex-col items-center justify-center p-16 text-center space-y-8">
     <div className="text-6xl text-[#111] animate-pulse">{icon}</div>
     <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{title}</h2>
     <p className="text-[9px] text-[#222] max-w-sm leading-relaxed uppercase font-black tracking-[0.4em]">{desc}</p>
     <button className="px-12 py-4 bg-[#080808] border border-[#111] hover:border-[#BF953F]/40 hover:text-white rounded-2xl text-[8px] font-black uppercase tracking-[0.5em] text-[#222] transition-all duration-1000">EXECUTE PROVISIONING</button>
  </div>
);

const StatusDot: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-[#BF953F] shadow-[0_0_15px_#BF953F]' : 'bg-[#151515] animate-pulse'}`}></div>
);

// Icons
const InboxIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M22 12h-6l-2 3h-4l-2-3H2"></path><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>;
const TerminalIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
const CodeIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const BrowserIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const BookIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const RocketIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>;
const ActivityIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const PuzzleIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M12.87 15.07l-2.09-2.09"></path><path d="M18.74 9.12l-2.09-2.09"></path></svg>;
const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>;
const MoonIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const ChevronLeftIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const RefreshIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path></svg>;
const VideoIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
const UsersIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" className="group-hover:translate-x-2 transition-transform duration-500"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

export default App;
