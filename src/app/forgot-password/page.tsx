'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Utensils } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 items-center justify-center text-white shadow-xl shadow-orange-500/25">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Reset Account Password</h1>
          <p className="text-xs text-slate-400">
            Enter your registered staff email to receive recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h2 className="text-sm font-bold text-white">Reset Link Dispatched</h2>
            <p className="text-xs text-slate-300">
              A temporary password recovery link has been sent to <b>{email}</b>.
            </p>
            <div className="pt-2">
              <Link
                href="/reset-password"
                className="text-xs text-orange-400 font-bold hover:underline"
              >
                Proceed to Reset Password Page &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Registered Work Email
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

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-xs"
            >
              Send Password Reset Instructions
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
