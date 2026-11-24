'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ChefHat,
  Receipt,
  User,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams?.get('target');

  // Step state: 'CREDENTIALS' or '2FA'
  const [step, setStep] = useState<'CREDENTIALS' | '2FA'>('CREDENTIALS');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Target workstation info & defaults
  useEffect(() => {
    if (target === 'chef') {
      setEmail('chef@johnsonfoodcourt.com');
      setPassword('chef123');
    } else if (target === 'billing') {
      setEmail('pos@johnsonfoodcourt.com');
      setPassword('pos123');
    } else if (target === 'waiter') {
      setEmail('waiter@johnsonfoodcourt.com');
      setPassword('waiter123');
    } else if (target === 'admin') {
      setEmail('admin@johnsonfoodcourt.com');
      setPassword('admin123');
    } else {
      setEmail('admin@johnsonfoodcourt.com');
      setPassword('admin123');
    }
  }, [target]);

  const targetInfo = {
    chef: {
      station: 'Kitchen Display System',
      title: 'Head Chef Kitchen Login',
      subtitle: 'Enter Chef ID and password to access Kitchen Display System (KDS)',
      button: 'Sign In to Chef Panel',
      icon: ChefHat,
      color: 'from-amber-500 to-red-600',
    },
    billing: {
      station: 'POS Counter & Cashier',
      title: 'POS & Billing Workstation Login',
      subtitle: 'Enter Cashier ID and password to access Table Orders & Invoicing',
      button: 'Sign In to Billing Workstation',
      icon: Receipt,
      color: 'from-red-600 to-amber-500',
    },
    waiter: {
      station: 'Floor Staff Station',
      title: 'Floor Waiter Station Login',
      subtitle: 'Enter Server ID and password to manage dining tables & orders',
      button: 'Sign In to Floor Station',
      icon: User,
      color: 'from-amber-600 to-red-600',
    },
    admin: {
      station: 'Management Suite',
      title: 'Super Admin Portal Login',
      subtitle: 'Two-step email verification required for administrative access',
      button: 'Sign In to Admin Portal',
      icon: ShieldCheck,
      color: 'from-red-600 via-amber-600 to-red-700',
    },
  }[target || ''] || {
    station: 'Workstation Suite',
    title: 'Johnson Food Court (JFC)',
    subtitle: 'Sign in to access your role-based restaurant workstation',
    button: 'Sign In to Workstation',
    icon: UtensilsCrossed,
    color: 'from-red-600 to-amber-500',
  };

  const StationIcon = targetInfo.icon;

  // 1. Submit Credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Check if 2-Step Verification is required (Admin only)
      if (data.requires2FA) {
        setStep('2FA');
        setPreviewOtp(data.previewOtp || null);
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${data.email}.`);
        setLoading(false);
        return;
      }

      // Non-admin roles (Chef, Billing, Waiter) log in directly
      handleRedirectByRole(data.user?.role);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  // 2. Submit 2FA Code (Admin Only)
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid verification code');
        setLoading(false);
        return;
      }

      handleRedirectByRole(data.user?.role || 'SUPER_ADMIN');
    } catch (e: any) {
      setError(e.message || 'Error verifying code');
      setLoading(false);
    }
  };

  // 3. Resend 2FA Code
  const handleResendCode = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'resend' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not resend code');
        return;
      }
      setPreviewOtp(data.previewOtp || null);
      setSuccessMsg(`A fresh verification code was sent to ${email}`);
    } catch (e: any) {
      setError(e.message || 'Error resending code');
    } finally {
      setResending(false);
    }
  };

  // Role Redirection
  const handleRedirectByRole = (role?: string) => {
    if (role === 'SUPER_ADMIN') {
      router.push('/admin');
    } else if (role === 'CHEF') {
      router.push('/chef');
    } else if (role === 'BILLING_STAFF') {
      router.push('/billing');
    } else if (role === 'WAITER' || role === 'CUSTOMER') {
      router.push('/waiter');
    } else {
      router.push('/');
    }
    router.refresh();
  };

  // Quick Demo Logins
  const handleQuickLogin = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    setError('');
    setSuccessMsg('');

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

      // If Super Admin, step into 2FA verification
      if (data.requires2FA) {
        setStep('2FA');
        setPreviewOtp(data.previewOtp || null);
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${data.email}.`);
        setLoading(false);
        return;
      }

      // Other roles log in immediately
      handleRedirectByRole(data.user?.role);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-fade-in">
      {/* Brand & Station Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="/images/jfc-icon.svg"
            alt="JFC Logo"
            className="w-12 h-12 rounded-xl object-contain shadow-lg shadow-red-600/20"
          />
        </div>

        <div className="inline-block px-3 py-0.5 rounded-full bg-red-600/15 border border-red-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
          {targetInfo.station}
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          {step === '2FA' ? 'Two-Step Email Verification' : targetInfo.title}
        </h1>
        <p className="text-xs text-slate-400">
          {step === '2FA'
            ? 'Enter the 6-digit verification code sent to your email'
            : targetInfo.subtitle}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* =========================================================
          STEP 1: EMPLOYEE CREDENTIALS FORM
          ========================================================= */}
      {step === 'CREDENTIALS' && (
        <>
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Employee Email ID / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@johnsonfoodcourt.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs sm:text-sm cursor-pointer uppercase tracking-wider"
            >
              <span>{loading ? 'Authenticating...' : targetInfo.button}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Cards */}
          <div className="mt-7 pt-5 border-t border-slate-800 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
              One-Click Workstation Access
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@johnsonfoodcourt.com', 'admin123')}
                className={`p-2.5 rounded-xl text-slate-300 hover:text-white border transition-colors flex items-center gap-2 text-left cursor-pointer ${
                  target === 'admin'
                    ? 'bg-red-950/60 border-red-500/60 ring-1 ring-red-500/40 text-white'
                    : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-white leading-tight">Super Admin</p>
                  <span className="text-[10px] text-amber-400">2-Step Email Verification</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('chef@johnsonfoodcourt.com', 'chef123')}
                className={`p-2.5 rounded-xl text-slate-300 hover:text-white border transition-colors flex items-center gap-2 text-left cursor-pointer ${
                  target === 'chef'
                    ? 'bg-red-950/60 border-red-500/60 ring-1 ring-red-500/40 text-white'
                    : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-white leading-tight">Head Chef</p>
                  <span className="text-[10px] text-slate-400">Direct Login (/chef)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('pos@johnsonfoodcourt.com', 'pos123')}
                className={`p-2.5 rounded-xl text-slate-300 hover:text-white border transition-colors flex items-center gap-2 text-left cursor-pointer ${
                  target === 'billing'
                    ? 'bg-red-950/60 border-red-500/60 ring-1 ring-red-500/40 text-white'
                    : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-white leading-tight">Billing POS</p>
                  <span className="text-[10px] text-slate-400">Direct Login (/billing)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('waiter@johnsonfoodcourt.com', 'waiter123')}
                className={`p-2.5 rounded-xl text-slate-300 hover:text-white border transition-colors flex items-center gap-2 text-left cursor-pointer ${
                  target === 'waiter'
                    ? 'bg-red-950/60 border-red-500/60 ring-1 ring-red-500/40 text-white'
                    : 'bg-slate-950/70 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <User className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="truncate">
                  <p className="font-bold text-white leading-tight">Floor Waiter</p>
                  <span className="text-[10px] text-slate-400">Direct Login (/waiter)</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
          STEP 2: ADMIN TWO-STEP EMAIL VERIFICATION FORM
          ========================================================= */}
      {step === '2FA' && (
        <div className="space-y-5 animate-fade-in text-xs">
          {/* Live Mail Simulation Alert */}
          {previewOtp && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600/20 to-amber-500/20 border border-amber-500/40 text-amber-200 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">Administrator Email Notification:</span>
              </div>
              <p className="text-[11px] text-amber-300">
                Your 6-digit verification code is:{' '}
                <strong className="font-mono text-base font-black text-amber-300 tracking-widest px-2 py-0.5 rounded bg-black/60 border border-amber-500/50 inline-block ml-1">
                  {previewOtp}
                </strong>
              </p>
              <p className="text-[10px] text-slate-400">
                Dispatched to {email} &bull; Valid for 5 minutes
              </p>
            </div>
          )}

          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Enter 6-Digit Email Verification Code *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 849201"
                  autoFocus
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-amber-500/40 rounded-xl text-white font-mono text-center tracking-widest text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-700 hover:to-amber-700 text-white font-black rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs sm:text-sm cursor-pointer uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{loading ? 'Verifying Code...' : 'Verify & Access Super Admin'}</span>
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
            <button
              type="button"
              disabled={resending}
              onClick={handleResendCode}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>Resend Code</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('CREDENTIALS');
                setError('');
                setSuccessMsg('');
                setOtp('');
              }}
              className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows (Red & Amber Theme) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-white text-xs">
            Loading Workstation Login...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
