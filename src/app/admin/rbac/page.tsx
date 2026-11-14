'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Save,
  Check,
  X,
  Users,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function RbacPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [modules, setModules] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [permissionsState, setPermissionsState] = useState<Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Role Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  useEffect(() => {
    fetchRbac();
  }, []);

  const fetchRbac = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/rbac');
      const data = await res.json();
      setRoles(data.roles || []);
      setModules(data.modules || []);

      if (data.roles && data.roles.length > 0) {
        selectRole(data.roles[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role: any) => {
    setSelectedRole(role);
    const permMap: Record<string, { canCreate: boolean; canRead: boolean; canUpdate: boolean; canDelete: boolean }> = {};

    role.permissions?.forEach((p: any) => {
      permMap[p.module] = {
        canCreate: p.canCreate,
        canRead: p.canRead,
        canUpdate: p.canUpdate,
        canDelete: p.canDelete,
      };
    });

    setPermissionsState(permMap);
  };

  const handleToggle = (module: string, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete') => {
    setPermissionsState((prev) => {
      const current = prev[module] || { canCreate: false, canRead: true, canUpdate: false, canDelete: false };
      return {
        ...prev,
        [module]: {
          ...current,
          [action]: !current[action],
        },
      };
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const permArray = Object.entries(permissionsState).map(([module, perms]) => ({
        module,
        ...perms,
      }));

      const res = await fetch('/api/admin/rbac', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleId: selectedRole.id,
          permissions: permArray,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    try {
      const res = await fetch('/api/admin/rbac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, description: newRoleDesc }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewRoleName('');
        setNewRoleDesc('');
        fetchRbac();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Role-Based Access Control (RBAC) Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Define system roles and enforce granular Create, Read, Update, Delete access boundaries
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List Sidebar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            System Roles ({roles.length})
          </h2>

          <div className="space-y-1.5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => selectRole(r)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col justify-between border ${
                  selectedRole?.id === r.id
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20 font-bold'
                    : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">{r.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedRole?.id === r.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {r._count?.users || 0} Users
                  </span>
                </div>
                <p
                  className={`text-[11px] mt-1 line-clamp-1 font-normal ${
                    selectedRole?.id === r.id ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  {r.description || 'System role access'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-800">
                    Permissions for: <span className="text-orange-600">{selectedRole?.name}</span>
                  </h2>
                  {selectedRole?.name === 'SUPER_ADMIN' && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      Full Root Access
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check or uncheck privileges below to configure real API route enforcement.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </div>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Application Module</th>
                    <th className="py-3 px-4 text-center">Can Create</th>
                    <th className="py-3 px-4 text-center">Can Read</th>
                    <th className="py-3 px-4 text-center">Can Update</th>
                    <th className="py-3 px-4 text-center">Can Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {modules.map((mod) => {
                    const perm = permissionsState[mod] || {
                      canCreate: false,
                      canRead: true,
                      canUpdate: false,
                      canDelete: false,
                    };

                    return (
                      <tr key={mod} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mod}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.canCreate}
                            onChange={() => handleToggle(mod, 'canCreate')}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.canRead}
                            onChange={() => handleToggle(mod, 'canRead')}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.canUpdate}
                            onChange={() => handleToggle(mod, 'canUpdate')}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={perm.canDelete}
                            onChange={() => handleToggle(mod, 'canDelete')}
                            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
            <span className="text-xs text-slate-400">
              Changes apply instantly to role-based session authorizations
            </span>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Matrix...' : 'Save Permissions Matrix'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Add New System Role</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. INVENTORY_MANAGER"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Responsibilities and access scope..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
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
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
