"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
};

export default function AdminProfileClient({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authClient.updateUser({
        name: name.trim(),
        image: imageUrl.trim() || undefined,
      });
      showToast("Admin profile updated successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
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
        <h1 className="font-display text-3xl text-ink font-normal tracking-tight">
          Administrator Profile
        </h1>
        <p className="text-mute text-sm mt-1">
          Manage your administrative credentials and display profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-cream-deep/70 shadow-sm overflow-hidden">
        {/* Avatar Hero */}
        <div className="bg-forest/10 px-6 py-8 flex flex-col items-center border-b border-cream-deep/50 relative">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-cream-soft border-4 border-white shadow-lg relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-forest text-cream font-bold text-2xl">
                  {initials}
                </div>
              )}
            </div>
          </div>

          <h2 className="font-display text-2xl text-ink font-semibold">
            {user.name}
          </h2>
          <p className="text-xs text-mute mt-0.5">{user.email}</p>

          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-forest bg-white px-3 py-1 rounded-full border border-cream-deep shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            Administrator
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-soft/40 border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-cream-soft/20 border border-cream-deep rounded-xl text-sm text-mute-soft cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-mute-soft mt-1">
              Primary administrative email cannot be modified directly.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Profile Image URL
            </label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute-soft" />
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-soft/40 border border-cream-deep rounded-xl text-sm text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-forest hover:bg-forest-deep text-cream rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
