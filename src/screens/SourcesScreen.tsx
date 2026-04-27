import { useState } from 'react';
import { Plus, Trash, PencilSimple } from '@phosphor-icons/react';
import { useQuery, useMutation } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';

export function SourcesScreen() {
  const { data: sources, isPending, error } = useQuery('LeadSource', { orderBy: { name: 'asc' } });
  const { create, update, remove, isPending: isMutating } = useMutation('LeadSource');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', isActive: true, integrationKey: '' });

  const handleSave = async () => {
    if (!form.name) return;
    if (editId) {
      await update(editId, form);
      setEditId(null);
    } else {
      await create(form);
    }
    setForm({ name: '', isActive: true, integrationKey: '' });
    setShowForm(false);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await update(id, { isActive: !isActive });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this source?')) await remove(id);
  };

  const handleEdit = (s: { id: string; name: string; isActive: boolean; integrationKey?: string }) => {
    setForm({ name: s.name, isActive: s.isActive, integrationKey: s.integrationKey ?? '' });
    setEditId(s.id);
    setShowForm(true);
  };

  const activeCount = sources?.filter((s) => s.isActive).length ?? 0;
  const totalCount = sources?.length ?? 0;

  if (isPending) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">Loading sources…</div>;
  if (error) return <div className="flex h-64 items-center justify-center text-accent text-sm">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Lead Sources</h2>
          <p className="text-xs text-muted-foreground mt-1">{activeCount} of {totalCount} sources active and scanning.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={() => { setShowForm((v) => !v); setEditId(null); setForm({ name: '', isActive: true, integrationKey: '' }); }}>
          <Plus size={14} weight="fill" />
          Add Source
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-panel">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Sources</p>
            <p className="text-2xl font-semibold text-foreground mt-2">{totalCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Sources</p>
            <p className="text-2xl font-semibold text-success mt-2">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Inactive Sources</p>
            <p className="text-2xl font-semibold text-muted-foreground mt-2">{totalCount - activeCount}</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="border-primary/40 bg-panel-alt">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground">{editId ? 'Edit Source' : 'New Source'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Source name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Input placeholder="Integration key / API ID (optional)" value={form.integrationKey} onChange={(e) => setForm((p) => ({ ...p, integrationKey: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))} />
              <span className="text-sm text-foreground">{form.isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={handleSave} disabled={isMutating}>
                {isMutating ? 'Saving…' : editId ? 'Update' : 'Add Source'}
              </Button>
              <Button className="bg-panel border border-border text-foreground hover:bg-panel-hover text-xs" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(sources ?? []).map((source) => (
          <Card key={source.id} className={`border-border bg-panel transition-all ${source.isActive ? '' : 'opacity-60'}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{source.name}</p>
                  {source.integrationKey && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{source.integrationKey}</p>
                  )}
                </div>
                <Badge className={`${source.isActive ? 'bg-success text-success-foreground' : 'bg-gray-600 text-gray-200'} border-transparent text-xs shrink-0`}>
                  {source.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={source.isActive} onCheckedChange={() => handleToggle(source.id, source.isActive)} disabled={isMutating} />
                  <span className="text-xs text-muted-foreground">{source.isActive ? 'Scanning' : 'Paused'}</span>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => handleEdit(source)} className="p-1.5 rounded border border-border bg-panel-alt text-muted-foreground hover:text-foreground hover:bg-panel-hover transition-colors">
                    <PencilSimple size={12} weight="fill" />
                  </button>
                  <button type="button" onClick={() => handleDelete(source.id)} className="p-1.5 rounded border border-border bg-panel-alt text-muted-foreground hover:text-accent hover:bg-panel-hover transition-colors">
                    <Trash size={12} weight="fill" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
