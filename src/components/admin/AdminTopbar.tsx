'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Plus,
  RefreshCw,
  UtensilsCrossed,
  ChefHat,
  Receipt,
  Store,
  ChevronDown,
  X,
  Users,
  Grid,
  Layers,
  Image as ImageIcon,
  MessageSquareQuote,
  Mail,
  ShieldCheck,
  Sliders,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  // Other Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param if present on certain pages
  useEffect(() => {
    const q = searchParams.get('search');
    if (q && !searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setShowResultsDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data);
        setShowResultsDropdown(true);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowResultsDropdown(false);

      // Route search to appropriate page depending on context
      const q = encodeURIComponent(searchQuery.trim());
      if (pathname.includes('/admin/users')) {
        router.push(`/admin/users?search=${q}`);
      } else if (pathname.includes('/admin/menu')) {
        router.push(`/admin/menu?search=${q}`);
      } else if (pathname.includes('/admin/categories')) {
        router.push(`/admin/categories?search=${q}`);
      } else if (pathname.includes('/admin/tables')) {
        router.push(`/admin/tables?search=${q}`);
      } else if (pathname.includes('/admin/billing')) {
        router.push(`/admin/billing?search=${q}`);
      } else if (pathname.includes('/admin/gallery')) {
        router.push(`/admin/gallery?search=${q}`);
      } else if (pathname.includes('/admin/testimonials')) {
        router.push(`/admin/testimonials?search=${q}`);
      } else if (pathname.includes('/admin/messages')) {
        router.push(`/admin/messages?search=${q}`);
      } else {
        // Global heuristic routing
        if (/staff|admin|chef|waiter|user|customer|cashier|alexander|pierre|connor|sharma/i.test(searchQuery)) {
          router.push(`/admin/users?search=${q}`);
        } else if (/table|seat|deck|lounge|t-0|dining/i.test(searchQuery)) {
          router.push(`/admin/tables?search=${q}`);
        } else if (/inv|bill|payment|paid|receipt|tax/i.test(searchQuery)) {
          router.push(`/admin/billing?search=${q}`);
        } else if (/category|starters|dessert|bread|beverage/i.test(searchQuery)) {
          router.push(`/admin/categories?search=${q}`);
        } else if (/photo|gallery|ambience|interior|event/i.test(searchQuery)) {
          router.push(`/admin/gallery?search=${q}`);
        } else if (/review|testimonial|feedback|critic|star/i.test(searchQuery)) {
          router.push(`/admin/testimonials?search=${q}`);
        } else if (/message|inquiry|lead|booking|pooja|rohan/i.test(searchQuery)) {
          router.push(`/admin/messages?search=${q}`);
        } else {
          router.push(`/admin/menu?search=${q}`);
        }
      }
    } else if (e.key === 'Escape') {
      setShowResultsDropdown(false);
    }
  };

  const handleSelectResult = (url: string) => {
    setShowResultsDropdown(false);
    router.push(url);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowResultsDropdown(false);
    if (searchParams.get('search')) {
      router.push(pathname);
    }
  };

  const notifications = [
    { id: 1, title: 'New Dine-In Order', desc: 'Table T-02 placed ORD-1001', time: '5m ago', unread: true },
    { id: 2, title: 'Bill Paid', desc: 'INV-2026-001 settled via UPI (₹863.50)', time: '12m ago', unread: false },
    { id: 3, title: 'New Customer Inquiry', desc: 'Pooja Verma requested 20 pax reservation', time: '1h ago', unread: true },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left: Global Interactive Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl relative" ref={searchContainerRef}>
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults && searchResults.totalCount > 0) setShowResultsDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search across Core Management, Content & Inquiries, Staff (press Enter)..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 shadow-inner"
          />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-orange-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          ) : searchQuery ? (
            <button
              onClick={clearSearch}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Floating Live Search Dropdown */}
        {showResultsDropdown && searchResults && (
          <div className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fade-in max-h-[82vh] overflow-y-auto">
            {searchResults.totalCount === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching records found for "<span className="font-semibold text-slate-700">{searchResults.query}</span>".
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {/* =========================================
                    SECTION 1: CORE MANAGEMENT
                    ========================================= */}
                {searchResults.core?.count > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50/60 rounded-lg flex items-center justify-between">
                      <span>Core Management ({searchResults.core.count})</span>
                      <span className="text-[10px] text-slate-400 font-normal">Dishes, Categories, Tables, Bills</span>
                    </div>

                    {/* Menu Items */}
                    {searchResults.core.menuItems?.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(`/admin/menu?search=${encodeURIComponent(item.name)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border" />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.category?.name} &bull; {item.isVeg ? 'Veg 🟢' : 'Non-Veg 🔴'}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-orange-600">{formatCurrency(item.price)}</span>
                      </div>
                    ))}

                    {/* Categories */}
                    {searchResults.core.categories?.map((cat: any) => (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectResult(`/admin/categories?search=${encodeURIComponent(cat.name)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{cat.name}</p>
                            <p className="text-[10px] text-slate-400">Category &bull; {cat._count?.menuItems || 0} dishes</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Category</span>
                      </div>
                    ))}

                    {/* Tables */}
                    {searchResults.core.tables?.map((t: any) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelectResult(`/admin/tables?search=${encodeURIComponent(t.tableNumber)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                            <Grid className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{t.tableNumber}</p>
                            <p className="text-[10px] text-slate-400">{t.floorZone} &bull; Capacity {t.capacity} guests</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{t.status}</span>
                      </div>
                    ))}

                    {/* Bills */}
                    {searchResults.core.bills?.map((b: any) => (
                      <div
                        key={b.id}
                        onClick={() => handleSelectResult(`/admin/billing?search=${encodeURIComponent(b.invoiceNumber)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 font-mono">{b.invoiceNumber}</p>
                            <p className="text-[10px] text-slate-400">{b.order?.customerName || 'Walk-in'} &bull; {b.paymentStatus}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-900">{formatCurrency(b.grandTotal)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* =========================================
                    SECTION 2: CONTENT & INQUIRIES
                    ========================================= */}
                {searchResults.content?.count > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/60 rounded-lg flex items-center justify-between">
                      <span>Content & Inquiries ({searchResults.content.count})</span>
                      <span className="text-[10px] text-slate-400 font-normal">Gallery, Testimonials, Messages</span>
                    </div>

                    {/* Gallery */}
                    {searchResults.content.gallery?.map((g: any) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelectResult(`/admin/gallery?search=${encodeURIComponent(g.title)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={g.imageUrl} alt={g.title} className="w-8 h-8 rounded-lg object-cover border" />
                          <div>
                            <p className="font-bold text-slate-900">{g.title}</p>
                            <p className="text-[10px] text-slate-400">Gallery &bull; {g.category}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Photo</span>
                      </div>
                    ))}

                    {/* Testimonials */}
                    {searchResults.content.testimonials?.map((t: any) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelectResult(`/admin/testimonials?search=${encodeURIComponent(t.customerName)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                            <MessageSquareQuote className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{t.customerName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{t.customerRole} &bull; "{t.content}"</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Review</span>
                      </div>
                    ))}

                    {/* Messages */}
                    {searchResults.content.messages?.map((m: any) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectResult(`/admin/messages?search=${encodeURIComponent(m.name)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{m.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{m.subject || m.message}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">{m.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* =========================================
                    SECTION 3: ADMINISTRATION & STAFF
                    ========================================= */}
                {searchResults.admin?.count > 0 && (
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-1 text-[11px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50/60 rounded-lg flex items-center justify-between">
                      <span>Administration & Staff Accounts ({searchResults.admin.count})</span>
                      <span className="text-[10px] text-slate-400 font-normal">Users, Roles</span>
                    </div>

                    {/* Staff Users */}
                    {searchResults.admin.users?.map((u: any) => (
                      <div
                        key={u.id}
                        onClick={() => handleSelectResult(`/admin/users?search=${encodeURIComponent(u.name)}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email} &bull; {u.phone || 'No phone'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800">
                          {u.role?.name}
                        </span>
                      </div>
                    ))}

                    {/* Roles */}
                    {searchResults.admin.roles?.map((r: any) => (
                      <div
                        key={r.id}
                        onClick={() => handleSelectResult(`/admin/rbac`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{r.name}</p>
                            <p className="text-[10px] text-slate-400">{r.description || 'System Role'}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Role</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 rounded-b-2xl">
                  <div className="flex items-center gap-1.5">
                    <span>Press</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-700 shadow-xs font-semibold">Enter ↵</kbd>
                    <span>to filter current module</span>
                  </div>
                  <span className="font-bold text-orange-600">{searchResults.totalCount} matches found</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Module Switchers & Actions */}
      <div className="flex items-center gap-3">
        {/* Module Fast Links */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Link
            href="/chef"
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all flex items-center gap-1.5"
            title="Open Chef Kitchen Display"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
            <span>Chef View</span>
          </Link>
          <Link
            href="/billing"
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all flex items-center gap-1.5"
            title="Open Billing & POS Counter"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-500" />
            <span>Billing View</span>
          </Link>
          <Link
            href="/waiter"
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all flex items-center gap-1.5"
            title="Open Floor Staff / Waiter View"
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>User View</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all flex items-center gap-1.5"
            title="Open Customer Website"
          >
            <Store className="w-3.5 h-3.5 text-orange-500" />
            <span>Customer View</span>
          </Link>
        </div>

        {/* Quick Action Add Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs font-bold shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in text-xs font-medium text-slate-700">
              <Link
                href="/admin/menu"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 hover:text-orange-600"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                <span>Add Food Item</span>
              </Link>
              <Link
                href="/admin/categories"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 hover:text-orange-600"
              >
                <Plus className="w-3.5 h-3.5 text-amber-500" />
                <span>Add Category</span>
              </Link>
              <Link
                href="/admin/tables"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 hover:text-orange-600"
              >
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                <span>Add Dining Table</span>
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setShowQuickMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 hover:text-orange-600 border-t border-slate-100"
              >
                <Plus className="w-3.5 h-3.5 text-blue-500" />
                <span>Add Staff User</span>
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Notifications</span>
                <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 cursor-pointer ${
                      n.unread ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium text-slate-800 mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Refresh Page Button */}
        <button
          onClick={() => router.refresh()}
          title="Refresh Data"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
