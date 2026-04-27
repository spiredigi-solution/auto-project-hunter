import {
  Brain,
  ChartDonut,
  Database,
  FileText,
  Gear,
  ListBullets,
  PaperPlaneTilt,
  Robot,
  Sidebar as SidebarIcon,
  Sparkle,
  Lightning,
} from '@phosphor-icons/react';
import { Card, CardContent } from '../ui/card';
import type { NavKey } from '../../types';

interface SidebarProps {
  activeNav: NavKey;
  collapsed: boolean;
  onNav: (key: NavKey) => void;
  onToggle: () => void;
}

export const navItems: { key: NavKey; label: string; icon: typeof ChartDonut }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: ChartDonut },
  { key: 'leads', label: 'Leads', icon: ListBullets },
  { key: 'insights', label: 'AI Insights', icon: Brain },
  { key: 'templates', label: 'Templates', icon: PaperPlaneTilt },
  { key: 'outreach', label: 'Outreach', icon: Lightning },
  { key: 'sources', label: 'Sources', icon: Database },
  { key: 'automation', label: 'Automation', icon: Sparkle },
  { key: 'settings', label: 'Settings', icon: Gear },
  { key: 'logs', label: 'Activity Logs', icon: FileText },
];

export function AppSidebar({ activeNav, collapsed, onNav, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden border-r border-border bg-panel transition-all ease-in duration-200 lg:flex lg:flex-col ${collapsed ? 'lg:w-24' : 'lg:w-72'}`}
    >
      <div className="flex min-h-16 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Robot size={28} weight="fill" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Lead Intelligence</p>
              <h1 className="text-sm font-semibold text-foreground leading-tight">Auto Project Hunter</h1>
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Collapse sidebar"
          className="cursor-pointer rounded-md border border-border bg-panel-alt p-2 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onToggle}
        >
          <SidebarIcon size={20} weight="fill" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? 'border-primary bg-secondary text-secondary-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:bg-panel-hover hover:text-foreground'
                  }`}
                  onClick={() => onNav(item.key)}
                >
                  <Icon size={20} weight="fill" className="shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <Card className="border-border bg-panel-alt">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <span className="relative flex h-2 w-2 mt-1 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {!collapsed && (
                <div>
                  <p className="text-xs font-medium text-foreground">AI Watcher Active</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">5 sources scanning now</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
