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
  MapPin,
  ExternalLink,
  Flame,
} from 'lucide-react';

export default function PublicNavbar({ settings }: { settings?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Top Announcement & Quick Links Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="tel:+919965278872"
              className="flex items-center gap-1.5 text-amber-400 font-medium hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings?.phone || '+91 99652 78872'}</span>
            </a>
            <span className="hidden md:inline text-slate-500">&bull;</span>
            <a
              href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Sherwood, Arni Road, Pennathur, Vellore</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
            </a>
            <span className="hidden lg:inline text-slate-500">&bull;</span>
            <span className="hidden lg:inline text-slate-400">
              {settings?.openingHours || 'Mon-Sat: 10:30 AM - 11:30 PM | Sun: 12:30 PM - 11:30 PM'}
            </span>
          </div>

          {/* Right: Justdial & Google Map Badges */}
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <a
              href="https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold hover:bg-red-900/60 transition-colors"
            >
              <span>Justdial ★ 3.9</span>
            </a>
            <a
              href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-900/60 transition-colors"
            >
              <span>Google Maps 📍</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border-2 border-amber-500/80 p-1 flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/images/jfc-logo.svg"
                alt="Johnson Food Court Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block">
                  Johnson Food Court
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  JFC
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-600" />
                <span>Multi-Cuisine &bull; Open-Air Dining &bull; Vellore</span>
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links - Styled in Ubuntu Uppercase */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-ubuntu text-xs uppercase tracking-wider font-bold transition-all hover:text-red-600 relative py-2 ${
                    isActive ? 'text-red-600 font-black' : 'text-slate-700'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/menu"
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 border border-slate-800 text-xs font-bold transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Explore Menu</span>
            </Link>
            <Link
              href="/reservations"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/menu"
              className="p-2 text-red-600 bg-red-50 rounded-xl border border-red-200"
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
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-between p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <img src="/images/jfc-logo.svg" alt="JFC Logo" className="w-8 h-8" />
              <span className="font-extrabold text-white text-base">Johnson Food Court (JFC)</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-ubuntu text-sm uppercase tracking-wider font-bold py-2 px-3 rounded-xl ${
                  pathname === link.href
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <a
              href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-slate-900 border border-slate-700 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Open in Google Maps</span>
            </a>
            <Link
              href="/reservations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl font-black text-xs flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book A Dining Table</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
