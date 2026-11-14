'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  Bell,
  UtensilsCrossed,
  Layers,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Store,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ChefPanelPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000); // 5s kitchen live poll
    return () => clearInterval(interval);
  }, [statusFilter]);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const url = statusFilter === 'ALL' ? '/api/orders' : `/api/orders?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          changedBy: 'Head Chef Marco',
          notes: `Kitchen updated status to ${newStatus}`,
        }),
      });

      if (res.ok) {
        fetchOrders(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Status counts
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const acceptedCount = orders.filter((o) => o.status === 'ACCEPTED').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white tracking-wide">
                Kitchen Display System (KDS)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Chef Marco Pierre
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Auto-sync active &bull; Last refreshed {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Portal Links & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-3">
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold text-xs flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
            <Link
              href="/pos"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>POS Billing</span>
            </Link>
            <Link
              href="/"
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-6">
        {/* Status Pipeline Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">1. New / Pending</span>
              <span className="text-xl font-black text-white">{pendingCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'ACCEPTED'
                ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">2. Accepted</span>
              <span className="text-xl font-black text-white">{acceptedCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              👨‍🍳
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('PREPARING')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'PREPARING'
                ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">3. Cooking</span>
              <span className="text-xl font-black text-white">{preparingCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
              🔥
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('READY')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'READY'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">4. Ready to Serve</span>
              <span className="text-xl font-black text-white">{readyCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              🛎️
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'ALL'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">All Tickets</span>
              <span className="text-xl font-black text-white">{orders.length}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              📋
            </div>
          </button>
        </div>

        {/* Orders Ticket Board */}
        <div>
          {loading && orders.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              Connecting to kitchen database...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-base text-white">All Kitchen Tickets Cleared!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No orders are currently awaiting preparation under filter "{statusFilter}". New orders from the customer website or POS billing counter will chime in automatically.
              </p>
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold inline-block"
                >
                  Place Test Order On Website
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders.map((order) => {
                const isPending = order.status === 'PENDING';
                const isAccepted = order.status === 'ACCEPTED';
                const isPreparing = order.status === 'PREPARING';
                const isReady = order.status === 'READY';
                const isCompleted = order.status === 'COMPLETED';

                const statusColor = isPending
                  ? 'border-amber-500/60 bg-amber-500/5'
                  : isAccepted
                  ? 'border-blue-500/60 bg-blue-500/5'
                  : isPreparing
                  ? 'border-orange-500/60 bg-orange-500/5'
                  : isReady
                  ? 'border-emerald-500/60 bg-emerald-500/5'
                  : 'border-slate-800 bg-slate-900/60 opacity-60';

                return (
                  <div
                    key={order.id}
                    className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 shadow-lg ${statusColor}`}
                  >
                    {/* Ticket Header */}
                    <div className="space-y-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-white">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {order.orderType}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            isPending
                              ? 'bg-amber-500 text-slate-950 animate-pulse'
                              : isAccepted
                              ? 'bg-blue-600 text-white'
                              : isPreparing
                              ? 'bg-orange-600 text-white'
                              : isReady
                              ? 'bg-emerald-500 text-slate-950 font-extrabold'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-black flex items-center justify-center text-xs">
                            {order.table?.tableNumber || 'Takeaway'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">
                              {order.table ? `Table ${order.table.tableNumber}` : 'Takeaway Order'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {order.customerName || 'Walk-in Diner'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {order.specialInstructions && (
                        <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs font-semibold">
                          <span className="block text-[10px] uppercase font-bold text-orange-400">
                            Kitchen Note:
                          </span>
                          {order.specialInstructions}
                        </div>
                      )}
                    </div>

                    {/* Ordered Items List */}
                    <div className="py-4 space-y-2.5 flex-1">
                      {order.items?.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700">
                              {item.quantity}x
                            </span>
                            <div>
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <span>{item.menuItem?.name}</span>
                                <span className="text-[10px]">{item.menuItem?.isVeg ? '🟢' : '🔴'}</span>
                              </p>
                              {item.specialInstructions && (
                                <p className="text-[10px] text-amber-300 italic">
                                  &ldquo;{item.specialInstructions}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Step Buttons */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Kitchen Order</span>
                        </button>
                      )}

                      {isAccepted && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-orange-500/20"
                        >
                          <Flame className="w-4 h-4" />
                          <span>Start Cooking / Preparing</span>
                        </button>
                      )}

                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                        >
                          <Bell className="w-4 h-4" />
                          <span>Mark Food Ready (Chime Staff)</span>
                        </button>
                      )}

                      {isReady && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          disabled={updatingId === order.id}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Dispatched to Table &bull; Complete</span>
                        </button>
                      )}

                      {isCompleted && (
                        <div className="text-center py-1 text-slate-500 text-[11px] font-bold">
                          ✓ Ticket Delivered & Settled
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
