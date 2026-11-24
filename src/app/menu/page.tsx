'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Utensils,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Clock,
  Flame,
  AlertCircle,
  QrCode,
  Store,
} from 'lucide-react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { formatCurrency } from '@/lib/utils';

export default function PublicMenuPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading digital menu...</div>}>
      <MenuContent />
    </React.Suspense>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTable = searchParams.get('table') || '';
  const urlCategory = searchParams.get('category') || 'ALL';
  const urlDish = searchParams.get('dish') || '';

  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [search, setSearch] = useState(urlDish);
  const [vegFilter, setVegFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');

  // Cart State: array of { id, menuItem, quantity, specialInstructions }
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState(urlTable);
  const [orderType, setOrderType] = useState('DINE_IN');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [catRes, menuRes, tableRes, setRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/menu'),
        fetch('/api/admin/tables'),
        fetch('/api/admin/settings'),
      ]);

      const catData = await catRes.json();
      const menuData = await menuRes.json();
      const tableData = await tableRes.json();
      const setData = await setRes.json();

      setCategories(catData.categories || []);
      setMenuItems(menuData.items || []);
      setTables(tableData.tables || []);
      setSettings(setData.settings || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'ALL' || item.categoryId === activeCategory;
    const matchesVeg =
      vegFilter === 'ALL' ||
      (vegFilter === 'VEG' && item.isVeg) ||
      (vegFilter === 'NON_VEG' && !item.isVeg);
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesVeg && matchesSearch;
  });

  // Cart Functions
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          image: item.image,
          quantity: 1,
          specialInstructions: '',
        },
      ];
    });
    setCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.menuItemId === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as any[]
    );
  };

  const updateInstructions = (itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((i) => (i.menuItemId === itemId ? { ...i, specialInstructions: note } : i))
    );
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = +(cartSubtotal * 0.05).toFixed(2);
  const cartTotal = +(cartSubtotal + cartTax).toFixed(2);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (orderType === 'DINE_IN' && !selectedTable) {
      setOrderError('Please select your dining table number.');
      return;
    }
    if (!customerName) {
      setOrderError('Please enter your name.');
      return;
    }

    setIsPlacingOrder(true);
    setOrderError('');

    try {
      // Find table ID
      const tableObj = tables.find((t) => t.tableNumber === selectedTable);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: tableObj?.id || null,
          customerName,
          customerPhone,
          orderType,
          items: cart.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            specialInstructions: i.specialInstructions,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Failed to place order');
        return;
      }

      // Success -> Redirect to thank you page
      router.push(`/thank-you?orderNumber=${data.order.orderNumber}&name=${encodeURIComponent(customerName)}`);
    } catch (e: any) {
      setOrderError(e.message || 'Error communicating with kitchen');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <PublicNavbar settings={settings} />

      {/* Menu Header Banner */}
      <div className="bg-slate-950 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-amber-400 text-xs font-bold mb-3">
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Contactless QR Digital Ordering Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                Johnson Food Court <span className="text-amber-400">Menu</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Explore our authentic Charcoal BBQ, Shawarmas, Chinese Wok, Biryanis, and Fresh Juices. Orders placed here sync immediately to the Chef KDS and Billing workstation.
              </p>
            </div>

            {/* Table Badge if QR scanned */}
            {selectedTable && (
              <div className="bg-slate-900 border border-amber-500/40 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center text-sm">
                  {selectedTable}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Dine-In Table
                  </span>
                  <p className="text-xs font-black text-white">Table {selectedTable} Connected</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Menu Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes by name or ingredients..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Veg / Non-Veg Toggle Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setVegFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                vegFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setVegFilter('VEG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                vegFilter === 'VEG'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>🟢 Pure Veg</span>
            </button>
            <button
              onClick={() => setVegFilter('NON_VEG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                vegFilter === 'NON_VEG'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span>🔴 Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid and Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dishes Catalog (Col 8) */}
          <div className="lg:col-span-8">
            {loading ? (
              <div className="py-20 text-center text-xs text-slate-400">Loading delicious dishes...</div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
                <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-sm text-slate-800">No matching dishes found</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your category filter or search query.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('ALL');
                    setVegFilter('ALL');
                    setSearch('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredItems.map((item) => {
                  const inCart = cart.find((i) => i.menuItemId === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {item.isVeg ? 'Veg 🟢' : 'Non-Veg 🔴'}
                        </span>
                        {item.prepTime && (
                          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/75 text-white backdrop-blur-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.prepTime} mins
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-black text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                              {item.name}
                            </h3>
                            <span className="font-extrabold text-sm text-slate-900 shrink-0">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {item.description || 'Authentic dish freshly cooked with chef special spice blend.'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">
                            {item.category?.name}
                          </span>

                          {inCart ? (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-5 h-5 rounded-lg bg-white text-red-600 hover:bg-red-100 flex items-center justify-center font-bold text-xs"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-red-700 w-4 text-center">
                                {inCart.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-5 h-5 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center font-bold text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Dish</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Order Cart Drawer (Col 4) */}
          <div className="lg:col-span-4 sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-sm text-slate-900">Your Order Cart</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Your cart is empty.</p>
                <p className="text-[11px] text-slate-400">
                  Select dishes from the menu to start your order.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.menuItemId} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]">{item.isVeg ? '🟢' : '🔴'}</span>
                        <span className="font-extrabold text-slate-900">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <input
                        type="text"
                        value={item.specialInstructions}
                        onChange={(e) => updateInstructions(item.menuItemId, e.target.value)}
                        placeholder="Kitchen note (e.g. less spice)..."
                        className="w-36 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 placeholder:text-slate-400"
                      />

                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="p-1 text-slate-600 hover:text-red-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-slate-900 w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="p-1 text-slate-600 hover:text-emerald-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Order Details Form */}
            {cart.length > 0 && (
              <form onSubmit={handlePlaceOrder} className="pt-2 space-y-4 border-t border-slate-100">
                {orderError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Dine-In or Takeaway Selector */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Order Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('DINE_IN')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        orderType === 'DINE_IN'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Dine-In Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('TAKEAWAY')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        orderType === 'TAKEAWAY'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Takeaway / Parcel
                    </button>
                  </div>
                </div>

                {/* Table Dropdown (if Dine-in) */}
                {orderType === 'DINE_IN' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Dining Table *
                    </label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500"
                    >
                      <option value="">-- Select Your Table --</option>
                      {tables.map((t) => (
                        <option key={t.id} value={t.tableNumber}>
                          {t.tableNumber} ({t.floorZone} - {t.capacity} Seats)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Guest Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>GST (5.0%)</span>
                    <span>{formatCurrency(cartTax)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-black text-slate-900 text-sm">
                    <span>Payable Total</span>
                    <span className="text-red-600 font-black">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isPlacingOrder ? 'Sending to Kitchen...' : `Place Order • ${formatCurrency(cartTotal)}`}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Order transmits instantly to Chef KDS & Billing Counter.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <PublicFooter settings={settings} />
    </div>
  );
}
