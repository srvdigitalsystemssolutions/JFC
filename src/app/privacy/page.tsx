import React from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-16 flex-1 w-full space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026</p>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            When you place an order, book a table reservation, or submit a review on Johnson Food Court (JFC), we collect necessary contact information including your name, phone number, email address, and dining preferences.
          </p>

          <h2 className="text-sm font-bold text-slate-900">2. How We Use Your Information</h2>
          <p>
            Your information is used strictly to prepare your orders, assign appropriate restaurant tables, facilitate kitchen ticket workflows, and process POS invoice receipts. We never sell or share your personal data with third-party marketers.
          </p>

          <h2 className="text-sm font-bold text-slate-900">3. Security & Payments</h2>
          <p>
            Payment transactions processed via cash, UPI, or card are securely managed according to industry standards. No raw financial card numbers are stored on our servers.
          </p>

          <h2 className="text-sm font-bold text-slate-900">4. Contact Us</h2>
          <p>
            For questions or requests concerning your privacy data, please contact privacy@royalspice.com.
          </p>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
