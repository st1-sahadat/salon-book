"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  CalendarCheck,
  Clock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  XCircle,
  Plus,
  Loader2,
  Calendar,
  AlertTriangle,
} from "lucide-react";

type StatProps = {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointmentRequests: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
};

type RecentAppointment = {
  _id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

type Props = {
  stats: StatProps;
  recentAppointments: RecentAppointment[];
  user: { name: string; email: string };
};

export default function AdminOverviewClient({
  stats,
  recentAppointments: initialAppointments,
  user,
}: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}/confirm`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm.");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "Confirmed" } : a))
      );
      showToast("Appointment confirmed successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to confirm appointment.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/appointments/${id}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel.");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "Cancelled" } : a))
      );
      showToast("Appointment cancelled successfully.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel appointment.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          Confirmed
        </span>
      );
    if (s === "pending")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
          <Clock className="w-3 h-3 text-amber-500" />
          Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
        <XCircle className="w-3 h-3 text-rose-500" />
        Cancelled
      </span>
    );
  };

  const paymentBadge = (pStatus: string) => {
    const p = pStatus.toLowerCase();
    if (p === "paid")
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Paid
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
        Unpaid
      </span>
    );
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] uppercase text-forest/70 mb-1">
            Salon Administration · Welcome, {user.name}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            Admin Overview
          </h1>
          <p className="text-mute text-sm mt-1">
            Real-time monitoring of customers, services, appointments, and transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/dashboard/admin/manage-service"
            className="inline-flex items-center gap-1.5 bg-forest text-cream px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-forest-deep transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </Link>
          <Link
            href="/dashboard/admin/appointment"
            className="inline-flex items-center gap-1.5 bg-cream-soft text-ink border border-cream-deep px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-cream-deep transition-colors"
          >
            <Calendar className="w-4 h-4 text-forest" />
            Manage Appointments
          </Link>
        </div>
      </div>

      {/* All 6 Required Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Total Registered Customers */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Registered Customers
            </p>
            <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {stats.totalCustomers}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-mute">Verified platform clients</span>
            <Link
              href="/dashboard/admin/customers"
              className="text-forest font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 2. Total Active Services */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Active Services
            </p>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {stats.totalActiveServices}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-mute">Live and bookable</span>
            <Link
              href="/dashboard/admin/manage-service"
              className="text-forest font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 3. Total Appointment Requests */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-mute">
              Total Appointment Requests
            </p>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {stats.totalAppointmentRequests}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-mute">All customer bookings</span>
            <Link
              href="/dashboard/admin/appointment"
              className="text-forest font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              All requests <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 4. Pending Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 bg-amber-50/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-amber-800">
              Pending Appointments
            </p>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-amber-950 font-normal">
            {stats.pendingAppointments}
          </p>
          <p className="text-xs text-amber-700 mt-2">
            Awaiting administrator confirmation
          </p>
        </div>

        {/* 5. Confirmed Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 bg-emerald-50/20 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-emerald-800">
              Confirmed Appointments
            </p>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-emerald-950 font-normal">
            {stats.confirmedAppointments}
          </p>
          <p className="text-xs text-emerald-700 mt-2">
            Scheduled & approved visits
          </p>
        </div>

        {/* 6. Total Successful Payments */}
        <div className="bg-white rounded-2xl p-5 border border-forest/30 bg-forest/5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-forest font-semibold">
              Successful Payments
            </p>
            <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {stats.totalSuccessfulPayments}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-mute">Completed transactions</span>
            <Link
              href="/dashboard/admin/transactions"
              className="text-forest font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              View ledger <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Appointments with Quick Actions */}
      <div className="bg-white rounded-2xl border border-cream-deep/70 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl text-ink font-medium">
              Recent Appointment Requests
            </h2>
            <p className="text-xs text-mute mt-0.5">
              Review, confirm, or cancel incoming customer appointment requests.
            </p>
          </div>
          <Link
            href="/dashboard/admin/appointment"
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-forest-deep transition-colors"
          >
            View all appointments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
              <CalendarCheck className="w-6 h-6 text-mute-soft" />
            </div>
            <p className="text-mute font-medium">No appointment requests yet</p>
            <p className="text-xs text-mute-soft mt-1">
              Customer bookings will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-deep/40 bg-cream-soft/40 text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Price
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/30">
                {appointments.map((apt) => {
                  const dateFormatted = apt.appointmentDate
                    ? new Date(apt.appointmentDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )
                    : "N/A";

                  const isPending =
                    apt.status.toLowerCase() === "pending";
                  const canCancel =
                    apt.status.toLowerCase() === "pending" ||
                    apt.status.toLowerCase() === "confirmed";

                  return (
                    <tr
                      key={apt._id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-ink">
                          {apt.customerName}
                        </p>
                        <p className="text-xs text-mute">{apt.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-ink">
                        {apt.serviceName}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-ink">{dateFormatted}</p>
                        <p className="text-xs text-mute">{apt.timeSlot}</p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        ${apt.servicePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(apt.status)}</td>
                      <td className="px-4 py-3.5">
                        {paymentBadge(apt.paymentStatus)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Only pending can be confirmed */}
                          {isPending && (
                            <button
                              onClick={() => handleConfirm(apt._id)}
                              disabled={actionLoading === apt._id}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                            >
                              {actionLoading === apt._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Confirm
                            </button>
                          )}
                          {/* Pending or Confirmed can be cancelled */}
                          {canCancel && (
                            <button
                              onClick={() => handleCancel(apt._id)}
                              disabled={actionLoading === apt._id}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer border border-rose-200"
                            >
                              {actionLoading === apt._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              Cancel
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
        )}
      </div>
    </div>
  );
}
