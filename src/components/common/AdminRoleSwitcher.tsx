'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ChefHat,
  Receipt,
  Users,
  Store,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function AdminRoleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        setUser(data.user || null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Only SUPER_ADMIN has access to jump between views
  if (loading || !user || user.role !== 'SUPER_ADMIN') {
    return null;
  }

  const views = [
    {
      name: 'Admin View',
      href: '/admin',
      icon: ShieldCheck,
      isActive: pathname.startsWith('/admin'),
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      activeColor: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30',
    },
    {
      name: 'Chef View',
      href: '/chef',
      icon: ChefHat,
      isActive: pathname.startsWith('/chef'),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      activeColor: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30',
    },
    {
      name: 'Billing View',
      href: '/billing',
      icon: Receipt,
      isActive: pathname.startsWith('/billing') || pathname.startsWith('/pos'),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      activeColor: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30',
    },
    {
      name: 'User View (Waiter)',
      href: '/waiter',
      icon: Users,
      isActive: pathname.startsWith('/waiter'),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      activeColor: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30',
    },
    {
      name: 'Customer View',
      href: '/',
      icon: Store,
      isActive: pathname === '/' || pathname === '/menu' || pathname === '/reservations',
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      activeColor: 'bg-orange-600 text-white shadow-lg shadow-orange-600/30',
    },
  ];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-2 sticky top-0 z-50 text-xs shadow-md select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Admin Role Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            👑
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-[11px] tracking-wide">
                SUPER ADMIN CONTROLLER
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                All-Views Access
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Jump between Admin, Kitchen, Billing, and Waiter views anytime
            </p>
          </div>
        </div>

        {/* Center: Quick View Switchers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <Link
                key={v.name}
                href={v.href}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 border ${
                  v.isActive
                    ? v.activeColor + ' border-transparent'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Sign Out */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-[11px] transition-colors flex items-center gap-1"
            title="Sign out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
