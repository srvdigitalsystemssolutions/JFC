import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ExternalLink,
  Flame,
  Star,
} from 'lucide-react';

export default function PublicFooter({ settings }: { settings?: any }) {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/50 p-1 flex items-center justify-center shadow-lg shadow-orange-500/10">
                <img src="/images/jfc-logo.svg" alt="JFC Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  Johnson Food Court
                </span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  JFC &bull; Vellore
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vellore’s favorite open-air garden multi-cuisine food court on Arni Road, Pennathur. Famous for authentic chicken shawarma, live charcoal BBQ grills, Ambur dum biryani, and zesty mocktails.
            </p>
            {/* External Verified Directory Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
              <a
                href="https://www.justdial.com/Vellore/Jhonson-Food-Court-Jfc-Bagayam-Pennathur/9999PX416-X416-240319224157-K4W3_BZDET"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-red-500/40 text-red-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>Justdial Verified</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-ubuntu">
              Food Court Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-400 transition-colors">
                  Multi-Cuisine Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Johnson Food Court
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  Open-Air Ambience Gallery
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-amber-400 transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-amber-400 transition-colors">
                  Book A Garden Table
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact &amp; Driving Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Signature Specialties */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-ubuntu">
              Popular Specialties
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>JFC Special Rumali Shawarma</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Crispy Honey Chilli Chicken</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Charcoal Tandoori &amp; BBQ Chicken</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Ambur Seeraga Samba Dum Biryani</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Malabar Bun Parotta with Salna</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Tender Coconut Falooda &amp; Shakes</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-ubuntu">
              Location &amp; Timings
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sherwood, Bagayam, Arni Road, Pennathur, Vellore, Tamil Nadu – 632011
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919965278872" className="hover:text-white transition-colors">
                  +91 99652 78872
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@johnsonfoodcourt.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Mon &ndash; Sat: 10:30 AM &ndash; 11:30 PM
                  <br />
                  Sun: 12:30 PM &ndash; 11:30 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Johnson Food Court (JFC). All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Dining
            </Link>
            <a
              href="https://maps.app.goo.gl/VubJq18cKDMrij7w5"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
