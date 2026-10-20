/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

const INITIAL_LOGS = [
  { id: 0, text: "[System] Ready for user prompt. Please input an idea for the agents to build." },
];

export default function App() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [prompt, setPrompt] = useState("");
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [previewComp, setPreviewComp] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setActiveTask(prompt);
    setLogs((prev) => [...prev, { id: Date.now(), text: `[${new Date().toLocaleTimeString()}] [USER_PROMPT] ${prompt}` }]);
    setPrompt("");
    // Blur to close mobile keyboard
    (document.activeElement as HTMLElement)?.blur();
  };

  useEffect(() => {
    if (!activeTask) return;

    let isMounted = true;
    const fetchCollaboration = async () => {
      try {
        const response = await fetch('/api/collaborate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: activeTask, history: logs }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted && data.persona) {
          setPreviewComp(data.comp);
          setLogs((prev) => {
            const newLog = { id: Date.now(), text: `[${new Date().toLocaleTimeString()}] ${data.persona}: ${data.text}` };
            return [...prev, newLog].slice(-50);
          });
        }
      } catch (err) {
        console.error("Collaborator error:", err);
      }
      
      if (isMounted) setTimeout(fetchCollaboration, 3000);
    };

    fetchCollaboration();
    return () => { isMounted = false; };
  }, [activeTask]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const renderPreview = () => {
    switch(previewComp) {
      case "hero": return <div className="p-8 bg-slate-800 text-white rounded-lg"><h1>Hero Section</h1></div>;
      case "grid": return <div className="grid grid-cols-2 gap-4 p-4"><div className="h-20 bg-slate-800 rounded"></div><div className="h-20 bg-slate-800 rounded"></div></div>;
      case "filter": return <div className="flex gap-2 p-4"><button className="px-2 border rounded border-slate-700">All</button><button className="px-2 border rounded border-slate-700">Active</button></div>;
      case "test": return <div className="p-4 bg-emerald-900 text-emerald-100 rounded">Test Passed</div>;
      default: return <div className="text-slate-500">Collaborating on: {activeTask}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <header className="border-b border-slate-800 pb-4 mb-6 md:pb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">Multi-Agent DevStudio (Dark Mode)</h1>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Suggest an idea for the agents to build..."
                className="flex-grow p-2 bg-slate-900 border border-slate-800 rounded text-sm text-slate-100"
                maxLength={200}
            />
            <button type="submit" className="px-4 py-2 bg-slate-100 text-slate-900 rounded text-sm font-semibold hover:bg-slate-200">Prompt Agents</button>
        </form>
        <div className="text-sm text-slate-400 font-mono mt-2" role="status">Status: {activeTask ? `Active: ${activeTask}` : "Waiting for input"}</div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">Live Preview</h2>
          <div className="border-2 border-dashed border-slate-800 h-96 p-4 overflow-hidden bg-slate-950">
            {renderPreview()}
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">Simulation Logs</h2>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto" aria-live="polite">
            {logs.map((log) => (
              <div key={log.id} className="mb-2 border-b border-slate-800 pb-2">{log.text}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-slate-100">Active Agents</h2>
          <ul className="space-y-4">
            <li className="p-4 border rounded border-slate-800 font-medium bg-slate-950">🎨 UI/UX Architect</li>
            <li className="p-4 border rounded border-slate-800 font-medium bg-slate-950">💻 Lead Fullstack Dev</li>
            <li className="p-4 border rounded border-slate-800 font-medium bg-slate-950">🛡️ QA & Security Engineer</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
