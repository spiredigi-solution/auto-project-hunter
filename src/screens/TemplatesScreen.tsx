import { useState } from 'react';
import { Copy, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useQuery, useMutation } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { copyToClipboard } from '../lib/utils';

const templateTypes = ['Email', 'LinkedIn Message', 'WhatsApp', 'Follow-up', 'DM'];

export function TemplatesScreen() {
  const { data: templates, isPending, error } = useQuery('Template', { orderBy: { createdAt: 'desc' } });
  const { create, update, remove, isPending: isMutating } = useMutation('Template');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'Email', content: '' });
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = templates?.filter((t) => typeFilter === 'all' || t.type === typeFilter) ?? [];

  const handleSave = async () => {
    if (!form.name || !form.content) return;
    if (editId) {
      await update(editId, form);
      setEditId(null);
    } else {
      await create(form);
    }
    setForm({ name: '', type: 'Email', content: '' });
    setShowForm(false);
  };

  const handleEdit = (t: { id: string; name: string; type: string; content: string }) => {
    setForm({ name: t.name, type: t.type, content: t.content });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this template?')) await remove(id);
  };

  if (isPending) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">Loading templates…</div>;
  if (error) return <div className="flex h-64 items-center justify-center text-accent text-sm">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Outreach Templates</h2>
          <p className="text-xs text-muted-foreground mt-1">Pre-built and custom message frameworks for every channel.</p>
        </div>
        <div className="flex gap-3 items-center">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="border-border bg-background text-foreground text-xs w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="border-border bg-panel text-foreground">
              <SelectItem value="all">All types</SelectItem>
              {templateTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={() => { setShowForm((v) => !v); setEditId(null); setForm({ name: '', type: 'Email', content: '' }); }}>
            <Plus size={14} weight="fill" />
            New Template
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-primary/40 bg-panel-alt">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground">{editId ? 'Edit Template' : 'New Template'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Template name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
              <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                <SelectTrigger className="border-border bg-background text-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-panel text-foreground">
                  {templateTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <textarea
              className="w-full min-h-[140px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              placeholder="Template content… Use {{name}} and {{company}} as placeholders."
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={handleSave} disabled={isMutating}>
                {isMutating ? 'Saving…' : editId ? 'Update Template' : 'Create Template'}
              </Button>
              <Button className="bg-panel border border-border text-foreground hover:bg-panel-hover text-xs" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((template) => (
          <Card key={template.id} className="border-border bg-panel flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm text-foreground leading-tight">{template.name}</CardTitle>
                  <Badge className="mt-1 bg-secondary text-secondary-foreground border-transparent text-xs">{template.type}</Badge>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button type="button" onClick={() => handleEdit(template)} className="p-1.5 rounded border border-border bg-panel-alt text-muted-foreground hover:text-foreground hover:bg-panel-hover transition-colors">
                    <PencilSimple size={12} weight="fill" />
                  </button>
                  <button type="button" onClick={() => handleDelete(template.id)} className="p-1.5 rounded border border-border bg-panel-alt text-muted-foreground hover:text-accent hover:bg-panel-hover transition-colors">
                    <Trash size={12} weight="fill" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <p className="text-xs text-muted-foreground leading-5 line-clamp-5 whitespace-pre-line flex-1">{template.content}</p>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-hover text-xs" onClick={() => copyToClipboard(template.content)}>
                <Copy size={12} weight="fill" />
                Copy Template
              </Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex h-40 items-center justify-center text-sm text-muted-foreground">
            No templates yet. Create your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
