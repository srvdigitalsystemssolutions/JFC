'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Phone,
  User,
  X,
  MessageSquare,
  Reply,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 250);
    return () => clearTimeout(timer);
  }, [statusFilter, searchTerm]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let url = statusFilter === 'ALL' ? '/api/admin/messages' : `/api/admin/messages?status=${statusFilter}`;
      if (searchTerm) {
        url += (statusFilter === 'ALL' ? '?' : '&') + `search=${encodeURIComponent(searchTerm)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setMessages(data.messages || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleView = (m: any) => {
    setSelectedMessage(m);
    if (m.status === 'UNREAD') {
      handleUpdateStatus(m.id, 'READ');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Customer Inquiries & Banquet Leads</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400">
            Submissions received from website contact form, private dining and event requests
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sender, email, subject..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['ALL', 'UNREAD', 'READ', 'REPLIED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Message Snippet</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No messages in this folder.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => handleView(m)}
                    className={`cursor-pointer transition-colors ${
                      m.status === 'UNREAD'
                        ? 'bg-orange-50/30 hover:bg-orange-50/60 font-semibold'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'UNREAD'
                            ? 'bg-orange-100 text-orange-800'
                            : m.status === 'READ'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                      {m.subject || 'Website Inquiry'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate">
                      {m.message}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {formatDate(m.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleView(m)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Inquiry Details
              </span>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedMessage.subject || 'No Subject'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  Received on {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sender: <b>{selectedMessage.name}</b></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email: <b>{selectedMessage.email}</b></span>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone: <b>{selectedMessage.phone}</b></span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                  Message Content:
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Status:</span>
                {(['UNREAD', 'READ', 'REPLIED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(selectedMessage.id, s)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      selectedMessage.status === s
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject || 'Restaurant Enquiry'
                )}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
