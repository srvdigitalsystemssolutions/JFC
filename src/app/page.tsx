import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  ShieldCheck,
  ChefHat,
  Receipt,
  Store,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Star,
  Clock,
  MapPin,
  ShoppingBag,
  Award,
  Heart,
  Flame,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function HomePage() {
  const [settings, categories, featuredItems, gallery, testimonials] = await Promise.all([
    prisma.setting.findUnique({ where: { id: 'default' } }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { menuItems: true } } },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { price: 'desc' },
      take: 4,
    }),
    prisma.gallery.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar settings={settings} />

      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28">
        {/* Background Overlay Art */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Culinary Excellence & Heritage Spices</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Taste The Grandeur of <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                  Royal Dining Flavours
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Immerse yourself in centuries of culinary majesty. From slow-simmered dum biryanis to artisan tandoori creations, every dish is an ode to authentic royalty.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/menu"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order & View Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/reservations"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Reserve Table</span>
                </Link>
              </div>

              {/* Fast Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">4.9 ★</span>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">5,000+ Reviews</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">45+</span>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Artisan Dishes</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-orange-400">100%</span>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Fresh & Halal</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                    alt="Royal Spice Dining Ambience"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-500 text-white mb-2 inline-block">
                      Signature Ambience
                    </span>
                    <h3 className="font-bold text-base sm:text-lg">Open Sky Rooftop & Chandelier Dining</h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      Designed for celebratory family dinners, banquets, and intimate dates.
                    </p>
                  </div>
                </div>

                {/* Floating Dish Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-3.5 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-fade-in hidden sm:flex">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-black text-lg">
                    🍛
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block">
                      Chef's Special
                    </span>
                    <p className="font-extrabold text-xs text-slate-900">Royal Butter Chicken</p>
                    <p className="text-[11px] font-bold text-slate-500">₹390.00 &bull; Slow-Cooked Gravy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Portals Launch Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              Complete Integrated System
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              One Unified Platform &bull; Four Specialized Modules
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              All four interfaces share the same synchronized database, orders, and real-time updates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Super Admin Panel */}
            <Link
              href="/admin"
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 hover:border-orange-500 transition-all shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                    Module 1
                  </span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-orange-400 transition-colors">
                  Super Admin Panel
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  13 executive management tools, live analytics, menus, tables, RBAC, gallery & settings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400">
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 2. Customer Website & Digital Menu */}
            <Link
              href="/menu"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Module 2
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  Customer Website & Menu
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Digital QR menu with live ordering cart, table booking, food gallery & reviews.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 3. Chef Panel (KDS) */}
            <Link
              href="/chef"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    Module 3
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                  Chef Panel (KDS)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Live kitchen order queue, cook pipeline: Pending &rarr; Preparing &rarr; Ready.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Open Kitchen Display</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* 4. POS Billing Software */}
            <Link
              href="/pos"
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    Module 4
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                  POS Billing Software
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Table dine-in counter, quick order touch, GST engine, UPI checkout & print invoice.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Open POS Terminal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Menu Specials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Handcrafted Flavours
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Featured Culinary Masterpieces
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Signature dishes prepared using time-honored slow-cooking methods.
              </p>
            </div>
            <Link
              href="/menu"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-sm">
                    {dish.category?.name}
                  </span>
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      dish.isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {dish.isVeg ? 'Veg 🟢' : 'Non-Veg 🔴'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                      {dish.description || 'Authentic dish prepared fresh with royal spices.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                      <span className="text-base font-black text-slate-900">
                        {formatCurrency(dish.price)}
                      </span>
                    </div>
                    <Link
                      href={`/menu?dish=${encodeURIComponent(dish.name)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories Explorer */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Explore Our Cuisines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Popular Menu Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu?category=${encodeURIComponent(cat.id)}`}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mx-auto mb-2.5 text-orange-600 group-hover:scale-110 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-orange-600">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {cat._count?.menuItems || 0} dishes
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Atmosphere & Gallery Showcase */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Visual Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Restaurant Atmosphere & Culinary Art
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
            >
              <span>View All Photos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 shadow-xs border border-slate-200"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-orange-400">
                    {photo.category}
                  </span>
                  <p className="text-[11px] font-bold line-clamp-1">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Guest Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Words From Our Diners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-4 border-t border-slate-200/60">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={t.customerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{t.customerName}</h4>
                    <p className="text-[10px] text-slate-400">{t.customerRole}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
            >
              <span>Submit Your Dining Experience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-sm">
            Reservations & Private Dining
          </span>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight">
            Planning a Family Banquet or Romantic Dinner?
          </h2>
          <p className="text-sm text-orange-100 max-w-xl mx-auto">
            Book your preferred dining table in advance. We offer personalized menus and VIP private lounge seating for unforgettable celebrations.
          </p>
          <div className="pt-2">
            <Link
              href="/reservations"
              className="px-8 py-4 rounded-2xl bg-white text-orange-600 hover:bg-slate-100 font-extrabold text-sm shadow-xl transition-all inline-flex items-center gap-2 group"
            >
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Reserve Table Online</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter settings={settings} />
    </div>
  );
}
