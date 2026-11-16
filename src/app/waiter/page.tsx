'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Minus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  UtensilsCrossed,
  ChefHat,
  Receipt,
  X,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
} from 'lucide-react';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import { formatCurrency } from '@/lib/utils';

export default function WaiterFloorStationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Data
  const [tables, setTables] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status updating state
  const [updatingTableId, setUpdatingTableId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Ordering State
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dishSearch, setDishSearch] = useState('');
  const [orderCart, setOrderCart] = useState<any[]>([]);
  const [specialNote, setSpecialNote] = useState('');
  const [customerName, setCustomerName] = useState('Table Guest');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSentSuccess, setOrderSentSuccess] = useState<string | null>(null);

  // 1. Role verification
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        const user = data.user;
        setCurrentUser(user);
        // Only SUPER_ADMIN, WAITER, and CUSTOMER can access User/Waiter View
        if (
          user.role !== 'SUPER_ADMIN' &&
          user.role !== 'WAITER' &&
          user.role !== 'CUSTOMER'
        ) {
          if (user.role === 'CHEF') router.push('/chef');
          else if (user.role === 'BILLING_STAFF') router.push('/billing');
          else router.push('/login');
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [router]);

  // 2. Fetch tables, categories, and menu items
  useEffect(() => {
    fetchStationData();
    const interval = setInterval(() => {
      fetchStationData(false);
    }, 5000); // Poll every 5s for table status & active order updates
    return () => clearInterval(interval);
  }, []);

  const fetchStationData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [tRes, cRes, mRes] = await Promise.all([
        fetch('/api/admin/tables'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/menu'),
      ]);

      const tData = await tRes.json();
      const cData = await cRes.json();
      const mData = await mRes.json();

      setTables(tData.tables || []);
      setCategories(cData.categories || []);
      setMenuItems(mData.items || mData.menuItems || []);

      // Keep selected table updated
      if (selectedTable) {
        const found = (tData.tables || []).find((t: any) => t.id === selectedTable.id);
        if (found) setSelectedTable(found);
      }
    } catch (e) {
      console.error('Error fetching station data:', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // 3. Quick Table Status Updater (AVAILABLE, OCCUPIED, RESERVED, CLEANING)
  const handleUpdateTableStatus = async (tableId: string, tableNumber: string, newStatus: string) => {
    setUpdatingTableId(tableId);
    setStatusFeedback(null);

    try {
      const res = await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tableId,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update table status');

      // Update local state immediately
      setTables((prev) =>
        prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
      );
      if (selectedTable?.id === tableId) {
        setSelectedTable((prev: any) => ({ ...prev, status: newStatus }));
      }

      const statusLabels: Record<string, string> = {
        AVAILABLE: 'Table Free',
        OCCUPIED: 'Occupied',
        RESERVED: 'Reserved',
        CLEANING: 'Cleaning Work Going',
      };
      setStatusFeedback(`Table ${tableNumber} updated to "${statusLabels[newStatus] || newStatus}"`);
      setTimeout(() => setStatusFeedback(null), 3500);
    } catch (e: any) {
      alert(e.message || 'Error updating table status');
    } finally {
      setUpdatingTableId(null);
    }
  };

  // 4. Order Cart Management
  const handleSelectTableForOrder = (table: any) => {
    setSelectedTable(table);
    setOrderSentSuccess(null);
  };

  const handleAddToCart = (dish: any) => {
    setOrderCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1, instructions: '' }];
    });
  };

  const handleUpdateCartQty = (dishId: string, delta: number) => {
    setOrderCart((prev) =>
      prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  const handleUpdateItemInstructions = (dishId: string, instructions: string) => {
    setOrderCart((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, instructions } : item))
    );
  };

  const handleRemoveFromCart = (dishId: string) => {
    setOrderCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  // Cart calculations
  const cartSubtotal = orderCart.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const cartTax = +(cartSubtotal * 0.05).toFixed(2);
  const cartTotal = +(cartSubtotal + cartTax).toFixed(2);

  // 5. Submit Order -> Dispatches to Chef
  const handleSubmitOrderToChef = async () => {
    if (!selectedTable) {
      alert('Please select a table first.');
      return;
    }
    if (orderCart.length === 0) {
      alert('Please add at least one dish to the order.');
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const payload = {
        tableId: selectedTable.id,
        customerName: customerName || `Table ${selectedTable.tableNumber} Guest`,
        orderType: 'DINE_IN',
        specialInstructions: specialNote || null,
        items: orderCart.map((item) => ({
          menuItemId: item.dish.id,
          quantity: item.quantity,
          specialInstructions: item.instructions || null,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Success feedback
      setOrderSentSuccess(
        `Order ${data.order?.orderNumber || 'ORD-NEW'} sent to Kitchen! Chef is notified to begin cooking.`
      );
      setOrderCart([]);
      setSpecialNote('');
      fetchStationData(false);
      setTimeout(() => setOrderSentSuccess(null), 5000);
    } catch (e: any) {
      alert(e.message || 'Error submitting order');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Filter Menu Items by Category & Search
  const filteredMenuItems = menuItems.filter((dish) => {
    if (!dish.isAvailable) return false;
    if (selectedCategory !== 'ALL' && dish.categoryId !== selectedCategory) {
      return false;
    }
    if (dishSearch.trim()) {
      const q = dishSearch.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description?.toLowerCase().includes(q);
      const matchTags = dish.tags?.toLowerCase().includes(q);
      return matchName || matchDesc || matchTags;
    }
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="font-bold text-sm">Authenticating Floor Staff Station...</span>
        </div>
      </div>
    );
  }

  // Count tables by status
  const countFree = tables.filter((t) => t.status === 'AVAILABLE').length;
  const countOccupied = tables.filter((t) => t.status === 'OCCUPIED').length;
  const countReserved = tables.filter((t) => t.status === 'RESERVED').length;
  const countCleaning = tables.filter((t) => t.status === 'CLEANING').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Super Admin Top Switcher (Visible to Admin Only) */}
      <AdminRoleSwitcher />

      {/* Main Workstation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 leading-tight">
                  Floor Staff & Table Station (User View)
                </h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                  Floor Steward Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Update table statuses (Free, Occupied, Reserved, Cleaning), take table orders & dispatch tickets to Chef
              </p>
            </div>
          </div>

          {/* Quick Metrics & User Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500">Steward:</span>
              <strong className="text-slate-900">{currentUser?.name || 'Floor Staff'}</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">
                {currentUser?.role}
              </span>
            </div>

            <button
              onClick={() => fetchStationData()}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Status Toast Banner */}
        {statusFeedback && (
          <div className="max-w-7xl mx-auto mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusFeedback}</span>
          </div>
        )}

        {/* Order Sent Success Banner */}
        {orderSentSuccess && (
          <div className="max-w-7xl mx-auto mt-2 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black flex items-center justify-between shadow-md animate-fade-in">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              <span>{orderSentSuccess}</span>
            </div>
            <button
              onClick={() => setOrderSentSuccess(null)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Workstation Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-8">
        {/* =========================================================
            SECTION 1: TABLE FLOOR OVERVIEW & 1-CLICK STATUS UPDATER
            ========================================================= */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Restaurant Table Floor Plan & Live Status</span>
                <span className="text-xs font-normal text-slate-500">
                  ({tables.length} Total Tables)
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any status button on a table to instantly update its status. Click "Take Order" to select a table for ordering.
              </p>
            </div>

            {/* Status Legend Pills */}
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                🟢 Free ({countFree})
              </span>
              <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                🟠 Occupied ({countOccupied})
              </span>
              <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                🟣 Reserved ({countReserved})
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                🟡 Cleaning ({countCleaning})
              </span>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => {
              const isSelected = selectedTable?.id === table.id;
              const hasActiveOrder =
                table.orders &&
                table.orders.length > 0 &&
                ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(table.orders[0].status);
              const activeOrder = hasActiveOrder ? table.orders[0] : null;

              return (
                <div
                  key={table.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Top: Table Title & Zone */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-slate-900">
                        {table.tableNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          table.status === 'AVAILABLE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : table.status === 'OCCUPIED'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : table.status === 'RESERVED'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {table.status === 'AVAILABLE' && '🟢 Table Free'}
                        {table.status === 'OCCUPIED' && '🟠 Occupied'}
                        {table.status === 'RESERVED' && '🟣 Reserved'}
                        {table.status === 'CLEANING' && '🟡 Cleaning Going'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {table.floorZone} &bull; {table.capacity} Seats
                    </p>

                    {/* Active Order Pill if running */}
                    {activeOrder && (
                      <div className="mt-2 p-1.5 rounded-lg bg-orange-50 border border-orange-200 text-[10px] text-orange-800 font-semibold flex items-center justify-between">
                        <span>Order {activeOrder.orderNumber}</span>
                        <span className="font-bold">{activeOrder.status}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle: 1-Click Status Updaters */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Update Status:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                      <button
                        type="button"
                        disabled={updatingTableId === table.id}
                        onClick={() =>
                          handleUpdateTableStatus(table.id, table.tableNumber, 'AVAILABLE')
                        }
                        className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                          table.status === 'AVAILABLE'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200 hover:text-emerald-700'
                        }`}
                      >
                        Table Free
                      </button>

                      <button
                        type="button"
                        disabled={updatingTableId === table.id}
                        onClick={() =>
                          handleUpdateTableStatus(table.id, table.tableNumber, 'OCCUPIED')
                        }
                        className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                          table.status === 'OCCUPIED'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-orange-50 text-slate-700 border-slate-200 hover:text-orange-700'
                        }`}
                      >
                        Occupied
                      </button>

                      <button
                        type="button"
                        disabled={updatingTableId === table.id}
                        onClick={() =>
                          handleUpdateTableStatus(table.id, table.tableNumber, 'RESERVED')
                        }
                        className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                          table.status === 'RESERVED'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-purple-50 text-slate-700 border-slate-200 hover:text-purple-700'
                        }`}
                      >
                        Reserved
                      </button>

                      <button
                        type="button"
                        disabled={updatingTableId === table.id}
                        onClick={() =>
                          handleUpdateTableStatus(table.id, table.tableNumber, 'CLEANING')
                        }
                        className={`py-1 px-1.5 rounded-lg border text-center transition-all ${
                          table.status === 'CLEANING'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200 hover:text-amber-700'
                        }`}
                      >
                        Cleaning
                      </button>
                    </div>
                  </div>

                  {/* Bottom: Select Table For Ordering */}
                  <div className="mt-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSelectTableForOrder(table)}
                      className={`w-full py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Selected for Order' : 'Take / Add Order'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 2: MENU ITEM CATALOG & ORDER TAKING STATION
            ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Menu Items with Category Tabs & Instant Search (lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            {/* Header with Table Target */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>Menu Item Ordering Catalog</span>
                  {selectedTable ? (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Ordering for Table {selectedTable.tableNumber} ({selectedTable.floorZone})
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      ⚠️ Please click a table above to assign order
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500">
                  Browse by category, search instantly, and add dishes to the table order list
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder="Search dishes (e.g. Biryani, Paneer)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {dishSearch && (
                  <button
                    onClick={() => setDishSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories ({menuItems.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMenuItems.map((dish) => {
                const cartItem = orderCart.find((ci) => ci.dish.id === dish.id);

                return (
                  <div
                    key={dish.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      cartItem
                        ? 'border-blue-400 bg-blue-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Dish Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-sm border shrink-0 ${
                              dish.isVeg
                                ? 'border-emerald-600 bg-emerald-500'
                                : 'border-rose-600 bg-rose-500'
                            }`}
                            title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          />
                          <h4 className="font-bold text-xs text-slate-900 leading-snug">
                            {dish.name}
                          </h4>
                        </div>
                        <span className="font-black text-xs text-slate-900 whitespace-nowrap">
                          {formatCurrency(dish.price)}
                        </span>
                      </div>

                      {/* Description */}
                      {dish.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {dish.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Add to Order / Qty Controls */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {dish.prepTime || 15} mins prep
                      </span>

                      {cartItem ? (
                        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(dish.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-blue-700 flex items-center justify-center font-bold hover:bg-blue-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-blue-900 px-1">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(dish.id, 1)}
                            className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(dish)}
                          className="px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                No menu items found matching "{dishSearch}".
              </div>
            )}
          </div>

          {/* Right: Table Order List & Send to Chef (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-24">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900">
                      Table Order List (KOT)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedTable
                        ? `Table ${selectedTable.tableNumber} • ${selectedTable.floorZone}`
                        : 'No table assigned'}
                    </p>
                  </div>
                </div>

                {orderCart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setOrderCart([])}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Target Table Warning if none */}
            {!selectedTable && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                👉 Please click <strong>"Take / Add Order"</strong> on a table card above before sending items to the kitchen.
              </div>
            )}

            {/* Customer / Guest Name (Optional) */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Guest Name / Reference
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Guest / Name"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Order Items List */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Added Dishes ({orderCart.length})
              </h4>

              {orderCart.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
                  {orderCart.map((item) => (
                    <div key={item.dish.id} className="pt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-xs ${
                              item.dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="font-bold text-slate-800">
                            {item.dish.name}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.dish.price * item.quantity)}
                        </span>
                      </div>

                      {/* Qty & Instruction Row */}
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.dish.id, -1)}
                            className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center font-bold"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="font-bold px-1">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.dish.id, 1)}
                            className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center font-bold"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.instructions}
                          onChange={(e) =>
                            handleUpdateItemInstructions(item.dish.id, e.target.value)
                          }
                          placeholder="Cooking note (e.g. less spicy)..."
                          className="flex-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.dish.id)}
                          className="text-slate-400 hover:text-rose-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs italic">
                  Order list is empty. Click "+ Add" on any menu dish on the left.
                </div>
              )}
            </div>

            {/* Special Instructions */}
            {orderCart.length > 0 && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Table Order Overall Note
                </label>
                <input
                  type="text"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Special requests, allergies, or timing..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Totals Summary */}
            {orderCart.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%)</span>
                  <span>{formatCurrency(cartTax)}</span>
                </div>
                <div className="pt-2 border-t border-slate-300 flex justify-between font-black text-slate-900 text-sm">
                  <span>Estimated Total</span>
                  <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            )}

            {/* Submit to Chef Button */}
            <button
              type="button"
              disabled={isSubmittingOrder || orderCart.length === 0 || !selectedTable}
              onClick={handleSubmitOrderToChef}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>
                {isSubmittingOrder
                  ? 'Dispatching to Chef...'
                  : '🔥 Send Order to Kitchen (Chef)'}
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
