"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  ShieldCheck,
  Sparkles,
  CalendarDays,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Phone,
  Loader2,
  UserCheck,
  Info,
} from "lucide-react";
import { IServices } from "@/components/Type/type";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getTokenFromClient } from "@/lib/getTokenFronClient";

interface BookingDetailsPageProps {
  service: IServices;
  initialUser?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
}

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
];

export default function BookingDetailsPage({ service, initialUser }: BookingDetailsPageProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  // Prefer live session, fallback to initial SSR user
  const currentUser = session?.user || initialUser;
  const isAuthenticated = !!currentUser?.email;
  const isAdmin = currentUser?.role === "admin";
  const isActive = service.status ? service.status.toLowerCase() === "active" : true;

  // Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    appointmentDate: string;
    timeSlot: string;
  } | null>(null);

  const priceFormatted = Number(service.price || 0).toFixed(2);
  const durationText = typeof service.duration === "number" ? `${service.duration} minutes` : service.duration || "60 minutes";

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rule 1: Customers must be authenticated
    if (!isAuthenticated) {
      router.push(`/sign-in?callbackUrl=/services/${service._id}`);
      return;
    }

    // Rule 2: Admins cannot submit customer appointment requests
    if (isAdmin) {
      setErrorMessage("Admins cannot submit customer appointment requests. Please use a customer account.");
      return;
    }

    // Rule 4: Only active services are available for booking
    if (!isActive) {
      setErrorMessage("Only active services are available for appointment booking.");
      return;
    }

    if (!appointmentDate) {
      setErrorMessage("Please select an appointment date.");
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage("Please select a convenient time slot.");
      return;
    }
    setIsSubmitting(true);
    
    const token = await getTokenFromClient();
    
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.serviceName,
          serviceImage: service.image,
          serviceCategory: service.category,
          price: service.price,
          duration: service.duration,
          appointmentDate,
          timeSlot: selectedTimeSlot,
          notes: message,
          serviceStatus: service.status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit appointment request.");
      }

      setBookingSuccess(result.appointment || {
        serviceName: service.serviceName,
        appointmentDate,
        timeSlot: selectedTimeSlot,
        servicePrice: service.price,
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2622] selection:bg-brass-soft selection:text-brass-ink py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7D7368] hover:text-[#2D2622] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all services</span>
          </Link>
        </div>

        {/* Success Modal / Confirmation Dialog */}
        {bookingSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#EFE7DC] text-center">
              <div className="w-16 h-16 bg-[#EAF7EE] text-[#1D773E] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#B88746] mb-1">
                Request Confirmed
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2622] font-normal mb-2">
                Appointment Requested!
              </h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Thank you for choosing SalonBook. Our team will review and confirm your reservation shortly.
              </p>

              <div className="bg-[#FAF7F2] rounded-2xl p-4 text-left border border-[#EFE7DC] mb-6 space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-[#EAE2D5]">
                  <span className="text-stone-500">Service</span>
                  <span className="font-medium text-[#2D2622]">{service.serviceName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#EAE2D5]">
                  <span className="text-stone-500">Date</span>
                  <span className="font-medium text-[#2D2622]">{bookingSuccess.appointmentDate}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#EAE2D5]">
                  <span className="text-stone-500">Time Slot</span>
                  <span className="font-medium text-[#2D2622]">{bookingSuccess.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#EAE2D5]">
                  <span className="text-stone-500">Total Price</span>
                  <span className="font-serif font-medium text-[#2D2622]">${priceFormatted}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Pending Approval
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard/customer/appointments"
                  className="flex-1 inline-flex justify-center items-center py-3 px-4 rounded-full bg-[#2D2622] hover:bg-[#433B36] text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  My Appointments
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setBookingSuccess(null)}
                  className="flex-1 py-3 px-4 rounded-full border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Details on Left, Booking Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Service Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Service Featured Image Container */}
            <div className="relative aspect-16/10 sm:aspect-4/3 w-full rounded-3xl sm:rounded-4xl overflow-hidden bg-stone-100 shadow-md">
              <Image
                src={service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"}
                alt={service.serviceName}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px"
              />

              {/* Overlaid Category Badge (Top-left, pill style from image 1) */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black/60 backdrop-blur-md text-white uppercase tracking-widest text-[11px] font-semibold px-4 py-1.5 rounded-full shadow-sm">
                  {service.category || "Service"}
                </span>
              </div>
            </div>

            {/* Badges Row: Status + Category/Ritual tag */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {isActive ? (
                <span className="inline-flex items-center gap-1.5 bg-[#EAF7EE] text-[#1D773E] text-xs font-semibold px-3 py-1 rounded-full border border-[#D5EEDC]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Inactive
                </span>
              )}

              <span className="inline-flex items-center bg-[#F3ECE1] text-[#7A6146] text-xs font-medium px-3.5 py-1 rounded-full">
                Salon experience
              </span>
            </div>

            {/* Service Name Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal tracking-tight text-[#2D2622] leading-[1.18]">
              {service.serviceName}
            </h1>

            {/* Service Description */}
            <p className="text-[#6C635B] text-base sm:text-lg leading-relaxed font-light">
              {service.description}
            </p>

            {/* Price, Duration, and Assurance Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 py-3 border-y border-[#EDE4D8]">
              {/* Price */}
              <div className="font-serif text-3xl sm:text-4xl text-[#2D2622] font-normal">
                ${priceFormatted}
              </div>

              {/* Estimated Duration */}
              <div className="flex items-center gap-2 text-stone-600 text-sm sm:text-base">
                <Clock className="w-4 h-4 text-[#B88746]" />
                <span>{durationText}</span>
              </div>

              {/* Booking Assurance */}
              <div className="flex items-center gap-2 text-[#1D773E] text-sm sm:text-base font-medium">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>Secure booking</span>
              </div>
            </div>

            {/* Bottom Highlights & Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Card 1: What to Expect */}
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-5 border border-[#EDE4D8] shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#B88746] flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#2D2622] mb-1">
                  What to expect
                </h4>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  Personal consultation with our master stylist, complimentary warm refreshments, sterile botanical products, and unhurried craftsmanship.
                </p>
              </div>

              {/* Card 2: Booking Policy */}
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-5 border border-[#EDE4D8] shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[#FAF5EE] text-[#B88746] flex items-center justify-center mb-3">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-medium text-[#2D2622] mb-1">
                  Booking policy
                </h4>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  Flexible cancellation or rescheduling up to 24 hours prior. No deposit charged at reservation; payment collected once confirmed.
                </p>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Appointment Booking Option (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-[#EDE4D8] shadow-xl shadow-stone-200/50">
              
              {/* Card Header */}
              <div className="mb-6">
                <p className="text-[#B88746] text-xs font-bold tracking-[0.18em] uppercase mb-1.5">
                  Request an appointment
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2622] font-normal mb-1">
                  Choose your time
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm">
                  The salon will confirm your request shortly.
                </p>
              </div>

              {/* Error Alert Display */}
              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Inactive Service Banner (Rule 4) */}
              {!isActive && (
                <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">Service Unavailable</p>
                    <p className="text-amber-800 leading-snug">
                      Only active services are available for appointment booking. This treatment is currently inactive.
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Warning Banner (Rule 2) */}
              {isAuthenticated && isAdmin && (
                <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200/80 text-amber-950 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">Admin Account Detected</p>
                    <p className="text-amber-800 leading-snug">
                      Admins cannot submit customer appointment requests. Please sign in as a customer to book an appointment.
                    </p>
                  </div>
                </div>
              )}

              {/* Unauthenticated Alert (Rule 1) */}
              {!isAuthenticated && (
                <div className="mb-5 p-3.5 bg-stone-100/90 border border-stone-200 text-stone-800 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-0.5">Authentication Required</p>
                    <p className="text-stone-600 leading-snug">
                      Customers must be authenticated to submit appointment requests. Please sign in to proceed.
                    </p>
                  </div>
                </div>
              )}

              {/* Appointment Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* 1. Appointment Date */}
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Appointment date
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    disabled={!isActive || isAdmin}
                    className="w-full bg-white border border-[#E2D8CC] rounded-xl px-4 py-2.5 text-sm text-[#2D2622] outline-none transition-all focus:border-[#B88746] focus:ring-1 focus:ring-[#B88746] disabled:bg-stone-100 disabled:cursor-not-allowed cursor-pointer"
                    required
                  />
                </div>

                {/* 2. Time Slot */}
                <div>
                  <label
                    htmlFor="timeSlot"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Time slot
                  </label>
                  <div className="relative">
                    <select
                      id="timeSlot"
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      disabled={!isActive || isAdmin}
                      className="w-full appearance-none bg-white border border-[#E2D8CC] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#2D2622] outline-none transition-all focus:border-[#B88746] focus:ring-1 focus:ring-[#B88746] disabled:bg-stone-100 disabled:cursor-not-allowed cursor-pointer"
                      required
                    >
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-stone-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 pl-1">
                    21 of 21 times open on this date.
                  </p>
                </div>

                {/* 3. Message for the salon (optional) */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Message for the salon <span className="text-stone-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Anything we should know before your visit?"
                    disabled={!isActive || isAdmin}
                    className="w-full bg-white border border-[#E2D8CC] rounded-xl p-3.5 text-sm text-[#2D2622] placeholder-stone-400 outline-none transition-all focus:border-[#B88746] focus:ring-1 focus:ring-[#B88746] resize-none disabled:bg-stone-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* 4. Authenticated Customer Pill (from Image 1: Avatar, Name, Email) */}
                {isAuthenticated && currentUser && (
                  <div className="bg-[#F4EDE2]/80 border border-[#E6DCCF] rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8DDD0] overflow-hidden flex items-center justify-center shrink-0 border border-[#DACFBF] relative">
                      {currentUser.image ? (
                        <Image
                          src={currentUser.image}
                          alt={currentUser.name || "Customer"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserCheck className="w-5 h-5 text-stone-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[#2D2622] truncate">
                          {currentUser.name || "Customer"}
                        </p>
                        {isAdmin && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. Service Total Row */}
                <div className="pt-2 border-t border-[#EDE4D8]">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 font-medium">Service total</span>
                    <span className="font-serif text-2xl text-[#2D2622] font-normal">
                      ${priceFormatted}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Payment is collected only after the salon confirms your appointment.
                  </p>
                </div>

                {/* 6. Action Button */}
                <div className="pt-2">
                  {!isAuthenticated ? (
                    <Button
                      type="button"
                      onClick={() => router.push(`/sign-in?callbackUrl=/services/${service._id}`)}
                      className="w-full py-6 rounded-full bg-[#9E7575] hover:bg-[#8B6464] text-white text-sm font-medium tracking-wide shadow-md transition-all cursor-pointer"
                    >
                      Sign In to Request Appointment
                    </Button>
                  ) : isAdmin ? (
                    <Button
                      type="button"
                      disabled
                      className="w-full py-6 rounded-full bg-stone-300 text-stone-500 text-sm font-medium cursor-not-allowed shadow-none"
                    >
                      Admins Cannot Submit Booking Requests
                    </Button>
                  ) : !isActive ? (
                    <Button
                      type="button"
                      disabled
                      className="w-full py-6 rounded-full bg-stone-300 text-stone-500 text-sm font-medium cursor-not-allowed shadow-none"
                    >
                      Service Currently Unavailable
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 rounded-full bg-[#9E7575] hover:bg-[#8B6464] active:bg-[#7D5757] text-white text-sm font-medium tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </span>
                      ) : (
                        "Request appointment"
                      )}
                    </Button>
                  )}
                </div>

              </form>

              {/* Help & Support Note below card */}
              <div className="mt-5 text-center">
                <a
                  href="tel:+12125550198"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#2D2622] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B88746]" />
                  <span>Need help? Call +1 (212) 555-0198</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
