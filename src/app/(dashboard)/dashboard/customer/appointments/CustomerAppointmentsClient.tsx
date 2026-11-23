"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Eye,
  X,
  Loader2,
  AlertTriangle,
  Scissors,
  Tag,
  FileText,
} from "lucide-react";
import type { TAppointment } from "./page";
import Link from "next/link";

type Props = {
  appointments: TAppointment[];
};

export default function CustomerAppointmentsClient({ appointments: initialAppointments }: Props) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<TAppointment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredAppointments =
    filterStatus === "all"
      ? appointments
      : appointments.filter(
          (a) => a.status.toLowerCase() === filterStatus.toLowerCase()
        );

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel.");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "Cancelled" } : a
        )
      );
      setSelectedAppointment(null);
      showToast("Appointment cancelled successfully.", "success");
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Failed to cancel appointment.",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "confirmed")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Confirmed
        </span>
      );
    if (s === "pending")
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  };

  const paymentBadge = (ps: string) => {
    const p = ps.toLowerCase();
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

  // Can cancel: only Pending appointments
  const canCancel = (a: TAppointment) =>
    a.status.toLowerCase() === "pending";

  // Can pay: only Confirmed + Unpaid
  const canPay = (a: TAppointment) =>
    a.status.toLowerCase() === "confirmed" &&
    a.paymentStatus.toLowerCase() !== "paid";

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
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-ink font-normal tracking-tight">
          My Appointments
        </h1>
        <p className="text-mute text-sm mt-1">
          All appointment requests submitted by you, with their current status.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "pending", "confirmed", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
              filterStatus === tab
                ? "bg-forest text-cream"
                : "bg-cream-soft text-mute hover:bg-cream-deep"
            }`}
          >
            {tab === "all" ? "All" : tab}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/60">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <CalendarCheck className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No appointments found</p>
          <p className="text-xs text-mute-soft mt-1">
            {filterStatus === "all"
              ? "Book your first service to get started."
              : `No ${filterStatus} appointments.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-deep/60 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-deep/40 bg-cream-soft/50">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Date & Time
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Requested
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute">
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

                  return (
                    <tr
                      key={apt._id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-cream-soft relative">
                            {apt.serviceImage ? (
                              <Image
                                src={apt.serviceImage}
                                alt={apt.serviceName}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Scissors className="w-4 h-4 text-brass" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-ink truncate max-w-[160px]">
                            {apt.serviceName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-cream-soft text-mute px-2 py-0.5 rounded-full">
                          {apt.serviceCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-ink text-sm">{dateFormatted}</p>
                        <p className="text-xs text-mute">{apt.timeSlot}</p>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-ink">
                        ${apt.servicePrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">{statusBadge(apt.status)}</td>
                      <td className="px-4 py-3.5">
                        {paymentBadge(apt.paymentStatus)}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-mute">
                        {requestedDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="p-1.5 rounded-lg hover:bg-cream-soft text-mute hover:text-ink transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canCancel(apt) && (
                            <button
                              onClick={() => handleCancel(apt._id)}
                              disabled={actionLoading === apt._id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {actionLoading === apt._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              Cancel
                            </button>
                          )}
                          {canPay(apt) && (
                            <Link
                              href={`/checkout?appointmentId=${apt._id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors cursor-pointer"
                            >
                              <CreditCard className="w-3 h-3" />
                              Pay Now
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-cream-deep/30">
            {filteredAppointments.map((apt) => {
              const dateFormatted = apt.appointmentDate
                ? new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A";

              return (
                <div key={apt._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-cream-soft relative">
                        {apt.serviceImage ? (
                          <Image
                            src={apt.serviceImage}
                            alt={apt.serviceName}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Scissors className="w-4 h-4 text-brass" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">
                          {apt.serviceName}
                        </p>
                        <p className="text-xs text-mute">{apt.serviceCategory}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-ink">
                      ${apt.servicePrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-mute">
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="w-3 h-3" />
                      {dateFormatted}
                    </span>
                    <span>·</span>
                    <span>{apt.timeSlot}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {statusBadge(apt.status)}
                    {paymentBadge(apt.paymentStatus)}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-medium text-ink bg-cream-soft hover:bg-cream-deep rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                    {canCancel(apt) && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        disabled={actionLoading === apt._id}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoading === apt._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        Cancel
                      </button>
                    )}
                    {canPay(apt) && (
                      <Link
                        href={`/checkout?appointmentId=${apt._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-medium text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Now
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-cream-deep overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-deep/40 bg-cream-soft/50">
              <h3 className="font-display text-xl text-ink font-medium">
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1 rounded-lg hover:bg-cream-deep text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Service Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-cream-soft overflow-hidden relative shrink-0">
                  {selectedAppointment.serviceImage ? (
                    <Image
                      src={selectedAppointment.serviceImage}
                      alt={selectedAppointment.serviceName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Scissors className="w-6 h-6 text-brass" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-ink text-lg">
                    {selectedAppointment.serviceName}
                  </h4>
                  <p className="text-xs text-mute flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {selectedAppointment.serviceCategory}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-cream-soft/50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Date
                  </p>
                  <p className="text-sm text-ink font-medium">
                    {selectedAppointment.appointmentDate
                      ? new Date(
                          selectedAppointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-cream-soft/50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Time
                  </p>
                  <p className="text-sm text-ink font-medium">
                    {selectedAppointment.timeSlot}
                  </p>
                </div>
                <div className="bg-cream-soft/50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Price
                  </p>
                  <p className="text-sm text-ink font-semibold">
                    ${selectedAppointment.servicePrice.toFixed(2)}
                  </p>
                </div>
                <div className="bg-cream-soft/50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Duration
                  </p>
                  <p className="text-sm text-ink font-medium">
                    {selectedAppointment.duration} min
                  </p>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-3 p-3 bg-cream-soft/30 rounded-xl">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Appointment Status
                  </p>
                  {statusBadge(selectedAppointment.status)}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Payment Status
                  </p>
                  {paymentBadge(selectedAppointment.paymentStatus)}
                </div>
              </div>

              {/* Request Date */}
              <div className="flex items-center gap-2 text-xs text-mute">
                <FileText className="w-3.5 h-3.5" />
                Requested on{" "}
                {selectedAppointment.createdAt
                  ? new Date(
                      selectedAppointment.createdAt
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-cream-soft/50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-mute font-bold mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-ink">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-cream-deep/40 bg-cream-soft/30 flex items-center gap-3">
              {canCancel(selectedAppointment) && (
                <button
                  onClick={() => handleCancel(selectedAppointment._id)}
                  disabled={actionLoading === selectedAppointment._id}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer border border-rose-200"
                >
                  {actionLoading === selectedAppointment._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Cancel Request
                </button>
              )}
              {canPay(selectedAppointment) && (
                <Link
                  href={`/checkout?appointmentId=${selectedAppointment._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-forest hover:bg-forest-deep rounded-xl transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </Link>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="ml-auto inline-flex items-center px-4 py-2 text-sm font-medium text-mute hover:text-ink bg-cream-soft hover:bg-cream-deep rounded-xl transition-colors cursor-pointer"
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
