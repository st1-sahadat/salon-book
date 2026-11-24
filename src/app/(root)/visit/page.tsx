import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Train,
  Sparkles,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "Visit Us | SalonBook Flagship Sanctuary & Atelier",
  description:
    "Find directions, hours, valet info, and concierge contact for SalonBook's flagship luxury salon and wellness sanctuary.",
};

const hours = [
  { days: "Monday – Friday", time: "9:00 AM – 8:00 PM", status: "Open" },
  { days: "Saturday", time: "8:30 AM – 7:30 PM", status: "Open" },
  { days: "Sunday", time: "10:00 AM – 6:00 PM", status: "Open" },
  { days: "National Holidays", time: "Special Hours (By Appointment)", status: "Limited" },
];

const amenities = [
  {
    icon: Coffee,
    title: "Artisanal Tea Bar",
    desc: "Complimentary botanical infusions, matcha lattes, and sparkling mineral water.",
  },
  {
    icon: Car,
    title: "Complimentary Valet",
    desc: "Curbside valet parking attended during all operating hours.",
  },
  {
    icon: Sparkles,
    title: "Private Suites",
    desc: "Acoustically treated private booths for VIP consultations and quiet relaxation.",
  },
  {
    icon: ShieldCheck,
    title: "Medical-Grade Hygiene",
    desc: "Hospital-grade autoclaved steel tools and HEPA-filtered clean air circulation.",
  },
];

