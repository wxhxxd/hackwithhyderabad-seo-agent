"use client";

import { useState } from "react";
import { Zap, GitPullRequest, Bug, TerminalSquare, Search, Plus, Play, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [fix, setFix] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [traffic, setTraffic] = useState(8500);
  const [trafficStatus, setTrafficStatus] = useState("Stable");
  const [sessionState, setSessionState] = useState<"idle" | "analyzing" | "completed">("idle");

  // 1. Simulate Vercel Code Deploy
  const handleDeploy = async () => {
    setIsDeploying(true);
    const changes = "Changed H1 tags to client-side rendering for Festopiya vendor pages";
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${apiUrl}/api/webhook/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      alert("Deployed code changes and logged to Hindsight memory.");
    } catch (e) {
      console.error(e);
      alert("Error deploying");
    }
    setIsDeploying(false);
  };

  // 2. Simulate Traffic Drop
  const handleTrafficDrop = async () => {
    setTraffic(4200);
    setTrafficStatus("Critical Drop!");
    setIsAnalyzing(true);
    setSessionState("analyzing");
    setLogs([]);
    setFix("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/trigger-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: "Organic traffic dropped by 50% overnight" }),
      });
      const data = await res.json();
      setLogs(data.hindsight_memory_retrieved || []);
      setFix(data.analysis_and_fix || "No analysis available.");
      setSessionState("completed");
    } catch (e) {
      console.error(e);
      setFix("Error reaching backend.");
      setSessionState("completed");
    }
    setIsAnalyzing(false);
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
          <span className="text-sm font-medium text-gray-600">Festopiya</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <span className={traffic < 5000 ? "text-red-600" : "text-green-600"}>Traffic: {traffic.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleDeploy} 
            disabled={isDeploying}
            className="text-xs font-medium bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            {isDeploying ? 'Deploying...' : 'Simulate Code Deploy'}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Sessions */}
        <div className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col p-4 flex-shrink-0 overflow-y-auto">
          <button className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-70 transition-opacity w-full text-left">
            <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center bg-white shadow-sm text-xs">
              <Plus className="w-3.5 h-3.5" />
            </div>
            New session
          </button>
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Pinned</div>
          <div className="flex flex-col gap-1 mb-6">
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium flex items-center gap-2 text-gray-900 cursor-pointer">
              <Zap className="w-4 h-4 text-blue-600" />
              Investigate Traffic Drop
            </div>
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
              <GitPullRequest className="w-4 h-4 text-gray-400" />
              Fix H1 render issue
            </div>
          </div>
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">More</div>
          <div className="flex flex-col gap-1">
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
              <Bug className="w-4 h-4 text-gray-400" />
              Patch vulnerable deps
            </div>
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
              <Search className="w-4 h-4 text-gray-400" />
              Review API changes
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
          
          {/* Header */}
          <div className="h-16 border-b border-gray-100 flex items-center px-6 relative z-10 bg-white/80 backdrop-blur-sm">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Investigate Traffic Drop
            </h1>
          </div>
          
          {/* Feed */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-20">
              
              {/* Intro / Prompt Box */}
              <div className="flex flex-col gap-4">
                <div className="self-end bg-gray-100 text-gray-900 px-5 py-3 rounded-2xl rounded-tr-sm text-sm md:text-base max-w-[85%] border border-gray-200">
                  The organic traffic for Festopiya has suddenly dropped by 50%. Let's investigate the recent changes and find the root cause.
                </div>
                
                {sessionState === "idle" && (
                  <div className="self-end">
                    <button 
                      onClick={handleTrafficDrop}
                      className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Run Analysis Simulation
                    </button>
                  </div>
                )}
              </div>

              {/* Agent Thinking State */}
              {sessionState === "analyzing" && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-3 w-full max-w-[85%]">
                    <div className="text-sm font-medium text-gray-500">Nexus is analyzing...</div>
                    <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl rounded-tl-sm flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-black animate-spin" />
                        Fetching recent deployment logs from Hindsight Memory...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent Completed State */}
              {sessionState === "completed" && (
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
                        Hindsight Context Retrieved
                      </div>
                      <div className="p-4 bg-gray-50/50 max-h-48 overflow-y-auto">
                        {logs.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {logs.map((log, idx) => (
                              <div key={idx} className="text-xs font-mono text-gray-600 bg-white border border-gray-200 p-2.5 rounded-md">
                                {log}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No recent logs found.</div>
                        )}
                      </div>
                    </div>

                    {/* Analysis Card */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                      <div className="bg-blue-50/50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                        <TerminalSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">Root Cause Analysis & Fix</span>
                      </div>
                      <div className="p-5">
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                          {fix.split('Learned SEO Rule:')[0]}
                        </div>
                        
                        {fix.includes('Learned SEO Rule:') && (
                          <div className="mt-6 bg-gray-900 text-gray-100 p-4 rounded-lg flex flex-col gap-2">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Learned Rule Added to Memory</div>
                            <div className="text-sm font-mono leading-relaxed text-blue-200">
                              {fix.split('Learned SEO Rule:')[1].trim()}
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
