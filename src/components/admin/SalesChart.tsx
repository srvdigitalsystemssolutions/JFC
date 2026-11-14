'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SalesChartProps {
  data: {
    day: string;
    sales: number;
    orders: number;
  }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="day"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: any, name: string) => [
              name === 'sales' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
              name === 'sales' ? 'Revenue' : 'Orders',
            ]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#f97316"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
