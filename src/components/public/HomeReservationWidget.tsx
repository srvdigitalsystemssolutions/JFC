'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  Loader2,
} from 'lucide-react';

export default function HomeReservationWidget() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '4',
    zone: 'Main Dining',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests) || 2,
          zone: formData.zone,
          specialRequests: formData.specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete reservation');
      }

      setConfirmedReservation(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reservations" className="scroll-mt-24">
      {confirmedReservation ? (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in text-slate-900">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Table Reservation Confirmed
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              We Look Forward To Welcoming You!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your dining table has been reserved under booking reference{' '}
              <strong className="text-slate-900 font-mono">
                {confirmedReservation.reservationCode}
              </strong>
              {confirmedReservation.tableNumber && (
                <> (Table {confirmedReservation.tableNumber})</>
              )}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div>
              <span className="text-slate-500 block">Guest Name:</span>
              <strong className="text-slate-900">{formData.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Party Size:</span>
              <strong className="text-slate-900">{formData.guests} Guests</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Date & Time:</span>
              <strong className="text-slate-900">
                {formData.date} at {formData.time}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Seating Zone:</span>
              <strong className="text-slate-900">{formData.zone}</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Browse Complete Menu
            </Link>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-4xl mx-auto">
          <div className="text-center sm:text-left space-y-2 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Confirmation &bull; No Wait Times</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Online Dining Table Reservation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Traveling from outside the area or planning a family banquet? Reserve your preferred table in advance and our stewards will have your seating ready upon arrival.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Row 1: Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reservation Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <optgroup label="Lunch Dining">
                    <option value="12:30">12:30 PM</option>
                    <option value="13:30">01:30 PM</option>
                    <option value="14:30">02:30 PM</option>
                  </optgroup>
                  <optgroup label="Dinner Dining">
                    <option value="19:00">07:00 PM</option>
                    <option value="19:30">07:30 PM</option>
                    <option value="20:30">08:30 PM</option>
                    <option value="21:30">09:30 PM</option>
                    <option value="22:00">10:00 PM</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Guest Party Size *
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="2">2 Guests (Couple Dining)</option>
                  <option value="4">4 Guests (Family Dining)</option>
                  <option value="6">6 Guests (Party Table)</option>
                  <option value="8">8 Guests (Large Banquet)</option>
                  <option value="12">12 Guests (VIP Group)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Zone & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Preferred Seating Zone
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                >
                  <option value="Main Dining">Main Dining Hall (Warm Chandelier)</option>
                  <option value="Rooftop Deck">Open Sky Rooftop & Courtyard</option>
                  <option value="VIP Lounge">VIP Private Dining Suite</option>
                  <option value="Family Corner">Family Dining Corner</option>
                  <option value="Garden Terrace">Garden Terrace</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Row 3: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Row 4: Special Occasion / Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Special Occasion, Dietary Notes or Travel Info
              </label>
              <textarea
                rows={2}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Anniversary, birthday, arriving from out-of-town, child high chair needed..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Table...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Table Reservation</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
