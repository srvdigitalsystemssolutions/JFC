'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Utensils,
  Menu,
  X,
  Phone,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  ChefHat,
  Receipt,
  Store,
  ChevronDown,
} from 'lucide-react';

export default function PublicNavbar({ settings }: { settings?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About Us', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Reservations', href: '/reservations' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement & Fast Portal Switcher Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>{settings?.phone || '+91 98765 43210'}</span>
            </span>
            <span className="hidden md:inline text-slate-500">&bull;</span>
            <span className="hidden md:inline text-slate-400">
              {settings?.openingHours || 'Open Daily: 11:00 AM - 11:30 PM'}
            </span>
          </div>

          {/* Quick System Portal Access Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
              Module Portals:
            </span>
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Super Admin</span>
            </Link>
            <Link
              href="/chef"
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ChefHat className="w-3 h-3" />
              <span>Chef Panel</span>
            </Link>
            <Link
              href="/pos"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Receipt className="w-3 h-3" />
              <span>POS Billing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block">
                {settings?.restaurantName?.split(' ')[0] || 'Royal'}{' '}
                <span className="text-orange-600">
                  {settings?.restaurantName?.split(' ').slice(1, 3).join(' ') || 'Spice'}
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Fine Dining & Lounge
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold transition-all hover:text-orange-600 relative py-2 ${
                    isActive ? 'text-orange-600 font-extrabold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/menu"
              className="px-4 py-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 text-xs font-bold transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Digital Menu</span>
            </Link>
            <Link
              href="/reservations"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/menu"
              className="p-2 text-orange-600 bg-orange-50 rounded-xl border border-orange-200"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 animate-fade-in shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Super Admin</span>
              </Link>
              <Link
                href="/chef"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                <span>Chef Panel</span>
              </Link>
              <Link
                href="/pos"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>POS Software</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Staff Login</span>
              </Link>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-semibold rounded-lg px-2 transition-colors ${
                    pathname === link.href ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-center block text-xs shadow-md shadow-orange-500/20"
              >
                Reserve A Table
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
