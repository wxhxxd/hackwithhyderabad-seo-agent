"use client";

import Link from "next/link";
import { ChevronRight, Zap, Play, TerminalSquare, Search, Bug, GitPullRequest, LayoutTemplate, Database } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            Nexus
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <span className="cursor-pointer hover:text-black">Product</span>
            <span className="cursor-pointer hover:text-black">Solutions</span>
            <span className="cursor-pointer hover:text-black">Resources</span>
            <span className="cursor-pointer hover:text-black">Customers</span>
            <span className="cursor-pointer hover:text-black">Pricing</span>
            <span className="cursor-pointer hover:text-black">Blog</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="hidden md:block cursor-pointer text-gray-600 hover:text-black">Get a demo</span>
          <span className="hidden md:block cursor-pointer text-gray-600 hover:text-black">Login</span>
          <Link href="/dashboard">
            <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full transition-colors flex items-center gap-2">
              Get started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1200px] mx-auto px-8 pt-24 pb-20 flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] max-w-4xl mb-6">
          Meet Nexus, your team's autonomous SEO engineer
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          Nexus runs in the cloud or on your machine, analyzes traffic drops in its own environment, and won't stop until the SEO fix is ready to merge.
        </p>
        
        <div className="flex items-center gap-4 mb-24">
          <Link href="/dashboard">
            <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-colors text-lg">
              Get started
            </button>
          </Link>
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors text-lg">
            Book a demo
          </button>
        </div>

        {/* Mock UI Showcase */}
        <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative z-10">
          {/* Mac window header */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto bg-white border border-gray-200 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-gray-500 shadow-sm">
              <Search className="w-3 h-3" />
              nexus.ai/dashboard
            </div>
            <div className="w-12" /> {/* Spacer */}
          </div>
          
          {/* Mock App Content */}
          <div className="flex h-[450px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-100 p-4 bg-gray-50/50 flex flex-col text-left">
              <div className="flex items-center gap-2 text-sm font-medium mb-6">
                <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center bg-white shadow-sm text-xs">+</div>
                New session
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Sessions</div>
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium flex items-center gap-2 text-blue-600">
                  <Zap className="w-4 h-4" />
                  Investigate Traffic Drop
                </div>
                <div className="px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-gray-400" />
                  Fix H1 render issue
                </div>
                <div className="px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2">
                  <Bug className="w-4 h-4 text-gray-400" />
                  Patch vulnerable deps
                </div>
              </div>
            </div>
            
            {/* Main Area */}
            <div className="flex-1 p-8 bg-white relative overflow-hidden flex flex-col justify-end text-left">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              
              <div className="relative z-10 flex flex-col gap-4 max-w-2xl mx-auto w-full">
                <div className="self-end bg-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                  Organic traffic dropped by 50% overnight. Find out why and fix it.
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-sm font-medium mb-3">
                        <TerminalSquare className="w-4 h-4 text-gray-500" />
                        Nexus Analysis
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        I've analyzed the recent deployment logs from Hindsight. The traffic drop was caused by a decommissioned AI model (`mixtral-8x7b`) failing in the backend pipeline, which halted dynamic metadata updates.
                      </p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700">
                        Learned Rule: Always validate AI model availability in SEO automation pipelines.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Integrations Section */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 max-w-md leading-tight">
              Connect once, deliver repeatedly<br/>
              <span className="text-gray-400">with your favorite tools</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            <div>
              <div className="w-10 h-10 mb-4 text-gray-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 8.21 11.38c.6.11.82-.26.82-.58v-2.16c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.08 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0 0 24 12a12 12 0 0 0-12.016-12z"/></svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Fix CI when it fails</p>
            </div>
            <div>
              <div className="w-10 h-10 mb-4 text-gray-400 flex items-center justify-center">
                <Database className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Investigate Hindsight logs</p>
            </div>
            <div>
              <div className="w-10 h-10 mb-4 text-gray-400 flex items-center justify-center">
                <LayoutTemplate className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Build from a spec page</p>
            </div>
            <div>
              <div className="w-10 h-10 mb-4 text-gray-400 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Triage bugs as they land</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
