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
  // Remove command prefixes
  clean = clean.replace(/^(make|build|create|design|generate|code|develop)\s+(me\s+)?(a\s+|an\s+|the\s+)?/i, '');
  clean = clean.replace(/^(a\s+|an\s+|the\s+)/i, '');
  clean = clean.replace(/\s+(website|web\s*site|app|application|platform|page|clone|portal)$/i, '');
  clean = clean.trim();
  if (!clean) return "DevStudio Project";
  // Capitalize words
  return clean
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function synthesizeDomainWebsite(rawPrompt: string): WebsiteState {
  const p = (rawPrompt || "").toLowerCase().trim();
  const cleanedName = cleanPromptName(rawPrompt);

  // 1. CHEWY / PET CARE / ANIMALS / DOGS / CATS / VET
  if (/chewy|pet|dog|cat|puppy|kitten|vet|veterinar|animal|paw|bark|kibble|aquarium|canine|feline/i.test(p)) {
    const isChewyNamed = /chewy/i.test(p);
    const brand = isChewyNamed ? "Chewy Pet Supply Co." : `${cleanedName} Pet Care Co.`;
    return {
      title: brand,
      tagline: "Where Pet Parents Shop for Food, Toys, Treats & Healthcare",
      description: "America's most trusted destination for pet parents. Save 35% on your first Autoship order, enjoy free 1-2 day delivery over $49, and connect with licensed veterinarians 24/7.",
      theme: "chewy",
      themeAccent: "#128CED",
      stage: 1,
      currentSection: "blueprint",
      navLinks: ["Dog Supplies", "Cat Essentials", "Pet Pharmacy", "Treats & Toys", "Autoship"],
      heroCTA: "Autoship & Save 35%",
      heroSecondaryCTA: "Connect with a Vet",
      stats: [
        { label: "Autoship Savings", value: "35% OFF", change: "First Order" },
        { label: "Delivery Speed", value: "1-2 Days", change: "Free Over $49" },
        { label: "Happy Pets", value: "20M+", change: "Families Served" }
      ],
      features: [
        { 
          id: "1", 
          title: "Autoship & Flexible Scheduling", 
          desc: "Never run out of pet food or medications. Flexible delivery dates, instant skips, and 5% recurring savings on every order." 
        },
        { 
          id: "2", 
          title: "24/7 Licensed Pet Pharmacy", 
          desc: "Prescription flea/tick, heartworm, and specialty medications verified directly with your vet and shipped to your door." 
        },
        { 
          id: "3", 
          title: "100% Pet Happiness Guarantee", 
          desc: "If your pup or kitten doesn't absolutely love their new food, toy, or bed, return it anytime within 365 days." 
        }
      ],
      categoryTabs: ["All", "Dog Food", "Cat Essentials", "Pet Pharmacy", "Treats & Toys"],
      items: [
        { id: "CHW-01", name: "Blue Buffalo Life Protection Chicken & Brown Rice (30 lb)", status: "Best Seller", latency: "$64.98", category: "Dog Food" },
        { id: "CHW-02", name: "Purina Pro Plan High Protein Wet Cat Food (24pk)", status: "Popular", latency: "$38.49", category: "Cat Essentials" },
        { id: "CHW-03", name: "KONG Classic Durable Rubber Dog Chew Toy (Large)", status: "In Stock", latency: "$14.99", category: "Treats & Toys" },
        { id: "CHW-04", name: "Heartgard Plus Chewables for Dogs 26-50 lbs (6 Doses)", status: "Vet Verified", latency: "$44.99", category: "Pet Pharmacy" },
        { id: "CHW-05", name: "Frisco 62-in Real Wood Multi-Cat Scratching Tree", status: "In Stock", latency: "$59.99", category: "Cat Essentials" },
        { id: "CHW-06", name: "Greenies Original Dental Dog Treats Box (36 ct)", status: "Recommended", latency: "$34.98", category: "Treats & Toys" }
      ]
    };
  }

  // 2. COFFEE / CAFE / BAKERY / RESTAURANT / FOOD / DINING
  if (/coffee|cafe|bakery|restaurant|bistro|food|pizza|burger|sushi|taco|tea|roast|chef|dining|kitchen|brew/i.test(p)) {
    const brand = /coffee|roast|brew|cafe/i.test(p) ? "Velvet Roast Coffee Co." : `${cleanedName} Artisan Kitchen`;
    return {
      title: brand,
      tagline: "Single-Origin Artisan Roasts & Freshly Baked Daily Delicacies",
      description: "Ethically harvested from high-altitude family micro-lots and roasted fresh every sunrise. Experience extraordinary notes of wild berry, dark cacao, and honeycomb.",
      theme: "amber",
      themeAccent: "#F59E0B",
      stage: 1,
      currentSection: "blueprint",
      navLinks: ["Single Origin", "Espresso", "Cold Brew", "Subscriptions", "Brew Guides"],
      heroCTA: "Subscribe for $18/mo",
      heroSecondaryCTA: "View Tasting Menu",
      stats: [
        { label: "Origin Countries", value: "14 Farms", change: "Direct Trade" },
        { label: "Roast Freshness", value: "48 Hours", change: "Direct to Door" },
        { label: "Customer Rating", value: "4.96 ★", change: "3,200+ Reviews" }
      ],
      features: [
        { id: "1", title: "Micro-Batch Drum Roasting", desc: "Small-batch drum roasting tailored to highlight origin berry and cacao notes." },
        { id: "2", title: "Direct Trade Guarantee", desc: "100% of farmers compensated at least 45% above the fair-trade price floor." },
        { id: "3", title: "Compostable Eco-Pouch", desc: "Zero-plastic plant-based packaging that degrades naturally within 90 days." }
      ],
      categoryTabs: ["All", "Single Origin", "Cold Brew", "Espresso", "Gear"],
      items: [
        { id: "ROAST-01", name: "Ethiopian Yirgacheffe Washed Heirloom", status: "In Stock", latency: "$21.00", category: "Single Origin" },
        { id: "ROAST-02", name: "Colombian Huila Geisha Reserve", status: "Limited Lot", latency: "$28.50", category: "Single Origin" },
        { id: "ROAST-03", name: "Nitro Cold Brew Concentrate (32oz)", status: "Best Seller", latency: "$16.00", category: "Cold Brew" },
        { id: "ROAST-04", name: "Midnight Velvet Espresso Blend", status: "In Stock", latency: "$19.00", category: "Espresso" },
        { id: "ROAST-05", name: "AeroPress Clear Precision Brewer", status: "Popular", latency: "$49.95", category: "Gear" }
      ]
    };
  }

  // 3. FASHION / FOOTWEAR / SNEAKERS / NIKE / APPAREL / LUXURY
  if (/nike|adidas|shoe|sneaker|footwear|fashion|cloth|apparel|wear|luxury|watch|boutique|dress|streetwear/i.test(p)) {
    const brand = /nike|shoe|sneaker/i.test(p) ? "AeroStep Footwear & Athletics" : `${cleanedName} Atelier`;
    return {
      title: brand,
      tagline: "Performance Engineered Footwear & Modern Streetwear",
      description: "Ultra-responsive carbon fiber propulsion paired with breathable recycled knit uppers. Engineered for personal best marathons and modern street aesthetic.",
      theme: "emerald",
      themeAccent: "#10B981",
      stage: 1,
      currentSection: "blueprint",
      navLinks: ["New Arrivals", "Running Shoes", "Streetwear", "Accessories", "Sale"],
      heroCTA: "Shop Collection",
      heroSecondaryCTA: "Explore Innovation",
      stats: [
        { label: "Express Delivery", value: "Free", change: "Over $75" },
        { label: "Recycled Knit", value: "85%", change: "Eco-Certified" },
        { label: "Customer Rating", value: "4.9 ★", change: "18,000+ Reviews" }
      ],
      features: [
        { id: "1", title: "Carbon Kinetic Plate", desc: "Dynamic energy return maximizing stride efficiency with minimum joint fatigue." },
        { id: "2", title: "Breathable Aeroknit Mesh", desc: "Zone-mapped ventilation keeping your feet cool and dry over any distance." },
        { id: "3", title: "30-Day Wear Test Trial", desc: "Run in them for 30 days. If you're not in love, return them no questions asked." }
      ],
      categoryTabs: ["All", "Running", "Lifestyle", "Trail", "Accessories"],
      items: [
        { id: "SHOE-01", name: "AeroStep Pro Carbon Marathon Racer", status: "Best Seller", latency: "$189.99", category: "Running" },
        { id: "SHOE-02", name: "StreetPulse Retro High Leather Sneaker", status: "Trending", latency: "$139.99", category: "Lifestyle" },
        { id: "SHOE-03", name: "TerrainGrip Waterproof Trail Runner", status: "In Stock", latency: "$159.99", category: "Trail" },
        { id: "SHOE-04", name: "Seamless TechKnit Running Tee", status: "Popular", latency: "$48.00", category: "Accessories" }
      ]
    };
  }

  // 4. REAL ESTATE / AIRBNB / HOUSING / VILLAS / TRAVEL
  if (/real estate|property|realtor|house|home|apartment|villa|airbnb|hotel|resort|vacation|rental|condo|booking/i.test(p)) {
    const brand = "Haven & Hearth Luxury Estates";
    return {
      title: brand,
      tagline: "Curated Architectural Sanctuaries & Prime Coastal Residences",
      description: "Discover bespoke private villas, panoramic waterfront penthouses, and tranquil mountain retreats hand-selected for discerning travelers and investors.",
      theme: "amber",
      themeAccent: "#F59E0B",
      stage: 1,
      currentSection: "blueprint",
      navLinks: ["Exclusive Villas", "Penthouses", "Coastal Retreats", "Market Reports", "Concierge"],
      heroCTA: "Explore Properties",
      heroSecondaryCTA: "Schedule Private Tour",
      stats: [
        { label: "Portfolio Value", value: "$2.4B+", change: "Global Listings" },
        { label: "Guest Satisfaction", value: "4.98 ★", change: "Superhost Verified" },
        { label: "Private Concierge", value: "24/7", change: "White Glove" }
      ],
      features: [
        { id: "1", title: "Vetted Architectural Mastery", desc: "Every estate audited across 120 structural, acoustic, and privacy standards." },
        { id: "2", title: "Full-Service Private Staff", desc: "Dedicated private chefs, sommelier cellars, and chauffeur airport transfers." },
        { id: "3", title: "Seamless Escrow & Booking", desc: "Encrypted instant reservation security with flexible cancellation protection." }
      ],
      categoryTabs: ["All", "Villas", "Penthouses", "Coastal", "Cabins"],
      items: [
        { id: "PROP-01", name: "Azure Horizon Waterfront Villa — Malibu, CA", status: "Available", latency: "$1,850/night", category: "Villas" },
        { id: "PROP-02", name: "The Glass Penthouse at Hudson Yards — NYC", status: "Available", latency: "$3,200/night", category: "Penthouses" },
        { id: "PROP-03", name: "Villa Bellagio Lakefront Sanctuary — Como, IT", status: "Booked", latency: "$2,400/night", category: "Coastal" },
        { id: "PROP-04", name: "Nordic Cedar Hot Spring Chalet — Aspen, CO", status: "Available", latency: "$1,450/night", category: "Cabins" }
      ]
    };
  }

  // 5. CRYPTO / WEB3 / DEFI / TRADING
  if (/crypto|coin|trading|web3|wallet|token|defi|blockchain|dex|solana|bitcoin|ethereum|finance|fintech/i.test(p)) {
    return {
      title: "ApexChain Decentralized Terminal",
      tagline: "Ultra-Low Latency Cross-Chain Asset Terminal",
      description: "Institutional liquidity routing, zero-MEV execution, and trustless cross-chain atomic swaps across Ethereum, Solana, and Cosmos.",
      theme: "emerald",
      themeAccent: "#10B981",
      stage: 1,
      currentSection: "blueprint",
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
        { id: "2", title: "Cross-Chain Atomic Swaps", desc: "Trustless liquidity bridges across Ethereum, Solana, and Cosmos." },
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

  // 6. CYBERSECURITY / SOC / CLOUD DEVOPS
  if (/security|cyber|incident|threat|pentest|audit|firewall|soc|infosec|devops/i.test(p)) {
    return {
      title: "SentinelShield Cybersecurity Ops",
      tagline: "Autonomous Threat Detection & Zero-Trust Perimeter Defense",
      description: "Real-time behavioral telemetry, automated honeypots, and instantaneous incident neutralization across multi-cloud infrastructure.",
      theme: "cyber",
      themeAccent: "#06B6D4",
      stage: 1,
      currentSection: "blueprint",
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
        { id: "3", title: "Continuous Compliance", desc: "Automated SOC2 Type II, ISO 27001, and HIPAA compliance verification." }
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

  // 7. UNIVERSAL INTELLIGENT SYNTHESIS FOR ANY ARBITRARY PROMPT
  const brandTitle = cleanedName.length > 28 ? cleanedName.slice(0, 28) : cleanedName;
  return {
    title: brandTitle,
    tagline: `Premium ${brandTitle} — Engineered for Modern Excellence`,
    description: `Experience the next generation of ${cleanedName.toLowerCase()}. Crafted with meticulous attention to detail, accessible interaction design, and uncompromising performance.`,
    theme: "cyan",
    themeAccent: "#06B6D4",
    stage: 1,
    currentSection: "blueprint",
    navLinks: ["Overview", "Capabilities", "Catalog", "Contact"],
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
