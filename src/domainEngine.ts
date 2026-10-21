/**
 * Domain Engine: Synthesizes hyper-tailored, realistic website designs,
 * copy, products, metrics, and multi-agent dialogue based on any user prompt.
 */

export interface WebsiteState {
  title: string;
  tagline: string;
  description: string;
  theme: string;
  themeAccent: string;
  stage: number;
  currentSection: string;
  navLinks: string[];
  heroCTA: string;
  heroSecondaryCTA: string;
  stats: Array<{ label: string; value: string; change: string }>;
  features: Array<{ id: string; title: string; desc: string }>;
  categoryTabs: string[];
  items: Array<{ id: string; name: string; status: string; latency: string; category: string }>;
}

export function cleanPromptName(prompt: string): string {
  if (!prompt || !prompt.trim()) return "DevStudio Project";
  let clean = prompt.trim();
  clean = clean.replace(/^(make|build|create|design|generate|code|develop)\s+(me\s+)?(a\s+|an\s+|the\s+)?/i, '');
  clean = clean.replace(/^(a\s+|an\s+|the\s+)/i, '');
  clean = clean.replace(/\s+(website|web\s*site|app|application|platform|page|clone|portal)$/i, '');
  clean = clean.trim();
  if (!clean) return "DevStudio Project";
  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function synthesizeDomainWebsite(rawPrompt: string): WebsiteState {
  const p = (rawPrompt || "").toLowerCase().trim();
  const cleanedName = cleanPromptName(rawPrompt);

  // 1. SPACE / ASTRONOMY / ORBIT / SATELLITE / SPACEX
  if (/space|orbit|satellite|rocket|astronomy|cosmos|mars|galaxy|star|nasa|spacex|telescope/i.test(p)) {
    return {
      title: "OrbitDynamics Deep Space Telemetry",
      tagline: "Next-Generation Orbital Intelligence & Autonomous Satellite Constellations",
      description: "Real-time orbital tracking, sub-meter Earth observation imagery, and autonomous collision avoidance telemetry for commercial space operations.",
      theme: "cyan",
      themeAccent: "#06B6D4",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Constellation Map", "Telemetry Feed", "Launch Schedules", "Deep Space"],
      heroCTA: "Deploy Satellite Node",
      heroSecondaryCTA: "View Orbital Map",
      stats: [
        { label: "Active Satellites", value: "342 Constellation", change: "99.98% Uptime" },
        { label: "Orbital Velocity", value: "7.8 km/s", change: "Low Earth Orbit" },
        { label: "Telemetry Latency", value: "12ms", change: "Laser Link" }
      ],
      features: [
        { id: "1", title: "Autonomous Collision Avoidance", desc: "AI-driven thruster adjustment preventing space debris conjunctions in real time." },
        { id: "2", title: "Sub-Meter Optical Imaging", desc: "High-resolution multispectral earth observation sensors for climate and logistics." },
        { id: "3", title: "Quantum Encrypted Downlink", desc: "Post-quantum cryptography securing high-bandwidth satellite telemetry." }
      ],
      categoryTabs: ["All", "LEO Satellites", "Deep Space", "Launch Vehicles"],
      items: [
        { id: "SAT-01", name: "Sentinel-Alpha Earth Observation Hub", status: "Active Orbit", latency: "11ms", category: "LEO Satellites" },
        { id: "SAT-02", name: "Helios Solar Flare Early Warning Relay", status: "Nominal", latency: "14ms", category: "LEO Satellites" },
        { id: "SAT-03", name: "Lunar Gateway Relay Station Beta", status: "Standby", latency: "1.3s", category: "Deep Space" },
        { id: "SAT-04", name: "Falcon-Heavy Block 5 Booster", status: "Ready to Launch", latency: "T-minus 4h", category: "Launch Vehicles" }
      ]
    };
  }

  // 2. BIOTECH / GENOMICS / HEALTH / CRISPR / LAB
  if (/biotech|genomic|dna|crispr|gene|biology|lab|research|cure|health|medical|pharma|bio/i.test(p)) {
    return {
      title: "HelixGenomics Research Institute",
      tagline: "Precision Gene Editing & Single-Cell Transcriptomic Discovery",
      description: "Accelerating therapeutic breakthroughs with high-throughput CRISPR screening, automated sequencing pipelines, and AI protein folding.",
      theme: "emerald",
      themeAccent: "#10B981",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Sequencing Lab", "CRISPR Library", "Protein Folding", "Clinical Trials"],
      heroCTA: "Request Assay Run",
      heroSecondaryCTA: "Explore Genomes",
      stats: [
        { label: "Sequenced Genomes", value: "1.4M+", change: "High Precision" },
        { label: "Folding Accuracy", value: "99.4%", change: "AlphaFold Core" },
        { label: "Discovery Speed", value: "48 Hours", change: "Target to Lead" }
      ],
      features: [
        { id: "1", title: "High-Throughput CRISPR Array", desc: "Multiplexed library screening targeting 20,000 human genes simultaneously." },
        { id: "2", title: "AI Protein Structure Prediction", desc: "Atomic-level 3D molecular modeling predicting ligand binding affinities." },
        { id: "3", title: "Secure Genomic Vault", desc: "HIPAA and GDPR certified federated learning protecting patient privacy." }
      ],
      categoryTabs: ["All", "Sequencing", "CRISPR Assays", "Proteins"],
      items: [
        { id: "BIO-01", name: "Illumina NovaSeq X Plus High-Yield Run", status: "Sequencing", latency: "4.2h left", category: "Sequencing" },
        { id: "BIO-02", name: "CRISPR-Cas9 Knockout Library V4", status: "Ready", latency: "100%", category: "CRISPR Assays" },
        { id: "BIO-03", name: "Monoclonal Antibody Target #842", status: "Folded", latency: "0.2Å RMSD", category: "Proteins" },
        { id: "BIO-04", name: "Single-Cell RNA Transcriptome Matrix", status: "Analyzed", latency: "12M cells", category: "Sequencing" }
      ]
    };
  }

  // 3. PET CARE / CHEWY / ANIMALS
  if (/chewy|pet|dog|cat|puppy|kitten|vet|veterinar|animal|paw|bark|kibble/i.test(p)) {
    return {
      title: "Chewy Pet Supply Co.",
      tagline: "Where Pet Parents Shop for Food, Toys, Treats & 24/7 Vet Care",
      description: "America's most trusted destination for pet parents. Save 35% on Autoship, enjoy free 1-2 day delivery, and connect with licensed veterinarians anytime.",
      theme: "chewy",
      themeAccent: "#128CED",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Dog Supplies", "Cat Essentials", "Pet Pharmacy", "Autoship"],
      heroCTA: "Autoship & Save 35%",
      heroSecondaryCTA: "Connect with a Vet",
      stats: [
        { label: "Autoship Savings", value: "35% OFF", change: "First Order" },
        { label: "Delivery Speed", value: "1-2 Days", change: "Free Over $49" },
        { label: "Happy Pets", value: "20M+", change: "Families Served" }
      ],
      features: [
        { id: "1", title: "Autoship & Flexible Scheduling", desc: "Never run out of pet food. Flexible delivery dates and recurring savings." },
        { id: "2", title: "24/7 Licensed Pet Pharmacy", desc: "Prescription medications verified with your vet and shipped to your door." },
        { id: "3", title: "365-Day Guarantee", desc: "If your pet doesn't love it, return it anytime within a year." }
      ],
      categoryTabs: ["All", "Dog Food", "Cat Essentials", "Pet Pharmacy", "Toys"],
      items: [
        { id: "CHW-01", name: "Blue Buffalo Life Protection Chicken & Rice (30 lb)", status: "Best Seller", latency: "$64.98", category: "Dog Food" },
        { id: "CHW-02", name: "Purina Pro Plan High Protein Wet Cat Food (24pk)", status: "Popular", latency: "$38.49", category: "Cat Essentials" },
        { id: "CHW-03", name: "KONG Classic Durable Rubber Dog Chew Toy", status: "In Stock", latency: "$14.99", category: "Toys" },
        { id: "CHW-04", name: "Heartgard Plus Chewables for Dogs (6 Doses)", status: "Vet Verified", latency: "$44.99", category: "Pet Pharmacy" }
      ]
    };
  }

  // 4. COFFEE / CAFE / BAKERY
  if (/coffee|cafe|bakery|restaurant|bistro|food|pizza|burger|sushi|taco|tea|roast|brew/i.test(p)) {
    return {
      title: "Velvet Roast Coffee Co.",
      tagline: "Single-Origin Artisan Roasts & Freshly Baked Daily Delicacies",
      description: "Ethically harvested from high-altitude micro-lots and roasted fresh every sunrise. Notes of wild berry, dark cacao, and honeycomb.",
      theme: "amber",
      themeAccent: "#F59E0B",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Single Origin", "Espresso", "Cold Brew", "Subscriptions"],
      heroCTA: "Subscribe for $18/mo",
      heroSecondaryCTA: "View Menu",
      stats: [
        { label: "Origin Farms", value: "14 Farms", change: "Direct Trade" },
        { label: "Roast Freshness", value: "48 Hours", change: "Direct to Door" },
        { label: "Customer Rating", value: "4.96 ★", change: "3,200+ Reviews" }
      ],
      features: [
        { id: "1", title: "Micro-Batch Drum Roasting", desc: "Small-batch roasting tailored to highlight origin berry and cacao notes." },
        { id: "2", title: "Direct Trade Guarantee", desc: "Farmers compensated at least 45% above fair-trade price floor." },
        { id: "3", title: "Compostable Eco-Pouch", desc: "Zero-plastic plant-based packaging degrading naturally in 90 days." }
      ],
      categoryTabs: ["All", "Single Origin", "Cold Brew", "Espresso", "Gear"],
      items: [
        { id: "ROAST-01", name: "Ethiopian Yirgacheffe Washed Heirloom", status: "In Stock", latency: "$21.00", category: "Single Origin" },
        { id: "ROAST-02", name: "Colombian Huila Geisha Reserve", status: "Limited Lot", latency: "$28.50", category: "Single Origin" },
        { id: "ROAST-03", name: "Nitro Cold Brew Concentrate (32oz)", status: "Best Seller", latency: "$16.00", category: "Cold Brew" },
        { id: "ROAST-04", name: "Midnight Velvet Espresso Blend", status: "In Stock", latency: "$19.00", category: "Espresso" }
      ]
    };
  }

  // 5. CYBERSECURITY / SOC / CLOUD DEVOPS
  if (/security|cyber|incident|threat|pentest|audit|firewall|soc|infosec|devops/i.test(p)) {
    return {
      title: "SentinelShield Cybersecurity Ops",
      tagline: "Autonomous Threat Detection & Zero-Trust Perimeter Defense",
      description: "Real-time behavioral telemetry, automated honeypots, and instantaneous incident neutralization across multi-cloud infrastructure.",
      theme: "cyber",
      themeAccent: "#06B6D4",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Threat Radar", "Firewall Matrix", "Intrusion Logs", "Compliance"],
      heroCTA: "Launch Security Matrix",
      heroSecondaryCTA: "Run Vulnerability Scan",
      stats: [
        { label: "Active Nodes", value: "1,420", change: "+12" },
        { label: "Attacks Neutralized", value: "48,910", change: "100% Mitigated" },
        { label: "Response Latency", value: "<2ms", change: "Automated" }
      ],
      features: [
        { id: "1", title: "Autonomous SIEM Ingestion", desc: "Sub-millisecond log parsing and zero-trust perimeter rule enforcement." },
        { id: "2", title: "Kernel Threat Sandboxing", desc: "Isolated virtual execution spaces neutralizing memory corruption exploits." },
        { id: "3", title: "Continuous Compliance", desc: "Automated SOC2 Type II and ISO 27001 verification." }
      ],
      categoryTabs: ["All", "Core", "Firewall", "Intrusion"],
      items: [
        { id: "SEC-01", name: "Gateway Sentinel Cluster Alpha", status: "Shielded", latency: "1ms", category: "Core" },
        { id: "SEC-02", name: "Deep Packet Inspection Engine", status: "Active", latency: "2ms", category: "Firewall" },
        { id: "SEC-03", name: "BGP DDoS Scrubbing Proxy", status: "Optimal", latency: "4ms", category: "Firewall" },
        { id: "SEC-04", name: "Automated Regression Harness", status: "Passed", latency: "1ms", category: "Intrusion" }
      ]
    };
  }

  // 6. CRYPTO / WEB3 / DEFI
  if (/crypto|coin|trading|web3|wallet|token|defi|blockchain|dex|solana|bitcoin|ethereum|finance/i.test(p)) {
    return {
      title: "ApexChain Decentralized Terminal",
      tagline: "Ultra-Low Latency Cross-Chain Asset Terminal",
      description: "Institutional liquidity routing, zero-MEV execution, and trustless cross-chain atomic swaps across Ethereum, Solana, and Cosmos.",
      theme: "emerald",
      themeAccent: "#10B981",
      stage: 6,
      currentSection: "full_site",
      navLinks: ["Markets", "DEX Terminal", "Staking Vaults", "Governance"],
      heroCTA: "Connect Wallet (0x...)",
      heroSecondaryCTA: "Explore Liquidity Vaults",
      stats: [
        { label: "24h Volume", value: "$4.82B", change: "+14.8%" },
        { label: "Total Value Locked", value: "$12.4B", change: "+3.2%" },
        { label: "Block Finality", value: "400ms", change: "Zero Reorg" }
      ],
      features: [
        { id: "1", title: "MEV-Shielded Execution", desc: "Private mempool transaction routing eliminating frontrunning and sandwich attacks." },
        { id: "2", title: "Cross-Chain Atomic Swaps", desc: "Trustless liquidity bridges across major L1 networks." },
        { id: "3", title: "Self-Custodial Vaults", desc: "Smart contract vaults with programmable multi-sig time locks." }
      ],
      categoryTabs: ["All", "Layer 1", "DeFi", "Perpetuals"],
      items: [
        { id: "BTC-USD", name: "Bitcoin Perpetual ($68.4k)", status: "Bullish", latency: "+4.2%", category: "Layer 1" },
        { id: "ETH-USD", name: "Ethereum Staked Asset", status: "Liquid", latency: "+6.1%", category: "Layer 1" },
        { id: "SOL-USD", name: "Solana Supernode Yield", status: "Active", latency: "+8.9%", category: "Layer 1" },
        { id: "UNI-V3", name: "Automated Liquidity Vault", status: "14.2% APY", latency: "Nominal", category: "DeFi" }
      ]
    };
  }

  // 7. UNIVERSAL DYNAMIC SYNTHESIS FOR ANY PROMPT
  const brandTitle = cleanedName.length > 28 ? cleanedName.slice(0, 28) : cleanedName;
  return {
    title: brandTitle,
    tagline: `Premium ${brandTitle} — Engineered for Modern Excellence`,
    description: `Experience the next generation of ${cleanedName.toLowerCase()}. Crafted with meticulous attention to detail, accessible interaction design, and uncompromising performance.`,
    theme: "cyan",
    themeAccent: "#06B6D4",
    stage: 6,
    currentSection: "full_site",
    navLinks: ["Overview", "Capabilities", "Catalog", "Support"],
    heroCTA: "Explore Platform",
    heroSecondaryCTA: "View Features",
    stats: [
      { label: "Customer Satisfaction", value: "99.4%", change: "5-Star Rated" },
      { label: "Active Community", value: "24,000+", change: "Members" },
      { label: "Response Time", value: "<5 min", change: "24/7 Support" }
    ],
    features: [
      { id: "1", title: "Tailored Experience", desc: `Personalized solutions designed specifically around your ${cleanedName.toLowerCase()} goals.` },
      { id: "2", title: "Verified Quality", desc: "Every component and feature undergoes strict verification before release." },
      { id: "3", title: "24/7 Dedicated Support", desc: "Our product specialists and engineering team are available around the clock." }
    ],
    categoryTabs: ["All", "Featured", "Popular", "Custom"],
    items: [
      { id: "ITEM-01", name: `${brandTitle} Signature Edition`, status: "In Stock", latency: "$89.00", category: "Featured" },
      { id: "ITEM-02", name: `${brandTitle} Pro Bundle`, status: "Popular", latency: "$149.00", category: "Featured" },
      { id: "ITEM-03", name: `${brandTitle} Essential Pack`, status: "In Stock", latency: "$49.00", category: "Popular" },
      { id: "ITEM-04", name: `${brandTitle} Bespoke Reserve`, status: "Limited", latency: "$199.00", category: "Custom" }
    ]
  };
}
