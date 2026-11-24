'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Flame,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Table or Event Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send message');
        return;
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Table or Event Inquiry',
        message: '',
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Error submitting message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar />

      <section className="bg-slate-950 text-white py-16 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Connect With JFC Vellore</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-ubuntu">
            Location, Hours &amp; Customer Inquiries
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-droid">
            Questions regarding outdoor garden reservations, party orders, catering, or directions? Our team at Johnson Food Court is happy to assist.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details & Map Card (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="font-black text-base text-slate-900 font-ubuntu">
                Johnson Food Court (JFC)
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Address</strong>
                    <span>Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Contact Phone</strong>
                    <a href="tel:+919965278872" className="text-orange-600 font-bold hover:underline">
                      +91 99652 78872
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Email</strong>
                    <span>contact@johnsonfoodcourt.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Opening Hours</strong>
                    <span>Mon &ndash; Sat: 10:30 AM &ndash; 11:30 PM<br />Sun: 12:30 PM &ndash; 11:30 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Map & Justdial Action Card */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white p-6 shadow-sm relative group space-y-4">
              <div className="space-y-2 relative z-10">
                <span className="text-[10px] uppercase font-bold text-amber-400 font-ubuntu">
                  Directions &amp; Verified Listings
                </span>
                <h4 className="text-sm font-extrabold font-ubuntu">
                  Pennathur / Bagayam, Arni Road Stretch
                </h4>
                <p className="text-xs text-slate-300">
                  Easy parking for two-wheelers and cars. Near Bagayam and Thuthipattu junction.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 font-bold text-xs border border-orange-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  <span>Justdial Reviews</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (Col 7) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-lg text-slate-900 font-ubuntu">Send Us A Message</h3>
              <p className="text-xs text-slate-500 mt-1">
                Submissions automatically create real-time lead records in the Super Admin Messages module.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your message has been received by Johnson Food Court management. We will contact you shortly.
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 99652..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Inquiry Purpose</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="General Dining Inquiry">General Dining Inquiry</option>
                    <option value="Outdoor Table Booking">Outdoor Table Booking</option>
                    <option value="Birthday / Event Celebration">Birthday / Event Celebration</option>
                    <option value="Bulk Takeaway / Catering">Bulk Takeaway / Catering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us your requirements, estimated party size, or questions..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all font-ubuntu uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry to JFC'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
