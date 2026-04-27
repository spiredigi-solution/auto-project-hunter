import { useMemo } from 'react';
import {
  Brain,
  ChartDonut,
  CheckCircle,
  ClockCountdown,
  Fire,
  ListBullets,
  PaperPlaneTilt,
  Robot,
  Sparkle,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import {
  Bar, BarChart, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { useQuery } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import type { Lead } from '@animaapp/playground-react-sdk';
import type { NavKey } from '../types';

interface DashboardProps {
  onNav: (key: NavKey) => void;
  onSelectLead: (lead: Lead) => void;
  themeMode: 'dark' | 'light';
  onThemeChange: (mode: 'dark' | 'light') => void;
}

const metricCards = [
  { key: 'all', title: 'Total Leads', icon: ChartDonut },
  { key: 'hot', title: 'Hot Leads', icon: Fire },
  { key: 'new', title: 'New Leads', icon: Sparkle },
  { key: 'contacted', title: 'Contacted', icon: PaperPlaneTilt },
  { key: 'converted', title: 'Converted', icon: CheckCircle },
  { key: 'rejected', title: 'Rejected', icon: X },
] as const;

const urgencyTrendData = [
  { name: 'Mon', high: 4, medium: 2, low: 1 },
  { name: 'Tue', high: 3, medium: 3, low: 1 },
  { name: 'Wed', high: 5, medium: 2, low: 2 },
  { name: 'Thu', high: 6, medium: 4, low: 2 },
  { name: 'Fri', high: 5, medium: 3, low: 1 },
  { name: 'Sat', high: 2, medium: 1, low: 1 },
  { name: 'Sun', high: 4, medium: 2, low: 1 },
];

export function Dashboard({ onNav, onSelectLead, themeMode, onThemeChange }: DashboardProps) {
  const { data: leads, isPending } = useQuery('Lead');

  const metrics = useMemo(() => {
    if (!leads) return { total: 0, hot: 0, newCount: 0, contacted: 0, converted: 0, rejected: 0 };
    return {
      total: leads.length,
      hot: leads.filter((l) => l.status === 'hot').length,
      newCount: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      converted: leads.filter((l) => l.status === 'converted').length,
      rejected: leads.filter((l) => l.status === 'rejected').length,
    };
  }, [leads]);

  const sourceChartData = useMemo(() => {
    if (!leads) return [];
    const map: Record<string, number> = {};
    leads.forEach((l) => { map[l.source] = (map[l.source] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const categoryChartData = useMemo(() => {
    if (!leads) return [];
    const map: Record<string, number> = {};
    leads.forEach((l) => { map[l.category] = (map[l.category] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const hotLeads = useMemo(
    () => (leads ?? []).filter((l) => l.status === 'hot').slice(0, 3),
    [leads],
  );

  const metricValues = {
    all: metrics.total,
    hot: metrics.hot,
    new: metrics.newCount,
    contacted: metrics.contacted,
    converted: metrics.converted,
    rejected: metrics.rejected,
  };

  const CHART_COLORS = [
    'hsl(var(--color-primary))',
    'hsl(var(--color-secondary))',
    'hsl(var(--color-accent))',
    'hsl(var(--color-success))',
    'hsl(var(--color-warning))',
    'hsl(var(--color-gray-300))',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <Card className="overflow-hidden border-border bg-panel">
        <div className="grid h-full gap-0 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="flex flex-col justify-between p-8">
            <div>
              <Badge className="border-transparent bg-secondary text-secondary-foreground text-xs">
                AI-powered monitoring active
              </Badge>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                Operate your lead pipeline with fast filters, AI scoring, and outreach-ready context.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Real-time lead analytics, automated outreach generation, and smart scoring across every source adapter.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => onNav('leads')}>
                <ListBullets size={16} weight="fill" />
                View All Leads
              </Button>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover" onClick={() => onNav('outreach')}>
                <Robot size={16} weight="fill" />
                Generate Outreach
              </Button>
            </div>
          </div>
          <div className="hidden border-l border-border lg:block">
            <img
              src="https://c.animaapp.com/moh93ku2XiXYHy/img/ai_2.png"
              alt="AI data network"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Card>

      {/* System Status + Theme */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-panel col-span-1 md:col-span-2 xl:col-span-3">
          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Runtime health</p>
                  <p className="mt-1 text-sm font-medium text-foreground">Stable · All sources up</p>
                </div>
                <CheckCircle size={20} weight="fill" className="text-success shrink-0" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Hot leads pending</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{metrics.hot} need action today</p>
                </div>
                <WarningCircle size={20} weight="fill" className="text-accent shrink-0" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Next sync window</p>
                  <p className="mt-1 text-sm font-medium text-foreground">In 14 min · 5 connectors</p>
                </div>
                <ClockCountdown size={20} weight="fill" className="text-primary shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
            <p className="text-xs text-muted-foreground font-medium">Theme mode</p>
            <Tabs value={themeMode} onValueChange={(v) => onThemeChange(v as 'dark' | 'light')}>
              <TabsList className="w-full bg-background">
                <TabsTrigger value="dark" className="flex-1 text-xs">Dark</TabsTrigger>
                <TabsTrigger value="light" className="flex-1 text-xs">Light</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onNav('leads')}
              className="cursor-pointer rounded-lg border border-border bg-panel p-0 text-left transition-all hover:scale-[1.02] hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{card.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {isPending ? '—' : metricValues[card.key]}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background p-2 text-primary">
                    <Icon size={20} weight="fill" />
                  </div>
                </div>
              </CardContent>
            </button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Source Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">Lead volume by source adapter</p>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {sourceChartData.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--color-panel))', border: '1px solid hsl(var(--color-border))', color: 'hsl(var(--color-foreground))', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Service Categories</CardTitle>
            <p className="text-xs text-muted-foreground">Demand distribution across services</p>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} barCategoryGap={12}>
                <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--color-panel))', border: '1px solid hsl(var(--color-border))', color: 'hsl(var(--color-foreground))', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(var(--color-primary))" animationDuration={400} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Urgency Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Daily urgency pattern this week</p>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={urgencyTrendData}>
                <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--color-panel))', border: '1px solid hsl(var(--color-border))', color: 'hsl(var(--color-foreground))', fontSize: '12px' }} />
                <Line type="monotone" dataKey="high" stroke="hsl(var(--color-accent))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="medium" stroke="hsl(var(--color-primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="low" stroke="hsl(var(--color-success))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hot Leads spotlight */}
      {hotLeads.length > 0 && (
        <Card className="border-border bg-panel">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm text-foreground flex items-center gap-2">
                  <Fire size={16} weight="fill" className="text-accent" />
                  Hot Leads — Action Required
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">These leads scored 85+ and need immediate outreach.</p>
              </div>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs" onClick={() => onNav('leads')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {hotLeads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-border bg-panel-alt p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{lead.company}</p>
                      <p className="text-xs text-muted-foreground">{lead.leadName}</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground border-transparent text-xs shrink-0">
                      {lead.score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-secondary text-secondary-foreground border-transparent text-xs">{lead.source}</Badge>
                    <Badge className="bg-panel text-muted-foreground border-border text-xs">{lead.category}</Badge>
                  </div>
                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover text-xs py-2"
                    onClick={() => onSelectLead(lead)}
                  >
                    <Brain size={14} weight="fill" />
                    Generate Outreach
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
