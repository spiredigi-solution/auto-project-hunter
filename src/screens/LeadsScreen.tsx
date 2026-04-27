import { useMemo, useState } from 'react';
import {
  Brain, Copy, Export, Fire, Funnel, MagnifyingGlass, PaperPlaneTilt, Plus, Trash,
} from '@phosphor-icons/react';
import { useQuery, useMutation } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { scoreBarColor, statusColor, copyToClipboard } from '../lib/utils';
import type { Lead } from '@animaapp/playground-react-sdk';

interface LeadsScreenProps {
  onSelectLead: (lead: Lead) => void;
}

export function LeadsScreen({ onSelectLead }: LeadsScreenProps) {
  const { data: leads, isPending, error } = useQuery('Lead', { orderBy: { score: 'desc' } });
  const { update, remove, create, isPending: isMutating } = useMutation('Lead');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ company: '', leadName: '', source: '', category: '', score: 70, status: 'new' });

  const sources = useMemo(() => Array.from(new Set((leads ?? []).map((l) => l.source))), [leads]);
  const categories = useMemo(() => Array.from(new Set((leads ?? []).map((l) => l.category))), [leads]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
      const matchCategory = categoryFilter === 'all' || l.category === categoryFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || `${l.company} ${l.leadName} ${l.source} ${l.category}`.toLowerCase().includes(q);
      return matchStatus && matchSource && matchCategory && matchSearch;
    });
  }, [leads, statusFilter, sourceFilter, categoryFilter, search]);

  const handleStatusChange = async (id: string, status: string) => {
    await update(id, { status });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this lead?')) await remove(id);
  };

  const handleAddLead = async () => {
    if (!newLead.company || !newLead.leadName) return;
    await create({ ...newLead, lastContact: new Date() });
    setNewLead({ company: '', leadName: '', source: '', category: '', score: 70, status: 'new' });
    setShowAddForm(false);
  };

  const handleExport = () => {
    if (!filtered.length) return;
    const headers = ['Company', 'Lead Name', 'Source', 'Category', 'Score', 'Status'];
    const rows = filtered.map((l) => [l.company, l.leadName, l.source, l.category, l.score, l.status]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isPending) return <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">Loading leads…</div>;
  if (error) return <div className="flex items-center justify-center h-64 text-accent text-sm">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-border bg-panel">
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="border-border bg-background text-foreground text-sm">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent className="border-border bg-panel text-foreground">
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-border bg-background text-foreground text-sm">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="border-border bg-panel text-foreground">
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-border bg-background text-foreground text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="border-border bg-panel text-foreground">
                <SelectItem value="all">All statuses</SelectItem>
                {['new', 'hot', 'contacted', 'follow-up', 'converted', 'rejected'].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <MagnifyingGlass size={16} weight="fill" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-border bg-background pl-9 text-foreground text-sm"
                placeholder="Search leads…"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={() => setShowAddForm((v) => !v)}>
                <Plus size={14} weight="fill" />
                Add Lead
              </Button>
              <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs" onClick={handleExport}>
                <Export size={14} weight="fill" />
                Export
              </Button>
            </div>
          </div>

          {/* Inline Add Form */}
          {showAddForm && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-6 p-4 rounded-lg border border-primary/30 bg-panel-alt">
              <Input placeholder="Company *" value={newLead.company} onChange={(e) => setNewLead((p) => ({ ...p, company: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Input placeholder="Lead Name *" value={newLead.leadName} onChange={(e) => setNewLead((p) => ({ ...p, leadName: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Input placeholder="Source" value={newLead.source} onChange={(e) => setNewLead((p) => ({ ...p, source: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Input placeholder="Category" value={newLead.category} onChange={(e) => setNewLead((p) => ({ ...p, category: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Input type="number" placeholder="Score (0-100)" value={newLead.score} onChange={(e) => setNewLead((p) => ({ ...p, score: Number(e.target.value) }))} className="border-border bg-background text-foreground text-sm" min={0} max={100} />
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={handleAddLead} disabled={isMutating}>
                {isMutating ? 'Saving…' : 'Save Lead'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border bg-panel">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm text-foreground">Lead Management</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{filtered.length} leads match current filters</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-alt px-3 py-2">
            <Funnel size={14} weight="fill" className="text-primary" />
            <span className="text-xs text-foreground">Filter memory on</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-y border-border bg-panel-alt">
                  {['Lead / Company', 'Source', 'Category', 'Score', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, index) => (
                  <>
                    <tr
                      key={lead.id}
                      className={`border-b border-border/50 transition-colors hover:bg-panel-hover ${index % 2 === 0 ? 'bg-panel' : 'bg-background/30'}`}
                    >
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          className="text-left cursor-pointer hover:opacity-80 focus-visible:outline-none"
                          onClick={() => setExpandedId((p) => p === lead.id ? null : lead.id)}
                        >
                          <p className="text-sm font-medium text-foreground">{lead.leadName}</p>
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-xs text-foreground">{lead.source}</td>
                      <td className="px-5 py-4 text-xs text-foreground">{lead.category}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-panel-alt">
                            <div className={`h-1.5 rounded-full ${scoreBarColor(lead.score)}`} style={{ width: `${lead.score}%` }} />
                          </div>
                          <span className="font-mono text-xs text-foreground">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                          <SelectTrigger className="w-[130px] border-border bg-background text-foreground text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-border bg-panel text-foreground">
                            {['new', 'hot', 'contacted', 'follow-up', 'converted', 'rejected'].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs h-8 px-3" onClick={() => onSelectLead(lead)}>
                            <Brain size={12} weight="fill" />
                            Outreach
                          </Button>
                          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs h-8 px-3" onClick={() => copyToClipboard(`${lead.company} — ${lead.leadName} — ${lead.category}`)}>
                            <Copy size={12} weight="fill" />
                          </Button>
                          <Button className="bg-panel-alt text-muted-foreground hover:bg-panel-hover text-xs h-8 px-3 border border-border" onClick={() => handleDelete(lead.id)}>
                            <Trash size={12} weight="fill" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === lead.id && (
                      <tr key={`${lead.id}-exp`} className="bg-panel-hover border-b border-border">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Last Contact</p>
                              <p className="text-xs text-foreground">{new Date(lead.lastContact).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Score</p>
                              <p className="text-xs text-foreground">{lead.score}/100</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Category</p>
                              <p className="text-xs text-foreground">{lead.category}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">No leads match your current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 p-4 lg:hidden">
            {filtered.map((lead) => (
              <Card key={lead.id} className="border-border bg-panel-alt">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{lead.leadName}</p>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <Badge className={`${statusColor(lead.status)} border-transparent text-xs`}>{lead.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-foreground">
                    <span>Source: {lead.source}</span>
                    <span>Score: {lead.score}</span>
                    <span className="col-span-2">Category: {lead.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={() => onSelectLead(lead)}>
                      <Brain size={12} weight="fill" />
                      Outreach
                    </Button>
                    <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs" onClick={() => copyToClipboard(lead.company)}>
                      <Copy size={12} weight="fill" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
