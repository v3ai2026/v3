
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { generateFrontendProject } from './services/geminiService';
import { deployToVercel, checkDeploymentStatus } from './services/vercelService';
import { ChatMessage, GeneratedFile, TabType, DeploymentStatus } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<GeneratedFile[]>([]);
  const [currentComponent, setCurrentComponent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>(TabType.EDITOR);
  const [vercelToken, setVercelToken] = useState('');
  const [projectName, setProjectName] = useState('my-ai-project');
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateFrontendProject(input);
      const assistantMsg: ChatMessage = { 
        role: 'assistant', 
        content: `I've generated the **${result.componentName}** component. You can view and edit the code in the editor.`,
        files: result.files,
        componentName: result.componentName
      };
      setMessages(prev => [...prev, assistantMsg]);
      setCurrentFiles(result.files);
      setCurrentComponent(result.componentName);
      setActiveTab(TabType.EDITOR);
    } catch (err: any) {
      setError(err.message || "Failed to generate component");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    if (!vercelToken || !projectName || currentFiles.length === 0) {
      setError("Please provide a Vercel token and project name.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const dep = await deployToVercel(currentFiles, vercelToken, projectName);
      setDeployment(dep);
    } catch (err: any) {
      setError(err.message || "Deployment failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (index: number, newValue: string | undefined) => {
    if (newValue === undefined) return;
    setCurrentFiles(prev => {
      const next = [...prev];
      next[index] = { ...next[index], content: newValue };
      return next;
    });
  };

  useEffect(() => {
    let interval: any;
    if (deployment && deployment.state !== 'READY' && deployment.state !== 'ERROR') {
      interval = setInterval(async () => {
        try {
          const status = await checkDeploymentStatus(deployment.id, vercelToken);
          setDeployment(status);
          if (status.state === 'READY' || status.state === 'ERROR') {
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Status check failed", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [deployment, vercelToken]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Left Sidebar: Chat */}
      <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900 shadow-xl">
        <header className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">iB</div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                IntelliBuild
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Smart AI Compiler</p>
            </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 opacity-50 px-6">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <svg className="text-slate-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 10 4 2-4 2"/><path d="m6 10-4 2 4 2"/><path d="m12 2 2 4-2 2-2-4Z"/><path d="m12 16 2 4-2 2-2-4Z"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3 className="text-slate-300 font-bold mb-1">Welcome Master</h3>
              <p className="text-sm">Describe a React component you want to generate. I'll build it with Tailwind CSS.</p>
              <div className="mt-6 text-left space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-600">Try these:</p>
                <button onClick={() => setInput("An animated gradient button with a hover effect")} className="w-full text-left p-2 rounded bg-slate-800/50 border border-slate-800 text-xs hover:border-blue-500 transition-colors">Animated gradient button...</button>
                <button onClick={() => setInput("A modern dashboard sidebar with collapsible menu")} className="w-full text-left p-2 rounded bg-slate-800/50 border border-slate-800 text-xs hover:border-blue-500 transition-colors">Modern dashboard sidebar...</button>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                m.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'bg-slate-800 border border-slate-700'
              }`}>
                {m.content}
                {m.componentName && (
                  <div className="mt-2 flex items-center space-x-2 text-[10px] text-emerald-400 font-bold bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-900/50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <span>{m.componentName}.tsx generated</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-slate-400">Architecting component...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          {error && <div className="mb-2 text-[10px] font-bold text-red-400 bg-red-900/20 p-2 rounded border border-red-800 flex items-center">
            <svg className="mr-2 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your component (e.g. A login form with glassmorphism)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pr-12 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-24 transition-all placeholder:text-slate-600"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
            />
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !input.trim()}
              className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-all active:scale-90 shadow-lg shadow-blue-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Content: Editor / Preview / Deploy */}
      <div className="flex-1 flex flex-col bg-slate-950">
        <nav className="flex items-center px-4 bg-slate-900 border-b border-slate-800 h-14">
          <div className="flex space-x-1 h-full items-center">
            <TabButton active={activeTab === TabType.EDITOR} onClick={() => setActiveTab(TabType.EDITOR)} label="Code Editor" />
            <TabButton active={activeTab === TabType.PREVIEW} onClick={() => setActiveTab(TabType.PREVIEW)} label="Live Preview" />
            <TabButton active={activeTab === TabType.DEPLOY} onClick={() => setActiveTab(TabType.DEPLOY)} label="Cloud Deploy" />
          </div>
          <div className="ml-auto flex items-center space-x-4">
             {deployment && (
               <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center space-x-2 ${
                 deployment.state === 'READY' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-blue-900/30 text-blue-400 border border-blue-800/50 animate-pulse'
               }`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${deployment.state === 'READY' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                 <span>Vercel: {deployment.state}</span>
               </div>
             )}
          </div>
        </nav>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === TabType.EDITOR && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-40">
                    <svg className="mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p className="text-sm font-bold uppercase tracking-wider">Empty Workspace</p>
                  </div>
                ) : (
                  currentFiles.map((file, i) => (
                    <div key={i} className="mb-8 border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-900/30">
                      <div className="bg-slate-800/80 px-4 py-2 flex justify-between items-center text-[11px] font-bold border-b border-slate-700/50">
                        <div className="flex items-center space-x-2">
                           <span className="w-2.5 h-2.5 rounded-full bg-blue-500/20 border border-blue-500/50"></span>
                           <span className="text-slate-200">{file.path}</span>
                        </div>
                        <div className="flex space-x-2">
                           <button 
                             onClick={() => navigator.clipboard.writeText(file.content)}
                             className="text-slate-400 hover:text-white transition-colors bg-slate-700/50 px-2 py-1 rounded border border-slate-600"
                           >Copy</button>
                        </div>
                      </div>
                      <div className="h-[500px] border-b border-slate-800">
                        <Editor
                          height="100%"
                          defaultLanguage="typescript"
                          path={file.path}
                          value={file.content}
                          theme="vs-dark"
                          onChange={(value) => handleFileChange(i, value)}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 }
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === TabType.PREVIEW && (
            <div className="h-full bg-white text-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              <div className="relative z-10 text-center p-10 bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-2xl">
                <div className="mb-4 text-slate-400">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Component Sandbox</h3>
                  <p className="mt-3 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Visualizing <b>{currentComponent || 'Code'}</b>. Changes in the editor will reflect once you trigger a fresh deployment or in this preview simulation.
                  </p>
                </div>
                <div className="mt-8 flex justify-center space-x-3">
                  <button 
                    onClick={() => setActiveTab(TabType.EDITOR)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 text-sm"
                  >
                    Modify Code
                  </button>
                  <button 
                    onClick={() => setActiveTab(TabType.DEPLOY)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/10 active:scale-95 text-sm"
                  >
                    Go Live
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === TabType.DEPLOY && (
            <div className="h-full p-8 flex justify-center overflow-y-auto">
              <div className="max-w-xl w-full space-y-8 pb-20">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  
                  <h2 className="text-2xl font-black mb-2 flex items-center tracking-tight">
                    Cloud Orchestrator
                  </h2>
                  <p className="text-slate-500 text-xs mb-8 uppercase font-bold tracking-widest">Deploying to Vercel Infrastructure</p>
                  
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Vercel API Token</label>
                      <input 
                        type="password"
                        value={vercelToken}
                        onChange={(e) => setVercelToken(e.target.value)}
                        placeholder="••••••••••••••••••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/30 border-slate-700/50 outline-none transition-all placeholder:text-slate-800"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Project Identifier</label>
                      <input 
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="my-intelligent-component"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/30 border-slate-700/50 outline-none transition-all"
                      />
                    </div>
                    <button 
                      onClick={handleDeploy}
                      disabled={isGenerating || currentFiles.length === 0}
                      className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 py-4 rounded-2xl font-black text-white shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2 group"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Provisioning...</span>
                        </>
                      ) : (
                        <>
                          <span>Push to Production</span>
                          <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </>
                      )}
                    </button>
                  </div>

                  {deployment && (
                    <div className="mt-10 p-5 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Status</span>
                        <div className="flex items-center space-x-2">
                           <span className={`w-2 h-2 rounded-full ${deployment.state === 'READY' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
                           <span className={`text-[10px] font-black uppercase ${deployment.state === 'READY' ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {deployment.state}
                           </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Endpoint</span>
                        <a 
                          href={`https://${deployment.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 font-bold truncate max-w-[180px] bg-blue-950/30 px-2 py-1 rounded border border-blue-900/50"
                        >
                          {deployment.url}
                        </a>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                        <div className={`h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-1000 ease-out ${deployment.state === 'READY' ? 'w-full' : 'w-[40%]'}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900/5 p-6 rounded-3xl border border-blue-900/20 text-slate-400">
                  <h4 className="font-black text-slate-200 text-xs mb-3 uppercase tracking-widest flex items-center">
                    <svg className="mr-2 text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    Deployment Protocol
                  </h4>
                  <ul className="space-y-3 text-[11px] leading-relaxed">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-black">01.</span>
                      <span>The AI compiles <b>{currentComponent || 'source'}</b> into high-performance React modules.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-black">02.</span>
                      <span>Assets are bundled and optimized for the Vercel Edge Network.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 font-black">03.</span>
                      <span>A production-ready environment is provisioned with a custom SSL certificate.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 h-full text-[11px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center ${
      active ? 'text-white border-blue-500 bg-slate-800/30' : 'text-slate-500 border-transparent hover:text-slate-300'
    }`}
  >
    {label}
  </button>
);

export default App;