const faqs = [
  {
    q: "Do I need an appointment before visiting?",
    a: "We highly recommend reserving in advance through our online platform to guarantee your preferred artist and zero wait time. We do accept walk-ins based on immediate station availability.",
  },
  {
    q: "What is your cancellation or rescheduling policy?",
    a: "We understand schedules shift. You may reschedule or cancel your appointment free of charge up to 24 hours prior to your scheduled time via your personal SalonBook dashboard.",
  },
  {
    q: "Where do I park when arriving for my appointment?",
    a: "Pull directly up to our main entrance at 742 Evergreen Blvd. Our valet team will secure your vehicle and provide your claim ticket complimentary.",
  },
  {
    q: "Can I request a silent appointment?",
    a: "Absolutely. Simply add a note in your booking or notify our concierge at arrival. We will keep conversation strictly to consultation needs so you can rest or work uninterrupted.",
  },
];

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-ink selection:bg-brass selection:text-brass-ink">
      {/* ----------------- HERO ----------------- */}
      <section className="relative overflow-hidden bg-forest pt-24 pb-20 md:pt-32 md:pb-28 text-cream">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brass/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />

        <div className="container mx-auto px-5 lg:px-8 max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-brass mb-6">
            <MapPin className="w-3.5 h-3.5 text-brass" />
            Flagship Atelier & Sanctuary
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-cream leading-[1.1] max-w-4xl mx-auto">
            Experience Our <em className="italic text-brass font-medium">Urban Sanctuary</em>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-cream-dim/90 max-w-2xl mx-auto font-light leading-relaxed">
            Step through our doors into an oasis of calm. Natural stone, warm wood, and bespoke hospitality designed to restore your equilibrium.
          </p>
        </div>
      </section>

      {/* ----------------- CORE CONTACT & HOURS CARDS ----------------- */}
      <section className="relative -mt-10 container mx-auto px-5 lg:px-8 max-w-6xl z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Address & Location */}
          <div className="rounded-2xl bg-white p-7 border border-cream-deep/70 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/8 text-forest flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                Our Atelier
              </h3>
              <p className="text-sm text-mute leading-relaxed">
                742 Evergreen Boulevard, Suite 400<br />
                Design & Fashion District<br />
                New York, NY 10012
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-cream-deep/50 flex flex-col gap-2 text-xs font-mono text-forest">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-brass" />
                <span>Complimentary Valet at Main Entrance</span>
              </div>
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-brass" />
                <span>2 min from Lexington & 59th Metro</span>
              </div>
            </div>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="rounded-2xl bg-white p-7 border border-cream-deep/70 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/8 text-forest flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                Hours of Sanctuary
              </h3>
              <div className="space-y-2 mt-3">
                {hours.map((h, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-cream-deep/30 last:border-0">
                    <span className="font-medium text-ink">{h.days}</span>
                    <span className="font-mono text-mute">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-cream-deep/50 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Private morning and late slots by VIP request.</span>
            </div>
          </div>

          {/* Card 3: Direct Concierge */}
          <div className="rounded-2xl bg-white p-7 border border-cream-deep/70 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest/8 text-forest flex items-center justify-center mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                VIP Concierge
              </h3>
              <p className="text-sm text-mute leading-relaxed mb-4">
                Have questions regarding custom bridal packages, private bookings, or accessibility? Our team is at your service.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2.5 text-ink font-mono text-xs">
                  <Phone className="w-4 h-4 text-forest" />
                  <a href="tel:+15557256626" className="hover:text-brass transition-colors">
                    +1 (555) 725-BOOK
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-ink font-mono text-xs">
                  <Mail className="w-4 h-4 text-forest" />
                  <a href="mailto:concierge@salonbook.com" className="hover:text-brass transition-colors">
                    concierge@salonbook.com
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-cream-deep/50">
              <Link
                href="/services"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-cream hover:bg-forest-deep transition-colors"
              >
                <span>Book Station Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SANCTUARY AMENITIES ----------------- */}
      <section className="py-20 md:py-28 container mx-auto px-5 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-forest font-semibold">
            Comfort in Every Detail
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink mt-2">
            Sanctuary Amenities
          </h2>
          <p className="mt-4 text-mute text-base">
            Your appointment is more than a service — it is an intentional pause in your week.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-cream-deep/70 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-forest/8 text-forest flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-medium text-ink mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-mute leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- MAP & DIRECTIONS SECTION ----------------- */}
      <section className="bg-forest-deep text-cream py-20 md:py-24">
        <div className="container mx-auto px-5 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-brass">
                Getting Here
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream tracking-tight leading-tight">
                Effortless Arrival in the Design District
              </h2>
              <p className="text-cream-dim text-sm md:text-base leading-relaxed font-light">
                Located conveniently between Madison and Park Avenues. Whether arriving by chauffeured car, rideshare, or subway, our concierge greets you at the ground-level gallery before escorting you to your private suite.
              </p>

              <div className="space-y-4 pt-4 border-t border-cream/15 text-sm">
                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-cream">Arriving by Car</h4>
                    <p className="text-xs text-cream-dim/80 mt-0.5 font-light">
                      Curbside valet parking attended on Evergreen Blvd. EV high-speed charging available on request.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Train className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-cream">Public Transit</h4>
                    <p className="text-xs text-cream-dim/80 mt-0.5 font-light">
                      4, 5, 6, N, R, W trains at 59th St / Lexington Ave station. Take the southeast exit to Evergreen Blvd.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Map Canvas Mockup */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border border-cream/20 shadow-2xl bg-forest p-8 min-h-[360px] flex flex-col justify-between">
                {/* Visual Map Aesthetic Blueprint */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c9a15e_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-brass/20 text-brass border border-brass/30 text-xs font-mono uppercase tracking-wider">
                      Interactive Map View
                    </span>
                    <h4 className="font-display text-2xl text-cream font-medium mt-2">
                      SalonBook Flagship NYC
                    </h4>
                    <p className="text-xs text-cream-dim font-mono">
                      40.7614° N, 73.9776° W
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brass text-brass-ink flex items-center justify-center font-display font-bold shadow-lg animate-pulse">
                    SB
                  </div>
                </div>

                {/* Map Route Card */}
                <div className="relative z-10 mt-20 p-5 rounded-2xl bg-forest-deep/90 border border-cream/15 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brass/20 text-brass flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-cream-dim font-mono uppercase tracking-wider">
                          Destination Address
                        </p>
                        <p className="text-sm font-medium text-cream">
                          742 Evergreen Blvd, New York, NY
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=742+Evergreen+Boulevard+New+York"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-brass text-brass-ink font-mono text-xs font-semibold uppercase tracking-wider hover:bg-brass-soft transition-colors whitespace-nowrap"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- VISIT FAQS ----------------- */}
      <section className="py-20 md:py-28 container mx-auto px-5 lg:px-8 max-w-4xl">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-forest font-semibold mb-2">
            <HelpCircle className="w-4 h-4 text-brass" />
            Visitor Etiquette & FAQs
          </div>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-cream-deep/70 shadow-sm"
            >
              <h3 className="font-display text-xl font-medium text-ink mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-mute leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- CTA ----------------- */}
      <section className="pb-20 md:pb-28 container mx-auto px-5 lg:px-8 max-w-4xl text-center">
        <div className="rounded-3xl bg-forest p-10 md:p-14 text-cream shadow-xl">
          <h2 className="font-display text-3xl sm:text-4xl text-cream font-normal">
            Ready to Plan Your Salon Experience?
          </h2>
          <p className="mt-3 text-cream-dim text-sm max-w-md mx-auto font-light">
            Secure your preferred stylist and time slot in less than two minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="rounded-xl bg-brass px-7 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brass-ink hover:bg-brass-soft transition-transform hover:-translate-y-0.5 shadow-md"
            >
              Reserve An Appointment
            </Link>
            <a
              href="tel:+15557256626"
              className="rounded-xl border border-cream/30 bg-white/5 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-cream hover:bg-white/10 transition-colors"
            >
              Call Concierge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
