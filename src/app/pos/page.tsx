'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  UtensilsCrossed,
  ShieldCheck,
  ChefHat,
  Store,
  RefreshCw,
  QrCode,
  X,
  User,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PosBillingPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // POS State
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [menuSearch, setMenuSearch] = useState('');
  const [posCart, setPosCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Diner');
  const [customerPhone, setCustomerPhone] = useState('');

  // Discount & Payment
  const [discountType, setDiscountType] = useState<'NONE' | 'PERCENT' | 'FIXED'>('NONE');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'SPLIT'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  // Thermal Receipt Modal
  const [completedBill, setCompletedBill] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    fetchPosData();
  }, []);

  const fetchPosData = async () => {
    setLoading(true);
    try {
      const [tRes, cRes, mRes, oRes, sRes] = await Promise.all([
        fetch('/api/admin/tables'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/menu'),
        fetch('/api/orders?status=PENDING'),
        fetch('/api/admin/settings'),
      ]);

      const tData = await tRes.json();
      const cData = await cRes.json();
      const mData = await mRes.json();
      const oData = await oRes.json();
      const sData = await sRes.json();

      setTables(tData.tables || []);
      setCategories(cData.categories || []);
      setMenuItems(mData.items || []);
      setActiveOrders(oData.orders || []);
      setSettings(sData.settings || null);

      if (tData.tables?.length > 0 && !selectedTable) {
        setSelectedTable(tData.tables[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Add Item to POS Cart
  const addToCart = (item: any) => {
    setPosCart((prev) => {
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
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setPosCart((prev) =>
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

  const removeItem = (itemId: string) => {
    setPosCart((prev) => prev.filter((i) => i.menuItemId !== itemId));
  };

  // Subtotal & Calculations
  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (discountType === 'PERCENT') {
    discountAmount = +(subtotal * (discountValue / 100)).toFixed(2);
  } else if (discountType === 'FIXED') {
    discountAmount = Math.min(discountValue, subtotal);
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = +(taxableAmount * 0.05).toFixed(2);
  const grandTotal = +(taxableAmount + taxAmount).toFixed(2);

  // Checkout and Generate Bill
  const handleCheckout = async () => {
    if (posCart.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Create Order First
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable?.id || null,
          customerName: customerName || 'Walk-in Guest',
          customerPhone: customerPhone || null,
          orderType: 'DINE_IN',
          items: posCart.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to place order');

      // 2. Checkout & Settle Bill
      const checkoutRes = await fetch('/api/pos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order.id,
          discountType,
          discountValue,
          paymentMethod,
          transactionRef: `POS-${Date.now().toString().slice(-6)}`,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || 'Payment settlement failed');

      // 3. Show Printable Thermal Receipt
      setCompletedBill(checkoutData.bill);
      setShowReceiptModal(true);

      // Reset POS Cart
      setPosCart([]);
      fetchPosData();
    } catch (e: any) {
      alert(e.message || 'Error processing bill');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter menu items
  const filteredMenuItems = menuItems.filter((m) => {
    const matchesCat = selectedCategory === 'ALL' || m.categoryId === selectedCategory;
    const matchesSearch =
      !menuSearch ||
      m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(menuSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-slate-900 tracking-wide">
                POS Billing Terminal
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Staff Counter 01
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cashier: Sarah Connor &bull; GSTIN: {settings?.taxNumber || 'GSTIN33AABCT9988D1Z9'}
            </p>
          </div>
        </div>

        {/* Portal Switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchPosData()}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
          <Link
            href="/chef"
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs flex items-center gap-1"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Chef</span>
          </Link>
          <Link
            href="/"
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>
        </div>
      </header>

      {/* POS Workspace Layout: 3 Columns */}
      <main className="max-w-[1700px] mx-auto px-4 py-4 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Col 1: Dining Floor Tables (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 h-[calc(100vh-100px)] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Dining Floor Plan
              </h3>
              <p className="text-[10px] text-slate-400">Select active table for order</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {tables.length} Tables
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 overflow-y-auto flex-1 pr-1">
            {tables.map((t) => {
              const isSelected = selectedTable?.id === t.id;
              const isOccupied = t.status === 'OCCUPIED';

              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTable(t)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : isOccupied
                      ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-black text-slate-900">
                      {t.tableNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isOccupied ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block truncate font-medium">
                      {t.floorZone}
                    </span>
                    <span className="text-[10px] text-slate-400">Cap: {t.capacity} Guests</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Table Summary */}
          {selectedTable && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Active Selection
              </span>
              <p className="font-black text-slate-900">
                Table {selectedTable.tableNumber} &bull; {selectedTable.floorZone}
              </p>
            </div>
          )}
        </div>

        {/* Col 2: Fast Touch Menu Catalog (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4 h-[calc(100vh-100px)] flex flex-col">
          {/* Search & Category Pills */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search food by name, category, or code..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              {menuSearch && (
                <button
                  onClick={() => setMenuSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category horizontal scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Touch Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
            {filteredMenuItems.map((dish) => (
              <button
                key={dish.id}
                onClick={() => addToCart(dish)}
                className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between group h-36"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px]">{dish.isVeg ? '🟢' : '🔴'}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[90px]">
                      {dish.category?.name}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 group-hover:text-emerald-600">
                    {dish.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-xs text-slate-900">
                    {formatCurrency(dish.price)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center font-bold text-xs transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Col 3: POS Billing Register & Cart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-[calc(100vh-100px)] flex flex-col justify-between">
          <div>
            {/* Header: Register info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-sm text-slate-900">Billing Cart Register</h3>
                <p className="text-[10px] text-slate-400">
                  {selectedTable ? `Table: ${selectedTable.tableNumber}` : 'No Table Selected'}
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {posCart.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            {/* Guest Input */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Guest Name"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {posCart.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Cart is empty. Tap menu dishes to add.
                </div>
              ) : (
                posCart.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px]">{item.isVeg ? '🟢' : '🔴'}</span>
                      <span className="font-bold text-slate-900 truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-800">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, -1)}
                          className="p-0.5 text-slate-600 hover:text-red-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs w-3 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, 1)}
                          className="p-0.5 text-slate-600 hover:text-emerald-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Calculations & Payment Modes */}
          <div className="pt-2 border-t border-slate-200 space-y-3 text-xs">
            {/* Discount selector */}
            <div className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-500 font-medium">Discount</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDiscountType(discountType === 'PERCENT' ? 'NONE' : 'PERCENT')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    discountType === 'PERCENT' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  10% OFF
                </button>
                {discountType === 'PERCENT' && (
                  <span className="font-bold text-orange-600">
                    -{formatCurrency(discountAmount)}
                  </span>
                )}
              </div>
            </div>

            {/* Bill Math Breakdown */}
            <div className="space-y-1 text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (CGST 2.5% + SGST 2.5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-base">
                <span>Total Payable</span>
                <span className="text-emerald-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Payment Mode
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['CASH', 'UPI', 'CARD', 'SPLIT'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      paymentMethod === m
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={posCart.length === 0 || isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Receipt className="w-4 h-4" />
              <span>{isProcessing ? 'Settling Payment...' : `Complete Bill & Print • ${formatCurrency(grandTotal)}`}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Printable Thermal Receipt Modal */}
      {showReceiptModal && completedBill && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-slate-900 animate-fade-in font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-300">
              <span className="font-sans font-bold text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Paid & Settled
              </span>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Content */}
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <h2 className="font-sans font-black text-base text-slate-900">
                {settings?.restaurantName || 'Royal Spice Grand'}
              </h2>
              <p className="text-[10px] text-slate-500">
                {settings?.address || '42 Gourmet Avenue, Metro City'}
              </p>
              <p className="text-[10px] text-slate-500">
                GSTIN: {settings?.taxNumber || 'GSTIN33AABCT9988D1Z9'} &bull; Tel: {settings?.phone || '+91 98765 43210'}
              </p>
            </div>

            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span className="font-bold">{completedBill.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{new Date(completedBill.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Table:</span>
                <span className="font-bold">
                  {completedBill.order?.table?.tableNumber || 'Walk-in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{completedBill.order?.customerName || 'Valued Guest'}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3 text-[11px]">
              <div className="flex justify-between text-slate-400 font-bold">
                <span>Item</span>
                <span>Qty x Rate</span>
                <span>Amount</span>
              </div>
              {completedBill.order?.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate max-w-[140px]">{item.menuItem?.name}</span>
                  <span>{item.quantity} x {item.unitPrice}</span>
                  <span className="font-bold">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="space-y-1 border-b border-dashed border-slate-300 pb-3 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(completedBill.subtotal)}</span>
              </div>
              {completedBill.discountAmount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(completedBill.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CGST (2.5%):</span>
                <span>{formatCurrency(completedBill.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%):</span>
                <span>{formatCurrency(completedBill.taxAmount / 2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200">
                <span>GRAND TOTAL:</span>
                <span className="text-emerald-700">{formatCurrency(completedBill.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase">
                  {completedBill.payments?.[0]?.paymentMethod || 'CASH'}
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 pt-1">
              *** THANK YOU FOR DINING WITH US ***
            </div>

            {/* Print & Close Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
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
