import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royal Spice Grand | Authentic Royal Dining & Briyani',
  description: 'Authentic Chennai & Royal Spice Biryani, Table Reservations, Kitchen Display & POS Billing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Aguafina+Script&family=Dancing+Script:wght@600;700&family=Droid+Serif:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Ubuntu:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
