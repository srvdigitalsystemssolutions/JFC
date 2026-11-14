'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ChefHat,
  ShoppingBag,
  ArrowRight,
  Clock,
  Receipt,
  Store,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function ThankYouPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading order receipt...</div>}>
      <ThankYouContent />
    </React.Suspense>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-1002';
  const name = searchParams.get('name') || 'Valued Guest';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar />

      <main className="max-w-2xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 w-full animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Thank You, {name}!
            </h1>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your dining order has been transmitted directly to our kitchen. Our master chefs are preparing your dishes with royal authenticity.
            </p>
          </div>

          {/* Ticket Information Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
              <span className="text-slate-400 font-medium">Order Number</span>
              <span className="font-mono font-black text-slate-900 text-sm">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
              <span className="text-slate-400 font-medium">Estimated Cooking Time</span>
              <span className="font-bold text-orange-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 15 &ndash; 20 Minutes
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Live Kitchen Pipeline</span>
              <span className="font-bold text-amber-600 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5" /> Sent to Chef KDS
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/chef"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>View In Chef Panel</span>
            </Link>
            <Link
              href="/pos"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>View In POS Counter</span>
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Back To Menu</span>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
