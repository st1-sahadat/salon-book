"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Clock,
  Scissors,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type TServiceItem = {
  _id?: string;
  serviceName?: string;
  name?: string;
  image?: string;
  description?: string;
  price?: number;
  duration?: number | string;
  category?: string;
  branch?: string;
  status?: string;
};

type Props = {
  services: TServiceItem[];
};

export default function BrowseServicesClient({ services }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(
      new Set(services.map((s) => s.category || "General").filter(Boolean))
    ),
  ];

  const filtered = services.filter((s) => {
    const name = (s.serviceName || s.name || "").toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (s.category || "General").toLowerCase() ===
        selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-ink font-normal tracking-tight">
          Browse Services
        </h1>
        <p className="text-mute text-sm mt-1">
          Explore our full menu of salon treatments and book your next visit.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-forest text-cream"
                  : "bg-cream-soft text-mute hover:bg-cream-deep"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/60">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No services found</p>
          <p className="text-xs text-mute-soft mt-1">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((service) => {
            const name = service.serviceName || service.name || "Service";
            const price = Number(service.price || 0);
            const duration =
              typeof service.duration === "number"
                ? `${service.duration} min`
                : service.duration || "60 min";
            const isActive = service.status
              ? service.status.toLowerCase() === "active"
              : true;

            return (
              <div
                key={service._id}
                className="bg-white rounded-2xl border border-cream-deep/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Service Image */}
                <div className="relative h-44 bg-cream-soft overflow-hidden">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Scissors className="w-10 h-10 text-cream-dim" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                      {service.category || "General"}
                    </span>
                  </div>
                  {!isActive && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="font-display text-lg text-ink font-medium truncate mb-1">
                    {name}
                  </h3>
                  <p className="text-xs text-mute line-clamp-2 mb-3 leading-relaxed">
                    {service.description || "A premium salon experience."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl text-ink font-medium">
                        ${price.toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-mute">
                        <Clock className="w-3 h-3" />
                        {duration}
                      </span>
                    </div>

                    {isActive ? (
                      <Link
                        href={`/services/${service._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-forest hover:bg-forest-deep rounded-lg transition-colors"
                      >
                        Book <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-xs text-mute-soft font-medium">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
