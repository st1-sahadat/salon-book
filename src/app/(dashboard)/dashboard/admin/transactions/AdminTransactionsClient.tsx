"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  Receipt,
} from "lucide-react";
import type { TTransaction } from "./page";

type Props = {
  transactions: TTransaction[];
};

export default function AdminTransactionsClient({ transactions }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const paidTransactions = transactions.filter(
    (t) => t.paymentStatus.toLowerCase() === "paid"
  );
  const totalRevenue = paidTransactions.reduce(
    (sum, t) => sum + t.servicePrice,
    0
  );
  const pendingPayments = transactions.filter(
    (t) =>
      t.paymentStatus.toLowerCase() !== "paid" &&
      t.status.toLowerCase() !== "cancelled"
  );
  const pendingAmount = pendingPayments.reduce(
    (sum, t) => sum + t.servicePrice,
    0
  );

  const filteredTransactions = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      t.customerName.toLowerCase().includes(q) ||
      t.customerEmail.toLowerCase().includes(q) ||
      t.serviceName.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      t.paymentStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
          Transactions & Revenue
        </h1>
        <p className="text-mute text-sm mt-1">
          Monitor payment statuses, completed charges, and revenue across all salon bookings.
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-forest">
              Total Revenue
            </p>
            <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-mute mt-1">
            From {paidTransactions.length} settled appointments
          </p>
        </div>

        {/* Successful Payments */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-emerald-800">
              Paid Appointments
            </p>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            {paidTransactions.length}
          </p>
          <p className="text-xs text-mute mt-1">Successful transactions</p>
        </div>

        {/* Pending Receivables */}
        <div className="bg-white rounded-2xl p-5 border border-cream-deep/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-wider uppercase text-amber-800">
              Pending Receivables
            </p>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display text-4xl text-ink font-normal">
            ${pendingAmount.toFixed(2)}
          </p>
          <p className="text-xs text-mute mt-1">
            {pendingPayments.length} unpaid bookings
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-cream-deep/70 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
          <input
            type="text"
            placeholder="Search transactions by customer or service..."
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
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid Only</option>
          <option value="unpaid">Unpaid Only</option>
        </select>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/70">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <Receipt className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No transactions found</p>
          <p className="text-xs text-mute-soft mt-1">
            Completed or pending payments will appear here.
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
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Payment Status
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Appointment Status
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/30">
                {filteredTransactions.map((tx) => {
                  const isPaid = tx.paymentStatus.toLowerCase() === "paid";
                  const txDate = tx.paidAt || tx.createdAt;
                  const dateFormatted = txDate
                    ? new Date(txDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-ink">
                          {tx.customerName}
                        </p>
                        <p className="text-xs text-mute">{tx.customerEmail}</p>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-ink">
                        {tx.serviceName}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-ink">
                        ${tx.servicePrice.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cream-soft text-mute">
                          {tx.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right text-xs text-mute">
                        {dateFormatted}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
