'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Plus,
  Users,
  QrCode,
  Edit2,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  X,
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function TableManagementPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any>(null);
  const [selectedQrTable, setSelectedQrTable] = useState<any>(null);
  const [tableQrDataUrl, setTableQrDataUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    floorZone: 'Main Dining',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    fetchTables();
  }, [search]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/admin/tables?search=${encodeURIComponent(search)}` : '/api/admin/tables';
      const res = await fetch(url);
      const data = await res.json();
      setTables(data.tables || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (t?: any) => {
    if (t) {
      setEditingTable(t);
      setFormData({
        tableNumber: t.tableNumber,
        capacity: t.capacity,
        floorZone: t.floorZone,
        status: t.status,
      });
    } else {
      setEditingTable(null);
      const nextNum = `T-0${tables.length + 1}`;
      setFormData({
        tableNumber: nextNum,
        capacity: 4,
        floorZone: 'Main Dining',
        status: 'AVAILABLE',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingTable ? 'PUT' : 'POST';
      const body = editingTable ? { ...formData, id: editingTable.id } : formData;

      const res = await fetch('/api/admin/tables', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTables();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    try {
      await fetch('/api/admin/tables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tableId, status: newStatus }),
      });
      fetchTables();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this dining table?')) return;
    try {
      await fetch(`/api/admin/tables?id=${id}`, { method: 'DELETE' });
      fetchTables();
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewQr = async (table: any) => {
    setSelectedQrTable(table);
    try {
      const res = await fetch(`/api/admin/qr?tableNumber=${encodeURIComponent(table.tableNumber)}`);
      const data = await res.json();
      setTableQrDataUrl(data.qrDataUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const statusStyles: Record<string, { bg: string; text: string; badge: string }> = {
    AVAILABLE: { bg: 'border-emerald-200 bg-emerald-50/20', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
    OCCUPIED: { bg: 'border-rose-200 bg-rose-50/20', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
    RESERVED: { bg: 'border-amber-200 bg-amber-50/20', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
    CLEANING: { bg: 'border-blue-200 bg-blue-50/20', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Table & Floor Layout Management
          </h1>
          <p className="text-xs text-slate-400">
            Configure dining floor zones, table seating capacities and contactless QR order tokens
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dining Table</span>
        </button>
      </div>

      {/* In-Page Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tables by table number (T-01...), floor zone or status..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tables Counter */}
      {search && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span>Found <b>{tables.length}</b> {tables.length === 1 ? 'table' : 'tables'} matching "<b>{search}</b>"</span>
          <button onClick={() => setSearch('')} className="text-orange-600 font-semibold hover:underline">
            Reset search filter
          </button>
        </div>
      )}

      {/* Floor Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            Loading tables...
          </div>
        ) : tables.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400">
            No tables found matching your search.
          </div>
        ) : (
          tables.map((t) => {
            const currentStyle = statusStyles[t.status] || statusStyles.AVAILABLE;
            const activeOrder = t.orders && t.orders.length > 0 ? t.orders[0] : null;

            return (
              <div
                key={t.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-sm bg-white hover:shadow-md ${currentStyle.bg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black text-slate-800 tracking-tight">
                      {t.tableNumber}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${currentStyle.badge}`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capacity: <b>{t.capacity} Guests</b></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Zone: <b>{t.floorZone}</b></span>
                    </div>
                  </div>

                  {/* Active Order Preview if Occupied */}
                  {activeOrder && (
                    <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60 mb-3 text-[11px]">
                      <div className="flex justify-between font-bold text-orange-950 mb-0.5">
                        <span>{activeOrder.orderNumber}</span>
                        <span className="capitalize">{activeOrder.status.toLowerCase()}</span>
                      </div>
                      <p className="text-slate-600 truncate">
                        {activeOrder.customerName || 'Dine-In Guest'} ({activeOrder.items?.length || 0} items)
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {/* Status Dropdown */}
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    className="text-[11px] font-bold px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="CLEANING">Cleaning</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewQr(t)}
                      title="View QR Code"
                      className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(t)}
                      title="Edit Table"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      title="Delete Table"
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">
                {editingTable ? 'Edit Dining Table' : 'Add Dining Table'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Table Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  placeholder="e.g. T-09"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Seating Capacity (Guests) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={24}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Floor Zone / Location
                </label>
                <select
                  value={formData.floorZone}
                  onChange={(e) => setFormData({ ...formData, floorZone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="Main Dining">Main Dining</option>
                  <option value="Family Corner">Family Corner</option>
                  <option value="Rooftop Deck">Rooftop Deck</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Garden Terrace">Garden Terrace</option>
                  <option value="Bar Section">Bar Section</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLEANING">Cleaning</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md shadow-orange-500/20"
                >
                  {editingTable ? 'Update Table' : 'Add Table'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Specific QR Code Standee Modal */}
      {selectedQrTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">
                Table Standee QR: {selectedQrTable.tableNumber}
              </span>
              <button
                onClick={() => setSelectedQrTable(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Guests seated at <b>{selectedQrTable.tableNumber}</b> can scan this to order directly to their table.
            </p>

            {tableQrDataUrl ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <img src={tableQrDataUrl} alt="Table QR" className="w-48 h-48 rounded-lg shadow-sm" />
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  Table Token: {selectedQrTable.qrCodeToken}
                </span>
              </div>
            ) : (
              <div className="py-10 text-xs text-slate-400">Loading Table QR...</div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <a
                href={tableQrDataUrl}
                download={`${selectedQrTable.tableNumber}-qr.png`}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR</span>
              </a>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sticker</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
