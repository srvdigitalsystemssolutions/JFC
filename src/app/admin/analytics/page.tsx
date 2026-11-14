'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Grid,
  Calendar,
  Filter,
  Download,
  Award,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  const [range, setRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

  const categoryDistribution = [
    { name: 'Starters', value: 35 },
    { name: 'Main Course', value: 45 },
    { name: 'Breads & Rice', value: 25 },
    { name: 'Desserts', value: 15 },
    { name: 'Beverages', value: 20 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Sales & Operational Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive business performance, order velocity and revenue intelligence
          </p>
        </div>

        {/* Range Buttons & Export */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  range === r
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              {range} Gross Revenue
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {formatCurrency(data?.summary?.totalRevenue || 863.5)}
          </h2>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% vs previous period
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Avg Order Value (AOV)
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {formatCurrency(data?.summary?.averageOrderValue || 431)}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">Based on closed checks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Table Occupancy
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Grid className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {data?.summary?.occupiedTables || 2} / {data?.summary?.totalTables || 8}
          </h2>
          <p className="text-[11px] text-purple-600 font-medium mt-1">
            {data?.summary?.totalTables
              ? Math.round((data.summary.occupiedTables / data.summary.totalTables) * 100)
              : 25}% live floor utilization
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Active Guests
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {data?.summary?.totalCustomers || 18} Diners
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">Registered & walk-in clients</p>
        </div>
      </div>

      {/* Main Charts: Revenue Velocity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Orders Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-1">
            Sales & Orders Performance
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Daily breakdown of sales volume and ticket frequency
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data?.trendData || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${val}`, 'Sales']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800 mb-1">
              Sales by Category
            </h2>
            <p className="text-xs text-slate-400 mb-2">Revenue contribution percentage</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-slate-100">
            {categoryDistribution.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-slate-600 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Menu Items Leaderboard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Best-Selling Menu Items
            </h2>
            <p className="text-xs text-slate-400">
              Top revenue drivers and customer favorites
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Top Ranked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.popularItems && data.popularItems.length > 0
            ? data.popularItems
            : [
                { name: 'Royal Butter Chicken', quantity: 48, revenue: 18720 },
                { name: 'Dum Pukht Mutton Biryani', quantity: 42, revenue: 18900 },
                { name: 'Dal Makhani Bukhara', quantity: 38, revenue: 9880 },
                { name: 'Paneer Tikka Angara', quantity: 34, revenue: 9520 },
                { name: 'Garlic Butter Naan', quantity: 95, revenue: 7125 },
                { name: 'Saffron Gulab Jamun with Rabri', quantity: 29, revenue: 5220 },
              ]
          ).map((item: any, idx: number) => (
            <div
              key={item.name}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-orange-200 transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 font-extrabold flex items-center justify-center text-xs shrink-0">
                #{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-800 truncate">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{item.quantity} orders</span>
                  <span className="font-bold text-slate-900">{formatCurrency(item.revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
