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
  Flame,
  Phone,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import HomeReservationWidget from '@/components/public/HomeReservationWidget';
import TypewriterEffect from '@/components/public/TypewriterEffect';
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-amber-500 selection:text-white font-sans">
      {/* Super Admin Top Switcher (Renders only on explicit admin routes, hidden on customer website) */}
      <AdminRoleSwitcher />

      {/* Customer Website Navbar */}
      <PublicNavbar settings={settings} />

      {/* =========================================================
          HERO BANNER SECTION (Yaa Mohaideen Inspired Typography)
          ========================================================= */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 border-b-4 border-[#f2be54]">
        {/* Background Overlay Art & Ambient Lighting */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f2be54_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pre-Slogan Badge (Exact Yaa Mohaideen aesthetic) */}
              <div>
                <div className="header-text-pre-slogan shadow-xl">
                  Welcome To <em>Royal Spice Biryani</em>
                </div>
              </div>

              {/* Decorative Flourish Divider */}
              <div className="header-text-divider lg:mx-0" />

              {/* Main Heading: High-Contrast Serif & Calligraphic Typewriter Animation */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] font-ubuntu">
                Authentic Chennai &amp; Royal <br />
                <span className="font-dancing text-4xl sm:text-5xl lg:text-6xl text-[#f2be54] font-bold block mt-2 drop-shadow-[0_2px_15px_rgba(242,190,84,0.35)] min-h-[1.3em]">
                  <TypewriterEffect
                    words={[
                      'Freshly Cooked Every Day',
                      'Perfect for Family Meals',
                      'Authentic Dum Pukht Flavors',
                      'Fast Delivery & Royal Feasts',
                      'Slow Simmered Heritage Spices',
                    ]}
                  />
                </span>
              </h1>

              {/* Editorial Description in Droid Serif */}
              <p className="font-droid text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Serving authentic and flavorful biryani with traditional slow-simmered dum recipes and hand-pounded spices. Visit us or reserve your dining table online to enjoy the true taste of royal South Indian culinary heritage.
              </p>

              {/* Action Buttons in Ubuntu Uppercase */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#reservations"
                  className="px-6 py-3.5 rounded-lg bg-[#f2be54] hover:bg-black text-slate-950 hover:text-[#f2be54] border-2 border-[#f2be54] font-ubuntu text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Table Online</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/menu"
                  className="px-6 py-3.5 rounded-lg bg-black hover:bg-[#f2be54] text-white hover:text-black border-2 border-slate-700 hover:border-[#f2be54] font-ubuntu text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#f2be54]" />
                  <span>Explore Royal Menu</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center font-ubuntu">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#f2be54]">4.9 ★</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Guest Rating</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">25+</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Master Chefs</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#f2be54]">100%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Authentic Dum</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#f2be54]/40 shadow-2xl shadow-amber-500/10 group">
                <img
                  src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
                  alt="Authentic Dum Biryani"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-[#f2be54]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-ubuntu uppercase tracking-wider text-white">
                        Special Saffron Dum Biryani
                      </p>
                      <p className="text-[10px] font-droid italic text-slate-300">
                        Slow simmered in copper deghs with fragrant seeraga samba &amp; basmati
                      </p>
                    </div>
                    <span className="text-[10px] font-ubuntu font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2be54]/20 text-[#f2be54] border border-[#f2be54]/40">
                      Signature
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TABLE RESERVATION SECTION (OUT-OF-AREA & VISITING GUESTS)
          ========================================================= */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="section-header-script">Table Reservation Service</h3>
            <div>
              <span className="section-header-badge">Visiting From Another Area or City?</span>
            </div>
            <div className="header-text-divider" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-ubuntu">
              Reserve Your Dining Table In Advance
            </h2>
            <p className="font-droid text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guarantee your table and skip the queue. Whether visiting from other districts, traveling for a wedding, or planning a weekend family banquet, our stewards will have your table prepared.
            </p>
          </div>

          {/* Interactive Reservation Form Component */}
          <HomeReservationWidget />
        </div>
      </section>

      {/* =========================================================
          POPULAR SPECIALTIES PREVIEW (Yaa Mohaideen Font Styling)
          ========================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-10">
        <div className="text-center space-y-2">
          <h3 className="section-header-script">Chef&apos;s Royal Specialties</h3>
          <div>
            <span className="section-header-badge">The Menu Delicacies</span>
          </div>
          <div className="header-text-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#f2be54] transition-all group flex flex-col justify-between"
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
                    <span className="font-ubuntu text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm">
                      {dish.category?.name}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-ubuntu font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                    {dish.name}
                  </h4>
                  <p className="font-droid text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="font-ubuntu font-black text-sm text-slate-900">
                  {formatCurrency(dish.price)}
                </span>
                <Link
                  href="/menu"
                  className="font-ubuntu uppercase tracking-wider px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-[#f2be54] hover:text-black text-amber-800 text-xs font-bold transition-colors"
                >
                  Order
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 font-ubuntu uppercase tracking-wider text-xs font-bold px-6 py-3 rounded-lg bg-slate-900 text-white hover:bg-[#f2be54] hover:text-black transition-all shadow-md"
          >
            <span>Explore Complete Royal Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          AMBIENCE & PHOTO GALLERY
          ========================================================= */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="section-header-script">Dining Atmosphere</h3>
            <div>
              <span className="section-header-badge">Royal Heritage Ambience</span>
            </div>
            <div className="header-text-divider" />
            <p className="font-droid text-xs text-slate-600 max-w-xl mx-auto">
              Experience the grandeur of warm chandeliers, open sky rooftop dining, and private VIP family lounge seating.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-2xl overflow-hidden group h-48 sm:h-60 shadow-xs border border-slate-200"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <span className="font-ubuntu text-[10px] font-bold uppercase tracking-wider text-[#f2be54] block">
                      {photo.category}
                    </span>
                    <p className="font-ubuntu text-xs font-bold text-white">{photo.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/gallery"
              className="px-6 py-3 rounded-lg bg-white border border-slate-300 text-slate-800 font-ubuntu text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
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
        <div className="text-center space-y-2">
          <h3 className="section-header-script">Customer Testimonials</h3>
          <div>
            <span className="section-header-badge">Loved By Families &amp; Food Lovers</span>
          </div>
          <div className="header-text-divider" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#f2be54]">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f2be54]" />
                  ))}
                </div>
                <p className="font-droid italic text-xs text-slate-600 leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-xs">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-ubuntu text-xs font-bold text-slate-900">{t.customerName}</h4>
                  <p className="font-ubuntu text-[10px] text-slate-400 uppercase tracking-wider">{t.customerRole || 'Regular Diner'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          LOCATION, HOURS & DIRECTIONS FOR TRAVELERS
          ========================================================= */}
      <section className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Location &amp; Directions</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              {settings?.address || '42 Gourmet Avenue, Culinary District, Metro City'}
            </p>
            <p className="font-droid text-xs text-slate-400">
              Convenient valet parking available. Just 10 minutes from Central Metro Station.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Dining Hours</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              {settings?.openingHours || 'Monday - Sunday: 11:00 AM - 11:30 PM'}
            </p>
            <p className="font-droid text-xs text-slate-400">
              Lunch Hours: 12:00 PM - 03:30 PM &bull; Dinner: 07:00 PM - 11:30 PM
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Direct Reservations</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              {settings?.phone || '+91 98765 43210'}
            </p>
            <p className="font-droid text-xs text-slate-400">
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
