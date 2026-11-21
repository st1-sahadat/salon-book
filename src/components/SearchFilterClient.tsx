"use client";
import React, { useMemo, useState } from 'react';
import { Search, Sparkles, ChevronDown, X } from 'lucide-react';
import { IServices } from './Type/type';
import DefaultCard from './DefaultCard';
import { Button } from './ui/button';

export default function SearchFilterClient({ services = [] }: { services: IServices[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // 1. Only active services should be visible on public Browse Services page
    const activeServices = useMemo(() => {
        return (services || []).filter((service) => {
            if (!service.status) return true;
            return service.status.toLowerCase() === "active";
        });
    }, [services]);

    // 2. Extract unique categories dynamically from the services data
    const categories = useMemo(() => {
        const set = new Set<string>();
        activeServices.forEach((s) => {
            if (s.category && s.category.trim()) {
                set.add(s.category.trim());
            }
        });
        if (set.size === 0) {
            return [
                "Haircut & Styling",
                "Hair Coloring",
                "Hair Treatment",
                "Facial & Skincare",
                "Makeup",
                "Manicure & Pedicure",
                "Spa & Massage",
            ];
        }
        return Array.from(set).sort();
    }, [activeServices]);

    // 3. Filter by search name and category
    const filteredServices = useMemo(() => {
        return activeServices.filter((service) => {
            const matchesSearch =
                !searchTerm.trim() ||
                service.serviceName?.toLowerCase().includes(searchTerm.trim().toLowerCase());

            const matchesCategory =
                selectedCategory === "all" ||
                service.category?.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [activeServices, searchTerm, selectedCategory]);

    // 4. Sort services by price or newest date
    const sortedServices = useMemo(() => {
        const list = [...filteredServices];
        if (sortBy === "price-low") {
            list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (sortBy === "price-high") {
            list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        } else if (sortBy === "newest") {
            list.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        }
        return list;
    }, [filteredServices, sortBy]);

    // 5. Pagination calculations
    const totalServices = sortedServices.length;
    const totalPages = Math.ceil(totalServices / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSortBy("newest");
        setCurrentPage(1);
    };

    return (
        <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div className="max-w-2xl">
                    <p className="text-[#C19A6B] text-xs font-bold tracking-widest uppercase mb-3">
                        The Service Menu
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#333333] mb-4">
                        Find your next ritual
                    </h1>
                    <p className="text-[#666666] text-sm md:text-base leading-relaxed">
                        Browse every active treatment at SalonBook. Search by name, filter by category, or sort by price — then choose a time that suits you.
                    </p>
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 bg-[#FCF5E8] text-[#B88746] px-4 py-2 rounded-full border border-[#F2E3C6] text-sm font-medium whitespace-nowrap">
                    <Sparkles className="w-4 h-4" />
                    {totalServices} {totalServices === 1 ? "service" : "services"} available
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-4xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-6">
                
                {/* Search Input */}
                <div className="flex-1 flex items-center w-full px-4 py-3 bg-transparent">
                    <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Search services by name..." 
                        className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setCurrentPage(1);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2 cursor-pointer transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="relative w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="appearance-none w-full md:w-50 bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-full text-sm outline-none focus:border-gray-300 transition-colors cursor-pointer"
                    >
                        <option value="all">All categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative w-full md:w-auto">
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none w-full md:w-45 bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-full text-sm outline-none focus:border-gray-300 transition-colors cursor-pointer"
                    >
                        <option value="newest">Newest first</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
            </div>

            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-[#7A7A7A] px-2 mb-8">
                <p>
                    {totalServices > 0
                        ? `Showing ${startIndex + 1}–${Math.min(startIndex + itemsPerPage, totalServices)} of ${totalServices} services`
                        : "Showing 0 services"}
                </p>
                {totalServices > 0 && (
                    <p>Page {currentPage} of {totalPages}</p>
                )}
            </div>

            {/* Services Cards Grid or Empty State */}
            {paginatedServices.length > 0 ? (
                <DefaultCard serviceData={paginatedServices} />
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Sparkles className="w-10 h-10 text-[#C19A6B] mx-auto mb-3 opacity-60" />
                    <h3 className="text-lg font-serif font-medium text-gray-800">No services found</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                        We couldn&apos;t find any services matching your search or filter criteria.
                    </p>
                    {(searchTerm || selectedCategory !== "all" || sortBy !== "newest") && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="mt-5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#B88746] bg-[#FCF5E8] border border-[#F2E3C6] rounded-full hover:bg-[#F2E3C6] transition-colors cursor-pointer"
                        >
                            Reset all filters
                        </button>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage((p) => Math.max(p - 1, 1));
                        }}
                        className="rounded-full px-4 text-xs font-medium border-gray-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setCurrentPage(page);
                                }}
                                className={`w-9 h-9 rounded-full p-0 text-xs font-medium cursor-pointer ${
                                    currentPage === page
                                        ? "bg-[#333333] text-white hover:bg-[#444444]"
                                        : "border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage((p) => Math.min(p + 1, totalPages));
                        }}
                        className="rounded-full px-4 text-xs font-medium border-gray-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}
