'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Clock,
  Sparkles,
  Tag,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function MenuManagementPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegFilter, setVegFilter] = useState('all');

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isVeg: true,
    isAvailable: true,
    image: '',
    tags: '',
    prepTime: 15,
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/menu?search=${encodeURIComponent(search)}`;
      if (selectedCategory !== 'all') url += `&categoryId=${selectedCategory}`;
      if (vegFilter !== 'all') url += `&isVeg=${vegFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, vegFilter]);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        categoryId: item.categoryId,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        image: item.image || '',
        tags: item.tags || '',
        prepTime: item.prepTime || 15,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories[0]?.id || '',
        isVeg: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        tags: '',
        prepTime: 15,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch('/api/admin/menu', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMenuItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAvailability = async (item: any) => {
    try {
      await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          isAvailable: !item.isAvailable,
        }),
      });
      fetchMenuItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      fetchMenuItems();
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
            Menu Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage restaurant dishes, pricing, dietary indicators and kitchen prep times
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by name, tag or description..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Veg / Non-Veg */}
          <select
            value={vegFilter}
            onChange={(e) => setVegFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Dietary Types</option>
            <option value="true">Veg Only 🟢</option>
            <option value="false">Non-Veg Only 🔴</option>
          </select>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading menu items...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No dishes found matching your search.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                item.isAvailable ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                {/* Dish Image Banner */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Dietary Badge */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm flex items-center gap-1 ${
                      item.isVeg
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>

                  {/* Category Pill */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                    {item.category?.name}
                  </span>
                </div>

                {/* Dish Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-sm font-bold text-slate-800 leading-tight">
                      {item.name}
                    </h2>
                    <span className="text-sm font-extrabold text-orange-600 shrink-0">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description || 'Delicately prepared with hand-selected ingredients.'}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.prepTime} mins
                    </span>
                    {item.tags && (
                      <span className="truncate max-w-[140px] text-orange-600/80 font-medium">
                        {item.tags}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                {/* Instant Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                    item.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                </button>

                {/* Edit & Delete Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Dish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
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
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Butter Chicken"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="390"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter flavorful description of this dish..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Chef Special, Spicy"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Veg / Non-Veg & Availability Switches */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVegCheckbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="isVegCheckbox" className="font-semibold text-slate-700">
                    Vegetarian Dish 🟢
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailableCheckbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="isAvailableCheckbox" className="font-semibold text-slate-700">
                    Currently In Stock
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
