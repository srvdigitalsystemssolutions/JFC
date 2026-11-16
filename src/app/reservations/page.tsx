'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '4',
    zone: 'Main Dining',
    specialRequests: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/tables')
      .then((r) => r.json())
      .then((d) => setTables(d.tables || []))
      .catch(console.error);
  }, []);

  const [reservationResult, setReservationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guests: parseInt(formData.guests) || 2,
        }),
      });
      const data = await res.json();
      setReservationResult(data);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar />

      <section className="bg-slate-950 text-white py-16 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-block">
            Table Reservations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Book Your Table In Advance
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Reserve your preferred floor zone and let our culinary team prepare a personalized dining experience for your party.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        {submitted ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                We Look Forward To Welcoming You!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                A table for <strong>{formData.guests} Guests</strong> has been reserved for <strong>{formData.name}</strong> on <strong>{formData.date}</strong> at <strong>{formData.time}</strong> in our <strong>{formData.zone}</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/menu"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Browse Menu
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-lg text-slate-900">Reserve A Dining Table</h3>
              <p className="text-xs text-slate-500 mt-1">
                Instant reservation confirmation. For parties larger than 12, please reach out via our contact page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reservation Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dining Time *</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">01:00 PM (Lunch)</option>
                    <option value="14:00">02:00 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:00">08:00 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:00">09:00 PM (Dinner)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guest Party Size *</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="2">2 Guests (Couple Dining)</option>
                    <option value="4">4 Guests (Family Dining)</option>
                    <option value="6">6 Guests (Party Table)</option>
                    <option value="8">8 Guests (Large Banquet)</option>
                    <option value="12">12 Guests (VIP Group)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Zone</label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Main Dining">Main Dining Hall (Warm Chandelier)</option>
                    <option value="Terrace & Courtyard">Open Sky Rooftop & Courtyard</option>
                    <option value="Private Dining Lounge">VIP Private Dining Suite</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alexander Wright"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Occasion or Dietary Preferences</label>
                <textarea
                  rows={3}
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Anniversary, birthday, high chair for infant, dietary allergies..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm Table Reservation</span>
              </button>
            </form>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
