"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Eye,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Mail,
  Ban,
  Unlock,
} from "lucide-react";
import type { TCustomerWithStats } from "./page";

type Props = {
  initialCustomers: TCustomerWithStats[];
  currentAdminEmail: string;
};

export default function AdminCustomersClient({
  initialCustomers,
  currentAdminEmail,
}: Props) {
  const [customers, setCustomers] =
    useState<TCustomerWithStats[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] =
    useState<TCustomerWithStats | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [blockConfirmUser, setBlockConfirmUser] =
    useState<TCustomerWithStats | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleBlock = async (customer: TCustomerWithStats) => {
    setActionLoading(customer._id);
    try {
      const res = await fetch(`/api/admin/customers/${customer._id}/block`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user status.");

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === customer._id ? { ...c, isBlocked: data.isBlocked } : c
        )
      );

      if (selectedCustomer && selectedCustomer._id === customer._id) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, isBlocked: data.isBlocked } : null
        );
      }

      showToast(data.message, "success");
      setBlockConfirmUser(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update block status.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && c.isBlocked) ||
      (statusFilter === "active" && !c.isBlocked);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
          Manage Users
        </h1>
        <p className="text-mute text-sm mt-1">
          View all registered customers, view customer details, and block or unblock customer accounts.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-cream-deep/70 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-soft/40 border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-cream-soft/50 border border-cream-deep text-ink text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-forest cursor-pointer w-full md:w-auto"
        >
          <option value="all">All Accounts</option>
          <option value="active">Active Accounts</option>
          <option value="blocked">Blocked Accounts</option>
        </select>
      </div>

      {/* Customers Table */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/70">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No customers found</p>
          <p className="text-xs text-mute-soft mt-1">
            Try adjusting your search query or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-deep/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-deep/40 bg-cream-soft/40 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Account Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Registered
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/30">
                {filteredCustomers.map((cust) => {
                  const isCurrentAdmin =
                    cust.email === currentAdminEmail;
                  const isBlocked = cust.isBlocked;
                  const regDate = cust.createdAt
                    ? new Date(cust.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={cust._id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-forest/10 text-forest overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs relative">
                            {cust.image ? (
                              <Image
                                src={cust.image}
                                alt={cust.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              cust.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{cust.name}</p>
                            <p className="text-xs text-mute">{cust.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            cust.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-cream-soft text-mute"
                          }`}
                        >
                          {cust.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-ink">
                          {cust.stats.totalAppointments}
                        </span>
                        <span className="text-xs text-mute ml-1">
                          ({cust.stats.confirmedAppointments} confirmed)
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-ink">
                        ${cust.stats.totalSpent.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-mute">{regDate}</td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="p-1.5 rounded-lg hover:bg-cream-soft text-mute hover:text-ink transition-colors cursor-pointer"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Block / Unblock User */}
                          {!isCurrentAdmin && cust.role !== "admin" && (
                            <button
                              onClick={() => setBlockConfirmUser(cust)}
                              disabled={actionLoading === cust._id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
                                isBlocked
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              }`}
                              title={isBlocked ? "Unblock User" : "Block User"}
                            >
                              {actionLoading === cust._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : isBlocked ? (
                                <Unlock className="w-3 h-3" />
                              ) : (
                                <Ban className="w-3 h-3" />
                              )}
                              {isBlocked ? "Unblock" : "Block"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-cream-deep overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-deep/50 bg-cream-soft/40">
              <h3 className="font-display text-xl text-ink font-semibold">
                Customer Details
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg hover:bg-cream-deep text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* User Profile Overview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-cream-soft/40 border border-cream-deep/60">
                <div className="w-16 h-16 rounded-full bg-forest/10 text-forest overflow-hidden shrink-0 flex items-center justify-center font-bold text-lg relative">
                  {selectedCustomer.image ? (
                    <Image
                      src={selectedCustomer.image}
                      alt={selectedCustomer.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    selectedCustomer.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="font-display text-xl text-ink font-medium">
                    {selectedCustomer.name}
                  </h4>
                  <p className="text-xs text-mute flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-forest" />
                    {selectedCustomer.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-soft text-ink border border-cream-deep">
                      {selectedCustomer.role}
                    </span>
                    {selectedCustomer.isBlocked ? (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Account
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Total Bookings
                  </p>
                  <p className="text-xl font-bold text-ink">
                    {selectedCustomer.stats.totalAppointments}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Confirmed Visits
                  </p>
                  <p className="text-xl font-bold text-emerald-700">
                    {selectedCustomer.stats.confirmedAppointments}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Pending Requests
                  </p>
                  <p className="text-xl font-bold text-amber-700">
                    {selectedCustomer.stats.pendingAppointments}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Total Spent
                  </p>
                  <p className="text-xl font-bold text-ink">
                    ${selectedCustomer.stats.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Security Status Note */}
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  selectedCustomer.isBlocked
                    ? "bg-rose-50/70 border-rose-200 text-rose-900"
                    : "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {selectedCustomer.isBlocked ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Platform Access Blocked
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Full Platform Access Permitted
                    </>
                  )}
                </div>
                <p>
                  {selectedCustomer.isBlocked
                    ? "This user is currently blocked from requesting appointments and accessing protected dashboard features."
                    : "This user is active and can browse services, request appointments, and view booking details."}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-cream-deep/50 bg-cream-soft/30 flex items-center justify-between gap-3">
              {selectedCustomer.email !== currentAdminEmail &&
                selectedCustomer.role !== "admin" && (
                  <button
                    onClick={() => {
                      setBlockConfirmUser(selectedCustomer);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                      selectedCustomer.isBlocked
                        ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {selectedCustomer.isBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        Block User
                      </>
                    )}
                  </button>
                )}

              <button
                onClick={() => setSelectedCustomer(null)}
                className="ml-auto px-4 py-2 rounded-xl border border-cream-deep text-xs font-medium text-mute hover:text-ink hover:bg-cream-soft transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block / Unblock Confirmation Modal */}
      {blockConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-cream-deep text-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                blockConfirmUser.isBlocked
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {blockConfirmUser.isBlocked ? (
                <Unlock className="w-7 h-7" />
              ) : (
                <Ban className="w-7 h-7" />
              )}
            </div>

            <h3 className="font-display text-xl text-ink font-semibold mb-2">
              {blockConfirmUser.isBlocked ? "Unblock Customer" : "Block Customer"}
            </h3>

            <p className="text-sm text-mute leading-relaxed mb-6">
              {blockConfirmUser.isBlocked ? (
                <>
                  Are you sure you want to unblock{" "}
                  <span className="font-semibold text-ink">
                    {blockConfirmUser.name}
                  </span>
                  ? They will regain access to booking and dashboard features.
                </>
              ) : (
                <>
                  Are you sure you want to block{" "}
                  <span className="font-semibold text-ink">
                    {blockConfirmUser.name}
                  </span>
                  ? Blocked users will not be able to access protected platform features.
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBlockConfirmUser(null)}
                className="flex-1 py-2.5 rounded-xl border border-cream-deep text-sm font-medium text-mute hover:bg-cream-soft transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleToggleBlock(blockConfirmUser)}
                disabled={actionLoading === blockConfirmUser._id}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  blockConfirmUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {actionLoading === blockConfirmUser._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : blockConfirmUser.isBlocked ? (
                  "Confirm Unblock"
                ) : (
                  "Confirm Block"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
