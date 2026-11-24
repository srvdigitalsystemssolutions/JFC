'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  UtensilsCrossed,
  Layers,
  Receipt,
  Grid,
  Image as ImageIcon,
  MessageSquareQuote,
  Mail,
  Sliders,
  ShieldCheck,
  Users,
  LogOut,
  Utensils,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentUser?: {
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null;
}

const navItems = [
  {
    category: 'Core Management',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
      { name: 'Menu Master', href: '/admin/categories', icon: Layers },
      { name: 'Billing & POS', href: '/admin/billing', icon: Receipt },
      { name: 'Table Layout', href: '/admin/tables', icon: Grid },
    ],
  },
  {
    category: 'Content & Inquiries',
    items: [
      { name: 'Gallery Upload', href: '/admin/gallery', icon: ImageIcon },
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
      { name: 'Messages & Leads', href: '/admin/messages', icon: Mail },
    ],
  },
  {
    category: 'Administration & RBAC',
    items: [
      { name: 'Users & Staff', href: '/admin/users', icon: Users },
      { name: 'RBAC Roles', href: '/admin/rbac', icon: ShieldCheck },
      { name: 'System Settings', href: '/admin/settings', icon: Sliders },
    ],
  },
];

export default function AdminSidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
      router.push('/login');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/50 p-1 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/images/jfc-logo.svg" alt="JFC Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white group-hover:text-amber-400 transition-colors">
              Johnson Food Court
            </h1>
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-black">
              JFC &bull; Super Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.category} className="space-y-1">
            <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {group.category}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile & Quick Switch Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-amber-400 shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || 'Alexander Wright'}
              </p>
              <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 font-medium rounded border border-amber-500/20">
                {currentUser?.role || 'SUPER_ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Module Switcher Pill for quick testing */}
        <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
