import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  ShieldCheck,
  ChefHat,
  Receipt,
  Store,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function HomePage() {
  const settings = await prisma.setting.findUnique({ where: { id: 'default' } });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-white">
                {settings?.restaurantName || 'Royal Spice Grand'}
              </span>
              <p className="text-[11px] text-amber-400 font-medium">
                {settings?.tagLine || 'Luxury Dining & Smart Restaurant Management'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Super Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mx-auto animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Module 1 Completed &bull; Super Admin Control System</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Integrated Restaurant <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Management & POS Suite
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            A unified, multi-module restaurant automation platform connecting executive analytics, digital menu masters, real-time kitchen display, and POS billing software with unified database synchronization.
          </p>
        </div>

        {/* Modules Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-left">
          {/* Module 1: Super Admin */}
          <Link
            href="/admin"
            className="p-5 rounded-2xl bg-slate-900 border-2 border-orange-500/40 hover:border-orange-500 transition-all shadow-xl shadow-orange-500/10 flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready & Active
                </span>
                <span className="text-[10px] text-slate-400">Module 1</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-2 group-hover:text-orange-400 transition-colors">
                Super Admin Panel
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Executive dashboard, live orders, sales analytics, menu CRUD, floor tables, RBAC & settings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Enter Admin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Customer Website */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Next Phase
                </span>
                <span className="text-[10px] text-slate-400">Module 2</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-2">Customer Website</h2>
              <p className="text-xs text-slate-400 mt-1">
                Digital QR menu, reservation booking, dish reviews, photo gallery & brand showcase.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500">
              Starts after Super Admin
            </div>
          </div>

          {/* Module 3: Chef Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Phase 3
                </span>
                <span className="text-[10px] text-slate-400">Module 3</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-2">Chef Panel (KDS)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Kitchen order tickets, cooking statuses: Pending &rarr; Accepted &rarr; Preparing &rarr; Ready.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500">
              Kitchen Display System
            </div>
          </div>

          {/* Module 4: POS Billing */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Phase 4
                </span>
                <span className="text-[10px] text-slate-400">Module 4</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-2">POS Billing Software</h2>
              <p className="text-xs text-slate-400 mt-1">
                Table ordering cart, GST taxes, split payments, cash/UPI checkout & thermal invoices.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500">
              Point of Sale Counter
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} {settings?.restaurantName || 'Royal Spice Grand'}. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
