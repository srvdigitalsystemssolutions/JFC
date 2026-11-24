import React from 'react';
import Link from 'next/link';
import {
  Award,
  Sparkles,
  Users,
  Clock,
  Heart,
  ArrowRight,
  Flame,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await prisma.setting.findUnique({ where: { id: 'default' } });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar settings={settings} />

      {/* Header Banner */}
      <section className="bg-slate-950 text-white py-16 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Our Journey &bull; Pennathur, Vellore</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-ubuntu">
            The Story of Johnson Food Court (JFC)
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Founded with a vision to create an energetic, open-air casual dining destination in Vellore, Johnson Food Court (JFC) brings together sizzling charcoal barbeque, slow-roasted shawarma, and multi-cuisine street favorites.
          </p>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider font-ubuntu">
                Open-Air Food Court Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight font-ubuntu">
                Vibrant Evening Vibe, Generous Portions &amp; Pocket-Friendly Dining
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-droid">
                Situated along Arni Road in Pennathur, near Bagayam, Johnson Food Court (JFC) has rapidly become a preferred gathering spot for college students from CMC, families from surrounding residential areas, and highway commuters.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-droid">
                Our food court is designed around lively live-kitchen stalls: our live rotating Shawarma spit shaving seasoned chicken into thin rumali rotis, our open flame charcoal tandoor grilling smoky chicken and paneer, our wok stations tossing sizzling fried rice and noodles, and our fresh juice counter blending thick fruit shakes and faloodas.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <h4 className="font-black text-base sm:text-lg text-orange-600 font-ubuntu">100+</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Dishes</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <h4 className="font-black text-base sm:text-lg text-amber-600 font-ubuntu">3.9 ★</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Justdial Rated</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <h4 className="font-black text-base sm:text-lg text-emerald-600 font-ubuntu">7 Days</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">Late Night Dining</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                  alt="Johnson Food Court Open Air Evening Seating"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white border border-amber-500/30">
                  <p className="text-xs font-bold font-ubuntu text-amber-400">Open-Air Dining Garden</p>
                  <p className="text-[11px] text-slate-300">Sherwood, Arni Road, Pennathur, Vellore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory & Driving Access */}
      <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-lg font-ubuntu text-white">Find Us On Arni Road, Pennathur</h3>
            <p className="text-xs text-slate-400 mt-1">
              Easy driving access, convenient parking, and just minutes from Bagayam &amp; Thuthipattu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-300 font-bold text-xs border border-orange-500/30 transition-colors flex items-center gap-2"
            >
              <span>Justdial Directory</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      <PublicFooter settings={settings} />
    </div>
  );
}
