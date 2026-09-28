"use client";

import { useState } from "react";
import { Zap, GitPullRequest, Bug, TerminalSquare, Search, Plus, Play, ChevronRight, Activity, Database, Globe } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Session = {
  id: string;
  title: string;
  clientName: string;
  targetUrl: string;
  logs: string[];
  fix: string;
  state: "idle" | "analyzing" | "completed";
};

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([{
    id: Date.now().toString(),
    title: "Investigate Traffic Drop",
    clientName: "festopiya",
    targetUrl: "",
    logs: [],
    fix: "",
    state: "idle"
  }]);
  
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const activeSession = sessions.find(s => s.id === activeSessionId)!;
  
  const [traffic, setTraffic] = useState(8500);
  const [isDeploying, setIsDeploying] = useState(false);

  const updateActiveSession = (updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, ...updates } : s));
  };

  const createNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "New Investigation",
      clientName: "new_client",
      targetUrl: "",
      logs: [],
      fix: "",
      state: "idle"
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  // 1. Simulate Webhook Deploy
  const handleDeploy = async () => {
    setIsDeploying(true);
    const changes = `Changed H1 tags to client-side rendering for ${activeSession.clientName} vendor pages`;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiUrl}/api/webhook/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes, client_name: activeSession.clientName }),
      });
      alert(`Webhook sent! Deployed code changes and logged to Hindsight memory for ${activeSession.clientName}.`);
    } catch (e) {
      console.error(e);
      alert("Error deploying");
    }
    setIsDeploying(false);
  };

  // 2. Trigger Analysis (with live scraping and memory)
  const handleTrafficDrop = async () => {
    setTraffic(4200);
    updateActiveSession({ 
      state: "analyzing",
      title: activeSession.targetUrl ? `Analyze ${activeSession.targetUrl}` : `Investigate ${activeSession.clientName}`,
      logs: [],
      fix: ""
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/trigger-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          issue: "Organic traffic dropped by 50% overnight", 
          client_name: activeSession.clientName,
          target_url: activeSession.targetUrl || undefined
        }),
      });
      const data = await res.json();
      updateActiveSession({
        logs: data.hindsight_memory_retrieved || [],
        fix: data.analysis_and_fix || "No analysis available.",
        state: "completed"
      });
    } catch (e) {
      console.error(e);
      updateActiveSession({
        fix: "Error reaching backend.",
        state: "completed"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <nav className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer hover:opacity-80">
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              Nexus
            </div>
          </Link>
          <span className="text-gray-300 mx-2">/</span>
          <input 
            type="text" 
            value={activeSession.clientName}
            onChange={(e) => updateActiveSession({ clientName: e.target.value })}
            className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-gray-400 w-32"
            placeholder="Client ID (e.g. acme)"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className={traffic < 5000 ? "text-red-600" : "text-green-600"}>Traffic: {traffic.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleDeploy} 
            disabled={isDeploying}
            className="text-xs font-medium bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            {isDeploying ? 'Sending Webhook...' : 'Fire Mock CI Webhook'}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sessions */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col p-4 flex-shrink-0 overflow-y-auto">
          <button 
            onClick={createNewSession}
            className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity w-full text-left"
          >
            <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white shadow-sm text-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
            New session
          </button>
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">History</div>
          <div className="flex flex-col gap-1 mb-6">
            {sessions.map(s => (
              <div 
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors ${activeSessionId === s.id ? 'bg-white border border-gray-200 shadow-sm text-gray-900' : 'text-gray-600 hover:bg-gray-100 border border-transparent'}`}
              >
                {s.targetUrl ? <Globe className={`w-4 h-4 ${activeSessionId === s.id ? 'text-blue-600' : 'text-gray-400'}`} /> : <Zap className={`w-4 h-4 ${activeSessionId === s.id ? 'text-blue-600' : 'text-gray-400'}`} />}
                <span className="truncate">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
          
          {/* Header */}
          <div className="h-16 border-b border-gray-100 flex items-center px-6 relative z-10 bg-white/80 backdrop-blur-sm">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              {activeSession.targetUrl ? <Globe className="w-5 h-5 text-blue-600" /> : <Zap className="w-5 h-5 text-blue-600" />}
              {activeSession.title}
            </h1>
          </div>
          
          {/* Feed */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-20">
              
              {/* Intro / Prompt Box */}
              <div className="flex flex-col gap-4">
                <div className="self-end bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl rounded-tr-sm text-sm md:text-base max-w-[85%] border border-gray-200 shadow-sm">
                  The organic traffic for <strong>{activeSession.clientName}</strong> has suddenly dropped by 50%. Let's investigate the recent changes and find the root cause.
                </div>
                
                {activeSession.state === "idle" && (
                  <div className="self-end flex flex-col items-end gap-3 mt-2 bg-white border border-gray-200 shadow-sm p-4 rounded-xl max-w-md w-full">
                    <div className="text-sm font-medium text-gray-700 w-full mb-1">Target URL to Scrape (Optional)</div>
                    <input 
                      type="url" 
                      value={activeSession.targetUrl}
                      onChange={(e) => updateActiveSession({ targetUrl: e.target.value })}
                      placeholder="e.g. https://example.com"
                      className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400 w-full shadow-inner bg-gray-50"
                    />
                    <button 
                      onClick={handleTrafficDrop}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 w-full justify-center mt-2"
                    >
                      <Play className="w-4 h-4" />
                      Run Web Scraper & Memory Analysis
                    </button>
                  </div>
                )}
              </div>

              {/* Agent Thinking State */}
              {activeSession.state === "analyzing" && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-[85%]">
                    <div className="text-sm font-medium text-gray-500">Nexus is analyzing...</div>
                    <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl rounded-tl-sm flex flex-col gap-3">
                      {activeSession.targetUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4 text-blue-500 animate-pulse" />
                          Scraping live DOM from {activeSession.targetUrl}...
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Database className="w-4 h-4 text-gray-500 animate-pulse" />
                        Fetching isolated memory context for {activeSession.clientName}...
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-black animate-spin" />
                        Generating root cause analysis...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Completed State */}
              {activeSession.state === "completed" && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full">
                    <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      Nexus <span className="text-xs text-gray-400 font-normal">Just now</span>
                    </div>
                    
                    {/* Hindsight Logs Card */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 text-xs font-medium text-gray-600">
                        <Database className="w-3.5 h-3.5" />
                        Memory Retrieved for {activeSession.clientName}
                      </div>
                      <div className="p-4 bg-gray-50/50 max-h-48 overflow-y-auto">
                        {activeSession.logs.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {activeSession.logs.map((log, idx) => (
                              <div key={idx} className="text-xs font-mono text-gray-600 bg-white border border-gray-200 p-2.5 rounded-md">
                                {log}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No previous webhook logs found for this client ID.</div>
                        )}
                      </div>
                    </div>

                    {/* Analysis Card with ReactMarkdown */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                      <div className="bg-blue-50/50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                        <TerminalSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Root Cause Analysis & Fix</span>
                      </div>
                      <div className="p-6">
                        <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed font-sans">
                          <ReactMarkdown>
                            {activeSession.fix.split('Learned SEO Rule:')[0]}
                          </ReactMarkdown>
                        </div>
                        
                        {activeSession.fix.includes('Learned SEO Rule:') && (
                          <div className="mt-8 bg-gray-900 text-gray-100 p-5 rounded-lg flex flex-col gap-2 shadow-inner">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-yellow-400" />
                              Learned Rule Added to Memory
                            </div>
                            <div className="text-sm font-mono leading-relaxed text-blue-100">
                              {activeSession.fix.split('Learned SEO Rule:')[1].trim()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
