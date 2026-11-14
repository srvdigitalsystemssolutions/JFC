'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Globe,
  Share2,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    tagLine: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    openingHours: '',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 5.0,
    taxNumber: '',
    websiteUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) {
        setFormData(data.settings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            System & Restaurant Settings
          </h1>
          <p className="text-xs text-slate-400">
            Configure restaurant identity, billing tax parameters, operating schedules and branding
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-bold text-slate-800">
              Restaurant Brand & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Restaurant Legal / Display Name *
              </label>
              <input
                type="text"
                required
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagLine || ''}
                onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Complete Physical Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours & Tax / Currency Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Percent className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Tax, Currency & Operational Timings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Operating Schedule *
              </label>
              <input
                type="text"
                required
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="Mon - Sun: 11:00 AM - 11:30 PM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Applicable GST / Tax Rate (%) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN / Tax Registration No.
              </label>
              <input
                type="text"
                value={formData.taxNumber || ''}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                placeholder="GSTIN33AABCT9988D1Z9"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="INR"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                placeholder="₹"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Live Public Website URL
              </label>
              <input
                type="url"
                value={formData.websiteUrl || ''}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://royalspice.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Share2 className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-bold text-slate-800">
              Social Media & Web Presence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/royalspice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/royalspice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                X (Twitter) URL
              </label>
              <input
                type="url"
                value={formData.twitterUrl || ''}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/royalspice"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
