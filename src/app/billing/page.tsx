'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Receipt,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  DollarSign,
  CreditCard,
  QrCode,
  X,
  User,
  Phone,
  RefreshCw,
  UtensilsCrossed,
  ShieldAlert,
  Percent,
  Check,
  Building,
  Sparkles,
  LogOut,
  Bike,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Bell,
  Flame,
  MapPin,
  AlertCircle,
  ArrowRight,
  Send,
} from 'lucide-react';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BillingWorkstationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Core Data
  const [tables, setTables] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Workstation View Modes: 'TABLES' or 'ONLINE'
  const [viewChannel, setViewChannel] = useState<'TABLES' | 'ONLINE'>('TABLES');

  // Filter / Selection for Tables
  const [tableFilter, setTableFilter] = useState<'ALL' | 'ACTIVE' | 'VACANT'>('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState<any>(null);

  // Filter / Selection for Online Orders
  const [onlineFilter, setOnlineFilter] = useState<'ALL' | 'READY' | 'PREPARING' | 'ZOMATO' | 'SWIGGY'>('ALL');
  const [onlineSearch, setOnlineSearch] = useState('');

  // Selected Order for Right Column Bill Inspector
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Billing calculation
  const [discountType, setDiscountType] = useState<'NONE' | 'PERCENT' | 'FIXED'>('NONE');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'SPLIT'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  // Thermal Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<any>(null);

  // New Online Order Modal State
  const [showNewOnlineModal, setShowNewOnlineModal] = useState(false);
  const [onlinePlatform, setOnlinePlatform] = useState<'ZOMATO' | 'SWIGGY' | 'ONLINE' | 'MAGICPIN'>('ZOMATO');
  const [channelRef, setChannelRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [riderName, setRiderName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [onlineCart, setOnlineCart] = useState<any[]>([]);
  const [modalCategory, setModalCategory] = useState('ALL');
  const [modalDishSearch, setModalDishSearch] = useState('');
  const [isSubmittingOnline, setIsSubmittingOnline] = useState(false);
  const [onlineFeedback, setOnlineFeedback] = useState<string | null>(null);

  // 1. Role verification
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        const user = data.user;
        // Require active BILLING_STAFF or SUPER_ADMIN role.
        // If not logged in as Billing, view login page first so the employee can enter their ID and password!
        if (!user || (user.role !== 'BILLING_STAFF' && user.role !== 'SUPER_ADMIN')) {
          router.push('/login?target=billing');
          return;
        }
        setCurrentUser(user);
      })
      .catch(() => {
        router.push('/login?target=billing');
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [router]);

  // 2. Fetch tables, orders, menu items and settings
  useEffect(() => {
    fetchBillingData();
    fetchMenuData();
    const interval = setInterval(() => {
      fetchBillingData(false);
    }, 4000); // Poll every 4s for live order & status sync
    return () => clearInterval(interval);
  }, []);

  const fetchMenuData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch('/api/admin/menu'),
        fetch('/api/admin/categories'),
      ]);
      const mData = await mRes.json();
      const cData = await cRes.json();
      setMenuItems(mData.items || mData.menuItems || []);
      setCategories(cData.categories || []);
    } catch (e) {
      console.error('Error fetching menu items for online billing:', e);
    }
  };

  const fetchBillingData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [tRes, oRes, sRes] = await Promise.all([
        fetch('/api/admin/tables'),
        fetch('/api/orders?status=ALL'),
        fetch('/api/admin/settings'),
      ]);

      const tData = await tRes.json();
      const oData = await oRes.json();
      const sData = await sRes.json();

      const allTables = tData.tables || [];
      const orders = oData.orders || [];

      // Filter only active orders (PENDING, ACCEPTED, PREPARING, READY)
      const nonCompletedOrders = orders.filter((o: any) =>
        ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
      );

      setTables(allTables);
      setActiveOrders(nonCompletedOrders);
      setSettings(sData.settings || null);

      // Keep selected order in sync
      if (selectedOrder) {
        const freshSelected = nonCompletedOrders.find((o: any) => o.id === selectedOrder.id);
        if (freshSelected) {
          setSelectedOrder(freshSelected);
        }
      }
    } catch (e) {
      console.error('Error fetching billing data:', e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Open Online Order Placement Modal with randomized channel ID
  const handleOpenNewOnlineModal = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = onlinePlatform === 'ZOMATO' ? 'ZOM' : onlinePlatform === 'SWIGGY' ? 'SWIG' : 'WEB';
    setChannelRef(`${prefix}-${randomDigits}`);
    setOnlineCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setRiderName('');
    setSpecialInstructions('');
    setOnlineFeedback(null);
    setShowNewOnlineModal(true);
  };

  // Change platform in modal
  const handleSelectPlatform = (p: 'ZOMATO' | 'SWIGGY' | 'ONLINE' | 'MAGICPIN') => {
    setOnlinePlatform(p);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const prefix = p === 'ZOMATO' ? 'ZOM' : p === 'SWIGGY' ? 'SWIG' : p === 'MAGICPIN' ? 'MPIN' : 'WEB';
    setChannelRef(`${prefix}-${randomDigits}`);
  };

  // Add dish to online order cart
  const handleAddToCart = (dish: any) => {
    setOnlineCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: dish.id,
          name: dish.name,
          price: dish.price,
          isVeg: dish.isVeg,
          quantity: 1,
          specialInstructions: '',
        },
      ];
    });
  };

  // Update item quantity
  const handleUpdateCartQty = (menuItemId: string, delta: number) => {
    setOnlineCart((prev) =>
      prev
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  // Remove from cart
  const handleRemoveFromCart = (menuItemId: string) => {
    setOnlineCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  // Submit Online Order to Kitchen
  const handleSubmitOnlineOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onlineCart.length === 0) {
      setOnlineFeedback('Please add at least one menu item to the order');
      return;
    }

    setIsSubmittingOnline(true);
    setOnlineFeedback(null);

    try {
      const fullInstructions = [
        `Platform Channel ID: ${channelRef}`,
        deliveryAddress ? `Delivery Address: ${deliveryAddress}` : null,
        riderName ? `Rider: ${riderName}` : null,
        specialInstructions ? `Chef Note: ${specialInstructions}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: onlinePlatform,
          customerName: customerName || `${onlinePlatform} Customer`,
          customerPhone: customerPhone || null,
          specialInstructions: fullInstructions,
          items: onlineCart.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            specialInstructions: i.specialInstructions || null,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch online order');
      }

      setShowNewOnlineModal(false);
      setViewChannel('ONLINE');
      setSelectedOrder(data.order);
      setSelectedTable(null);
      await fetchBillingData(false);
    } catch (err: any) {
      setOnlineFeedback(err.message || 'Error dispatching order');
    } finally {
      setIsSubmittingOnline(false);
    }
  };

  // Select a table to view its over bill
  const handleSelectTable = (table: any) => {
    setSelectedTable(table);
    const activeOrd = activeOrders.find((o: any) => o.tableId === table.id);
    setSelectedOrder(activeOrd || null);
    // Reset discount
    setDiscountType('NONE');
    setDiscountValue(0);
  };

  // Select an online order
  const handleSelectOnlineOrder = (order: any) => {
    setSelectedTable(null);
    setSelectedOrder(order);
    setDiscountType('NONE');
    setDiscountValue(0);
  };

  // Filter Tables
  const filteredTables = tables.filter((t) => {
    const hasOrder = activeOrders.some((o) => o.tableId === t.id);
    if (tableFilter === 'ACTIVE' && !hasOrder) return false;
    if (tableFilter === 'VACANT' && hasOrder) return false;
    if (
      tableSearch &&
      !t.tableNumber.toLowerCase().includes(tableSearch.toLowerCase()) &&
      !t.floorZone.toLowerCase().includes(tableSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Filter Online Orders
  const onlineOrders = activeOrders.filter(
    (o) => ['ZOMATO', 'SWIGGY', 'ONLINE', 'MAGICPIN', 'TAKEAWAY'].includes(o.orderType) || !o.tableId
  );

  const filteredOnlineOrders = onlineOrders.filter((o) => {
    if (onlineFilter === 'READY' && o.status !== 'READY') return false;
    if (onlineFilter === 'PREPARING' && o.status !== 'PREPARING' && o.status !== 'PENDING') return false;
    if (onlineFilter === 'ZOMATO' && o.orderType !== 'ZOMATO') return false;
    if (onlineFilter === 'SWIGGY' && o.orderType !== 'SWIGGY') return false;
    if (onlineSearch) {
      const q = onlineSearch.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customerName?.toLowerCase().includes(q);
      const matchNote = o.specialInstructions?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchNote) return false;
    }
    return true;
  });

  const readyOnlineCount = onlineOrders.filter((o) => o.status === 'READY').length;
  const preparingOnlineCount = onlineOrders.filter((o) => o.status === 'PREPARING' || o.status === 'PENDING').length;

  // Active Order Financials
  const orderSubtotal = selectedOrder?.subtotal || 0;
  let calculatedDiscount = 0;
  if (discountType === 'PERCENT') {
    calculatedDiscount = +(orderSubtotal * (discountValue / 100)).toFixed(2);
  } else if (discountType === 'FIXED') {
    calculatedDiscount = Math.min(discountValue, orderSubtotal);
  }

  const taxableAmount = Math.max(0, orderSubtotal - calculatedDiscount);
  const taxRate = 5.0; // 5% GST
  const cgstAmount = +(taxableAmount * 0.025).toFixed(2);
  const sgstAmount = +(taxableAmount * 0.025).toFixed(2);
  const calculatedTax = +(cgstAmount + sgstAmount).toFixed(2);
  const grandTotal = +(taxableAmount + calculatedTax).toFixed(2);

  // Cross-Check & Generate Bill
  const handleCrossCheckAndPrint = async () => {
    if (!selectedOrder) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          discountType,
          discountValue,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to settle bill');
        setIsProcessing(false);
        return;
      }

      setGeneratedBill(data.bill);
      setShowReceiptModal(true);
      fetchBillingData(false);
    } catch (e: any) {
      alert(e.message || 'Error settling bill');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger print
  const handlePrintReceipt = () => {
    window.print();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          <span className="font-bold text-sm">Authenticating Billing Workstation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Super Admin Top Switcher (Visible to Admin Only) */}
      <AdminRoleSwitcher />

      {/* Main Workstation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 leading-tight">
                  POS &amp; Billing Workstation
                </h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Cashier Active
                </span>
                {readyOnlineCount > 0 && (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold animate-pulse flex items-center gap-1 shadow-xs">
                    <Bell className="w-3 h-3" />
                    <span>{readyOnlineCount} Food Ready For Rider!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Manage Table Orders, Place Zomato / Swiggy Delivery Orders &amp; Print Invoices
              </p>
            </div>
          </div>

          {/* Actions & Metrics */}
          <div className="flex items-center gap-3">
            {/* New Online Order Button */}
            <button
              onClick={handleOpenNewOnlineModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Place Online Order (Zomato / Swiggy)</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500">Logged In:</span>
              <strong className="text-slate-900">{currentUser?.name || 'Billing Staff'}</strong>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                {currentUser?.role}
              </span>
            </div>

            <button
              onClick={() => fetchBillingData()}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Sign out of Billing workstation"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Billing Workstation Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================
            LEFT COLUMN: ORDER SELECTOR (TABLES VS ONLINE) (lg:col-span-7)
            ========================================================= */}
        <section className="lg:col-span-7 space-y-4">
          {/* Channel Tabs: Dine-In Tables vs Online Delivery */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
            <button
              onClick={() => {
                setViewChannel('TABLES');
                if (selectedOrder && !selectedTable) setSelectedOrder(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                viewChannel === 'TABLES'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Dine-In Tables ({tables.length})</span>
            </button>

            <button
              onClick={() => {
                setViewChannel('ONLINE');
                if (selectedTable) setSelectedTable(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                viewChannel === 'ONLINE'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Online Orders (Zomato / Swiggy)</span>
              {onlineOrders.length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    viewChannel === 'ONLINE'
                      ? 'bg-white text-orange-600'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {onlineOrders.length}
                </span>
              )}
              {readyOnlineCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute right-3" />
              )}
            </button>
          </div>

          {/* =========================================================
              VIEW 1: DINE-IN TABLES GRID
              ========================================================= */}
          {viewChannel === 'TABLES' && (
            <div className="space-y-4">
              {/* Filter Controls Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setTableFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      tableFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Tables ({tables.length})
                  </button>
                  <button
                    onClick={() => setTableFilter('ACTIVE')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      tableFilter === 'ACTIVE'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>With Active Orders ({activeOrders.filter((o) => o.tableId).length})</span>
                  </button>
                  <button
                    onClick={() => setTableFilter('VACANT')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      tableFilter === 'VACANT'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Vacant ({tables.length - activeOrders.filter((o) => o.tableId).length})
                  </button>
                </div>

                {/* Table Search */}
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search Table No (e.g. T-01)..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Tables Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredTables.map((table) => {
                  const activeOrd = activeOrders.find((o) => o.tableId === table.id);
                  const isSelected = selectedTable?.id === table.id;

                  return (
                    <div
                      key={table.id}
                      onClick={() => handleSelectTable(table)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 shadow-md'
                          : activeOrd
                          ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-slate-900">
                            {table.tableNumber}
                          </span>
                          {activeOrd ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                              Active Bill
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {table.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {table.floorZone} &bull; {table.capacity} Seats
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {activeOrd ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-mono font-bold text-amber-700">
                                {activeOrd.orderNumber}
                              </span>
                              <span className="font-bold text-slate-900">
                                {formatCurrency(activeOrd.totalAmount)}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">
                              {activeOrd.items?.length || 0} items &bull; {activeOrd.customerName || 'Dine-In'}
                            </p>
                            <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 pt-0.5">
                              <span>👉 Click to view bill</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            No active order
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTables.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  No tables found matching your search.
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              VIEW 2: ONLINE PLATFORM ORDERS (ZOMATO / SWIGGY / DIRECT)
              ========================================================= */}
          {viewChannel === 'ONLINE' && (
            <div className="space-y-4">
              {/* Online Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setOnlineFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      onlineFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Online ({onlineOrders.length})
                  </button>
                  <button
                    onClick={() => setOnlineFilter('READY')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      onlineFilter === 'READY'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Food Ready For Rider ({readyOnlineCount})</span>
                  </button>
                  <button
                    onClick={() => setOnlineFilter('PREPARING')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      onlineFilter === 'PREPARING'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>In Kitchen ({preparingOnlineCount})</span>
                  </button>
                  <button
                    onClick={() => setOnlineFilter('ZOMATO')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      onlineFilter === 'ZOMATO'
                        ? 'bg-[#E23744] text-white shadow-xs'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Zomato
                  </button>
                  <button
                    onClick={() => setOnlineFilter('SWIGGY')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      onlineFilter === 'SWIGGY'
                        ? 'bg-[#FC8019] text-white shadow-xs'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    Swiggy
                  </button>
                </div>

                {/* Online Order Search */}
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={onlineSearch}
                    onChange={(e) => setOnlineSearch(e.target.value)}
                    placeholder="Search Order #, customer..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Online Orders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredOnlineOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id && !selectedTable;
                  const isZomato = order.orderType === 'ZOMATO';
                  const isSwiggy = order.orderType === 'SWIGGY';
                  const isReady = order.status === 'READY';
                  const isPreparing = order.status === 'PREPARING';

                  return (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOnlineOrder(order)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20 shadow-md'
                          : isReady
                          ? 'border-emerald-400 bg-emerald-50/50 hover:border-emerald-500 shadow-sm'
                          : isPreparing
                          ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {isZomato ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#E23744] text-white font-black text-[10px] flex items-center gap-1 shadow-xs">
                                <Bike className="w-3 h-3" />
                                <span>ZOMATO</span>
                              </span>
                            ) : isSwiggy ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FC8019] text-white font-black text-[10px] flex items-center gap-1 shadow-xs">
                                <Bike className="w-3 h-3" />
                                <span>SWIGGY</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center gap-1 shadow-xs">
                                <ShoppingBag className="w-3 h-3" />
                                <span>ONLINE</span>
                              </span>
                            )}
                            <span className="font-mono font-bold text-xs text-slate-800">
                              {order.orderNumber}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isReady
                                ? 'bg-emerald-500 text-white animate-pulse'
                                : isPreparing
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isReady ? '🔔 Food Ready For Rider' : isPreparing ? '🔥 In Kitchen' : '⚡ Dispatched'}
                          </span>
                        </div>

                        <div className="mt-2.5">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {order.customerName || 'Online Diner'}
                          </h4>
                          {order.customerPhone && (
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{order.customerPhone}</span>
                            </p>
                          )}
                        </div>

                        {order.specialInstructions && (
                          <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 line-clamp-2">
                            {order.specialInstructions}
                          </p>
                        )}
                      </div>

                      {/* Bottom Info & Total */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          {order.items?.length || 0} items &bull;{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold">
                            {formatCurrency(order.totalAmount)}
                          </strong>
                          <span className="text-[10px] text-orange-600 font-bold">
                            View &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredOnlineOrders.length === 0 && (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                    <Bike className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No Online Orders In Queue</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click the &ldquo;+ Place Online Order&rdquo; button above to simulate or record incoming delivery orders from Zomato, Swiggy, or direct orders.
                  </p>
                  <button
                    onClick={handleOpenNewOnlineModal}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                  >
                    + Place Zomato / Swiggy Order Now
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================================
            RIGHT COLUMN: OVERALL BILL & CROSS-CHECK PANEL (lg:col-span-5)
            ========================================================= */}
        <section className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 sticky top-24">
            {selectedOrder ? (
              /* Selected Order Bill View (Table or Online) */
              <div className="space-y-5">
                {/* Bill Card Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold ${
                          selectedOrder.orderType === 'ZOMATO'
                            ? 'bg-[#E23744]'
                            : selectedOrder.orderType === 'SWIGGY'
                            ? 'bg-[#FC8019]'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {selectedOrder.orderType === 'ZOMATO' || selectedOrder.orderType === 'SWIGGY' ? (
                          <Bike className="w-5 h-5" />
                        ) : (
                          <Receipt className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h2 className="font-black text-base text-slate-900">
                          {selectedTable
                            ? `Table ${selectedTable.tableNumber} Overall Bill`
                            : selectedOrder.orderType === 'ZOMATO'
                            ? 'Zomato Delivery Bill'
                            : selectedOrder.orderType === 'SWIGGY'
                            ? 'Swiggy Express Bill'
                            : 'Online Delivery Bill'}
                        </h2>
                        <p className="text-[11px] text-slate-400">
                          Order {selectedOrder.orderNumber} &bull;{' '}
                          {selectedTable ? selectedTable.floorZone : selectedOrder.orderType}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        selectedOrder.status === 'READY'
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : selectedOrder.status === 'PREPARING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* KITCHEN READY NOTIFICATION BADGE */}
                  {selectedOrder.status === 'READY' && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-fade-in shadow-xs">
                      <Bell className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 animate-bounce" />
                      <div>
                        <strong className="block font-black text-emerald-800 uppercase tracking-wide text-[11px]">
                          🔔 Dish Prepared By Chef &bull; Ready For Rider Handover!
                        </strong>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          The kitchen has completed cooking and packing this order. Cross-check items and hand over to delivery partner.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Customer / Table Info Box */}
                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer:</span>
                      <strong className="text-slate-900">
                        {selectedOrder.customerName || (selectedTable ? 'Dine-In Customer' : 'Online Diner')}
                      </strong>
                    </div>
                    {selectedOrder.customerPhone && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contact:</span>
                        <span>{selectedOrder.customerPhone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time Placed:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.specialInstructions && (
                      <div className="pt-1.5 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
                        {selectedOrder.specialInstructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Itemized Cross-Check List */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Cross-Check Ordered Dishes ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-sm border ${
                              item.menuItem?.isVeg
                                ? 'border-emerald-600 bg-emerald-500'
                                : 'border-rose-600 bg-rose-500'
                            }`}
                            title={item.menuItem?.isVeg ? 'Veg' : 'Non-Veg'}
                          />
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">
                              {item.menuItem?.name || 'Dish Item'}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {item.quantity} &times; {formatCurrency(item.unitPrice)}
                            </span>
                            {item.specialInstructions && (
                              <p className="text-[10px] text-amber-600 italic">
                                Note: {item.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold">{formatCurrency(orderSubtotal)}</span>
                  </div>

                  {/* Discount Control */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-600 font-medium">Apply Discount</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDiscountType('NONE');
                            setDiscountValue(0);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            discountType === 'NONE'
                              ? 'bg-slate-800 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          None
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDiscountType('PERCENT');
                            setDiscountValue(5);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            discountType === 'PERCENT' && discountValue === 5
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          5%
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDiscountType('PERCENT');
                            setDiscountValue(10);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            discountType === 'PERCENT' && discountValue === 10
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          10%
                        </button>
                      </div>
                    </div>
                  </div>

                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({discountType === 'PERCENT' ? `${discountValue}%` : 'Flat'})</span>
                      <span>- {formatCurrency(calculatedDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/60">
                    <span>GST (5% SGST + CGST)</span>
                    <span className="font-semibold">{formatCurrency(calculatedTax)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline text-slate-900">
                    <span className="text-sm font-extrabold uppercase">Overall Bill Total</span>
                    <span className="text-xl font-black text-emerald-700">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Payment Collection Method
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'CASH', label: 'Cash', icon: DollarSign },
                      { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                      { id: 'CARD', label: 'Card POS', icon: CreditCard },
                      { id: 'SPLIT', label: 'Online', icon: Receipt },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = paymentMethod === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setPaymentMethod(mode.id as any)}
                          className={`py-2 px-1.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Settle Bill & Print Invoice Button */}
                <button
                  type="button"
                  onClick={handleCrossCheckAndPrint}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                    selectedOrder.status === 'READY'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                      : 'bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white shadow-slate-900/20'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Settlement...</span>
                    </>
                  ) : selectedOrder.status === 'READY' ? (
                    <>
                      <Bike className="w-4 h-4 text-amber-300" />
                      <span>🛵 Hand Over to Rider &amp; Settle Bill ({formatCurrency(grandTotal)})</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>Cross-Check &amp; Print Bill ({formatCurrency(grandTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            ) : selectedTable ? (
              /* Selected Table has NO order */
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Table {selectedTable.tableNumber} is Vacant
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  There are no active orders placed on this table right now. Orders submitted from the Floor Waiter view will appear here immediately.
                </p>
              </div>
            ) : (
              /* Empty Selection State */
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {viewChannel === 'TABLES' ? 'Select A Dining Table' : 'Select An Online Order'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {viewChannel === 'TABLES'
                    ? 'Click any table number on the left to inspect its active ordered dishes, verify totals and print the receipt.'
                    : 'Click any Zomato or Swiggy delivery ticket on the left to check kitchen cooking status and print the packing slip.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =========================================================
          NEW ONLINE ORDER MODAL (ZOMATO / SWIGGY / DIRECT)
          ========================================================= */}
      {showNewOnlineModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative animate-fade-in text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 text-white flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Place Online Delivery Order
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatches directly to Chef Kitchen Display (KDS) with live status updates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewOnlineModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {onlineFeedback && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {onlineFeedback}
              </div>
            )}

            <form onSubmit={handleSubmitOnlineOrder} className="space-y-4 text-xs">
              {/* Platform Selector Tabs */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider text-[10px]">
                  Select Delivery Platform *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPlatform('ZOMATO')}
                    className={`py-2.5 px-2 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${
                      onlinePlatform === 'ZOMATO'
                        ? 'bg-[#E23744] text-white border-[#E23744] shadow-md shadow-red-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">🔴 Zomato</span>
                    <span className="text-[10px] opacity-80">Food Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPlatform('SWIGGY')}
                    className={`py-2.5 px-2 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${
                      onlinePlatform === 'SWIGGY'
                        ? 'bg-[#FC8019] text-white border-[#FC8019] shadow-md shadow-orange-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">🟠 Swiggy</span>
                    <span className="text-[10px] opacity-80">Express Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPlatform('ONLINE')}
                    className={`py-2.5 px-2 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${
                      onlinePlatform === 'ONLINE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">🌐 Direct Web</span>
                    <span className="text-[10px] opacity-80">Direct Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPlatform('MAGICPIN')}
                    className={`py-2.5 px-2 rounded-xl font-bold border transition-all flex flex-col items-center gap-1 ${
                      onlinePlatform === 'MAGICPIN'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs">🟣 Magicpin</span>
                    <span className="text-[10px] opacity-80">Aggregator</span>
                  </button>
                </div>
              </div>

              {/* Order Reference, Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Channel / Order Ref # *
                  </label>
                  <input
                    type="text"
                    required
                    value={channelRef}
                    onChange={(e) => setChannelRef(e.target.value)}
                    placeholder="e.g. ZOM-4821"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Delivery Address & Rider Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Delivery Address / Drop Landmark
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Flat 3B, Sunshine Apts, Main Road"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assigned Rider Name &amp; Partner
                  </label>
                  <input
                    type="text"
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar (Zomato Partner)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Special Cooking Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Special Instructions for Chef (Packaging / Spice Level)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra raita, pack salan separately, medium spicy..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Dish Selection Catalog */}
              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                    Select Dishes from Menu ({menuItems.length} Available)
                  </label>
                  <div className="relative w-48">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={modalDishSearch}
                      onChange={(e) => setModalDishSearch(e.target.value)}
                      placeholder="Search dish..."
                      className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setModalCategory('ALL')}
                    className={`px-2.5 py-1 rounded-lg shrink-0 font-bold ${
                      modalCategory === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setModalCategory(c.id)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 font-bold ${
                        modalCategory === c.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Dishes Grid */}
                <div className="max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {menuItems
                    .filter((dish) => {
                      if (modalCategory !== 'ALL' && dish.categoryId !== modalCategory) return false;
                      if (
                        modalDishSearch &&
                        !dish.name.toLowerCase().includes(modalDishSearch.toLowerCase())
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((dish) => {
                      const inCart = onlineCart.find((i) => i.menuItemId === dish.id);
                      return (
                        <div
                          key={dish.id}
                          className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-2 h-2 rounded-xs border ${
                                  dish.isVeg
                                    ? 'border-emerald-600 bg-emerald-500'
                                    : 'border-rose-600 bg-rose-500'
                                }`}
                              />
                              <p className="font-bold text-slate-800 text-[11px] truncate">
                                {dish.name}
                              </p>
                            </div>
                            <span className="font-extrabold text-slate-900 text-[11px]">
                              {formatCurrency(dish.price)}
                            </span>
                          </div>

                          <div className="mt-1 pt-1 border-t border-slate-100">
                            {inCart ? (
                              <div className="flex items-center justify-between bg-orange-50 rounded px-1.5 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCartQty(dish.id, -1)}
                                  className="text-orange-700 font-black"
                                >
                                  -
                                </button>
                                <span className="font-bold text-orange-900 text-xs">
                                  {inCart.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCartQty(dish.id, 1)}
                                  className="text-orange-700 font-black"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(dish)}
                                className="w-full py-0.5 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 font-bold rounded text-[10px] transition-colors"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Cart Summary */}
              {onlineCart.length > 0 && (
                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Order Cart ({onlineCart.reduce((sum, i) => sum + i.quantity, 0)} Items)</span>
                    <span className="font-black text-amber-900">
                      Subtotal:{' '}
                      {formatCurrency(
                        onlineCart.reduce((sum, i) => sum + i.price * i.quantity, 0)
                      )}
                    </span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto">
                    {onlineCart.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between bg-white p-1.5 rounded-lg border border-amber-100 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.menuItemId)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-800">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">
                            {item.quantity} &times; {formatCurrency(item.price)} ={' '}
                            <strong>{formatCurrency(item.price * item.quantity)}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSubmittingOnline || onlineCart.length === 0}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingOnline ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching to Kitchen KDS...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>⚡ Dispatch to Chef Kitchen Display (KDS)</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewOnlineModal(false)}
                  className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PRINTABLE THERMAL INVOICE MODAL
          ========================================================= */}
      {showReceiptModal && generatedBill && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-fade-in text-slate-900">
            {/* Close Button */}
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Printable Thermal Receipt Container */}
            <div id="printable-receipt" className="font-mono text-xs space-y-3 p-3 border border-dashed border-slate-300 rounded-2xl bg-amber-50/20">
              {/* Header */}
              <div className="text-center space-y-1">
                <p className="font-black text-sm tracking-wider uppercase">
                  {settings?.restaurantName || 'JOHNSON FOOD COURT (JFC)'}
                </p>
                <p className="text-[10px] text-slate-600">
                  {settings?.address || 'Sherwood, Arni Road, Pennathur, Vellore - 632011'}
                </p>
                <p className="text-[10px] text-slate-600">
                  Phone: {settings?.phone || '+91 99652 78872'}
                </p>
                <p className="text-[10px] font-bold text-slate-800">
                  GSTIN: {settings?.taxNumber || '33AAACJ1234F1Z5'}
                </p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <strong className="font-bold">{generatedBill.invoiceNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Channel / Source:</span>
                  <strong className="font-bold">
                    {generatedBill.order?.table
                      ? `Table ${generatedBill.order.table.tableNumber}`
                      : `${generatedBill.order?.orderType || 'ONLINE'} DELIVERY`}
                  </strong>
                </div>
                {generatedBill.order?.customerName && (
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>{generatedBill.order.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(generatedBill.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{currentUser?.name || 'Staff Cashier'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-t border-dashed border-slate-300 pt-2">
                <div className="flex justify-between font-bold text-[10px] border-b border-dashed border-slate-300 pb-1 mb-1">
                  <span className="w-1/2">ITEM</span>
                  <span className="w-1/4 text-center">QTY</span>
                  <span className="w-1/4 text-right">AMT</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  {generatedBill.order?.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="w-1/2 truncate">{item.menuItem?.name || 'Dish'}</span>
                      <span className="w-1/4 text-center">{item.quantity}</span>
                      <span className="w-1/4 text-right">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(generatedBill.subtotal)}</span>
                </div>
                {generatedBill.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>- {formatCurrency(generatedBill.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>{formatCurrency(generatedBill.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-xs font-black border-t border-dashed border-slate-300 pt-1">
                  <span>TOTAL PAID:</span>
                  <span>{formatCurrency(generatedBill.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                  <span>Mode:</span>
                  <span className="uppercase font-bold">{paymentMethod}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="border-t border-dashed border-slate-300 pt-2 text-center text-[10px] space-y-0.5">
                <p className="font-bold">THANK YOU FOR DINING WITH US!</p>
                <p className="text-slate-500">Fast &amp; Fresh Food Delivery Experience.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill / Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
