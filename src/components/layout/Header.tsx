import {
  Bell,
  FileText,
  Gear,
  ListBullets,
  Robot,
  SignOut,
} from '@phosphor-icons/react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useAuth } from '@animaapp/playground-react-sdk';
import { navItems } from './Sidebar';
import type { NavKey } from '../../types';

interface HeaderProps {
  activeNav: NavKey;
  onNav: (key: NavKey) => void;
  onMobileMenuOpen: () => void;
}

export function AppHeader({ activeNav, onNav, onMobileMenuOpen }: HeaderProps) {
  const { user, isAnonymous, login, logout } = useAuth();

  const currentNavItem = navItems.find((item) => item.key === activeNav);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open mobile menu"
            className="cursor-pointer rounded-md border border-border bg-panel p-2 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            onClick={onMobileMenuOpen}
          >
            <ListBullets size={20} weight="fill" />
          </button>
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Robot size={20} weight="fill" />
            </div>
            <span className="text-sm font-semibold text-foreground">APH</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-muted-foreground">Current section</p>
            <h2 className="text-base font-semibold text-foreground leading-tight">{currentNavItem?.label}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-foreground">System running</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative cursor-pointer rounded-lg border border-border bg-panel p-2 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell size={18} weight="fill" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                {user ? user.name?.slice(0, 2).toUpperCase() : 'AR'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden xl:block">
              <p className="text-xs font-medium text-foreground leading-tight">
                {user ? user.name : 'Ari Ramos'}
              </p>
              <p className="text-xs text-muted-foreground">Operator</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Settings"
                className="cursor-pointer rounded border border-border bg-panel-alt p-1.5 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onNav('settings')}
              >
                <Gear size={14} weight="fill" />
              </button>
              <button
                type="button"
                aria-label="Logs"
                className="cursor-pointer rounded border border-border bg-panel-alt p-1.5 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onNav('logs')}
              >
                <FileText size={14} weight="fill" />
              </button>
              {isAnonymous ? (
                <button
                  type="button"
                  aria-label="Login"
                  className="cursor-pointer rounded border border-border bg-panel-alt p-1.5 text-primary transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={login}
                >
                  <SignOut size={14} weight="fill" className="rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Logout"
                  className="cursor-pointer rounded border border-border bg-panel-alt p-1.5 text-foreground transition-all hover:border-primary hover:bg-panel-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={logout}
                >
                  <SignOut size={14} weight="fill" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb nav tabs */}
      <div className="border-t border-border px-6 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap ${
                activeNav === item.key
                  ? 'border-primary bg-secondary text-secondary-foreground'
                  : 'border-border bg-panel text-muted-foreground hover:border-primary hover:bg-panel-hover hover:text-foreground'
              }`}
              onClick={() => onNav(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
