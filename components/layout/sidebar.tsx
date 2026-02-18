'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const modules = [
  {
    title: 'Global Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: 'Front Office',
    href: '/front-office',
    icon: Users,
    badge: 'FO',
  },
  {
    title: 'Housekeeping',
    href: '/housekeeping',
    icon: Building2,
    badge: 'HK',
  },
  {
    title: 'Room Division',
    href: '/room-divition',
    icon: Briefcase,
    badge: 'RDM',
  },
  {
    title: 'AI Analysis',
    href: '/ai-analysis',
    icon: Sparkles,
    badge: 'BETA',
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Settings,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/admin' || pathname === '/ai-analysis'
        ? false
        : false;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {expanded && (
          <h1 className="text-lg font-bold text-sidebar-foreground truncate">
            Command Center
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded ? 'rotate-180' : '')}
          />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {modules.map((module) => {
          const Icon = module.icon;
          const active = isActive(module.href);

          return (
            <Link key={module.href} href={module.href}>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent',
                  active && 'bg-sidebar-accent text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {expanded && (
                  <>
                    <span className="ml-3 flex-1 text-left">{module.title}</span>
                    {module.badge && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                        {module.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          {expanded ? 'v1.0' : 'v'}
        </p>
      </div>
    </aside>
  );
}
