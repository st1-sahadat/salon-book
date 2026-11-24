"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Upload,
  Scissors,
} from "lucide-react";
import type { TAdminService } from "./page";

type Props = {
  initialServices: TAdminService[];
};

const DEFAULT_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
  "Bridal & Grooming",
];

export default function ManageServicesClient({ initialServices }: Props) {
  const [services, setServices] = useState<TAdminService[]>(initialServices);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<TAdminService | null>(null);
  const [isDeleting, setIsDeleting] = useState<TAdminService | null>(null);

  // Form State
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Feedback State
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingService(null);
    setServiceName("");
    setCategory(DEFAULT_CATEGORIES[0]);
    setCustomCategory("");
    setDescription("");
    setPrice("");
    setDuration("");
    setImagePreview("");
    setStatus("Active"); // Default Status: Active
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (service: TAdminService) => {
    setEditingService(service);
    setServiceName(service.serviceName);
    if (DEFAULT_CATEGORIES.includes(service.category)) {
      setCategory(service.category);
      setCustomCategory("");
    } else {
      setCategory("Other");
      setCustomCategory(service.category);
    }
    setDescription(service.description);
    setPrice(String(service.price));
    setDuration(String(service.duration));
    setImagePreview(service.image);
    setStatus(service.status.toLowerCase() === "inactive" ? "Inactive" : "Active");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image file size should be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  // Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!serviceName.trim()) {
      setFormError("Service name is required.");
      return;
    }

    const finalCategory =
      category === "Other" ? customCategory.trim() : category;
    if (!finalCategory) {
      setFormError("Service category is required.");
      return;
    }

    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }

    const numPrice = Number(price);
    // Rule: Price must be a positive number
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError("Price must be a positive number greater than 0.");
      return;
    }

    const numDuration = Number(duration);
    // Rule: Duration must be a positive number
    if (isNaN(numDuration) || numDuration <= 0) {
      setFormError("Estimated duration must be a positive number of minutes.");
      return;
    }

    // Rule: Service Image (Image Upload; Not Image URL)
    if (!imagePreview) {
      setFormError("Service Image is required. Please upload an image file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        serviceName: serviceName.trim(),
        category: finalCategory,
        description: description.trim(),
        price: numPrice,
        duration: numDuration,
        image: imagePreview,
        status, // Active or Inactive (Default: Active)
      };

      if (editingService) {
        // Update existing service
        const res = await fetch(`/api/admin/services/${editingService._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update service.");

        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id
              ? { ...s, ...payload }
              : s
          )
        );
        showToast("Service updated successfully!", "success");
      } else {
        // Add new service
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add service.");

        setServices((prev) => [data.service, ...prev]);
        showToast("New service added successfully!", "success");
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active / Inactive
  const handleToggleStatus = async (service: TAdminService) => {
    setToggleLoading(service._id);
    try {
      const res = await fetch(`/api/admin/services/${service._id}/toggle-status`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status.");

      setServices((prev) =>
        prev.map((s) =>
          s._id === service._id ? { ...s, status: data.status } : s
        )
      );
      showToast(data.message || "Status updated.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change status.";
      showToast(msg, "error");
    } finally {
      setToggleLoading(null);
    }
  };

  // Delete Service
  const handleDeleteService = async () => {
    if (!isDeleting) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/services/${isDeleting._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete service.");

      setServices((prev) => prev.filter((s) => s._id !== isDeleting._id));
      showToast("Service deleted successfully.", "success");
      setIsDeleting(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete service.";
      showToast(msg, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter Categories
  const allCategories = [
    "all",
    ...Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
  ];

  // Filtered Services List
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      s.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            Manage Services
          </h1>
          <p className="text-mute text-sm mt-1">
            Create, update, activate/deactivate, and manage salon treatments and pricing.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-forest hover:bg-forest-deep text-cream px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-cream-deep/70 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
          <input
            type="text"
            placeholder="Search services by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream-soft/40 border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-cream-soft/50 border border-cream-deep text-ink text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Categories</option>
            {allCategories
              .filter((c) => c !== "all")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-cream-soft/50 border border-cream-deep text-ink text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-forest cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-deep/70">
          <div className="w-14 h-14 rounded-full bg-cream-soft mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-mute-soft" />
          </div>
          <p className="text-mute font-medium text-lg">No services found</p>
          <p className="text-xs text-mute-soft mt-1">
            Try adjusting your search criteria or add a new service.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-cream bg-forest hover:bg-forest-deep rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Service
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-deep/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-deep/40 bg-cream-soft/40 text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Service
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Category
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Price
                  </th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-mute">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-mute text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-deep/30">
                {filteredServices.map((service) => {
                  const isActive =
                    service.status.toLowerCase() === "active";

                  return (
                    <tr
                      key={service._id}
                      className="hover:bg-cream/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-cream-soft relative border border-cream-deep/50">
                            {service.image ? (
                              <Image
                                src={service.image}
                                alt={service.serviceName}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-brass" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-ink truncate">
                              {service.serviceName}
                            </p>
                            <p className="text-xs text-mute line-clamp-1">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-cream-soft text-mute px-2.5 py-1 rounded-full font-medium">
                          {service.category}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-mute">
                        <span className="inline-flex items-center gap-1 text-xs">
                          <Clock className="w-3.5 h-3.5 text-forest" />
                          {service.duration} mins
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-ink">
                        ${service.price.toFixed(2)}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleStatus(service)}
                          disabled={toggleLoading === service._id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
                          }`}
                          title={`Click to ${isActive ? "Deactivate" : "Activate"}`}
                        >
                          {toggleLoading === service._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : "bg-stone-400"
                              }`}
                            />
                          )}
                          {isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Active / Deactivate */}
                          <button
                            onClick={() => handleToggleStatus(service)}
                            disabled={toggleLoading === service._id}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isActive
                                ? "text-amber-700 hover:bg-amber-50"
                                : "text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title={isActive ? "Deactivate Service" : "Activate Service"}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          {/* Edit Service */}
                          <button
                            onClick={() => handleOpenEditModal(service)}
                            className="p-2 rounded-lg text-mute hover:text-ink hover:bg-cream-soft transition-colors cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Service */}
                          <button
                            onClick={() => setIsDeleting(service)}
                            className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Add / Update Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-cream-deep">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-deep/50 bg-cream-soft/40 sticky top-0 z-10">
              <div>
                <h3 className="font-display text-xl text-ink font-semibold">
                  {editingService ? "Update Service Information" : "Add New Service"}
                </h3>
                <p className="text-xs text-mute">
                  Store in the <span className="font-mono font-semibold">services</span> collection.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-cream-deep text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Service Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Balayage Highlights & Toner"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                  required
                />
              </div>

              {/* Service Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Service Category <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest cursor-pointer"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Other">Other (Custom category)</option>
                  </select>

                  {category === "Other" && (
                    <input
                      type="text"
                      placeholder="Enter custom category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the salon treatment, benefits, and experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl p-3 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest resize-none"
                  required
                />
              </div>

              {/* Price & Duration (Positive numbers) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                    Price ($) <span className="text-rose-500">* (Positive number)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="e.g. 120.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    required
                  />
                  <p className="text-[11px] text-mute-soft mt-1">
                    Must be greater than 0
                  </p>
                </div>

                {/* Estimated Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                    Estimated Duration <span className="text-rose-500">* (in minutes)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 60"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-cream-soft/40 border border-cream-deep rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    required
                  />
                  <p className="text-[11px] text-mute-soft mt-1">
                    Must be a positive number
                  </p>
                </div>
              </div>

              {/* Service Image (Image Upload; Not Image URL) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Service Image <span className="text-rose-600 font-semibold">(Image Upload)</span> <span className="text-rose-500">*</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-cream-deep bg-cream-soft aspect-video flex items-center justify-center">
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-white text-ink text-xs font-semibold rounded-lg shadow-md hover:bg-cream-soft transition-colors cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreview("")}
                        className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cream-deep hover:border-forest rounded-2xl p-6 text-center cursor-pointer transition-colors bg-cream-soft/20 hover:bg-cream-soft/40"
                  >
                    <div className="w-12 h-12 rounded-full bg-forest/10 text-forest mx-auto flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-ink">
                      Click to upload service image
                    </p>
                    <p className="text-xs text-mute mt-0.5">
                      Direct file upload from your device (PNG, JPG, WEBP up to 5MB)
                    </p>
                    <p className="text-[11px] text-forest font-semibold mt-1">
                      (Image Upload)
                    </p>
                  </div>
                )}
              </div>

              {/* Service Status (Active / Inactive) -> Default Status: Active */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                  Service Status <span className="text-forest text-[11px] lowercase">(default status: active)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-cream-deep bg-cream-soft/30 hover:bg-cream-soft/60 transition-colors flex-1">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Active"}
                      onChange={() => setStatus("Active")}
                      className="accent-forest"
                    />
                    <div>
                      <p className="text-xs font-semibold text-ink">Active</p>
                      <p className="text-[10px] text-mute">Visible on public browse & bookable</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-cream-deep bg-cream-soft/30 hover:bg-cream-soft/60 transition-colors flex-1">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Inactive"}
                      onChange={() => setStatus("Inactive")}
                      className="accent-forest"
                    />
                    <div>
                      <p className="text-xs font-semibold text-ink">Inactive</p>
                      <p className="text-[10px] text-mute">Hidden from public browse</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cream-deep/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cream-deep text-sm font-medium text-mute hover:text-ink hover:bg-cream-soft transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-deep text-cream text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? (
                    "Update Service"
                  ) : (
                    "Save Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-rose-200 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl text-ink font-semibold mb-2">
              Delete Service
            </h3>
            <p className="text-sm text-mute leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-ink">
                &ldquo;{isDeleting.serviceName}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleting(null)}
                className="flex-1 py-2.5 rounded-xl border border-cream-deep text-sm font-medium text-mute hover:bg-cream-soft transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
