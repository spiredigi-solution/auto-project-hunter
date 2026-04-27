import { useEffect, useState } from 'react';
import {
  ListBullets,
  Robot,
} from '@phosphor-icons/react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { Switch } from '@/components/ui/switch';
import { useLeadSeeder } from './hooks/useLeadSeeder';
import { AppSidebar, navItems } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/Header';
import { Dashboard } from './screens/Dashboard';
import { LeadsScreen } from './screens/LeadsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { TemplatesScreen } from './screens/TemplatesScreen';
import { OutreachScreen } from './screens/OutreachScreen';
import { SourcesScreen } from './screens/SourcesScreen';
import { AutomationScreen } from './screens/AutomationScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LogsScreen } from './screens/LogsScreen';
import type { NavKey } from './types';
import type { Lead } from '@animaapp/playground-react-sdk';

function App() {
  const [activeNav, setActiveNav] = useState<NavKey>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);

  // Seed the database with demo data on first load
  useLeadSeeder();

  useEffect(() => {
    const saved = localStorage.getItem('aph-theme');
    if (saved === 'light' || saved === 'dark') setThemeMode(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', themeMode === 'light');
    localStorage.setItem('aph-theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    const label = navItems.find((item) => item.key === activeNav)?.label ?? 'Dashboard';
    document.title = `Auto Project Hunter — ${label}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeNav]);

  const handleSelectLead = (lead: Lead) => {
    setOutreachLead(lead);
    setActiveNav('outreach');
  };

  const handleNavChange = (key: NavKey) => {
    setActiveNav(key);
    setMobileMenuOpen(false);
  };

  const renderScreen = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard onNav={handleNavChange} onSelectLead={handleSelectLead} themeMode={themeMode} onThemeChange={setThemeMode} />;
      case 'leads':
        return <LeadsScreen onSelectLead={handleSelectLead} />;
      case 'insights':
        return <InsightsScreen />;
      case 'templates':
        return <TemplatesScreen />;
      case 'outreach':
        return <OutreachScreen preselectedLead={outreachLead} />;
      case 'sources':
        return <SourcesScreen />;
      case 'automation':
        return <AutomationScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'logs':
        return <LogsScreen />;
      default:
        return <Dashboard onNav={handleNavChange} onSelectLead={handleSelectLead} themeMode={themeMode} onThemeChange={setThemeMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar
          activeNav={activeNav}
          collapsed={sidebarCollapsed}
          onNav={handleNavChange}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        <div className="flex-1 min-w-0">
          <AppHeader
            activeNav={activeNav}
            onNav={handleNavChange}
            onMobileMenuOpen={() => setMobileMenuOpen(true)}
          />

          <main className="px-6 py-8 xl:px-8">
            {renderScreen()}
          </main>

          <footer className="border-t border-border px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-xs text-muted-foreground">Auto Project Hunter v3.0.0</p>
                <p className="text-xs text-muted-foreground">Powered by Anima SDK + AI</p>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Database connected</span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-panel px-3 py-2">
                <span className="text-xs text-foreground">Theme</span>
                <Switch
                  checked={themeMode === 'light'}
                  onCheckedChange={(v) => setThemeMode(v ? 'light' : 'dark')}
                  aria-label="Toggle theme"
                />
                <span className="text-xs text-muted-foreground">{themeMode === 'light' ? 'Light' : 'Dark'}</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DrawerContent className="border-border bg-panel text-foreground">
          <DrawerHeader>
            <DrawerTitle className="text-foreground flex items-center gap-2">
              <Robot size={20} weight="fill" className="text-primary" />
              Auto Project Hunter
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <NavigationMenu className="max-w-full">
              <NavigationMenuList className="flex w-full flex-col items-stretch gap-1.5">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.key} className="w-full">
                    <button
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        activeNav === item.key
                          ? 'border-primary bg-secondary text-secondary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary hover:bg-panel-hover'
                      }`}
                      onClick={() => handleNavChange(item.key)}
                    >
                      <item.icon size={18} weight="fill" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default App;
