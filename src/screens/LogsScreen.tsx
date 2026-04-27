import { useState } from 'react';
import { MagnifyingGlass, Trash } from '@phosphor-icons/react';
import { useQuery, useMutation } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';

const actionColors: Record<string, string> = {
  'Hot Lead Found': 'bg-accent text-accent-foreground',
  'Lead Contacted': 'bg-primary text-primary-foreground',
  'Database Sync Complete': 'bg-success text-success-foreground',
  'Message Sent': 'bg-secondary text-secondary-foreground',
  'New Lead Captured': 'bg-warning text-warning-foreground',
  'Scheduler Triggered': 'bg-gray-600 text-gray-200',
};

export function LogsScreen() {
  const { data: logs, isPending, error } = useQuery('ActivityLog', { orderBy: { createdAt: 'desc' } });
  const { remove, isPending: isDeleting } = useMutation('ActivityLog');

  const [search, setSearch] = useState('');

  const filtered = (logs ?? []).filter((log) => {
    const q = search.toLowerCase();
    return !q || `${log.action} ${log.details} ${log.entityId}`.toLowerCase().includes(q);
  });

  if (isPending) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">Loading logs…</div>;
  if (error) return <div className="flex h-64 items-center justify-center text-accent text-sm">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Activity Logs</h2>
          <p className="text-xs text-muted-foreground mt-1">Chronological system activity covering syncs, alerts, outreach, and scheduling events.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-panel-alt px-3 py-2">
          <span className="text-xs text-foreground">{filtered.length} entries</span>
        </div>
      </div>

      <div className="relative">
        <MagnifyingGlass size={16} weight="fill" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border bg-background pl-9 text-foreground text-sm"
          placeholder="Search logs…"
        />
      </div>

      <Card className="border-border bg-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">System Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y divide-border">
              {filtered.map((log) => {
                const badgeClass = actionColors[log.action] ?? 'bg-gray-600 text-gray-200';
                return (
                  <div key={log.id} className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-panel-hover transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        <Badge className={`${badgeClass} border-transparent text-xs whitespace-nowrap`}>{log.action}</Badge>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-foreground leading-5">{log.details}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-mono text-xs text-muted-foreground">{log.entityId}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 p-1.5 rounded border border-border bg-panel-alt text-muted-foreground hover:text-accent hover:bg-panel-hover transition-colors mt-0.5"
                      onClick={() => remove(log.id)}
                      disabled={isDeleting}
                      aria-label="Delete log entry"
                    >
                      <Trash size={12} weight="fill" />
                    </button>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No log entries match your search.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
