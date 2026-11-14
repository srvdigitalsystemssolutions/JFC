import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Royal Spice | Restaurant Management & POS',
  description: 'Enterprise Restaurant Management System - Super Admin, Kitchen Display & POS Billing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
