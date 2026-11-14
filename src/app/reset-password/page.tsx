'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle2, Utensils } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 items-center justify-center text-white shadow-xl shadow-orange-500/25">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Create New Password</h1>
          <p className="text-xs text-slate-400">
            Enter a strong new password for your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {error}
          </div>
        )}

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="text-sm font-bold text-white">Password Updated!</h2>
            <p className="text-xs text-slate-300">
              Your password has been changed successfully. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-xs"
            >
              Update Password & Sign In
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and Return to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
