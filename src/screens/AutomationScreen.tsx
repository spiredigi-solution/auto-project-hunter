import { useState, useEffect, useRef } from 'react';
import { Play, Stop, ClockCountdown, Sparkle, Robot, Lightning, CheckCircle, Warning } from '@phosphor-icons/react';
import { useMutation, useQuery } from '@animaapp/playground-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

type JobStatus = 'idle' | 'running' | 'completed' | 'error';

interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  interval: string;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string;
  status: JobStatus;
  runs: number;
}

const defaultJobs: ScheduledJob[] = [
  { id: 'job-1', name: 'LinkedIn Scanner', description: 'Scans LinkedIn public posts for project-seeking keywords', interval: '6h', enabled: true, lastRun: '2026-04-27 09:00', nextRun: '2026-04-27 15:00', status: 'completed', runs: 47 },
  { id: 'job-2', name: 'Upwork Lead Sync', description: 'Fetches new Upwork job posts matching service keywords', interval: '3h', enabled: true, lastRun: '2026-04-27 08:00', nextRun: '2026-04-27 11:00', status: 'idle', runs: 112 },
  { id: 'job-3', name: 'Google SERP Scraper', description: 'Searches intent keywords across Google and captures business signals', interval: '12h', enabled: false, lastRun: '2026-04-26 20:00', nextRun: 'Paused', status: 'idle', runs: 23 },
  { id: 'job-4', name: 'Lead Scorer (AI)', description: 'Re-scores all leads using latest AI model prompts', interval: '24h', enabled: true, lastRun: '2026-04-27 07:00', nextRun: '2026-04-28 07:00', status: 'completed', runs: 8 },
  { id: 'job-5', name: 'Duplicate Cleaner', description: 'Identifies and merges duplicate lead entries in the database', interval: '24h', enabled: true, lastRun: '2026-04-27 07:05', nextRun: '2026-04-28 07:05', status: 'completed', runs: 8 },
  { id: 'job-6', name: 'Hot Lead Notifier', description: 'Sends Telegram/WhatsApp alerts when hot leads (85+) are detected', interval: '1h', enabled: true, lastRun: '2026-04-27 09:14', nextRun: '2026-04-27 10:14', status: 'idle', runs: 203 },
];

const searchKeywords = [
  'need website developer', 'looking for Shopify developer', 'need WordPress expert',
  'website redesign required', 'looking for logo designer', 'need billing software',
  'need inventory management system', 'need chatbot for business', 'looking for AI automation',
  'need SEO blog automation', 'business website not working', 'slow website',
  'Shopify store issue', 'WordPress error', 'custom CRM required',
];

