'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  Bell,
  UtensilsCrossed,
  LogOut,
  X,
  Bike,
  ShoppingBag,
  MapPin,
  Check,
} from 'lucide-react';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ChefPanelPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'DINE_IN' | 'ONLINE'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

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
        // Only SUPER_ADMIN and CHEF can access Chef View
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'CHEF') {
          if (user.role === 'BILLING_STAFF') router.push('/billing');
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

  // 2. Poll orders every 3s so waiter updates reflect immediately
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 3000);
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
          changedBy: currentUser?.name || 'Head Chef',
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
          <span className="font-bold text-sm">Authenticating Kitchen Display System...</span>
        </div>
      </div>
    );
  }

  // Status counts
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const acceptedCount = orders.filter((o) => o.status === 'ACCEPTED').length;
  const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = orders.filter((o) => o.status === 'READY').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans">
      {/* Super Admin Top Switcher (Visible to Admin Only) */}
      <AdminRoleSwitcher />

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
                {currentUser?.name || 'Head Chef'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live orders from floor staff &bull; Auto-sync every 3s (Last: {lastRefreshed.toLocaleTimeString()})
            </p>
          </div>
        </div>

        {/* Refresh & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* If Chef (not Admin), show Logout */}
          {currentUser?.role !== 'SUPER_ADMIN' && (
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex-1 w-full space-y-6">
        {/* Status Pipeline Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'PENDING'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">1. New Tickets</span>
              <span className="text-xl font-black text-white">{pendingCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('PREPARING')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'PREPARING'
                ? 'bg-orange-500/20 border-orange-500 text-orange-300 ring-2 ring-orange-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">2. In Cooking</span>
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
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">3. Food Ready</span>
              <span className="text-xl font-black text-white">{readyCount}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              🔔
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
              statusFilter === 'ALL'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-2 ring-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block">All Live Tickets</span>
              <span className="text-xl font-black text-white">{orders.length}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              📋
            </div>
          </button>
        </div>

        {/* Channel Switcher (All vs Dine-In vs Online Zomato/Swiggy) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider pl-1">
              Order Source:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setChannelFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  channelFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Sources ({orders.length})
              </button>
              <button
                onClick={() => setChannelFilter('DINE_IN')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  channelFilter === 'DINE_IN'
                    ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dine-In Tables ({orders.filter((o) => o.tableId).length})</span>
              </button>
              <button
                onClick={() => setChannelFilter('ONLINE')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  channelFilter === 'ONLINE'
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white font-black shadow-md shadow-red-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bike className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  Online Delivery (Zomato / Swiggy) (
                  {
                    orders.filter(
                      (o) =>
                        ['ZOMATO', 'SWIGGY', 'ONLINE', 'TAKEAWAY'].includes(o.orderType) ||
                        !o.tableId
                    ).length
                  }
                  )
                </span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <span>⚡ Kitchen Auto-Sync Active</span>
          </div>
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
                No orders are currently awaiting cooking under filter "{statusFilter}". New table orders or online Zomato/Swiggy orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders
                .filter((order) => {
                  const isOnline =
                    ['ZOMATO', 'SWIGGY', 'ONLINE', 'TAKEAWAY'].includes(order.orderType) ||
                    !order.tableId;
                  if (channelFilter === 'DINE_IN' && isOnline) return false;
                  if (channelFilter === 'ONLINE' && !isOnline) return false;
                  return true;
                })
                .map((order) => {
                  const isPending = order.status === 'PENDING';
                  const isAccepted = order.status === 'ACCEPTED';
                  const isPreparing = order.status === 'PREPARING';
                  const isReady = order.status === 'READY';
                  const isCompleted = order.status === 'COMPLETED';

                  const isZomato = order.orderType === 'ZOMATO';
                  const isSwiggy = order.orderType === 'SWIGGY';
                  const isOnlineOrder =
                    isZomato ||
                    isSwiggy ||
                    order.orderType === 'ONLINE' ||
                    order.orderType === 'TAKEAWAY' ||
                    !order.tableId;

                  const statusColor = isPending
                    ? 'border-amber-500/80 bg-amber-500/10 ring-2 ring-amber-500/20'
                    : isAccepted
                    ? 'border-blue-500/60 bg-blue-500/5'
                    : isPreparing
                    ? 'border-orange-500/80 bg-orange-500/10'
                    : isReady
                    ? 'border-emerald-500/80 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/60 opacity-60';

                  return (
                    <div
                      key={order.id}
                      className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${statusColor}`}
                    >
                      {/* Ticket Header */}
                      <div className="space-y-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-black text-white">
                              {order.orderNumber}
                            </span>
                            {isZomato ? (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#E23744] text-white flex items-center gap-1 shadow-sm">
                                <Bike className="w-3 h-3" />
                                <span>ZOMATO</span>
                              </span>
                            ) : isSwiggy ? (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FC8019] text-white flex items-center gap-1 shadow-sm">
                                <Bike className="w-3 h-3" />
                                <span>SWIGGY</span>
                              </span>
                            ) : isOnlineOrder ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/80 text-white flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                <span>ONLINE</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                {order.orderType}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              isPending
                                ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                                : isPreparing
                                ? 'bg-orange-500 text-white'
                                : isReady
                                ? 'bg-emerald-400 text-slate-950 font-black'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {order.status === 'PENDING' && '⚡ New Ticket'}
                            {order.status === 'PREPARING' && '🔥 Cooking Now'}
                            {order.status === 'READY' && '🔔 Ready For Rider'}
                            {order.status === 'ACCEPTED' && 'Accepted'}
                            {order.status === 'COMPLETED' && 'Delivered'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-11 h-11 rounded-xl font-black flex items-center justify-center text-xs border ${
                                isZomato
                                  ? 'bg-[#E23744]/20 text-[#E23744] border-[#E23744]/40'
                                  : isSwiggy
                                  ? 'bg-[#FC8019]/20 text-[#FC8019] border-[#FC8019]/40'
                                  : isOnlineOrder
                                  ? 'bg-blue-900/30 text-blue-400 border-blue-700/50'
                                  : 'bg-slate-800 text-amber-400 border-slate-700'
                              }`}
                            >
                              {order.table?.tableNumber || (isZomato ? 'ZOM' : isSwiggy ? 'SWIG' : 'DELV')}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">
                                {order.table
                                  ? `Table ${order.table.tableNumber}`
                                  : isZomato
                                  ? 'Zomato Delivery'
                                  : isSwiggy
                                  ? 'Swiggy Express'
                                  : 'Online Delivery'}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {order.table?.floorZone || 'Rider Delivery'} &bull;{' '}
                                {order.customerName || 'Online Diner'}
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
                              Order & Delivery Notes:
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
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center border border-slate-700">
                                {item.quantity}&times;
                              </span>
                              <div>
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span>{item.menuItem?.name}</span>
                                  <span className="text-[10px]">
                                    {item.menuItem?.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                  </span>
                                </p>
                                {item.specialInstructions && (
                                  <p className="text-[10px] text-amber-300 italic">
                                    Note: &ldquo;{item.specialInstructions}&rdquo;
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
                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                            disabled={updatingId === order.id}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-orange-500/25"
                          >
                            <Flame className="w-4 h-4" />
                            <span>🔥 Start Cooking Food Now</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'READY')}
                            disabled={updatingId === order.id}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/25"
                          >
                            <Bell className="w-4 h-4" />
                            <span>
                              {isOnlineOrder
                                ? '🔔 Food Prepared & Packed (Notify Rider & Billing)'
                                : '✅ Mark Food Ready (Notify Waiter)'}
                            </span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            disabled={updatingId === order.id}
                            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            <span>
                              {isOnlineOrder
                                ? '🛵 Handed Over to Delivery Rider'
                                : '🍽️ Delivered / Served to Table'}
                            </span>
                          </button>
                        )}

                        {isCompleted && (
                          <div className="text-center py-2 text-slate-500 text-[11px] font-bold">
                            ✓ Delivered &amp; Settled at Billing
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
