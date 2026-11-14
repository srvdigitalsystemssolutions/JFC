import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  ShieldCheck,
  ChefHat,
  Receipt,
} from 'lucide-react';

export default function PublicFooter({ settings }: { settings?: any }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings?.restaurantName || 'Royal Spice Grand'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience the pinnacle of royal heritage recipes, culinary craftsmanship, and luxury dining service crafted by master chefs.
            </p>
            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a
                href={settings?.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings?.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.twitterUrl || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-orange-400">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Digital QR Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Atmosphere Gallery
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Guest Reviews
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-white transition-colors">
                  Book A Table
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Restaurant Management Suite */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-orange-400">
              System Portals
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/admin"
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                  <span>Super Admin Control</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chef"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chef Kitchen Display (KDS)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pos"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                  <span>POS Billing Counter</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-slate-100 transition-colors"
                >
                  Staff Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3 text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-orange-400">
              Visit & Dine
            </h3>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{settings?.address || '42 Gourmet Avenue, Culinary District'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{settings?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{settings?.email || 'contact@royalspice.com'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{settings?.openingHours || 'Daily: 11:00 AM - 11:30 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {settings?.restaurantName || 'Royal Spice Grand'}. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Integrated Restaurant Management & POS Suite</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
