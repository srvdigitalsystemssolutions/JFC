'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Star,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  UserCheck,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function TestimonialsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerRole: 'Regular Diner',
    avatarUrl: '',
    rating: 5,
    content: '',
    isApproved: true,
  });

  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTestimonials();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/testimonials';
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (t?: any) => {
    if (t) {
      setEditingItem(t);
      setFormData({
        customerName: t.customerName,
        customerRole: t.customerRole || 'Regular Diner',
        avatarUrl: t.avatarUrl || '',
        rating: t.rating || 5,
        content: t.content,
        isApproved: t.isApproved,
      });
    } else {
      setEditingItem(null);
      setFormData({
        customerName: '',
        customerRole: 'Food Enthusiast',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
        rating: 5,
        content: '',
        isApproved: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch('/api/admin/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleApproval = async (item: any) => {
    try {
      await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          isApproved: !item.isApproved,
        }),
      });
      fetchTestimonials();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Customer Testimonials & Reviews Moderation
          </h1>
          <p className="text-xs text-slate-400">
            Approve, manage and feature real customer dining experiences on the public site
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search testimonials by customer name, role, or review text..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-slate-700">{testimonials.length}</span> reviews
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No testimonials found.
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-sm bg-white hover:shadow-md ${
                t.isApproved ? 'border-slate-200' : 'border-amber-200 bg-amber-50/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={t.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'}
                      alt={t.customerName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-xs text-slate-800">{t.customerName}</h3>
                      <p className="text-[10px] text-slate-400">{t.customerRole}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4 mb-4">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {/* Approval Switch */}
                <button
                  onClick={() => handleToggleApproval(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    t.isApproved
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {t.isApproved ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Approved (Visible)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-amber-600" />
                      <span>Pending Approval</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(t)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Kavita Patel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.customerRole}
                    onChange={(e) => setFormData({ ...formData, customerRole: e.target.value })}
                    placeholder="e.g. Food Critic"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rating (1 to 5)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Review Content *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter genuine dining feedback..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="approveStatus"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="approveStatus" className="font-semibold text-slate-700">
                  Approved For Website Display
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20"
                >
                  {editingItem ? 'Save Changes' : 'Submit Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
