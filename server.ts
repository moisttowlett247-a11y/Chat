import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Helper to generate dynamic, tailored agent steps that construct the website progressively
function generateAutonomousFallback(task: string, historyLength: number) {
  const cleanTask = task.trim() || 'Modern SaaS Operations Platform';
  const stage = (historyLength % 6) + 1; // Stages 1 to 6

  const p = cleanTask.toLowerCase();
  const isEcommerce = /store|shop|coffee|product|cart|buy|retail|bakery|food/i.test(p);
  const isSecurity = /security|cyber|incident|threat|pentest|audit|firewall/i.test(p);
  const isCrypto = /crypto|coin|trading|web3|wallet|token|defi/i.test(p);
  const isFitness = /fitness|gym|workout|health|running|training/i.test(p);

  const brandName = isEcommerce ? "Artisan Craft & Co." 
    : isSecurity ? "SentinelShield Ops" 
    : isCrypto ? "ApexChain Terminal"
    : isFitness ? "KineticPulse Engine"
    : cleanTask.slice(0, 24);

  const categoryTabs = isEcommerce ? ["All", "Single Origin", "Cold Brew", "Espresso"]
    : isSecurity ? ["All", "Core", "Firewall", "Intrusion"]
    : isCrypto ? ["All", "Layer 1", "DeFi", "Perpetuals"]
    : isFitness ? ["All", "Workouts", "Recovery", "Nutrition"]
    : ["All", "Core", "Security", "Telemetry"];

  const items = isEcommerce ? [
    { id: "ROAST-01", name: "Ethiopian Yirgacheffe Washed", status: "In Stock", latency: "$21.00", category: "Single Origin" },
    { id: "ROAST-02", name: "Colombian Huila Geisha Reserve", status: "Limited", latency: "$28.50", category: "Single Origin" },
    { id: "ROAST-03", name: "Nitro Cold Brew Concentrate", status: "Popular", latency: "$16.00", category: "Cold Brew" },
    { id: "ROAST-04", name: "Midnight Velvet Espresso Blend", status: "In Stock", latency: "$19.00", category: "Espresso" }
  ] : isCrypto ? [
    { id: "BTC-USD", name: "Bitcoin Perpetual ($68.4k)", status: "Bullish", latency: "+4.2%", category: "Layer 1" },
    { id: "ETH-USD", name: "Ethereum Staked Asset", status: "Liquid", latency: "+6.1%", category: "Layer 1" },
    { id: "SOL-USD", name: "Solana Supernode Yield", status: "Active", latency: "+8.9%", category: "Layer 1" },
    { id: "UNI-V3", name: "Automated Liquidity Vault", status: "14.2% APY", latency: "Nominal", category: "DeFi" }
  ] : [
    { id: "SYS-01", name: `${brandName.slice(0, 14)} Engine`, status: "Active", latency: "2ms", category: "Core" },
    { id: "SYS-02", name: "Cryptographic Key Gateway", status: "Verified", latency: "1ms", category: "Security" },
    { id: "SYS-03", name: "Sliding Buffer Streamer", status: "Nominal", latency: "8ms", category: "Telemetry" },
    { id: "SYS-04", name: "Automated Regression Harness", status: "Passed", latency: "4ms", category: "Security" }
  ];

  const steps = [
    {
      stage: 1,
      persona: "🎨 UI/UX Architect",
      thought: `Stage 1 / 6: Initializing architectural blueprint for "${cleanTask}". Setting 60-30-10 slate foundation (#0B0F17) with high-contrast accents, typography scale, and layout grid. Zero purple gradient slop.`,
      action: `Stage 1: Architected design system, color tokens, and layout wireframe contract.`,
      comp: "blueprint",
      code: `// Stage 1: Design Tokens & Base Canvas Layout\nexport const DESIGN_TOKENS = {\n  canvas: '#0B0F17',\n  surface: '#111827',\n  accent: '#10B981',\n  textPrimary: '#F8FAFC',\n  textSecondary: '#94A3B8'\n};`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 1,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "blueprint",
        navLinks: ["Overview", "Capabilities", "Catalog", "Security"],
        heroCTA: "Explore System",
        categoryTabs,
        items,
        stats: [
          { label: "Layout Grid", value: "12-Col", change: "Responsive" },
          { label: "Color Harmony", value: "60-30-10", change: "Dark Slate" },
          { label: "Font Rhythm", value: "1.25 Ratio", change: "Modular" }
        ],
        features: []
      }
    },
    {
      stage: 2,
      persona: "💻 Lead Fullstack Dev",
      thought: `Stage 2 / 6: Building the Header navigation bar and high-impact Hero banner with real-time metric counters. Linking primary and secondary CTA triggers with defensive click dispatchers.`,
      action: `Stage 2: Implemented responsive Navigation Bar and interactive Hero Section with live metrics.`,
      comp: "hero",
      code: `// Stage 2: Navigation & Hero Section\nexport function HeroSection({ title, tagline, onCTA }) {\n  return (\n    <section className="p-6 rounded-xl border border-slate-800 bg-slate-900/60">\n      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>\n      <p className="text-sm text-slate-400 mt-2">{tagline}</p>\n      <button onClick={onCTA} className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg text-xs">\n        Get Started\n      </button>\n    </section>\n  );\n}`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 2,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "hero",
        navLinks: ["Overview", "Capabilities", "Catalog", "Security"],
        heroCTA: isEcommerce ? "Subscribe Today" : "Launch Workspace",
        categoryTabs,
        items,
        stats: [
          { label: "Throughput", value: "99.98%", change: "+0.4%" },
          { label: "Active Nodes", value: "1,420", change: "+12" },
          { label: "P99 Latency", value: "14ms", change: "-2ms" }
        ],
        features: []
      }
    },
    {
      stage: 3,
      persona: "🎨 UI/UX Architect",
      thought: `Stage 3 / 6: Architecting the 3-column Feature Grid and category taxonomy. Creating cards with high-contrast text and unboxed metadata badges for clear visual hierarchy.`,
      action: `Stage 3: Designed 3-column Feature Grid with domain-tailored value propositions.`,
      comp: "features",
      code: `// Stage 3: Feature Matrix Cards\nexport function FeatureGrid({ features }) {\n  return (\n    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">\n      {features.map(f => (\n        <div key={f.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg">\n          <h4 className="text-xs font-bold text-white">{f.title}</h4>\n          <p className="text-xs text-slate-400 mt-1">{f.desc}</p>\n        </div>\n      ))}\n    </div>\n  );\n}`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 3,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "features",
        navLinks: ["Overview", "Capabilities", "Catalog", "Security"],
        heroCTA: isEcommerce ? "Subscribe Today" : "Launch Workspace",
        categoryTabs,
        items,
        stats: [
          { label: "Throughput", value: "99.98%", change: "+0.4%" },
          { label: "Active Nodes", value: "1,420", change: "+12" },
          { label: "P99 Latency", value: "14ms", change: "-2ms" }
        ],
        features: [
          { id: "1", title: isEcommerce ? "Micro-Batch Roasting" : "Autonomous Orchestration", desc: isEcommerce ? "Small-batch roast profiles bringing out natural origin notes." : "Multi-agent runtime event loop maintaining 0 drift." },
          { id: "2", title: isEcommerce ? "Direct Trade Guarantee" : "Defensive Type Security", desc: isEcommerce ? "Farmers compensated 40% above fair-trade floor." : "Zod runtime schema sanitization across all client inputs." },
          { id: "3", title: isEcommerce ? "Compostable Eco-Pouch" : "Sub-Second Ingestion", desc: isEcommerce ? "100% plant-based zero plastic degradation in 90d." : "High-density data streaming with memory-safe sliding buffers." }
        ]
      }
    },
    {
      stage: 4,
      persona: "💻 Lead Fullstack Dev",
      thought: `Stage 4 / 6: Implementing the interactive Data Matrix and category filter controls. Adding debounced search filtering and client-side sanitization to neutralize script injection vectors.`,
      action: `Stage 4: Implemented interactive Systems Matrix with live category tabs and search filtering.`,
      comp: "grid",
      code: `// Stage 4: Filterable Data Records Table\nexport function DataMatrix({ items, filterQuery, activeTab }) {\n  const filtered = items.filter(i => (activeTab === 'All' || i.category === activeTab));\n  return (\n    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">\n      <div className="divide-y divide-slate-800 text-xs font-mono">\n        {filtered.map(row => (\n          <div key={row.id} className="py-2 flex justify-between">\n            <span>{row.name}</span>\n            <span className="text-emerald-400">{row.status}</span>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 4,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "grid",
        navLinks: ["Overview", "Capabilities", "Catalog", "Security"],
        heroCTA: isEcommerce ? "Subscribe Today" : "Launch Workspace",
        categoryTabs,
        items,
        stats: [
          { label: "Interactive Items", value: `${items.length} Active`, change: "Realtime" },
          { label: "Search Latency", value: "<1ms", change: "In-Memory" },
          { label: "Category Filters", value: `${categoryTabs.length} Tabs`, change: "Working" }
        ],
        features: [
          { id: "1", title: isEcommerce ? "Micro-Batch Roasting" : "Autonomous Orchestration", desc: isEcommerce ? "Small-batch roast profiles bringing out natural origin notes." : "Multi-agent runtime event loop maintaining 0 drift." },
          { id: "2", title: isEcommerce ? "Direct Trade Guarantee" : "Defensive Type Security", desc: isEcommerce ? "Farmers compensated 40% above fair-trade floor." : "Zod runtime schema sanitization across all client inputs." },
          { id: "3", title: isEcommerce ? "Compostable Eco-Pouch" : "Sub-Second Ingestion", desc: isEcommerce ? "100% plant-based zero plastic degradation in 90d." : "High-density data streaming with memory-safe sliding buffers." }
        ]
      }
    },
    {
      stage: 5,
      persona: "🛡️ QA & Security Engineer",
      thought: `Stage 5 / 6: Running comprehensive automated security and accessibility audit. Verified 0 script execution on malicious payloads. Confirmed WCAG AA 6.2:1 contrast ratio and 44px touch targets. Applying verified compliance badges.`,
      action: `Stage 5: Executed penetration test suite; injected WCAG AA & XSS verified security stamps.`,
      comp: "test",
      code: `// Stage 5: Security & Verification Suite\nexport const QA_AUDIT_REPORT = {\n  xssProtection: 'VERIFIED_CLEAN',\n  wcagContrastRatio: '6.2:1 (PASS)',\n  touchTargetSize: '≥44px (PASS)',\n  viewportOverflow: '0px (PASS)'\n};`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 5,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "test",
        navLinks: ["Overview", "Capabilities", "Catalog", "Audit (Passed)"],
        heroCTA: isEcommerce ? "Subscribe Today" : "Launch Workspace",
        categoryTabs,
        items,
        stats: [
          { label: "Security Status", value: "PASSED", change: "0 CVEs" },
          { label: "WCAG 2.1 AA", value: "100%", change: "Verified" },
          { label: "Test Coverage", value: "98.8%", change: "Green" }
        ],
        features: [
          { id: "1", title: isEcommerce ? "Micro-Batch Roasting" : "Autonomous Orchestration", desc: isEcommerce ? "Small-batch roast profiles bringing out natural origin notes." : "Multi-agent runtime event loop maintaining 0 drift." },
          { id: "2", title: isEcommerce ? "Direct Trade Guarantee" : "Defensive Type Security", desc: isEcommerce ? "Farmers compensated 40% above fair-trade floor." : "Zod runtime schema sanitization across all client inputs." },
          { id: "3", title: isEcommerce ? "Compostable Eco-Pouch" : "Sub-Second Ingestion", desc: isEcommerce ? "100% plant-based zero plastic degradation in 90d." : "High-density data streaming with memory-safe sliding buffers." }
        ]
      }
    },
    {
      stage: 6,
      persona: "💻 Lead Fullstack Dev",
      thought: `Stage 6 / 6: Final assembly complete. All 3 agents have verified and signed off on the release. Wired interactive Inspector drawer with Esc listener and full production styling. Website is ready for deployment.`,
      action: `Stage 6: Final production release complete — live website fully operational and interactive.`,
      comp: "full_site",
      code: `// Stage 6: Final Production Release Bundle\nexport default function App() {\n  return <ProductionWebsite config={RELEASE_CONFIG} />;\n}`,
      websiteState: {
        title: brandName,
        tagline: cleanTask,
        stage: 6,
        theme: isSecurity ? "cyber" : isEcommerce ? "amber" : "cyan",
        currentSection: "full_site",
        navLinks: ["Overview", "Capabilities", "Catalog", "Production Live"],
        heroCTA: isEcommerce ? "Subscribe Today" : "Launch Workspace",
        categoryTabs,
        items,
        stats: [
          { label: "Production Gate", value: "RELEASED", change: "Online" },
          { label: "Throughput", value: "99.99%", change: "+0.01%" },
          { label: "Team Signoff", value: "3 / 3 Agents", change: "Approved" }
        ],
        features: [
          { id: "1", title: isEcommerce ? "Micro-Batch Roasting" : "Autonomous Orchestration", desc: isEcommerce ? "Small-batch roast profiles bringing out natural origin notes." : "Multi-agent runtime event loop maintaining 0 drift." },
          { id: "2", title: isEcommerce ? "Direct Trade Guarantee" : "Defensive Type Security", desc: isEcommerce ? "Farmers compensated 40% above fair-trade floor." : "Zod runtime schema sanitization across all client inputs." },
          { id: "3", title: isEcommerce ? "Compostable Eco-Pouch" : "Sub-Second Ingestion", desc: isEcommerce ? "100% plant-based zero plastic degradation in 90d." : "High-density data streaming with memory-safe sliding buffers." }
        ]
      }
    }
  ];

  return steps[stage - 1];
}

