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
} from 'lucide-react';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BillingWorkstationPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data
  const [tables, setTables] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter / Selection
  const [tableFilter, setTableFilter] = useState<'ALL' | 'ACTIVE' | 'VACANT'>('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Billing calculation
  const [discountType, setDiscountType] = useState<'NONE' | 'PERCENT' | 'FIXED'>('NONE');
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'SPLIT'>('CASH');
  const [isProcessing, setIsProcessing] = useState(false);

  // Thermal Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [generatedBill, setGeneratedBill] = useState<any>(null);

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
        // Only SUPER_ADMIN and BILLING_STAFF can access Billing View
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'BILLING_STAFF') {
          if (user.role === 'CHEF') router.push('/chef');
          else if (user.role === 'WAITER' || user.role === 'CUSTOMER') router.push('/waiter');
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

  // 2. Fetch tables and orders
  useEffect(() => {
    fetchBillingData();
    const interval = setInterval(() => {
      fetchBillingData(false);
    }, 5000); // Poll every 5s for live table & order updates
    return () => clearInterval(interval);
  }, []);

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

      // Keep selected table & order in sync
      if (selectedTable) {
        const currentSelected = allTables.find((t: any) => t.id === selectedTable.id);
        if (currentSelected) {
          setSelectedTable(currentSelected);
          const activeOrd = nonCompletedOrders.find((o: any) => o.tableId === currentSelected.id);
          setSelectedOrder(activeOrd || null);
        }
      }
    } catch (e) {
      console.error('Error fetching billing data:', e);
    } finally {
      if (showLoading) setLoading(false);
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

  // Calculations for selected order
  const orderSubtotal = selectedOrder ? selectedOrder.subtotal : 0;
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

  // Filter tables
  const filteredTables = tables.filter((t) => {
    const hasOrder = activeOrders.some((o) => o.tableId === t.id);
    if (tableFilter === 'ACTIVE' && !hasOrder) return false;
    if (tableFilter === 'VACANT' && hasOrder) return false;
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        t.tableNumber.toLowerCase().includes(q) ||
        t.floorZone.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
                  POS & Billing Workstation
                </h1>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Cashier Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Click any table number to inspect table orders, cross-check overall bill & print invoices
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
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
          </div>
        </div>
      </header>

      {/* Main Billing Workstation Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================
            LEFT COLUMN: TABLE ORDERS SELECTOR (lg:col-span-7)
            ========================================================= */}
        <section className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
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
                <span>With Active Orders ({activeOrders.length})</span>
              </button>
              <button
                onClick={() => setTableFilter('VACANT')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  tableFilter === 'VACANT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Vacant / Free ({tables.length - activeOrders.length})
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
                  {/* Top: Table No & Zone */}
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

                  {/* Bottom: Active Order Info or Empty */}
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
        </section>

        {/* =========================================================
            RIGHT COLUMN: OVERALL BILL & CROSS-CHECK PANEL (lg:col-span-5)
            ========================================================= */}
        <section className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 sticky top-24">
            {selectedTable ? (
              selectedOrder ? (
                /* Active Order Bill View */
                <div className="space-y-5">
                  {/* Bill Card Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="font-black text-base text-slate-900">
                            Table {selectedTable.tableNumber} Overall Bill
                          </h2>
                          <p className="text-[11px] text-slate-400">
                            Order {selectedOrder.orderNumber} &bull; {selectedTable.floorZone}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {selectedOrder.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                      <span>Guest: <strong>{selectedOrder.customerName || 'Dine-In Customer'}</strong></span>
                      <span>Time: <strong>{formatDate(selectedOrder.createdAt)}</strong></span>
                    </div>
                  </div>

                  {/* Itemized Cross-Check List */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Cross-Check Ordered Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 text-xs">
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
                      {calculatedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Discount Applied</span>
                          <span>- {formatCurrency(calculatedDiscount)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-slate-600 pt-1">
                      <span>CGST (2.5%) + SGST (2.5%)</span>
                      <span className="font-semibold">{formatCurrency(calculatedTax)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-sm">
                      <span className="font-black text-slate-900">Grand Total Payable</span>
                      <span className="font-black text-emerald-600 text-base">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Select Payment Mode
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                      {(['CASH', 'UPI', 'CARD', 'SPLIT'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPaymentMethod(m)}
                          className={`py-2 rounded-xl border text-center transition-all ${
                            paymentMethod === m
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {m === 'CASH' && '💵 Cash'}
                          {m === 'UPI' && '📱 UPI'}
                          {m === 'CARD' && '💳 Card'}
                          {m === 'SPLIT' && '🔀 Split'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cross-Check & Print Button */}
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCrossCheckAndPrint}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Processing Bill...' : 'Cross-Check & Print Final Bill'}
                    </span>
                  </button>
                </div>
              ) : (
                /* Selected Table Has No Active Order */
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Table {selectedTable.tableNumber} is {selectedTable.status}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    There are no running food orders on this table. Place a new table order via the Waiter View to start a new dining ticket.
                  </p>
                  <Link
                    href="/waiter"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    <span>Open Waiter View</span>
                  </Link>
                </div>
              )
            ) : (
              /* No Table Selected */
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-800 text-base">
                  No Table Selected
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Select any table number on the left table board to inspect its items, cross-check the overall bill, and print the thermal receipt.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

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
                  {settings?.restaurantName || 'ROYAL SPICE GRAND'}
                </p>
                <p className="text-[10px] text-slate-600">
                  {settings?.address || '42 Gourmet Avenue, Culinary District'}
                </p>
                <p className="text-[10px] text-slate-600">
                  Phone: {settings?.phone || '+91 98765 43210'}
                </p>
                <p className="text-[10px] font-bold text-slate-800">
                  GSTIN: {settings?.taxNumber || '33AABCT9988D1Z9'}
                </p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <strong className="font-bold">{generatedBill.invoiceNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Table:</span>
                  <strong className="font-bold">
                    Table {selectedTable?.tableNumber || generatedBill.order?.table?.tableNumber || 'N/A'}
                  </strong>
                </div>
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
                <p className="text-slate-500">Please visit again soon.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
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
