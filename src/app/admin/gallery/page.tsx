'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  X,
  Filter,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ambience',
    imageUrl: '',
    description: '',
    isFeatured: false,
    displayOrder: 1,
  });

  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGallery();
    }, 250);
    return () => clearTimeout(timer);
  }, [categoryFilter, searchTerm]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/gallery?category=${categoryFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description || '',
        isFeatured: item.isFeatured,
        displayOrder: item.displayOrder || 1,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'Food',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        description: '',
        isFeatured: false,
        displayOrder: items.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch('/api/admin/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchGallery();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['ALL', 'Food', 'Ambience', 'Interior', 'Events', 'Chef'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Restaurant Media Gallery
          </h1>
          <p className="text-xs text-slate-400">
            Upload and organize photography showcased on the customer website
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search gallery photos..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
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
      </div>

      {/* Gallery Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading photos...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No gallery items found in this category.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-sm">
                  {item.category}
                </span>
                {item.isFeatured && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </span>
                )}
              </div>

              <div className="p-3.5 flex-1">
                <h3 className="font-bold text-xs text-slate-800 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {item.description || 'Showcased in website gallery.'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400 font-mono">
                  Pos #{item.displayOrder}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* Add / Edit Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">
                {editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
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
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Candlelight Ambience"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="Food">Food</option>
                    <option value="Ambience">Ambience</option>
                    <option value="Interior">Interior</option>
                    <option value="Events">Events</option>
                    <option value="Chef">Chef</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for website visitors..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="featuredPhoto"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="featuredPhoto" className="font-semibold text-slate-700">
                  Feature on Website Homepage
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
                  {editingItem ? 'Save Changes' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
