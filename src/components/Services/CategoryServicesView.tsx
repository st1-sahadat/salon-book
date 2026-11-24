"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock, Search, Sparkles, X, ChevronDown, CheckCircle2 } from "lucide-react";
import { IServices } from "@/components/Type/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const ALL_CATEGORIES = [
  { slug: "haircut-styling", title: "Haircut & Styling" },
  { slug: "hair-coloring", title: "Hair Coloring" },
  { slug: "hair-treatment", title: "Hair Treatment" },
  { slug: "facial-skincare", title: "Facial & Skincare" },
  { slug: "makeup", title: "Makeup" },
  { slug: "manicure-pedicure", title: "Manicure & Pedicure" },
  { slug: "spa-massage", title: "Spa & Massage" },
];

interface CategoryServicesViewProps {
  categorySlug: string;
  categoryTitle: string;
  categoryTagline?: string;
  categoryBlurb?: string;
  services: IServices[];
}

export default function CategoryServicesView({
  categorySlug,
  categoryTitle,
  categoryTagline,
  categoryBlurb,
  services = [],
}: CategoryServicesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  

  // 1. Filter by search term
  const filteredServices = useMemo(() => {
    return (services || []).filter((s) => {
      const matchName = !searchTerm.trim() || s.serviceName?.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchDesc = !searchTerm.trim() || s.description?.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchName || matchDesc;
    });
  }, [services, searchTerm]);

  // 2. Sort services
  const sortedServices = useMemo(() => {
    const list = [...filteredServices];
    if (sortBy === "price-low") {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "duration") {
      list.sort((a, b) => (Number(a.duration) || 0) - (Number(b.duration) || 0));
    }
    return list;
  }, [filteredServices, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2622] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#7D7368] hover:text-[#2D2622] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all services</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-stone-900 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#B88746] font-semibold">{categoryTitle}</span>
          </div>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE4D8] shadow-sm mb-8 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <p className="text-[#B88746] text-xs font-bold tracking-[0.2em] uppercase mb-2">
              Ritual Collection
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#2D2622] tracking-tight mb-3">
              {categoryTitle}
            </h1>
            {categoryTagline && (
              <p className="font-serif italic text-base sm:text-lg text-[#B05C39] mb-3">
                {categoryTagline}
              </p>
            )}
            <p className="text-[#6C635B] text-sm sm:text-base leading-relaxed max-w-2xl">
              {categoryBlurb ||
                `Explore our handcrafted ${categoryTitle.toLowerCase()} rituals, performed by dedicated master specialists using organic, premium treatments.`}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#FCF5E8] text-[#B88746] px-3.5 py-1.5 rounded-full border border-[#F2E3C6] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              {services.length} {services.length === 1 ? "treatment" : "treatments"} available
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#EAF7EE] text-[#1D773E] px-3.5 py-1.5 rounded-full border border-[#D5EEDC] text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Online appointment booking
            </span>
          </div>
        </div>

        {/* Horizontal Category Switcher Pills */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Explore other categories
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Link
              href="/services"
              className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all bg-white border border-[#EDE4D8] text-stone-700 hover:bg-stone-50 hover:border-stone-400"
            >
              All Services
            </Link>
            {ALL_CATEGORIES.map((cat) => {
              const isCurrent = cat.slug === categorySlug;
              return (
                <Link
                  key={cat.slug}
                  href={`/services/${cat.slug}`}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-[#2D2622] text-white shadow-sm"
                      : "bg-white border border-[#EDE4D8] text-stone-700 hover:bg-stone-50 hover:border-stone-400"
                  }`}
                >
                  {cat.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-3 border border-[#EDE4D8] shadow-xs mb-8">
          {/* Search Input */}
          <div className="flex-1 flex items-center w-full px-3 py-2 bg-transparent">
            <Search className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder={`Search ${categoryTitle} treatments...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-xs sm:text-sm text-stone-800 placeholder-stone-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-stone-400 hover:text-stone-600 ml-2 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-48 bg-[#FAF8F5] border border-[#E2D8CC] text-stone-700 py-2.5 px-4 pr-10 rounded-full text-xs sm:text-sm outline-none focus:border-[#B88746] transition-colors cursor-pointer"
            >
              <option value="default">Default order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
            </select>
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Services Grid or Empty State */}
        {sortedServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedServices.map((service: IServices, index: number) => (
              <Card
                key={service._id || index}
                className="relative flex flex-col overflow-hidden rounded-2xl pt-0 border border-[#EDE4D8] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.12)]"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={service.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                    alt={service.serviceName}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Category Badge */}
                  <Badge className="absolute top-3.5 left-3.5 z-10 bg-black/65 backdrop-blur-xs text-white uppercase tracking-wider font-semibold text-[10px] px-3 py-1 rounded-full shadow-xs">
                    {service.category || categoryTitle}
                  </Badge>
                </div>

                {/* Content Section */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-baseline gap-2">
                    <CardTitle className="font-serif text-xl font-normal text-[#2D2622]">
                      {service.serviceName}
                    </CardTitle>
                    <span className="font-serif text-lg font-medium text-[#2D2622] whitespace-nowrap">
                      ${Number(service.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                {/* Duration Section */}
                <CardContent className="pb-4 pt-0 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-[#B88746]" />
                    <span>
                      {typeof service.duration === "number" ? `${service.duration} mins` : service.duration || "60 mins"}
                    </span>
                  </div>
                </CardContent>

                {/* Footer Section with View Details button */}
                <CardFooter className="flex justify-between items-center pt-3 pb-4 border-t border-[#F2ECE3] mt-auto">
                  <span className="text-xs text-stone-500 capitalize flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {service.status || "Active"}
                  </span>
                  
                  {service._id ? (
                    <Link href={`/services/${service._id}`}>
                      <Button
                        variant="ghost"
                        className="rounded-full h-8 px-3.5 text-xs font-medium text-[#2D2622] hover:bg-[#FAF5EE] cursor-pointer"
                      >
                        Book Appointment
                        <ArrowUpRight className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      className="rounded-full h-8 px-3.5 text-xs font-medium text-[#2D2622] hover:bg-[#FAF5EE]"
                    >
                      Book Appointment
                      <ArrowUpRight className="ml-1.5 w-3.5 h-3.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EDE4D8] p-8 shadow-xs">
            <Sparkles className="w-10 h-10 text-[#B88746] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-normal text-[#2D2622]">
              No treatments found
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `No services matching "${searchTerm}" in this category.`
                : `There are currently no active services in ${categoryTitle}. Check back soon!`}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#B88746] bg-[#FCF5E8] border border-[#F2E3C6] rounded-full hover:bg-[#F2E3C6] transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/services"
                className="inline-block mt-4 px-5 py-2 text-xs font-medium text-white bg-[#2D2622] rounded-full hover:bg-stone-800 transition-colors"
              >
                Browse All Services
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
