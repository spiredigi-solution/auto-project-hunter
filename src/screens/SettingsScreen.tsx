import { useState } from 'react';
import { Bell, Database, Gear, Key, Shield, User } from '@phosphor-icons/react';
import { useAuth } from '@animaapp/playground-react-sdk';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const settingsSections = [
  { key: 'general', label: 'General', icon: Gear },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'api', label: 'API Keys', icon: Key },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'account', label: 'Account', icon: User },
] as const;

type SettingsKey = typeof settingsSections[number]['key'];

export function SettingsScreen() {
  const { user, isAnonymous, login, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsKey>('general');

  const [generalSettings, setGeneralSettings] = useState({
    agencyName: 'DevOps Agency',
    defaultCategory: 'Web Development',
    autoScore: true,
    deduplicate: true,
    syncInterval: '6h',
  });

  const [notifSettings, setNotifSettings] = useState({
    hotLeadAlert: true,
    dailySummary: true,
    channel: 'telegram',
    telegramToken: '',
    whatsappNumber: '',
    emailAddress: '',
    minScore: '85',
  });

  const [apiSettings, setApiSettings] = useState({
    openaiKey: '',
    serpApiKey: '',
    linkedinToken: '',
    upworkToken: '',
  });

  const [dbSettings, setDbSettings] = useState({
    dbType: 'sqlite',
    connectionString: './data/aph.db',
    backupEnabled: true,
    backupInterval: '24h',
    retentionDays: '90',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-xs text-muted-foreground mt-1">Control notification behavior, API integrations, database preferences, and workspace options.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Nav */}
        <div className="space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.key}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all ${activeSection === section.key ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-panel-hover hover:text-foreground'}`}
                onClick={() => setActiveSection(section.key)}
              >
                <Icon size={14} weight="fill" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeSection === 'general' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Agency Name</label>
                    <Input value={generalSettings.agencyName} onChange={(e) => setGeneralSettings((p) => ({ ...p, agencyName: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Default Lead Category</label>
                    <Input value={generalSettings.defaultCategory} onChange={(e) => setGeneralSettings((p) => ({ ...p, defaultCategory: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Sync Interval</label>
                  <Select value={generalSettings.syncInterval} onValueChange={(v) => setGeneralSettings((p) => ({ ...p, syncInterval: v }))}>
                    <SelectTrigger className="border-border bg-background text-foreground text-sm w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-panel text-foreground">
                      {['1h', '3h', '6h', '12h', '24h'].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'autoScore', label: 'Auto AI Scoring', desc: 'Automatically score new leads using AI upon capture' },
                    { key: 'deduplicate', label: 'Auto Deduplication', desc: 'Remove duplicate leads based on company + contact match' },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                      <div>
                        <p className="text-xs font-medium text-foreground">{setting.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                      </div>
                      <Switch
                        checked={generalSettings[setting.key as 'autoScore' | 'deduplicate']}
                        onCheckedChange={(v) => setGeneralSettings((p) => ({ ...p, [setting.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs">Save General Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  {[
                    { key: 'hotLeadAlert', label: 'Hot Lead Alerts', desc: 'Notify when a lead scores above the threshold' },
                    { key: 'dailySummary', label: 'Daily Summary', desc: 'Receive a daily digest of new leads and activity' },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                      <div>
                        <p className="text-xs font-medium text-foreground">{setting.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{setting.desc}</p>
                      </div>
                      <Switch
                        checked={notifSettings[setting.key as 'hotLeadAlert' | 'dailySummary']}
                        onCheckedChange={(v) => setNotifSettings((p) => ({ ...p, [setting.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Notification Channel</label>
                    <Select value={notifSettings.channel} onValueChange={(v) => setNotifSettings((p) => ({ ...p, channel: v }))}>
                      <SelectTrigger className="border-border bg-background text-foreground text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-panel text-foreground">
                        {['telegram', 'whatsapp', 'email', 'none'].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Min Score for Alert</label>
                    <Input type="number" value={notifSettings.minScore} onChange={(e) => setNotifSettings((p) => ({ ...p, minScore: e.target.value }))} className="border-border bg-background text-foreground text-sm" min={0} max={100} />
                  </div>
                  {notifSettings.channel === 'telegram' && (
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-foreground">Telegram Bot Token</label>
                      <Input type="password" placeholder="bot:XXXXXXX" value={notifSettings.telegramToken} onChange={(e) => setNotifSettings((p) => ({ ...p, telegramToken: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
                    </div>
                  )}
                  {notifSettings.channel === 'email' && (
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-foreground">Email Address</label>
                      <Input type="email" placeholder="you@example.com" value={notifSettings.emailAddress} onChange={(e) => setNotifSettings((p) => ({ ...p, emailAddress: e.target.value }))} className="border-border bg-background text-foreground text-sm" />
                    </div>
                  )}
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs">Save Notification Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'api' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">API Key Configuration</CardTitle>
                <p className="text-xs text-muted-foreground">These keys are stored locally in your .env file and never transmitted.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'openaiKey', label: 'OpenAI API Key', placeholder: 'sk-...' },
                  { key: 'serpApiKey', label: 'SERP API Key (Google Search)', placeholder: 'serp-...' },
                  { key: 'linkedinToken', label: 'LinkedIn Access Token', placeholder: 'Bearer ...' },
                  { key: 'upworkToken', label: 'Upwork API Token', placeholder: 'upwork-...' },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{field.label}</label>
                    <Input
                      type="password"
                      placeholder={field.placeholder}
                      value={apiSettings[field.key as keyof typeof apiSettings]}
                      onChange={(e) => setApiSettings((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="border-border bg-background text-foreground text-sm font-mono"
                    />
                  </div>
                ))}
                <div className="rounded-lg border border-border bg-panel-alt p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Security note:</strong> All API keys must be stored in your local <code className="font-mono text-primary">.env</code> file on the server. Never commit them to version control.
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs">Save API Keys</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'database' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Database Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Database Type</label>
                    <Select value={dbSettings.dbType} onValueChange={(v) => setDbSettings((p) => ({ ...p, dbType: v }))}>
                      <SelectTrigger className="border-border bg-background text-foreground text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-panel text-foreground">
                        <SelectItem value="sqlite">SQLite (local)</SelectItem>
                        <SelectItem value="mssql">SQL Server</SelectItem>
                        <SelectItem value="postgres">PostgreSQL</SelectItem>
                        <SelectItem value="mysql">MySQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Backup Interval</label>
                    <Select value={dbSettings.backupInterval} onValueChange={(v) => setDbSettings((p) => ({ ...p, backupInterval: v }))}>
                      <SelectTrigger className="border-border bg-background text-foreground text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-panel text-foreground">
                        {['6h', '12h', '24h', '7d'].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Connection String</label>
                  <Input value={dbSettings.connectionString} onChange={(e) => setDbSettings((p) => ({ ...p, connectionString: e.target.value }))} className="border-border bg-background text-foreground text-sm font-mono" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-panel-alt p-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">Auto Backup</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Automatically backup the database on schedule</p>
                  </div>
                  <Switch checked={dbSettings.backupEnabled} onCheckedChange={(v) => setDbSettings((p) => ({ ...p, backupEnabled: v }))} />
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs">Save Database Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Security &amp; Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: '✅', title: 'Safe to scrape', desc: 'Public LinkedIn posts, Google SERP results, public business directories, public Upwork job posts, and public Facebook groups can be accessed safely.' },
                  { icon: '🔑', title: 'Use official APIs', desc: 'LinkedIn Sales Navigator, Upwork API, Facebook Graph API, and Google Custom Search all have official APIs. Use these where available to stay compliant.' },
                  { icon: '🚫', title: 'Avoid spam behavior', desc: 'Never send automated messages at scale. Always use outreach messages as templates for manual, personalized sends. Respect rate limits and platform TOS.' },
                  { icon: '🛡️', title: 'Protect scraped data', desc: 'All lead data stays on your local machine. No data is transmitted to third parties. Respect GDPR and CCPA by not storing personal data longer than required.' },
                  { icon: '⚠️', title: 'Account protection', desc: 'Use rotating user agents, respect robots.txt, implement delays between requests, and never scrape while logged into personal accounts.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-panel-alt p-4">
                    <p className="text-sm font-medium text-foreground">{item.icon} {item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-5">{item.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === 'account' && (
            <Card className="border-border bg-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-foreground">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-border bg-panel-alt p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-semibold text-sm">
                    {user ? user.name?.slice(0, 2).toUpperCase() : 'AR'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user?.name ?? 'Local Operator'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? 'Running in anonymous mode'}</p>
                    <Badge className="mt-1 bg-secondary text-secondary-foreground border-transparent text-xs">
                      {isAnonymous ? 'Anonymous' : 'Authenticated'}
                    </Badge>
                  </div>
                </div>

                {isAnonymous ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">Sign in to sync your data across devices and enable cloud backup.</p>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs" onClick={login}>
                      Sign In
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">You are signed in. Your data is being synced securely.</p>
                    <Button className="bg-panel border border-border text-foreground hover:bg-panel-hover text-xs" onClick={logout}>
                      Sign Out
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
