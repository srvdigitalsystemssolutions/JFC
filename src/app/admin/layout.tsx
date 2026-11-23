import React from 'react';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminRoleSwitcher from '@/components/common/AdminRoleSwitcher';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Route protection: Only SUPER_ADMIN can access the /admin suite
  // If not authenticated as SUPER_ADMIN, redirect to login with target=admin (do NOT bounce to billing/chef)
  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/login?target=admin');
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Top Super Admin View Switcher */}
      <AdminRoleSwitcher />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Fixed Admin Sidebar */}
        <AdminSidebar currentUser={user} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <AdminTopbar />

          {/* Dynamic Page Views */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
