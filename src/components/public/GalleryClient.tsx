'use client';

import React, { useState } from 'react';
import { Camera, Eye, X, Sparkles, MapPin, Layers, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string | null;
  isFeatured?: boolean;
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Photos', count: items.length },
    { id: 'Ambience', label: 'Ambience & Terrace', count: items.filter((i) => i.category === 'Ambience').length },
    { id: 'Food', label: 'Signature Dishes', count: items.filter((i) => i.category === 'Food').length },
    { id: 'Menu Cards', label: 'Original Menu Cards', count: items.filter((i) => i.category === 'Menu Cards').length },
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-amber-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-xl cursor-pointer hover:border-amber-400/50 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 flex flex-col"
          >
            {/* Image Aspect Box */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                    photo.category === 'Menu Cards'
                      ? 'bg-amber-500 text-slate-950'
                      : photo.category === 'Food'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900/90 text-amber-400 border border-amber-400/40'
                  }`}
                >
                  {photo.category}
                </span>
              </div>

              {/* View Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-3 bg-red-600/90 text-white rounded-full shadow-xl backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Description Info Card */}
            <div className="p-4 bg-slate-900 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span>Pennathur, Vellore</span>
                </span>
                <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-0.5">
                  Click to inspect <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-600 text-white">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> JFC Arni Road, Pennathur, Vellore
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  {selectedPhoto.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Box */}
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-auto p-2">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Footer description */}
            {selectedPhoto.description && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs sm:text-sm text-slate-300 flex items-center justify-between">
                <p className="max-w-2xl">{selectedPhoto.description}</p>
                <span className="text-[11px] font-mono text-amber-400 font-bold shrink-0 ml-4">
                  Johnson Food Court &bull; Vellore
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
