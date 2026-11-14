import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing Royal Spice Grand’s digital services, ordering systems, or reservations, you agree to comply with our dining policies and house rules.
          </p>

          <h2 className="text-sm font-bold text-slate-900">2. Dining & Table Reservations</h2>
          <p>
            Reservations are held for a maximum of 15 minutes past the scheduled arrival time. If running late, please contact the host team to preserve your seating.
          </p>

          <h2 className="text-sm font-bold text-slate-900">3. Order Fulfillment & Billing</h2>
          <p>
            All prices are listed in INR and are subject to applicable GST tax regulations. Invoices generated through our POS system serve as the official tax receipt for all food and beverage consumption.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
