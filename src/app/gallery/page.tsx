import React from 'react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import GalleryClient from '@/components/public/GalleryClient';
import { Camera, MapPin } from 'lucide-react';

export const revalidate = 0;

export const metadata = {
  title: 'Photo Gallery & Menu Cards | Johnson Food Court (JFC) Vellore',
  description:
    'Explore authentic photos of Johnson Food Court (JFC) in Pennathur, Vellore. View our open-air garden terrace, neon entrance, charcoal BBQ mandi, crispy honey chilli chicken, and physical menu cards.',
};

export default async function GalleryPage() {
  const [settings, galleryItems] = await Promise.all([
    prisma.setting.findUnique({ where: { id: 'default' } }),
    prisma.gallery.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <PublicNavbar settings={settings} />

      {/* Hero Showcase Header */}
      <section className="relative py-16 sm:py-20 text-center border-b border-slate-800/80 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Authentic JFC Vellore Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Johnson Food Court <span className="text-amber-400">Gallery</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Take an authentic visual tour of our open-air terrace dining, illuminated neon entrance, sizzling charcoal BBQ grills, and official restaurant menu cards directly from Bagayam & Pennathur, Vellore.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-400/90 font-mono">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Arni Road, Pennathur, near Bagayam, Vellore &bull; 10 Original Photos & Menus</span>
          </div>
        </div>
      </section>

      {/* Main Gallery Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <GalleryClient items={galleryItems} />
      </main>

      <PublicFooter settings={settings} />
    </div>
  );
}