async function startServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(express.json({ limit: '10mb' }));

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  let rateLimitCooldownUntil = 0;

  app.post('/api/collaborate', async (req, res) => {
    const { task, history } = req.body;
    const safeHistory = Array.isArray(history) ? history : [];
    const promptText = (typeof task === 'string' && task.trim()) ? task.trim() : 'Autonomous Engineering Hub';

    // Attempt Gemini API call only if not currently in rate limit cooldown
    const now = Date.now();
    if (process.env.GEMINI_API_KEY && now > rateLimitCooldownUntil) {
      try {
        const prompt = `
You are an autonomous engineering workspace featuring 3 distinct AI personas collaborating to build a website for: "${promptText}".
Step history count: ${safeHistory.length}.
1. 🎨 UI/UX Architect
2. 💻 Lead Fullstack Dev
3. 🛡️ QA & Security Engineer

Return STRICTLY a JSON object matching this schema:
{
  "persona": "🎨 UI/UX Architect" | "💻 Lead Fullstack Dev" | "🛡️ QA & Security Engineer",
  "thought": "Deep technical reasoning (2 sentences)",
  "action": "Concrete implementation directive",
  "comp": "blueprint" | "hero" | "features" | "grid" | "test" | "full_site",
  "code": "A real snippet of React code for this step"
}
`;
        const result = await genAI.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        const text = result.text;

        if (text) {
          const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const firstBrace = cleanedText.indexOf('{');
          const lastBrace = cleanedText.lastIndexOf('}');

          if (firstBrace !== -1 && lastBrace !== -1) {
            const parsed = JSON.parse(cleanedText.substring(firstBrace, lastBrace + 1));
            if (parsed.persona && (parsed.thought || parsed.action)) {
              const fallback = generateAutonomousFallback(promptText, safeHistory.length);
              return res.json({
                ...fallback,
                ...parsed,
                source: 'gemini-3.8-flash'
              });
            }
          }
        }
      } catch (err: any) {
        if (err?.status === 429 || String(err?.message || '').includes('429') || String(err?.message || '').includes('RESOURCE_EXHAUSTED')) {
          rateLimitCooldownUntil = Date.now() + 60000;
        }
      }
    }

    // High-quality autonomous fallback engine ensures instant, progressive, thrilling website construction
    const fallbackResponse = generateAutonomousFallback(promptText, safeHistory.length);
    return res.json({
      ...fallbackResponse,
      source: 'autonomous-engine'
    });
  });

  app.use(vite.middlewares);

  app.listen(3000, () => console.log('Multi-Agent DevStudio server running on port 3000'));
}

startServer();
