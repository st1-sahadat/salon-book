"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Scissors,
  MessageSquare,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import type { TAdminAppointment } from "./page";

type Props = {
  initialAppointments: TAdminAppointment[];
};

export default function AdminAppointmentsClient({
  initialAppointments,
}: Props) {
  const [appointments, setAppointments] =
    useState<TAdminAppointment[]>(initialAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] =
    useState<TAdminAppointment | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Rule: Only pending appointments can be confirmed.
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
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: "Confirmed" } : null
        );
      }
      showToast("Appointment confirmed successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to confirm appointment.";
      showToast(msg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Rule: Cancel Pending or Confirmed Appointments
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
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment((prev) =>
          prev ? { ...prev, status: "Cancelled" } : null
        );
      }
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
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Confirmed
        </span>
      );
    if (s === "pending")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
        <XCircle className="w-3.5 h-3.5 text-rose-500" />
        Cancelled
      </span>
    );
  };

  const paymentBadge = (paymentStatus: string) => {
    const p = paymentStatus.toLowerCase();
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

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const q = search.toLowerCase();
    const matchesSearch =
      apt.customerName.toLowerCase().includes(q) ||
      apt.customerEmail.toLowerCase().includes(q) ||
      apt.serviceName.toLowerCase().includes(q) ||
      apt.serviceCategory.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      apt.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      apt.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
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
          Manage Appointments
        </h1>
        <p className="text-mute text-sm mt-1">
          Review all appointment requests, view full details, confirm pending requests, and manage cancellations.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-cream-deep/70 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
          <input
            type="text"
            placeholder="Search by customer name, email, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-soft/40 border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cream-soft/50 border border-cream-deep text-ink text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-cream-soft/50 border border-cream-deep text-ink text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/70">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No appointments found</p>
          <p className="text-xs text-mute-soft mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-deep/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-deep/40 bg-cream-soft/40 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Customer Info
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Service Info
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
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Request Date
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/30">
                {filteredAppointments.map((apt) => {
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

                  const requestedDate = apt.createdAt
                    ? new Date(apt.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
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
                      {/* Customer Information */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-forest/10 text-forest overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs relative">
                            {apt.customerImage ? (
                              <Image
                                src={apt.customerImage}
                                alt={apt.customerName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              apt.customerName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">
                              {apt.customerName}
                            </p>
                            <p className="text-xs text-mute">
                              {apt.customerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Information */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-ink">
                          {apt.serviceName}
                        </p>
                        <p className="text-xs text-mute">
                          {apt.serviceCategory} · {apt.duration} min
                        </p>
                      </td>

                      {/* Appointment Date and Time */}
                      <td className="px-4 py-3.5">
                        <p className="text-ink font-medium">{dateFormatted}</p>
                        <p className="text-xs text-mute">{apt.timeSlot}</p>
                      </td>

                      {/* Service Price */}
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        ${apt.servicePrice.toFixed(2)}
                      </td>

                      {/* Appointment Status */}
                      <td className="px-4 py-3.5">{statusBadge(apt.status)}</td>

                      {/* Payment Status */}
                      <td className="px-4 py-3.5">
                        {paymentBadge(apt.paymentStatus)}
                      </td>

                      {/* Booking Request Date */}
                      <td className="px-4 py-3.5 text-xs text-mute">
                        {requestedDate}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1.5 rounded-lg hover:bg-cream-soft text-mute hover:text-ink transition-colors cursor-pointer"
                            title="View Appointment Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Rule: Only pending appointments can be confirmed */}
                          {isPending && (
                            <button
                              onClick={() => handleConfirm(apt._id)}
                              disabled={actionLoading === apt._id}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                              title="Confirm pending appointment"
                            >
                              {actionLoading === apt._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Confirm
                            </button>
                          )}

                          {/* Rule: Cancel Pending or Confirmed Appointments */}
                          {canCancel && (
                            <button
                              onClick={() => handleCancel(apt._id)}
                              disabled={actionLoading === apt._id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer border border-rose-200"
                              title="Cancel appointment"
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
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-cream-deep overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-deep/50 bg-cream-soft/40">
              <h3 className="font-display text-xl text-ink font-semibold">
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg hover:bg-cream-deep text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Customer Information */}
              <div className="bg-cream-soft/40 rounded-2xl p-4 border border-cream-deep/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-forest mb-2">
                  Customer Information
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-forest/10 text-forest overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm relative">
                    {selectedAppointment.customerImage ? (
                      <Image
                        src={selectedAppointment.customerImage}
                        alt={selectedAppointment.customerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      selectedAppointment.customerName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-base">
                      {selectedAppointment.customerName}
                    </h4>
                    <p className="text-xs text-mute">
                      {selectedAppointment.customerEmail}
                    </p>
                    {selectedAppointment.customerId && (
                      <p className="text-[10px] text-mute-soft font-mono mt-0.5">
                        ID: {selectedAppointment.customerId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-cream-soft/40 rounded-2xl p-4 border border-cream-deep/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-forest mb-2">
                  Service Information
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cream-soft overflow-hidden shrink-0 relative border border-cream-deep/60">
                    {selectedAppointment.serviceImage ? (
                      <Image
                        src={selectedAppointment.serviceImage}
                        alt={selectedAppointment.serviceName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-brass" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink text-base">
                      {selectedAppointment.serviceName}
                    </h4>
                    <p className="text-xs text-mute flex items-center gap-2">
                      <span className="bg-white px-2 py-0.5 rounded-full border border-cream-deep/60">
                        {selectedAppointment.serviceCategory}
                      </span>
                      <span>·</span>
                      <span>{selectedAppointment.duration} minutes</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment Date, Time & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Appointment Date
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    {selectedAppointment.appointmentDate
                      ? new Date(
                          selectedAppointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Time Slot
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    {selectedAppointment.timeSlot}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Service Price
                  </p>
                  <p className="text-base font-bold text-ink">
                    ${selectedAppointment.servicePrice.toFixed(2)}
                  </p>
                </div>

                <div className="p-3 bg-cream-soft/30 rounded-xl border border-cream-deep/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Booking Request Date
                  </p>
                  <p className="text-xs font-medium text-ink">
                    {selectedAppointment.createdAt
                      ? new Date(
                          selectedAppointment.createdAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Status & Payment Status */}
              <div className="flex items-center gap-3 p-3 bg-cream-soft/40 rounded-xl border border-cream-deep/60">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Appointment Status
                  </p>
                  {statusBadge(selectedAppointment.status)}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1">
                    Payment Status
                  </p>
                  {paymentBadge(selectedAppointment.paymentStatus)}
                </div>
              </div>

              {/* Customer Message (if provided) */}
              {selectedAppointment.notes ? (
                <div className="p-3.5 bg-cream-soft/30 rounded-xl border border-cream-deep/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mute mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-forest" />
                    Customer Message
                  </p>
                  <p className="text-sm text-ink leading-relaxed">
                    &ldquo;{selectedAppointment.notes}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-cream-soft/20 rounded-xl border border-cream-deep/40 text-xs text-mute-soft italic">
                  No special instructions or customer message provided.
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-cream-deep/50 bg-cream-soft/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Rule: Only pending appointments can be confirmed */}
                {selectedAppointment.status.toLowerCase() === "pending" && (
                  <button
                    onClick={() => handleConfirm(selectedAppointment._id)}
                    disabled={actionLoading === selectedAppointment._id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-forest hover:bg-forest-deep rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {actionLoading === selectedAppointment._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    Confirm Appointment
                  </button>
                )}

                {/* Rule: Cancel Pending or Confirmed Appointments */}
                {(selectedAppointment.status.toLowerCase() === "pending" ||
                  selectedAppointment.status.toLowerCase() === "confirmed") && (
                  <button
                    onClick={() => handleCancel(selectedAppointment._id)}
                    disabled={actionLoading === selectedAppointment._id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer border border-rose-200"
                  >
                    {actionLoading === selectedAppointment._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    Cancel Appointment
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl border border-cream-deep text-xs font-medium text-mute hover:text-ink hover:bg-cream-soft transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
