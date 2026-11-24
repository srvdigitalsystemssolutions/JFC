import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ShoppingBag,
  ArrowRight,
  Star,
  Clock,
  MapPin,
  Flame,
  Phone,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
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
      take: 8,
    }),
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { price: 'desc' },
      take: 4,
    }),
    prisma.gallery.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
      take: 4,
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
          HERO BANNER SECTION (Johnson Food Court - JFC)
          ========================================================= */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 border-b-4 border-[#f2be54]">
        {/* Background Overlay Art & Ambient Lighting */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f2be54_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pre-Slogan Badge */}
              <div>
                <div className="header-text-pre-slogan shadow-xl inline-flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>Welcome To <em>Johnson Food Court (JFC)</em></span>
                </div>
              </div>

              {/* Decorative Flourish Divider */}
              <div className="header-text-divider lg:mx-0" />

              {/* Main Heading: High-Contrast Serif & Calligraphic Typewriter Animation */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] font-ubuntu">
                Open-Air Multi-Cuisine &amp; <br />
                <span className="font-dancing text-4xl sm:text-5xl lg:text-6xl text-[#f2be54] font-bold block mt-2 drop-shadow-[0_2px_15px_rgba(242,190,84,0.35)] min-h-[1.3em]">
                  <TypewriterEffect
                    words={[
                      'Open-Air Garden Dining',
                      'Authentic Chicken Shawarma',
                      'Smokey Charcoal BBQ Grills',
                      'Crispy Honey Chilli Chicken',
                      'Ambur Seeraga Samba Biryani',
                      'Pocket-Friendly Family Feasts',
                    ]}
                  />
                </span>
              </h1>

              {/* Editorial Description */}
              <p className="font-droid text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Located on Arni Road, Pennathur near Bagayam, Vellore, Johnson Food Court (JFC) is the destination for mouth-watering slow-roasted chicken shawarma, sizzling live BBQ grills, crispy Honey Chilli Chicken, Ambur dum biryani, and chilled mocktails under the open evening sky.
              </p>

              {/* Action Buttons in Ubuntu Uppercase */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#reservations"
                  className="px-6 py-3.5 rounded-lg bg-[#f2be54] hover:bg-black text-slate-950 hover:text-[#f2be54] border-2 border-[#f2be54] font-ubuntu text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Garden Table</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  href="/menu"
                  className="px-6 py-3.5 rounded-lg bg-black hover:bg-[#f2be54] text-white hover:text-black border-2 border-slate-700 hover:border-[#f2be54] font-ubuntu text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#f2be54]" />
                  <span>Explore JFC Menu</span>
                </Link>

                <a
                  href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-ubuntu text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0 text-center font-ubuntu">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#f2be54]">3.9 ★</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Justdial Rating</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-white">100+</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Menu Dishes</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-[#f2be54]">100%</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">Fresh &amp; Halal</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#f2be54]/40 shadow-2xl shadow-amber-500/10 group">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                  alt="JFC Live Charcoal BBQ & Grills"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-[#f2be54]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-ubuntu uppercase tracking-wider text-white">
                        Live Charcoal BBQ &amp; Shawarma Spit
                      </p>
                      <p className="text-[10px] font-droid italic text-slate-300">
                        Open flame barbecue, smoky tandoori chicken &amp; fresh rumali rolls
                      </p>
                    </div>
                    <span className="text-[10px] font-ubuntu font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f2be54]/20 text-[#f2be54] border border-[#f2be54]/40">
                      JFC Special
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          KEY HIGHLIGHTS: FOOD COURT FEATURES
          ========================================================= */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center font-bold text-lg">
                🍗
              </div>
              <h4 className="font-ubuntu font-black text-sm text-slate-900">Live Shawarma &amp; BBQ</h4>
              <p className="font-droid text-xs text-slate-600 leading-relaxed">
                Freshly shaved chicken shawarma rolls and smoky charcoal barbecue prepared on live flame spits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg">
                🌌
              </div>
              <h4 className="font-ubuntu font-black text-sm text-slate-900">Open-Air Garden Dining</h4>
              <p className="font-droid text-xs text-slate-600 leading-relaxed">
                Enjoy cool evening breezes and ambient festoon lighting in our pleasant outdoor dining lawn.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                💰
              </div>
              <h4 className="font-ubuntu font-black text-sm text-slate-900">Pocket-Friendly Prices</h4>
              <p className="font-droid text-xs text-slate-600 leading-relaxed">
                Generous multi-cuisine portions at affordable rates, highly loved by families, students and youth.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg">
                🚗
              </div>
              <h4 className="font-ubuntu font-black text-sm text-slate-900">Spacious Parking on Arni Road</h4>
              <p className="font-droid text-xs text-slate-600 leading-relaxed">
                Convenient parking space for two-wheelers and cars with swift takeaway parcel service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TABLE RESERVATION SECTION (OUT-OF-AREA & VISITING GUESTS)
          ========================================================= */}
      <section id="reservations" className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="section-header-script">Table Reservation Service</h3>
            <div>
              <span className="section-header-badge">Visiting Pennathur &bull; Bagayam &bull; Vellore</span>
            </div>
            <div className="header-text-divider" />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-ubuntu">
              Reserve Your Outdoor Dining Table In Advance
            </h2>
            <p className="font-droid text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guarantee your favorite open-air garden table or family canopy. Ideal for evening get-togethers, family dinners, birthdays, and highway travelers along Arni Road.
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
        <div className="text-center space-y-2">
          <h3 className="section-header-script">JFC Signature Specialties</h3>
          <div>
            <span className="section-header-badge">The Food Court Favorites</span>
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
                      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=500&q=80'
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
            <span>Explore Complete Multi-Cuisine Menu</span>
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
              <span className="section-header-badge">Johnson Food Court Ambience</span>
            </div>
            <div className="header-text-divider" />
            <p className="font-droid text-xs text-slate-600 max-w-xl mx-auto">
              Lively open-air garden setup under starry skies with delicious street aromas from our live charcoal grills and shawarma spits.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <span className="section-header-badge">Loved By Pennathur &bull; Bagayam &bull; Vellore Diners</span>
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
                <div className="w-9 h-9 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Location &amp; Driving Directions</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              {settings?.address || 'Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011'}
            </p>
            <p className="font-droid text-xs text-slate-400">
              Convenient open parking along Arni Road stretch. Located near Bagayam / Thuthipattu.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-300 font-bold text-xs rounded-lg border border-red-500/30 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-red-400 text-red-400" />
                <span>Justdial Reviews</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Operating Hours</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              {settings?.openingHours || 'Mon - Sat: 10:30 AM - 11:30 PM | Sun: 12:30 PM - 11:30 PM'}
            </p>
            <p className="font-droid text-xs text-slate-400">
              Evening Ambience Peak: 06:00 PM &ndash; 11:30 PM &bull; Takeaways &amp; Dine-in Available Daily
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f2be54] font-ubuntu text-xs font-bold uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Direct Inquiries &amp; Orders</span>
            </div>
            <p className="font-ubuntu text-sm font-bold text-white">
              <a href="tel:+919965278872" className="hover:text-amber-400 transition-colors">
                {settings?.phone || '+91 99652 78872'}
              </a>
            </p>
            <p className="font-droid text-xs text-slate-400">
              Email: {settings?.email || 'contact@johnsonfoodcourt.com'}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Website Footer */}
      <PublicFooter settings={settings} />
    </div>
  );
}
