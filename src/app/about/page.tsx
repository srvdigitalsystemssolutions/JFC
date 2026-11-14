import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Award,
  Sparkles,
  Users,
  Clock,
  Heart,
  ShieldCheck,
  ChefHat,
  ArrowRight,
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
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-block">
            Our Heritage & Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Honoring The Legacy of Authentic Royal Spices
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Founded with a passion for preserving culinary nobility, Royal Spice brings centuries of secret recipes to modern gastronomy.
          </p>
        </div>
      </section>

      {/* Story Narrative */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Crafting Culinary Memories For Over Three Decades
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                What began as a modest heritage kitchen dedicated to slow-dum cooking has evolved into an iconic fine dining destination. Each recipe in our repertoire has been refined through generations of royal master chefs, preserving original hand-pounded spices, stone-ground masalas, and genuine copper handis.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe dining is not merely a meal, but a sensory celebration. From the warm glow of antique chandeliers to the fragrant aroma of saffron-infused basmati, every element is curated to make guests feel like honored royalty.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                  <h4 className="font-black text-lg text-orange-600">30+ Years</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Culinary Legacy</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <h4 className="font-black text-lg text-amber-600">500,000+</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Satisfied Diners</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Restaurant Dining Interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Head Chef Profile */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
                  alt="Executive Chef Marco Pierre"
                  className="w-full h-80 object-cover"
                />
                <div className="p-5 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Executive Master Chef
                  </span>
                  <h3 className="text-lg font-bold">Chef Marco Pierre</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    22 Years of Culinary Innovation & Royal Heritage Kitchens
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Kitchen Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                "Ingredients Tell A Story. Fire Brings Them To Life."
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Chef Marco and his brigade work directly with local farmers and traditional spice cultivators across India to procure first-harvest saffron, black cardamom, and artisanal cold-pressed oils. No artificial food coloring or chemical flavor enhancers ever touch our pans.
              </p>
              <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>100% Farm-Fresh Daily Produce & Certified Spices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Traditional Clay Oven Tandoors for Authentic Smoky Char</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Integrated Real-Time Kitchen Display Order Processing</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Explore Chef's Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter settings={settings} />
    </div>
  );
}
