import { useMemo } from 'react';
import { Brain, Fire, TrendUp, Target, ChartBar } from '@phosphor-icons/react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, ScatterChart, Scatter } from 'recharts';
import { useQuery } from '@animaapp/playground-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { scoreColor, statusColor } from '../lib/utils';

export function InsightsScreen() {
  const { data: leads, isPending } = useQuery('Lead');

  const insights = useMemo(() => {
    if (!leads || !leads.length) return null;

    const avgScore = Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length);
    const hotLeads = leads.filter((l) => l.score >= 85);
    const byCategory: Record<string, { count: number; totalScore: number }> = {};
    const bySource: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    leads.forEach((l) => {
      byCategory[l.category] = byCategory[l.category] ?? { count: 0, totalScore: 0 };
      byCategory[l.category].count++;
      byCategory[l.category].totalScore += l.score;
      bySource[l.source] = (bySource[l.source] ?? 0) + 1;
      byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    });

    const categoryData = Object.entries(byCategory).map(([name, d]) => ({
      name,
      avgScore: Math.round(d.totalScore / d.count),
      count: d.count,
    }));

    const sourceData = Object.entries(bySource).map(([name, count]) => ({ name, count }));

    const radarData = categoryData.map((c) => ({ subject: c.name, score: c.avgScore }));

    const scoreDistribution = [
      { range: '0-40', count: leads.filter((l) => l.score < 40).length },
      { range: '40-60', count: leads.filter((l) => l.score >= 40 && l.score < 60).length },
      { range: '60-75', count: leads.filter((l) => l.score >= 60 && l.score < 75).length },
      { range: '75-85', count: leads.filter((l) => l.score >= 75 && l.score < 85).length },
      { range: '85-100', count: leads.filter((l) => l.score >= 85).length },
    ];

    return { avgScore, hotLeads, categoryData, sourceData, radarData, scoreDistribution, byStatus };
  }, [leads]);

  if (isPending) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">Loading insights…</div>;
  if (!insights) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No data available yet.</div>;

  const CHART_STYLE = { background: 'hsl(var(--color-panel))', border: '1px solid hsl(var(--color-border))', color: 'hsl(var(--color-foreground))', fontSize: '11px' };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
        <p className="text-xs text-muted-foreground mt-1">AI-powered analysis of lead quality, patterns, and conversion potential.</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Brain size={20} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Lead Score</p>
              <p className="text-2xl font-semibold text-foreground">{insights.avgScore}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><Fire size={20} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Hot Leads (85+)</p>
              <p className="text-2xl font-semibold text-foreground">{insights.hotLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success"><Target size={20} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Converted</p>
              <p className="text-2xl font-semibold text-foreground">{insights.byStatus['converted'] ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20 text-secondary"><TrendUp size={20} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Top Category</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {insights.categoryData.sort((a, b) => b.count - a.count)[0]?.name ?? '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Score Distribution</CardTitle>
            <p className="text-xs text-muted-foreground">Breakdown of lead quality bands</p>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.scoreDistribution} barCategoryGap={10}>
                <XAxis dataKey="range" stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="hsl(var(--color-primary))" animationDuration={400} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Category Performance Radar</CardTitle>
            <p className="text-xs text-muted-foreground">Average lead score by service category</p>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={insights.radarData}>
                <PolarGrid stroke="hsl(var(--color-border))" />
                <PolarAngleAxis dataKey="subject" stroke="hsl(var(--color-muted-foreground))" tick={{ fontSize: 10 }} />
                <Radar name="Avg Score" dataKey="score" stroke="hsl(var(--color-primary))" fill="hsl(var(--color-primary))" fillOpacity={0.25} />
                <Tooltip contentStyle={CHART_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Source Volume</CardTitle>
            <p className="text-xs text-muted-foreground">Number of leads per source</p>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.sourceData} layout="vertical" barCategoryGap={8}>
                <XAxis type="number" stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--color-muted-foreground))" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="hsl(var(--color-secondary))" animationDuration={400} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Top Hot Leads</CardTitle>
            <p className="text-xs text-muted-foreground">Leads scoring 85+ requiring immediate attention</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {insights.hotLeads.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hot leads yet.</p>
              ) : insights.hotLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{lead.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`${statusColor(lead.status)} border-transparent text-xs`}>{lead.status}</Badge>
                    <span className={`font-mono text-xs font-semibold ${scoreColor(lead.score)}`}>{lead.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
