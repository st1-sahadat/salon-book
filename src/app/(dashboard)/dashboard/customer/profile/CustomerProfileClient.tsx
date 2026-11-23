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
  Shield,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

export default function CustomerProfileClient({ user }: Props) {
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
      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Failed to update profile.",
        "error",
      );
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
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
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
          My Profile
        </h1>
        <p className="text-mute text-sm mt-1">
          Update your personal information and profile picture.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-cream-deep/60 shadow-sm overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-forest/5 px-6 py-8 flex flex-col items-center border-b border-cream-deep/40">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-cream-soft border-4 border-white shadow-md relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-forest/10">
                  <span className="text-2xl font-bold text-forest">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center shadow-md">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <h2 className="font-display text-xl text-ink font-medium">
            {user.name}
          </h2>
          <p className="text-sm text-mute">{user.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-forest bg-forest/10 px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            Customer
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="w-4 h-4 text-mute-soft" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cream-soft/50 border border-cream-deep rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="w-4 h-4 text-mute-soft" />
              </div>
              <input
                id="email"
                type="email"
                value={user.email}
                readOnly
                className="w-full bg-cream-soft/30 border border-cream-deep rounded-xl pl-10 pr-4 py-2.5 text-sm text-mute cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-mute-soft mt-1 pl-1">
              Email cannot be changed.
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5"
            >
              Profile Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Camera className="w-4 h-4 text-mute-soft" />
              </div>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-cream-soft/50 border border-cream-deep rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-forest focus:ring-1 focus:ring-forest placeholder:text-mute-soft"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-forest hover:bg-forest-deep text-cream rounded-xl text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
