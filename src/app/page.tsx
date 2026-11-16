import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  Award,
  Heart,
  Flame,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import HomeReservationWidget from '@/components/public/HomeReservationWidget';
import { formatCurrency } from '@/lib/utils';

export const revalidate = 0;

export default async function CustomerHomePage() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white font-sans">
      {/* Super Admin Top Switcher (Visible to Admin Only) */}
      <AdminRoleSwitcher />

      {/* Customer Website Navbar */}
      <PublicNavbar settings={settings} />

      {/* =========================================================
          HERO BANNER SECTION
          ========================================================= */}
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
                <span>Culinary Excellence &bull; Heritage Spices</span>
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
                <a
                  href="#reservations"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Reserve Table Online</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/menu"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Browse Full Menu</span>
                </Link>
              </div>

              {/* Fast Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">4.9 ★</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Guest Rating</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">25+</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Master Chefs</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-orange-400">100%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Fresh &amp; Authentic</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-orange-500/10 group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Royal Dining Ambience"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Grand Dining Hall &bull; Chandelier Suite</p>
                      <p className="text-[10px] text-slate-400">Comfortable indoor &amp; rooftop open-sky seating</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Open Today
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TABLE RESERVATION SECTION (OUT-OF-AREA & LOCAL GUESTS)
          ========================================================= */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-block">
              Table Reservation Service
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Visiting From Another Area? <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Reserve Your Dining Table In Advance
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Skip the wait and guarantee your dining experience. Whether traveling from neighboring districts, celebrating an anniversary, or planning a family banquet, our stewards will have your table prepared.
            </p>
          </div>

          {/* Interactive Reservation Form Component */}
          <HomeReservationWidget />
        </div>
      </section>

      {/* =========================================================
          POPULAR SPECIALTIES PREVIEW
          ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
              Curated Menu Delicacies
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Chef&apos;s Royal Specialties
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={
                      dish.image ||
                      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80'
                    }
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`w-3 h-3 rounded-xs border-2 bg-white flex items-center justify-center ${
                        dish.isVeg ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                      {dish.category?.name}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="font-black text-sm text-slate-900">
                  {formatCurrency(dish.price)}
                </span>
                <Link
                  href="/menu"
                  className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold transition-colors"
                >
                  Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          AMBIENCE & PHOTO GALLERY
          ========================================================= */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Dining Atmosphere
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              A Royal Heritage Ambience
            </h2>
            <p className="text-xs text-slate-500">
              Experience the opulence of majestic chandeliers, open sky terrace dining, and luxury banquet lounge rooms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-2xl overflow-hidden group h-48 sm:h-60 shadow-xs"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-orange-400 block">
                      {photo.category}
                    </span>
                    <p className="text-xs font-bold text-white">{photo.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/gallery"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              <span>Explore Complete Photo Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          GUEST TESTIMONIALS & REVIEWS
          ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Diner Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Loved By Connoisseurs &amp; Families
          </h2>
          <p className="text-xs text-slate-500">
            Hear what our guests have to say about our royal flavours, attentive service, and majestic ambience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.customerName}</h4>
                  <p className="text-[10px] text-slate-400">{t.customerRole || 'Regular Diner'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          LOCATION, HOURS & DIRECTIONS FOR TRAVELERS
          ========================================================= */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Location &amp; Directions</span>
            </div>
            <p className="text-sm font-bold text-white">
              {settings?.address || '42 Gourmet Avenue, Culinary District, Metro City'}
            </p>
            <p className="text-xs text-slate-400">
              Convenient valet parking available. Just 10 minutes from Central Metro Station.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Dining Hours</span>
            </div>
            <p className="text-sm font-bold text-white">
              {settings?.openingHours || 'Monday - Sunday: 11:00 AM - 11:30 PM'}
            </p>
            <p className="text-xs text-slate-400">
              Lunch Hours: 12:00 PM - 03:30 PM &bull; Dinner: 07:00 PM - 11:30 PM
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Direct Reservations</span>
            </div>
            <p className="text-sm font-bold text-white">
              {settings?.phone || '+91 98765 43210'}
            </p>
            <p className="text-xs text-slate-400">
              Email: {settings?.email || 'reservations@royalspice.com'}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Website Footer */}
      <PublicFooter settings={settings} />
    </div>
  );
}
