'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquareQuote,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerRole: 'Regular Diner',
    rating: 5,
    content: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setReviews(data.testimonials || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ customerName: '', customerRole: 'Regular Diner', rating: 5, content: '' });
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <PublicNavbar />

      <section className="bg-slate-950 text-white py-16 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider inline-block">
            Guest Feedback & Ratings
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Honest Reviews From Our Diners
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Read authentic reviews from guests who celebrated their meals with us, or share your own dining experience.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Submit Review Form (Col 4) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-28 space-y-4">
            <h3 className="font-black text-base text-slate-900">Leave Your Review</h3>
            <p className="text-xs text-slate-500">
              Your feedback is displayed on our website and synced with our Super Admin panel.
            </p>

            {submitted && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your review has been submitted successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Diner Role / Tag</label>
                <input
                  type="text"
                  value={formData.customerRole}
                  onChange={(e) => setFormData({ ...formData, customerRole: e.target.value })}
                  placeholder="e.g. Family Dining, Food Critic"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{formData.rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Dining Review *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell us about the dishes, service, and atmosphere..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs shadow-md shadow-red-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Post Review'}</span>
              </button>
            </form>
          </div>

          {/* Reviews List (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-black text-sm text-slate-900">
                Verified Customer Testimonials ({reviews.length})
              </h3>
              <span className="text-xs font-bold text-amber-500">Average 4.9 ★ Rating</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No reviews found yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{rev.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                      <img
                        src={rev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={rev.customerName}
                        className="w-9 h-9 rounded-full object-cover border"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{rev.customerName}</h4>
                        <p className="text-[10px] text-slate-400">{rev.customerRole}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