export function AutomationScreen() {
  const [jobs, setJobs] = useState<ScheduledJob[]>(defaultJobs);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywords, setKeywords] = useState(searchKeywords);
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [notifyChannel, setNotifyChannel] = useState('telegram');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { create: createLog } = useMutation('ActivityLog');
  const { data: leads } = useQuery('Lead');

  const simulateRun = async (job: ScheduledJob) => {
    if (runningJobId) return;
    setRunningJobId(job.id);
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: 'running' } : j));

    await createLog({
      action: `Scheduler: ${job.name} started`,
      entityId: job.id,
      details: `Manual trigger of ${job.name} at ${new Date().toLocaleTimeString()}`,
    });

    timerRef.current = setTimeout(async () => {
      setJobs((prev) => prev.map((j) =>
        j.id === job.id
          ? { ...j, status: 'completed', lastRun: new Date().toLocaleString(), runs: j.runs + 1 }
          : j,
      ));
      setRunningJobId(null);

      await createLog({
        action: `Scheduler: ${job.name} completed`,
        entityId: job.id,
        details: `${job.name} completed. ${leads?.length ?? 0} leads in database.`,
      });
    }, 2800);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const toggleJob = (id: string) => {
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, enabled: !j.enabled } : j));
  };

  const statusIcon = (s: JobStatus) => {
    if (s === 'running') return <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>;
    if (s === 'completed') return <CheckCircle size={14} weight="fill" className="text-success" />;
    if (s === 'error') return <Warning size={14} weight="fill" className="text-accent" />;
    return <span className="h-2 w-2 rounded-full bg-gray-500 inline-block" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Automation Engine</h2>
          <p className="text-xs text-muted-foreground mt-1">Background scheduler, search keywords, and notification settings.</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-panel px-4 py-2.5">
          <Sparkle size={16} weight="fill" className={globalEnabled ? 'text-success' : 'text-muted-foreground'} />
          <span className="text-xs font-medium text-foreground">{globalEnabled ? 'Automation Active' : 'Automation Paused'}</span>
          <Switch checked={globalEnabled} onCheckedChange={setGlobalEnabled} />
        </div>
      </div>

      {/* System overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success"><Robot size={18} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Active Jobs</p>
              <p className="text-xl font-semibold text-foreground">{jobs.filter((j) => j.enabled).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary"><Lightning size={18} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Runs Today</p>
              <p className="text-xl font-semibold text-foreground">{jobs.reduce((a, j) => a + j.runs, 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-panel">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent"><ClockCountdown size={18} weight="fill" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Search Keywords</p>
              <p className="text-xl font-semibold text-foreground">{keywords.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduler Jobs */}
      <Card className="border-border bg-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Scheduled Jobs</CardTitle>
          <p className="text-xs text-muted-foreground">Configure, enable, and manually trigger each background task.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className={`rounded-lg border p-4 transition-all ${job.enabled ? 'border-border bg-panel-alt' : 'border-border/50 bg-background/30 opacity-60'}`}>
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {statusIcon(job.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{job.name}</p>
                      <Badge className="bg-panel text-muted-foreground border-border text-xs">{job.interval}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{job.description}</p>
                    <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span>Last: {job.lastRun ?? 'Never'}</span>
                      <span>Next: {job.nextRun}</span>
                      <span>Runs: {job.runs}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={job.enabled} onCheckedChange={() => toggleJob(job.id)} />
                  <Button
                    className={`text-xs h-8 px-3 ${job.status === 'running' ? 'bg-accent text-accent-foreground opacity-70 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary-hover'}`}
                    onClick={() => simulateRun(job)}
                    disabled={job.status === 'running' || !job.enabled || !globalEnabled}
                  >
                    {job.status === 'running' ? (
                      <><Stop size={12} weight="fill" /> Running…</>
                    ) : (
                      <><Play size={12} weight="fill" /> Run Now</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card className="border-border bg-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Search Keywords</CardTitle>
          <p className="text-xs text-muted-foreground">Keywords used to detect project opportunities across platforms.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new keyword…"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="border-border bg-background text-foreground text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newKeyword.trim()) {
                  setKeywords((prev) => [...prev, newKeyword.trim()]);
                  setNewKeyword('');
                }
              }}
            />
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs shrink-0"
              onClick={() => {
                if (newKeyword.trim()) {
                  setKeywords((prev) => [...prev, newKeyword.trim()]);
                  setNewKeyword('');
                }
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <button
                key={kw}
                type="button"
                className="flex items-center gap-1 rounded-full border border-border bg-panel-alt px-3 py-1 text-xs text-foreground hover:border-accent hover:bg-panel-hover transition-colors group"
                onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))}
                title="Click to remove"
              >
                {kw}
                <span className="text-muted-foreground group-hover:text-accent">×</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification settings */}
      <Card className="border-border bg-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Notification Settings</CardTitle>
          <p className="text-xs text-muted-foreground">Configure where hot lead alerts are sent.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Notify via</label>
              <Select value={notifyChannel} onValueChange={setNotifyChannel}>
                <SelectTrigger className="border-border bg-background text-foreground text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-panel text-foreground">
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="none">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Min score to trigger alert</label>
              <Input type="number" defaultValue={85} min={50} max={100} className="border-border bg-background text-foreground text-sm" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-panel-alt p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> For Telegram, configure your BOT_TOKEN and CHAT_ID in the .env file on your local Node.js server. Notifications fire automatically when the scheduler detects new hot leads.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
