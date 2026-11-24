'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function BillingManagementPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [stats, setStats] = useState({ totalRevenue: 0, pendingAmount: 0, totalCount: 0 });

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    fetchBills();
  }, [statusFilter]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/billing?status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      setBills(data.bills || []);
      setStats({
        totalRevenue: data.totalRevenue || 0,
        pendingAmount: data.pendingAmount || 0,
        totalCount: data.totalCount || 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBills();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Billing & Invoices Ledger
          </h1>
          <p className="text-xs text-slate-400">
            View generated tax invoices, payment settlement channels and transaction logs
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Settled Revenue
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {formatCurrency(stats.totalRevenue)}
          </h2>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Paid transactions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Pending Bills
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {formatCurrency(stats.pendingAmount)}
          </h2>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting checkout</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Total Invoices
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {stats.totalCount} Bills
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">Registered in system</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice number (INV-...), table or customer name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Order / Table</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Subtotal</th>
                <th className="py-3.5 px-4">Tax (GST)</th>
                <th className="py-3.5 px-4">Grand Total</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    Loading bills...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {bill.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{bill.order?.orderNumber}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                          {bill.order?.table?.tableNumber || 'Takeaway'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {bill.order?.customerName || 'Walk-in Guest'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatCurrency(bill.subtotal)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatCurrency(bill.taxAmount)} ({bill.taxRate}%)
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatCurrency(bill.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          bill.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bill.paymentStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {formatDate(bill.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="px-2.5 py-1 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header / Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <span className="text-xs font-bold text-slate-500">TAX INVOICE PREVIEW</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1 text-xs font-semibold"
                >
                  <Printer className="w-4 h-4 text-orange-500" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs font-mono text-slate-800">
              <div className="text-center space-y-0.5">
                <h3 className="font-bold text-sm tracking-wide text-slate-900">JOHNSON FOOD COURT (JFC)</h3>
                <p className="text-[10px] text-slate-500">Sherwood, Arni Road, Pennathur, Vellore - 632011</p>
                <p className="text-[10px] text-slate-500">GSTIN: 33AAACJ1234F1Z5 | Phone: +91 99652 78872</p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between text-[11px]">
                <div>
                  <p>Invoice: <b>{selectedBill.invoiceNumber}</b></p>
                  <p>Table: <b>{selectedBill.order?.table?.tableNumber || 'Takeaway'}</b></p>
                </div>
                <div className="text-right">
                  <p>Date: {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                  <p>Status: <span className="text-emerald-600 font-bold">{selectedBill.paymentStatus}</span></p>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1">Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedBill.order?.items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-1.5">{item.menuItem?.name}</td>
                        <td className="py-1.5 text-center">{item.quantity}</td>
                        <td className="py-1.5 text-right font-medium">₹{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedBill.subtotal)}</span>
                </div>
                {selectedBill.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedBill.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({selectedBill.taxRate}%):</span>
                  <span>{formatCurrency(selectedBill.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-300 pt-1">
                  <span>GRAND TOTAL:</span>
                  <span>{formatCurrency(selectedBill.grandTotal)}</span>
                </div>
              </div>

              {selectedBill.payments && selectedBill.payments.length > 0 && (
                <div className="border-t border-dashed border-slate-300 pt-2 text-[10px] text-slate-500">
                  <p>Payment Mode: <b>{selectedBill.payments[0].paymentMethod}</b></p>
                  <p>Ref: {selectedBill.payments[0].transactionRef || 'N/A'}</p>
                </div>
              )}

              <div className="text-center pt-2 text-[10px] text-slate-400">
                <p>*** Thank You For Dining With Us! ***</p>
                <p>Please Visit Again</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
