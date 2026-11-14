'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ChefHat,
  Receipt,
  User,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Role-based redirection
      const role = data.user.role;
      if (role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (role === 'CHEF') {
        router.push('/chef');
      } else if (role === 'BILLING_STAFF') {
        router.push('/pos');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: roleEmail, password: rolePass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      const role = data.user.role;
      if (role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (role === 'CHEF') {
        router.push('/chef');
      } else if (role === 'BILLING_STAFF') {
        router.push('/pos');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 items-center justify-center text-white shadow-xl shadow-orange-500/25">
            <Utensils className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Royal Spice Grand
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your role-based restaurant workstation
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royalspice.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Switchers */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
            One-Click Demo Credentials
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@royalspice.com', 'admin123')}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-2 text-left"
            >
              <Utensils className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <div className="truncate">
                <p className="font-bold text-white leading-tight">Super Admin</p>
                <span className="text-[10px] text-slate-400">admin123</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('chef@royalspice.com', 'chef123')}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-2 text-left"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <p className="font-bold text-white leading-tight">Head Chef</p>
                <span className="text-[10px] text-slate-400">chef123</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('pos@royalspice.com', 'pos123')}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-2 text-left"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <p className="font-bold text-white leading-tight">Billing POS</p>
                <span className="text-[10px] text-slate-400">pos123</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('john@example.com', 'user123')}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-2 text-left"
            >
              <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="truncate">
                <p className="font-bold text-white leading-tight">Customer</p>
                <span className="text-[10px] text-slate-400">user123</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
