'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  QrCode,
  Download,
  ExternalLink,
  Printer,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function MenuMasterPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 1,
    isActive: true,
  });

  // QR Code State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    fetchCategories();
    fetchGeneralQr();
  }, [search]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/admin/categories?search=${encodeURIComponent(search)}` : '/api/admin/categories';
      const res = await fetch(url);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneralQr = async () => {
    try {
      const res = await fetch('/api/admin/qr');
      const data = await res.json();
      setQrDataUrl(data.qrDataUrl);
      setTargetUrl(data.targetUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        description: cat.description || '',
        image: cat.image || '',
        displayOrder: cat.displayOrder || 1,
        isActive: cat.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
        displayOrder: categories.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory ? { ...formData, id: editingCategory.id } : formData;

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Dishes linked to this category may be affected.')) return;
    try {
      await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      fetchCategories();
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
            Menu Master & Categories
          </h1>
          <p className="text-xs text-slate-400">
            Create catalog taxonomies, display orders and QR menu endpoints
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-900/20"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Generate Menu QR</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* In-Page Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Found <b>{categories.length}</b> {categories.length === 1 ? 'category' : 'categories'}
            {search && <span> matching "<b>{search}</b>"</span>}
          </span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-orange-600 font-semibold hover:underline"
            >
              Reset search filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Items Count</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-500">
                      #{c.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm truncate text-slate-500">
                      {c.description || 'No description added.'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                        {c._count?.menuItems || 0} Dishes
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tandoori Specialties"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Appetizing summary of this category..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
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
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for Menu Access */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-orange-500" />
                <span>Restaurant Digital Menu QR</span>
              </h2>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Scan this QR code with any smartphone camera to open the live interactive menu.
            </p>

            {qrDataUrl ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <img src={qrDataUrl} alt="Menu QR Code" className="w-52 h-52 rounded-lg shadow-sm" />
                <span className="text-[11px] font-mono text-slate-400 mt-2 break-all max-w-xs">
                  {targetUrl}
                </span>
              </div>
            ) : (
              <div className="py-12 text-xs text-slate-400">Generating QR Code...</div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={qrDataUrl}
                download="royal-spice-menu-qr.png"
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Standee</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
