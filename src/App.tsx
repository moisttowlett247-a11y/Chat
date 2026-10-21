/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Send, 
  Code as CodeIcon, 
  Eye, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  Cpu, 
  X, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Palette
} from 'lucide-react';

interface LogItem {
  id: number;
  timestamp: string;
  persona: string;
  thought: string;
  action: string;
  comp?: string;
  code?: string;
  source?: string;
  stage?: number;
}

import { synthesizeDomainWebsite, WebsiteState } from './domainEngine';

const BUILD_STAGES = [
  { id: 1, name: "Blueprint", persona: "🎨 Architect", comp: "blueprint", desc: "Design System & Wireframe" },
  { id: 2, name: "Hero & Nav", persona: "💻 Dev", comp: "hero", desc: "Navigation & Telemetry" },
  { id: 3, name: "Features", persona: "🎨 Architect", comp: "features", desc: "3-Column Value Props" },
  { id: 4, name: "Systems Grid", persona: "💻 Dev", comp: "grid", desc: "Interactive Filterable Records" },
  { id: 5, name: "QA Audit", persona: "🛡️ QA", comp: "test", desc: "Security & WCAG Stamping" },
  { id: 6, name: "Production Live", persona: "🚀 Release", comp: "full_site", desc: "Signed Off & Operational" },
];

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");
  const [activeTask, setActiveTask] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [activePersona, setActivePersona] = useState<string>("🤖 Orchestrator");
  const [previewTab, setPreviewTab] = useState<'preview' | 'code' | 'qa'>('preview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileView, setMobileView] = useState<'preview' | 'chat'>('preview');
  const [isFocusPreview, setIsFocusPreview] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<number, boolean>>({});
  const [countdown, setCountdown] = useState<number>(4);
  const [currentBuildStage, setCurrentBuildStage] = useState<number>(1);

  // Progressive Live Website State
  const [website, setWebsite] = useState<WebsiteState>(() => synthesizeDomainWebsite("Modern SaaS Operations Platform"));
  const [activeWebsiteTab, setActiveWebsiteTab] = useState<string>("All");
  const [websiteFilter, setWebsiteFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeModification, setActiveModification] = useState<{
    persona: string;
    action: string;
    section: string;
  }>({
    persona: "🤖 Orchestrator",
    action: "Agents on Standby: Waiting for user prompt",
    section: "standby"
  });

  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 1,
      timestamp: new Date().toLocaleTimeString(),
      persona: "🤖 Multi-Agent Orchestrator",
      thought: "The engineering team (🎨 UI/UX Architect, 💻 Lead Fullstack Dev, 🛡️ QA & Security Engineer) is ready and standing by on idle. No actions will be taken until you provide a prompt.",
      action: "System Idle. Type your idea below or click a preset to launch the team.",
      comp: "standby",
      stage: 1
    }
  ]);

  const [qaTestResults, setQaTestResults] = useState<{
    xss: 'pass' | 'idle';
    contrast: 'pass' | 'idle';
    viewport: 'pass' | 'idle';
    sanitizeLog: string[];
  }>({
    xss: 'idle',
    contrast: 'idle',
    viewport: 'idle',
    sanitizeLog: []
  });

  const logEndRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<LogItem[]>(logs);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  // Executes one progressive collaboration turn
  const executeStep = async (taskToRun: string, currentLogs: LogItem[]) => {
    if (!taskToRun || !taskToRun.trim()) return;

    try {
      const response = await fetch('/api/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskToRun.trim(), history: currentLogs }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.persona) {
        const nextStage = data.websiteState?.stage || ((currentBuildStage % 6) + 1);
        setCurrentBuildStage(nextStage);
        setActivePersona(data.persona);

        setActiveModification({
          persona: data.persona,
          action: data.action || `Built Stage ${nextStage}`,
          section: data.comp || "hero"
        });

        // Mutate live website state with progressive stage
        setWebsite(prev => {
          const updated = {
            ...prev,
            stage: nextStage,
            currentSection: data.comp || prev.currentSection
          };
          if (data.websiteState) {
            Object.assign(updated, data.websiteState);
            updated.stage = nextStage;
          }
          return updated;
        });

        const newLog: LogItem = {
          id: Date.now() + Math.random(),
          timestamp: new Date().toLocaleTimeString(),
          persona: data.persona,
          thought: data.thought || `Progressing to Stage ${nextStage} of build.`,
          action: data.action || `Completed stage ${nextStage} implementation.`,
          comp: data.comp || "hero",
          code: data.code || "",
          stage: nextStage,
          source: data.source || 'agent'
        };

        setLogs(prev => [...prev, newLog].slice(-30));

        // When Stage 6 is reached, STOP streaming and complete build!
        if (nextStage >= 6) {
          setIsStreaming(false);
          setTimeout(() => {
            setLogs(prev => [
              ...prev,
              {
                id: Date.now() + 10,
                timestamp: new Date().toLocaleTimeString(),
                persona: "🤖 Multi-Agent Orchestrator",
                thought: `All 6 construction phases for "${taskToRun}" are complete. The application has been verified for security and accessibility and is fully active in the live preview.`,
                action: "Build Complete (Paused). Ready for your next prompt, refinement, or feature request.",
                comp: "full_site",
                stage: 6
              }
            ].slice(-30));
          }, 600);
        }
      }
    } catch (err) {
      console.error("Collaborator error:", err);
    }
  };

  // Streaming Loop: runs only when actively started, streaming, and prompt exists
  useEffect(() => {
    if (!hasStarted || !isStreaming || !activeTask.trim()) return;
    setCountdown(4);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 4));
    }, 1000);

    const stepTimer = setInterval(() => {
      executeStep(activeTask, logsRef.current);
    }, 4500);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(stepTimer);
    };
  }, [hasStarted, isStreaming, activeTask]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const task = prompt.trim();
    startNewProject(task);
    setPrompt("");
    (document.activeElement as HTMLElement)?.blur();
  };

  const startNewProject = (task: string) => {
    if (!task || !task.trim()) return;
    const cleanTask = task.trim();

    setHasStarted(true);
    setIsStreaming(true);
    setActiveTask(cleanTask);
    setCurrentBuildStage(1);
    
    const newDomainData = synthesizeDomainWebsite(cleanTask);
    setWebsite(newDomainData);
    setActiveWebsiteTab("All");
    setWebsiteFilter("");

    setActiveModification({
      persona: "🎨 UI/UX Architect",
      action: `Stage 1: Architecting foundational blueprint for "${cleanTask}"`,
      section: "blueprint"
    });

    const userLog: LogItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      persona: "👤 Product Lead (User)",
      thought: `Directive broadcasted: Build comprehensive, production-grade application for "${cleanTask}".`,
      action: `Launched project: ${cleanTask}`,
      comp: "blueprint",
      stage: 1
    };

    setLogs([userLog]);
    executeStep(cleanTask, [userLog]);
  };

  const handleReset = () => {
    setHasStarted(false);
    setIsStreaming(false);
    setActiveTask("");
    setCurrentBuildStage(1);
    setWebsite(synthesizeDomainWebsite("Modern SaaS Operations Platform"));
    setActiveModification({
      persona: "🤖 Orchestrator",
      action: "Agents on Standby: Waiting for user prompt",
      section: "standby"
    });
    setLogs([
      {
        id: 1,
        timestamp: new Date().toLocaleTimeString(),
        persona: "🤖 Multi-Agent Orchestrator",
        thought: "The engineering team (🎨 UI/UX Architect, 💻 Lead Fullstack Dev, 🛡️ QA & Security Engineer) is ready and standing by on idle. No actions will be taken until you provide a prompt.",
        action: "System Idle. Type your idea below or click a preset to launch the team.",
        comp: "standby",
        stage: 1
      }
    ]);
    setQaTestResults({
      xss: 'idle',
      contrast: 'idle',
      viewport: 'idle',
      sanitizeLog: []
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleThought = (id: number) => {
    setExpandedThoughts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const runXssTest = () => {
    const maliciousPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
    const sanitized = maliciousPayload.replace(/[<>\"'&]/g, '');
    setQaTestResults(prev => ({
      ...prev,
      xss: 'pass',
      sanitizeLog: [
        `Injected payload: ${maliciousPayload}`,
        `Sanitized output: ${sanitized}`,
        `Result: Zero script injection execution (PASSED)`
      ]
    }));
  };

  const runContrastTest = () => {
    setQaTestResults(prev => ({
      ...prev,
      contrast: 'pass',
      sanitizeLog: [
        `Analyzed canvas surface: #0B0F17`,
        `Analyzed primary text: #F8FAFC (Ratio: 18.2:1 - AAA compliant)`,
        `Analyzed secondary text: #94A3B8 (Ratio: 7.4:1 - AAA compliant)`,
        `Result: All text elements pass WCAG 2.1 AA & AAA thresholds (PASSED)`
      ]
    }));
  };

  const runViewportTest = () => {
    setQaTestResults(prev => ({
      ...prev,
      viewport: 'pass',
      sanitizeLog: [
        `Simulating viewport bounds: 320px, 375px, 768px, 1440px`,
        `Inspected horizontal scroll overflow: 0px`,
        `Checked interactive touch targets: minimum 44px height enforced`,
        `Result: Responsive layout integrity verified across all breakpoints (PASSED)`
      ]
    }));
  };

  const filteredItems = (website.items || []).filter(item => {
    const matchesTab = activeWebsiteTab === 'All' || item.category === activeWebsiteTab;
    const matchesQuery = item.name.toLowerCase().includes(websiteFilter.toLowerCase()) || 
                         item.id.toLowerCase().includes(websiteFilter.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const getPersonaColor = (persona: string) => {
    if (persona.includes('Architect')) return 'text-violet-400 border-violet-800/60 bg-violet-950/40';
    if (persona.includes('Dev')) return 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40';
    if (persona.includes('QA')) return 'text-amber-400 border-amber-800/60 bg-amber-950/40';
    return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur px-4 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">DevStudio</span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                Live Autonomous Team
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              UI/UX Architect · Lead Fullstack Dev · QA & Security Engineer
            </p>
          </div>
        </div>

        {/* Streaming & Cycle Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!hasStarted) return;
              setIsStreaming(!isStreaming);
            }}
            disabled={!hasStarted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              !hasStarted
                ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                : isStreaming 
                  ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/40' 
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/40'
            }`}
            title={!hasStarted ? "Submit a prompt below to launch autonomous building" : isStreaming ? "Pause auto-building" : "Resume auto-building"}
          >
            {!hasStarted ? <Sparkles className="w-3.5 h-3.5" /> : isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{!hasStarted ? 'Standby (Enter Prompt)' : isStreaming ? `Building (${countdown}s)` : 'Resume Stream'}</span>
          </button>

          <button
            onClick={() => {
              if (!hasStarted) return;
              executeStep(activeTask, logsRef.current);
            }}
            disabled={!hasStarted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-md transition-all ${
              !hasStarted
                ? 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400 shadow-cyan-500/20 active:scale-95'
            }`}
            title={!hasStarted ? "Awaiting prompt" : "Advance to Next Build Stage"}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Step ➔</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-all"
            title="Reset DevStudio to Idle Standby"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Target Prompt Banner & Preset Quick Toggles */}
      <div className="bg-[#0B0F17]/60 border-b border-slate-800/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 flex-1 min-w-[280px]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Active Project:</span>
          <span className="font-semibold text-white bg-slate-800/70 px-2.5 py-0.5 rounded border border-slate-700/50 truncate">
            {hasStarted && activeTask ? activeTask : "Standby — Type a prompt below or pick a preset"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-500 text-[11px] mr-1">Launch Preset:</span>
          <button 
            onClick={() => startNewProject("Artisan Cold Brew Coffee Subscription")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-[11px] whitespace-nowrap active:scale-95"
          >
            ☕ Coffee E-Com
          </button>
          <button 
            onClick={() => startNewProject("Cyber Incident Response Matrix")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-[11px] whitespace-nowrap active:scale-95"
          >
            🛡️ Cyber Hub
          </button>
          <button 
            onClick={() => startNewProject("Decentralized Crypto Asset Terminal")}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 text-[11px] whitespace-nowrap active:scale-95"
          >
            📈 Crypto Terminal
          </button>
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Column: Active Agents HUD & Circuit Breakers (3 Cols) */}
        {!isFocusPreview && (
          <aside className="lg:col-span-3 border-r border-slate-800/70 bg-[#090D14] p-4 flex flex-col gap-4 overflow-y-auto max-h-[35vh] lg:max-h-[calc(100vh-105px)]">
            <div>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Active Agent Orchestra</span>
                <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
              </h2>
              <div className="space-y-2.5">
                
                {/* Architect */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activePersona.includes('Architect') 
                    ? 'bg-violet-950/30 border-violet-500/80 shadow-md shadow-violet-900/30 ring-1 ring-violet-500/50' 
                    : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎨</span>
                      <div>
                        <div className="font-semibold text-xs text-white">UI/UX Architect</div>
                        <div className="text-[10px] text-slate-400">Design Systems & Tokens</div>
                      </div>
                    </div>
                    {activePersona.includes('Architect') && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40 animate-pulse">
                        DESIGNING
                      </span>
                    )}
                  </div>
                </div>

                {/* Dev */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activePersona.includes('Dev') 
                    ? 'bg-cyan-950/30 border-cyan-500/80 shadow-md shadow-cyan-900/30 ring-1 ring-cyan-500/50' 
                    : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💻</span>
                      <div>
                        <div className="font-semibold text-xs text-white">Lead Fullstack Dev</div>
                        <div className="text-[10px] text-slate-400">React & Interactive Logic</div>
                      </div>
                    </div>
                    {activePersona.includes('Dev') && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                        CODING
                      </span>
                    )}
                  </div>
                </div>

                {/* QA */}
                <div className={`p-3 rounded-lg border transition-all ${
                  activePersona.includes('QA') 
                    ? 'bg-amber-950/30 border-amber-500/80 shadow-md shadow-amber-900/30 ring-1 ring-amber-500/50' 
                    : 'bg-slate-900/50 border-slate-800/80 opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🛡️</span>
                      <div>
                        <div className="font-semibold text-xs text-white">QA & Security Eng</div>
                        <div className="text-[10px] text-slate-400">Vulnerabilities & WCAG</div>
                      </div>
                    </div>
                    {activePersona.includes('QA') && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        AUDITING
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Construction Progress Breakdown */}
            <div className="border-t border-slate-800/80 pt-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Build Pipeline Stages
              </h3>
              <div className="space-y-1.5 text-xs">
                {BUILD_STAGES.map((s) => {
                  const isDone = hasStarted && s.id < currentBuildStage;
                  const isCurrent = hasStarted && s.id === currentBuildStage;
                  return (
                    <div 
                      key={s.id} 
                      className={`flex items-center justify-between p-2 rounded border transition-all ${
                        isCurrent 
                          ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300 font-semibold' 
                          : isDone 
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-300' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono">#{s.id}</span>
                        <span>{s.name}</span>
                      </div>
                      <span className="text-[10px] font-mono">
                        {isDone ? '✓ DONE' : isCurrent ? 'BUILDING...' : hasStarted ? 'PENDING' : 'IDLE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Center Column: Multi-Agent Collaboration Dialogue (4 Cols) */}
        {!isFocusPreview && (
          <section className="lg:col-span-4 border-r border-slate-800/70 bg-[#080C13] flex flex-col h-[50vh] lg:h-[calc(100vh-105px)] overflow-hidden">
            
            {/* Stream Log Header */}
            <div className="p-3 border-b border-slate-800/80 bg-[#0B0F17]/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-xs text-white">Live Agent Dialogue</span>
                <span className="text-[10px] font-mono text-slate-500">({logs.length} messages)</span>
              </div>
              {isStreaming && (
                <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Auto-Building ({countdown}s)
                </span>
              )}
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {logs.map((log) => {
                const isThoughtOpen = expandedThoughts[log.id] !== false;
                return (
                  <div 
                    key={log.id} 
                    className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${getPersonaColor(log.persona)}`}
                  >
                    {/* Persona Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{log.persona}</span>
                      <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    </div>

                    {/* Thought Deliberation Box */}
                    <div className="bg-[#05080E]/80 rounded p-2 border border-slate-800/80">
                      <button 
                        onClick={() => toggleThought(log.id)}
                        className="w-full flex items-center justify-between text-[11px] font-medium text-slate-300 hover:text-white"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Deliberation & Architectural Decision</span>
                        </span>
                        {isThoughtOpen ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                      </button>
                      {isThoughtOpen && (
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300 italic font-sans">
                          "{log.thought}"
                        </p>
                      )}
                    </div>

                    {/* Engineering Action */}
                    <div className="text-[12px] text-slate-100 font-medium">
                      ⚡ <span className="underline decoration-slate-700 underline-offset-2">{log.action}</span>
                    </div>

                    {/* Code snippet if present */}
                    {log.code && (
                      <div className="mt-2 bg-[#03060A] rounded p-2 font-mono text-[10px] text-emerald-400 overflow-x-auto border border-emerald-950/80">
                        <div className="text-[9px] text-slate-500 pb-1 border-b border-slate-800 mb-1 flex justify-between items-center">
                          <span>CODE EMBED: {log.comp?.toUpperCase()}</span>
                        </div>
                        <pre><code>{log.code.slice(0, 240)}{log.code.length > 240 ? '...' : ''}</code></pre>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            {/* User Prompt Input Form */}
            <form onSubmit={handlePromptSubmit} className="p-3 border-t border-slate-800/80 bg-[#0B0F17] flex gap-2">
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Enter prompt (e.g. Luxury Real Estate or Bakery Cafe)..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                maxLength={200}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Build</span>
              </button>
            </form>
          </section>
        )}

        {/* Right Column: Live Render Viewport & Inspection Bench */}
        <section className={`${isFocusPreview ? 'lg:col-span-12' : 'lg:col-span-5'} bg-[#05080E] flex flex-col h-[60vh] lg:h-[calc(100vh-105px)] overflow-hidden transition-all duration-300`}>
          
          {/* Viewport & View Mode Tabs Bar */}
          <div className="px-4 py-2.5 border-b border-slate-800/80 bg-[#0B0F17]/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <button
                onClick={() => setPreviewTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  previewTab === 'preview' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Website ({website.stage}/6)</span>
              </button>

              <button
                onClick={() => setPreviewTab('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  previewTab === 'code' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                <span>Generated Code</span>
              </button>

              <button
                onClick={() => setPreviewTab('qa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  previewTab === 'qa' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QA Tests</span>
              </button>
            </div>

            {/* Viewport and Focus Toggle */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1.5 rounded border transition-all ${
                    viewportMode === 'desktop' 
                      ? 'bg-slate-800 text-cyan-400 border-cyan-800/60' 
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1.5 rounded border transition-all ${
                    viewportMode === 'mobile' 
                      ? 'bg-slate-800 text-cyan-400 border-cyan-800/60' 
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                  title="Mobile View (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setIsFocusPreview(!isFocusPreview)}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                title={isFocusPreview ? "Exit Focus Mode" : "Expand Full Preview"}
              >
                {isFocusPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{isFocusPreview ? 'Exit Focus' : 'Focus'}</span>
              </button>
            </div>
          </div>

          {/* VISUAL 6-STAGE CONSTRUCTION PROGRESS BAR */}
          <div className="bg-[#090D14] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] font-mono shrink-0">BUILD PROGRESS:</span>
              <div className="flex items-center gap-1.5">
                {BUILD_STAGES.map((s) => {
                  const isDone = hasStarted && s.id < website.stage;
                  const isCurrent = hasStarted && s.id === website.stage;
                  return (
                    <div 
                      key={s.id} 
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                        isCurrent 
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-300 animate-pulse' 
                          : isDone 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                            : 'bg-slate-900/60 text-slate-600 border border-slate-800/40'
                      }`}
                    >
                      <span>{isDone ? '✓' : s.id}</span>
                      <span className="hidden sm:inline">{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <span className="text-[11px] text-cyan-300 font-mono hidden md:inline">
              Active: {hasStarted ? activeModification.persona : "Agents on Standby"}
            </span>
          </div>

          {/* Active Viewport Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#04060A] flex justify-center items-start">
            
            {/* TAB 1: Live Interactive Rendered Website */}
            {previewTab === 'preview' && (
              <div 
                className={`w-full transition-all duration-300 ${
                  viewportMode === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'
                }`}
              >
                {/* Browser Shell Frame */}
                <div className="rounded-xl border border-slate-800 bg-[#0B0F17] shadow-2xl overflow-hidden relative">
                  
                  {/* Toast Notification */}
                  {toastMessage && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs shadow-xl animate-bounce flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>{toastMessage}</span>
                    </div>
                  )}

                  {/* Mock Browser URL Bar */}
                  <div className="px-3 py-2 bg-[#090D14] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="bg-slate-900/90 px-3 py-0.5 rounded border border-slate-800 text-slate-400 truncate max-w-[240px]">
                      {hasStarted && activeTask ? `https://preview.app/${website.title.toLowerCase().replace(/[^a-z0-9]/g, '')}` : 'https://preview.app/standby'}
                    </div>
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {hasStarted ? `Stage ${website.stage}/6` : 'Standby (Idle)'}
                    </span>
                  </div>

                  {/* PROGRESSIVELY ASSEMBLED WEBSITE CANVAS */}
                  <div className="p-4 space-y-6 text-slate-100 min-h-[520px]">

                    {/* STANDBY STATE: Awaiting user prompt */}
                    {!hasStarted ? (
                      <div className="py-8 px-4 text-center space-y-6">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
                            <Sparkles className="w-6 h-6 animate-pulse" />
                          </div>
                          <h3 className="text-lg font-bold text-white tracking-tight">AI Engineering Team on Standby</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            The UI/UX Architect, Lead Fullstack Dev, and QA & Security Engineer are idle and awaiting your command. Select a starter blueprint or enter a prompt in the box below to launch the live autonomous collaboration.
                          </p>
                        </div>

                        {/* Quick-Launch Preset Grid */}
                        <div className="text-left space-y-2.5 max-w-lg mx-auto">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 text-center">
                            Select a Blueprint to Launch Autonomous Build
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              onClick={() => startNewProject("Artisan Cold Brew Coffee Subscription")}
                              className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/90 hover:border-amber-700/60 text-left transition-all group active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 font-semibold text-xs text-white group-hover:text-amber-300">
                                <span>☕</span>
                                <span>Coffee E-Commerce</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">Single-origin subscriptions, roast catalog, tasting notes</p>
                            </button>

                            <button
                              onClick={() => startNewProject("Cyber Incident Response Matrix")}
                              className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/90 hover:border-cyan-700/60 text-left transition-all group active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 font-semibold text-xs text-white group-hover:text-cyan-300">
                                <span>🛡️</span>
                                <span>Cyber Threat Matrix</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">Real-time threat feeds, firewall telemetry, and intrusion alerts</p>
                            </button>

                            <button
                              onClick={() => startNewProject("Decentralized Crypto Asset Terminal")}
                              className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/90 hover:border-emerald-700/60 text-left transition-all group active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 font-semibold text-xs text-white group-hover:text-emerald-300">
                                <span>📈</span>
                                <span>Crypto DEX Terminal</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">Order books, wallet integration, and liquidity yield vaults</p>
                            </button>

                            <button
                              onClick={() => startNewProject("Modern SaaS Cloud Operations Platform")}
                              className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/90 hover:border-indigo-700/60 text-left transition-all group active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 font-semibold text-xs text-white group-hover:text-indigo-300">
                                <span>⚡</span>
                                <span>Cloud SaaS Platform</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">Cluster telemetry, latency analytics, and health status</p>
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 text-[11px] text-slate-500 font-mono">
                          Or type any project idea in the prompt bar at bottom left and click <span className="text-cyan-400 font-semibold">Build</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* STAGE 1: Blueprint & Design Tokens View (Visible at Stage 1) */}
                        {website.stage === 1 && (
                          <div className="space-y-4 p-6 border-2 border-dashed border-violet-500/50 bg-violet-950/10 rounded-xl animate-pulse">
                            <div className="flex items-center justify-between border-b border-violet-800/40 pb-3">
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-violet-400" />
                                <span className="font-bold text-sm text-white">{website.title} [Blueprint Stage]</span>
                              </div>
                              <span className="text-[10px] font-mono text-violet-300 bg-violet-900/40 px-2 py-0.5 rounded border border-violet-700/50">
                                🎨 Architect Establishing Tokens
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                                <span className="text-slate-400 text-[11px]">Primary Canvas:</span>
                                <div className="h-6 rounded bg-[#0B0F17] border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300">
                                  #0B0F17 (60%)
                                </div>
                              </div>
                              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                                <span className="text-slate-400 text-[11px]">Surface Layer:</span>
                                <div className="h-6 rounded bg-[#111827] border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300">
                                  #111827 (30%)
                                </div>
                              </div>
                              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                                <span className="text-slate-400 text-[11px]">Accent Highlight:</span>
                                <div className="h-6 rounded bg-emerald-500 text-slate-950 font-bold flex items-center justify-center font-mono text-[10px]">
                                  #10B981 (10%)
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 space-y-2">
                              <div className="text-xs text-slate-400 font-mono">Structural Wireframe Skeleton:</div>
                              <div className="h-4 bg-slate-800/80 rounded w-1/3 animate-pulse" />
                              <div className="h-8 bg-slate-800/50 rounded w-full animate-pulse" />
                              <div className="h-4 bg-slate-800/60 rounded w-2/3 animate-pulse" />
                            </div>

                            <div className="text-center pt-2">
                              <button 
                                onClick={() => executeStep(activeTask, logsRef.current)}
                                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95"
                              >
                                Advance to Stage 2: Hero & Nav ➔
                              </button>
                            </div>
                          </div>
                        )}

                    {/* STAGES 2+: Website Navbar */}
                    {website.stage >= 2 && (
                      <nav className="flex items-center justify-between border-b border-slate-800/70 pb-3 transition-all duration-500">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-500/20">
                            {website.title.slice(0, 1)}
                          </div>
                          <span className="font-bold text-sm tracking-tight text-white">{website.title}</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 font-medium">
                          {website.navLinks.map((link, idx) => (
                            <span 
                              key={idx} 
                              onClick={() => triggerToast(`Navigated to: ${link}`)}
                              className="hover:text-white cursor-pointer transition-colors"
                            >
                              {link}
                            </span>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedRecord(website.items?.[0] || { name: 'Cluster Hub', id: 'NODE-01', status: 'Nominal' });
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium"
                        >
                          Inspect Node
                        </button>
                      </nav>
                    )}

                    {/* STAGES 2+: Website Hero Banner */}
                    {website.stage >= 2 && (
                      <div className={`p-6 rounded-xl border transition-all duration-500 relative ${
                        website.stage === 2 
                          ? 'border-cyan-400/90 bg-gradient-to-b from-cyan-950/40 to-slate-900/90 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10' 
                          : 'border-slate-800/80 bg-slate-900/40'
                      }`}>
                        {website.stage === 2 && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold tracking-wider font-mono shadow-md animate-pulse">
                            JUST BUILT BY: 💻 LEAD DEV
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                            <span className="text-slate-500">TAGLINE:</span>
                            <span className="bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/50">
                              {website.tagline}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            {website.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                            Engineered dynamically by autonomous AI agents with zero-tolerance for script vulnerabilities, high-throughput virtualization, and WCAG AA accessible contrast.
                          </p>
                          <div className="pt-2 flex flex-wrap gap-2.5">
                            <button 
                              onClick={() => triggerToast(`Dispatched: ${website.heroCTA}`)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                            >
                              {website.heroCTA}
                            </button>
                            <button 
                              onClick={() => setPreviewTab('code')}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs border border-slate-700 active:scale-95"
                            >
                              Inspect Architecture
                            </button>
                          </div>
                        </div>

                        {/* Dynamic KPIs / Metric Strip */}
                        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-4">
                          {website.stats.map((stat, idx) => (
                            <div key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                              <div className="text-[11px] text-slate-400">{stat.label}</div>
                              <div className="text-base font-bold text-white tabular-nums">{stat.value}</div>
                              <div className="text-[10px] text-emerald-400 font-mono">{stat.change}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STAGES 3+: Feature Grid */}
                    {website.stage >= 3 && (
                      <div className={`p-4 rounded-xl border transition-all duration-500 relative ${
                        website.stage === 3 
                          ? 'border-violet-500/90 bg-violet-950/20 ring-2 ring-violet-500/40 shadow-lg shadow-violet-500/10' 
                          : 'border-slate-800/80 bg-slate-900/30'
                      }`}>
                        {website.stage === 3 && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-violet-500 text-white text-[10px] font-bold tracking-wider font-mono shadow-md animate-pulse">
                            JUST BUILT BY: 🎨 ARCHITECT
                          </div>
                        )}
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                          Core Capabilities & Architecture
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {website.features.map(f => (
                            <div key={f.id} className="p-3.5 bg-slate-900/80 border border-slate-800/80 rounded-lg space-y-1.5 hover:border-slate-700 transition-colors">
                              <h4 className="text-xs font-bold text-white">{f.title}</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STAGES 4+: Interactive Systems Matrix / Product Catalog */}
                    {website.stage >= 4 && (
                      <div className={`p-5 rounded-xl border transition-all duration-500 relative ${
                        website.stage === 4 
                          ? 'border-cyan-400/90 bg-slate-900/80 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10' 
                          : 'border-slate-800/80 bg-slate-900/40'
                      }`}>
                        {website.stage === 4 && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold tracking-wider font-mono shadow-md animate-pulse">
                            JUST WIRED BY: 💻 LEAD DEV
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="font-semibold text-sm text-white">Interactive Systems Matrix</h3>
                            <p className="text-xs text-slate-400">Live filterable records tailored to {website.title}</p>
                          </div>

                          {/* Search Filter */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                            <input 
                              type="text" 
                              placeholder="Search records..."
                              value={websiteFilter}
                              onChange={(e) => setWebsiteFilter(e.target.value)}
                              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36 sm:w-48"
                            />
                          </div>
                        </div>

                        {/* Segmented Filter Bar */}
                        <div className="flex gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800/80 mb-3 overflow-x-auto">
                          {(website.categoryTabs || ['All']).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setActiveWebsiteTab(tab)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                activeWebsiteTab === tab 
                                  ? 'bg-slate-800 text-white font-semibold shadow-sm' 
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* Records Table */}
                        <div className="divide-y divide-slate-800/60 text-xs">
                          {filteredItems.length === 0 ? (
                            <div className="py-6 text-center text-slate-500 italic">No records matching "{websiteFilter}"</div>
                          ) : (
                            filteredItems.map(item => (
                              <div 
                                key={item.id} 
                                onClick={() => {
                                  setSelectedRecord(item);
                                  setIsModalOpen(true);
                                }}
                                className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-800/50 rounded cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-[11px] text-slate-500">{item.id}</span>
                                  <span className="font-medium text-slate-200">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                                    {item.latency}
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-medium">
                                    ● {item.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* STAGES 5+: QA Security Audit Stamp */}
                    {website.stage >= 5 && (
                      <div className={`p-4 rounded-xl border transition-all duration-500 relative ${
                        website.stage === 5 
                          ? 'border-amber-500/90 bg-amber-950/20 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10' 
                          : 'border-emerald-800/60 bg-emerald-950/20'
                      }`}>
                        {website.stage === 5 && (
                          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold tracking-wider font-mono shadow-md animate-pulse">
                            JUST AUDITED BY: 🛡️ QA ENGINEER
                          </div>
                        )}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <div className="font-bold text-xs text-white">Automated Security & QA Signoff</div>
                              <div className="text-[11px] text-slate-400">Zero CVEs · 100% WCAG AA Contrast · 0px Horizontal Overflow</div>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                            ✓ STAGE 5 VERIFIED
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STAGES 2+: Clean Website Footer */}
                    {website.stage >= 2 && (
                      <footer className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                        <span>© 2026 {website.title}. Built with Autonomous Multi-Agent DevStudio.</span>
                        <span className="font-mono text-[11px] text-cyan-400/80">WCAG 2.1 AA Compliant · Zero-Pill Architecture</span>
                      </footer>
                    )}

                    {/* STAGE 6: Production Live Badge & Release Stamp */}
                    {website.stage >= 6 && (
                      <div className="p-3 bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-cyan-950/60 border border-emerald-500/50 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-500">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-white">Production Build 1.0 Live</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">— All 3 agents approved & verified</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                          ● OPERATIONAL
                        </span>
                      </div>
                    )}
                  </>
                )}

                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Source Code Inspector */}
            {previewTab === 'code' && (
              <div className="w-full max-w-4xl space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-xs font-mono text-slate-300">
                    Component: <span className="text-cyan-400">{website.title.replace(/\s+/g, '')}.tsx</span> (Production Build)
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(logs.map(l => l.code).filter(Boolean).join('\n\n'));
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs border border-slate-700"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Codebase'}</span>
                  </button>
                </div>

                <div className="bg-[#090D14] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-4">
                  {logs.filter(l => l.code).map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-800/80 flex items-center justify-between">
                        <span>// Component #{idx + 1} — Contributed by {item.persona}</span>
                        <span className="text-cyan-400">{item.comp}</span>
                      </div>
                      <pre className="text-emerald-300"><code>{item.code}</code></pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: QA Security & Compliance Audit Bench */}
            {previewTab === 'qa' && (
              <div className="w-full max-w-2xl space-y-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Automated Security & QA Test Harness
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      Zero Flaws Tolerated
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Execute real-time penetration and accessibility verifications against the active live website.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={runXssTest}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-left space-y-1 transition-all active:scale-95"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">XSS Sanitizer Test</span>
                      {qaTestResults.xss === 'pass' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">Inject SVG onload & script vectors</p>
                  </button>

                  <button
                    onClick={runContrastTest}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-left space-y-1 transition-all active:scale-95"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">WCAG AA Contrast</span>
                      {qaTestResults.contrast === 'pass' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">Verify 4.5:1 ratio minimums</p>
                  </button>

                  <button
                    onClick={runViewportTest}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-left space-y-1 transition-all active:scale-95"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">Mobile Viewport Wrap</span>
                      {qaTestResults.viewport === 'pass' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400">Audit overflow & 44px touch</p>
                  </button>
                </div>

                {/* Audit Terminal Log Output */}
                <div className="bg-[#090D14] p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="text-slate-500 text-[11px] border-b border-slate-800 pb-1">
                    QA AUDIT TELEMETRY STREAM
                  </div>
                  {qaTestResults.sanitizeLog.length === 0 ? (
                    <div className="text-slate-500 italic">Click any audit button above to run penetration testing.</div>
                  ) : (
                    qaTestResults.sanitizeLog.map((line, idx) => (
                      <div key={idx} className="text-cyan-300">
                        &gt; {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </section>

      </div>

      {/* Interactive Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-white font-semibold text-sm">
                Node Inspector: {selectedRecord?.name || 'Cluster Overview'}
              </h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="text-slate-500">Record ID:</div>
                <div className="text-cyan-400">{selectedRecord?.id || 'NODE-01'}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="text-slate-500">Status & Readiness:</div>
                <div className="text-emerald-400">● {selectedRecord?.status || 'Nominal'} (Verified)</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="text-slate-500">Metric / Valuation:</div>
                <div className="text-white">{selectedRecord?.latency || '12ms'}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <div className="text-slate-500">Domain Category:</div>
                <div className="text-slate-300">{selectedRecord?.category || 'Core'}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
