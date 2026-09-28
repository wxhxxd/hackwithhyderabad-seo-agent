"use client";

import { useState } from "react";

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [fix, setFix] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [traffic, setTraffic] = useState(8500);
  const [trafficStatus, setTrafficStatus] = useState("Stable");

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
    } catch (e) {
      console.error(e);
      setFix("Error reaching backend.");
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col p-8">
      <header className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-blue-500">Autonomous SEO Dashboard</h1>
        <p className="text-gray-400">Client: Festopiya</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-grow">
        
        {/* Main Content Area: Dashboard */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Top Section: Live Traffic Chart */}
          <section className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-300">Live Organic Traffic</h2>
              <div className={`text-5xl font-bold mt-2 ${traffic < 5000 ? 'text-red-500' : 'text-green-500'}`}>
                {traffic.toLocaleString()} <span className="text-lg font-normal text-gray-500">visitors/day</span>
              </div>
              <div className={`mt-1 font-medium ${traffic < 5000 ? 'text-red-400' : 'text-green-400'}`}>
                Status: {trafficStatus}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeploy} 
                disabled={isDeploying}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeploying ? 'Deploying...' : 'Simulate Vercel Code Deploy'}
              </button>
              <button 
                onClick={handleTrafficDrop} 
                disabled={isAnalyzing}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Simulate Traffic Drop'}
              </button>
            </div>
          </section>

          {/* Action UI: Generated Fix & New Learned Rule */}
          <section className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex-grow flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Agent Output: Generated Fix & New Learned Rule</h2>
            <div className="flex-grow bg-gray-950 rounded-lg p-6 border border-gray-800 overflow-y-auto">
              {isAnalyzing ? (
                <div className="animate-pulse text-yellow-500 font-mono">Agent is analyzing recent changes...</div>
              ) : fix ? (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">{fix}</p>
                </div>
              ) : (
                <div className="text-gray-600 italic">Waiting for an anomaly to investigate...</div>
              )}
            </div>
          </section>

        </div>

        {/* Sidebar: Memory UI */}
        <aside className={`w-full lg:w-1/3 p-6 rounded-xl shadow-lg border flex flex-col transition-colors duration-500 ${isAnalyzing || logs.length > 0 ? 'bg-indigo-950 border-indigo-500 shadow-indigo-900/50' : 'bg-gray-900 border-gray-800'}`}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
              <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Nexus Autonomous Investigation
            </h2>
            <p className="text-gray-400 text-sm mt-1">Hindsight memory logs retrieved for anomaly context.</p>
          </div>

          <div className="flex-grow flex flex-col gap-3 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, idx) => (
                <div key={idx} className="bg-gray-950 p-4 rounded-lg border border-indigo-500/30">
                  <p className="text-sm font-mono text-indigo-300">{log}</p>
                </div>
              ))
            ) : isAnalyzing ? (
              <div className="text-indigo-400 text-sm italic flex items-center justify-center h-full border border-dashed border-indigo-800 rounded-lg p-6 font-mono">
                Searching Hindsight Memory...
              </div>
            ) : (
              <div className="text-gray-600 text-sm italic flex items-center justify-center h-full border border-dashed border-gray-800 rounded-lg p-6">
                System idle.
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
