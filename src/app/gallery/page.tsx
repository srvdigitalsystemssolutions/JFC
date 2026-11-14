import React from 'react';
import { prisma } from '@/lib/prisma';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';

export const revalidate = 0;

export default async function GalleryPage() {
  const [settings, galleryItems] = await Promise.all([
    prisma.setting.findUnique({ where: { id: 'default' } }),
    prisma.gallery.findMany({
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }],
    }),
  ]);

  const categories = ['ALL', 'Food', 'Ambience', 'Interior', 'Events', 'Chef'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <PublicNavbar settings={settings} />

      <section className="bg-slate-950 text-white py-16 text-center border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider inline-block">
            Atmosphere & Gastronomy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Restaurant Visual Showcase
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Take a visual tour through our luxury dining halls, open-sky rooftop terraces, and culinary craftsmanship.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {galleryItems.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-200 border border-slate-200 shadow-sm hover:shadow-xl transition-all aspect-4/3"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  {photo.category}
                </span>
                <h4 className="font-extrabold text-sm">{photo.title}</h4>
                {photo.description && (
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter settings={settings} />
    </div>
  );
}
