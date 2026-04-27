// Seed data for initial demo population via SDK mutations

export const seedLeads = [
  {
    company: 'Northline Solar',
    leadName: 'Ava Reynolds',
    source: 'LinkedIn',
    category: 'Web Development',
    score: 92,
    status: 'hot',
    lastContact: new Date('2026-04-24'),
  },
  {
    company: 'Mira Health Studio',
    leadName: 'Leo Kim',
    source: 'Upwork',
    category: 'AI Automation',
    score: 88,
    status: 'new',
    lastContact: new Date('2026-04-27'),
  },
  {
    company: 'PeakCraft Interiors',
    leadName: 'Nina Patel',
    source: 'Fiverr',
    category: 'Branding',
    score: 73,
    status: 'contacted',
    lastContact: new Date('2026-04-23'),
  },
  {
    company: 'Harbor Logistics',
    leadName: 'Marcus Hale',
    source: 'Indeed',
    category: 'CRM Setup',
    score: 81,
    status: 'new',
    lastContact: new Date('2026-04-26'),
  },
  {
    company: 'BrightPath Legal',
    leadName: 'Isla Morgan',
    source: 'Google',
    category: 'AI Automation',
    score: 95,
    status: 'hot',
    lastContact: new Date('2026-04-27'),
  },
  {
    company: 'Oakridge Finance',
    leadName: 'Jonas Feld',
    source: 'Referral',
    category: 'Analytics',
    score: 67,
    status: 'converted',
    lastContact: new Date('2026-04-18'),
  },
  {
    company: 'Vertex Learning',
    leadName: 'Chloe Bennett',
    source: 'LinkedIn',
    category: 'Web Development',
    score: 59,
    status: 'rejected',
    lastContact: new Date('2026-04-12'),
  },
  {
    company: 'Quantum Retail',
    leadName: 'Ethan Brooks',
    source: 'Product Hunt',
    category: 'Chatbot',
    score: 84,
    status: 'contacted',
    lastContact: new Date('2026-04-25'),
  },
  {
    company: 'RedRock Ecommerce',
    leadName: 'Sara Malik',
    source: 'Rozee.pk',
    category: 'Shopify Development',
    score: 90,
    status: 'hot',
    lastContact: new Date('2026-04-27'),
  },
  {
    company: 'BlueSky Retail',
    leadName: 'James Colton',
    source: 'Facebook',
    category: 'WordPress Development',
    score: 76,
    status: 'new',
    lastContact: new Date('2026-04-26'),
  },
];

export const seedTemplates = [
  {
    name: 'Short DM - Web Development',
    type: 'LinkedIn Message',
    content: `Hi {{name}}, I noticed {{company}} might benefit from a faster, conversion-focused website. I help businesses like yours build high-performance web experiences. Would love to share a quick idea — open to a short call?`,
  },
  {
    name: 'Professional Email - AI Automation',
    type: 'Email',
    content: `Subject: Automate your lead workflow at {{company}}\n\nHi {{name}},\n\nI specialize in building AI automation systems that handle lead qualification, follow-up, and reporting without manual effort.\n\nI reviewed {{company}}'s workflow and believe a lightweight automation layer could save your team 10+ hours per week.\n\nHappy to send a tailored breakdown — would that be useful?\n\nBest,\n[Your Name]`,
  },
  {
    name: 'WhatsApp - Shopify Store',
    type: 'WhatsApp',
    content: `Hi {{name}}, I build high-converting Shopify stores and noticed {{company}} could benefit from a performance audit. I can send a free checklist if you're interested!`,
  },
  {
    name: 'Follow-up - Warm Lead',
    type: 'Follow-up',
    content: `Hi {{name}}, just following up on my earlier message about {{company}}. Totally understand if timing isn\'t right — but if you\'re still exploring solutions, I\'d love to help. Happy to start with something small and low-risk.`,
  },
  {
    name: 'Cold Outreach - SEO Blog Automation',
    type: 'Email',
    content: `Subject: 10x {{company}}\'s organic traffic with AI-written blogs\n\nHi {{name}},\n\nI help businesses automate SEO content at scale using AI — publishing 20–50 targeted blog posts per month with zero manual writing.\n\nThis drives consistent organic traffic and reduces your content costs dramatically.\n\nWould you like a sample strategy for {{company}}?\n\nBest regards,\n[Your Name]`,
  },
];

export const seedLeadSources = [
  { name: 'LinkedIn', isActive: true, integrationKey: 'linkedin-public' },
  { name: 'Upwork', isActive: true, integrationKey: 'upwork-api' },
  { name: 'Fiverr', isActive: false, integrationKey: 'fiverr-scraper' },
  { name: 'Google Search', isActive: true, integrationKey: 'serp-api' },
  { name: 'Facebook Groups', isActive: true, integrationKey: 'fb-public' },
  { name: 'Indeed / Rozee', isActive: true, integrationKey: 'job-boards' },
  { name: 'Referral Network', isActive: true, integrationKey: 'manual' },
  { name: 'Product Hunt', isActive: false, integrationKey: 'ph-api' },
];

export const seedActivityLogs = [
  {
    action: 'Hot Lead Found',
    entityId: 'lead-brightpath',
    details: 'BrightPath Legal exceeded score threshold (95) with urgent AI automation request.',
  },
  {
    action: 'Lead Contacted',
    entityId: 'lead-quantum',
    details: 'Quantum Retail received AI-generated outreach via email sequence.',
  },
  {
    action: 'Database Sync Complete',
    entityId: 'system',
    details: 'Local database synced with remote source adapters. Deduplicated 3 records.',
  },
  {
    action: 'Message Sent',
    entityId: 'lead-northline',
    details: 'Northline Solar follow-up sent from outreach template pipeline.',
  },
  {
    action: 'New Lead Captured',
    entityId: 'lead-redrock',
    details: 'RedRock Ecommerce discovered via Rozee.pk — Shopify Development, score 90.',
  },
  {
    action: 'Scheduler Triggered',
    entityId: 'system',
    details: 'Daily cron job executed at 07:00. Scanned 5 sources, 3 new leads found.',
  },
];
