"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { SignUpEmailOptions } from "../Type/type";

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConformPassword, setShowConformPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [eror, setError] = useState<string | null>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const objectUrlRef = useRef<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        };
    }, []);

    // Image functionality
    const isValidImageUrl = (value: string) => {
        try {
            const parsed = new URL(value);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    const imageUrlIsInvalid =
        imageMode === "url" && imageUrl.trim().length > 0 && !isValidImageUrl(imageUrl.trim());
    const imagePreview =
        imageMode === "upload"
            ? filePreview
            : imageUrl.trim() && isValidImageUrl(imageUrl.trim())
                ? imageUrl.trim()
                : null;

    const clearSelectedImage = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        setProfileImage(null);
        setFilePreview(null);
        const input = document.getElementById("profile-image") as HTMLInputElement | null;
        if (input) input.value = "";
    };

    const handleRemoveImage = () => {
        clearSelectedImage();
        setImageUrl("");
        setError(null);
    };

    // Downscale large photos so the avatar stays small and loads quickly.
    const optimizeImage = async (file: File): Promise<File> => {
        try {
            const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
            const maxSide = 512;
            const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
            const width = Math.round(bitmap.width * scale);
            const height = Math.round(bitmap.height * scale);
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            if (!context) {
                bitmap.close?.();
                return file;
            }
            context.drawImage(bitmap, 0, 0, width, height);
            bitmap.close?.();

            if (scale === 1 && file.size <= 250 * 1024) return file;

            const blob = await new Promise<Blob | null>((resolve) =>
                canvas.toBlob(resolve, "image/jpeg", 0.86)
            );
            if (!blob) return file;
            return new File([blob], "avatar.jpg", { type: "image/jpeg" });
        } catch {
            return file;
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const file = input.files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.add({ title: "Choose a JPG, PNG or WEBP image." });
            input.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.add({ title: "Image must be 5 MB or smaller." });
            input.value = "";
            return;
        }

        const optimized = await optimizeImage(file);
        clearSelectedImage();
        objectUrlRef.current = URL.createObjectURL(optimized);
        setFilePreview(objectUrlRef.current);
        setProfileImage(optimized);
        setImageMode("upload");
        setError(null);
        input.value = "";
    };

    const uploadProfileImage = async (file: File): Promise<string> => {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const response = await fetch("/api/upload/avatar", {
            method: "POST",
            body: uploadData,
        });
        const result = (await response.json().catch(() => null)) as
            | { url?: string; error?: string }
            | null;

        if (!response.ok || !result?.url) {
            throw new Error(result?.error ?? "Could not upload your photo. Please try again.");
        }

        return result.url;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        const fullName = String(formData.get("fullName") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }
        setPasswordMismatch(false);

        if (imageMode === "url" && imageUrl.trim() && !isValidImageUrl(imageUrl.trim())) {
            setError("Enter a valid image URL that starts with http:// or https://.");
            return;
        }

        setIsLoading(true);
        try {
            let image: string | undefined;

            if (imageMode === "upload" && profileImage) {
                setIsUploading(true);
                image = await uploadProfileImage(profileImage);
            } else if (imageMode === "url" && imageUrl.trim()) {
                image = imageUrl.trim();
            }
            setIsUploading(false);

            const options: SignUpEmailOptions = {
                name: fullName,
                email: email, // required, The email address of the user.
                password: password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
                image,
                callbackURL: "/", // An optional URL to redirect to after the user signs up.
            };
            const { data, error } = await signUp.email(options);
            if (error) {
                return setError(error.message ?? "Could not create your account.");
            }
            toast.add({
                title: `Hello ${data.user?.name}, Account created`,
                description: "Your account has been created successfully.",
            });
            router.push("/")
            console.log({ data, error });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    // Google sign up
    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        setError(null);
        try {
            const res = await signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
            if (res?.error) {
                toast.add({
                    title: "Sign-Up failed",
                    description: res.error.message ?? "Sign-Up failed",
                });
                setError(res.error.message ?? "Sign-Up failed");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "Google sign-up failed. Please try again.";
            setError(message);
            toast.add({
                title: "Sign-Up failed",
                description: message,
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };


    return (
        <main className="flex min-h-screen bg-[#F6F0E9] font-body">
            {/* ============ LEFT : FORM ============ */}
            <section className="flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:px-14 xl:px-20">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#B0762F]">
                    Join the salon
                </p>

                <h1 className="mt-5 font-display text-[clamp(36px,5vw,58px)] font-light leading-[1.05] tracking-tight text-[#2B211C]">
                    Create your <em className="font-medium italic text-[#5B2233]">account</em>
                </h1>

                <p className="mt-5 max-w-107.5 text-[15px] leading-[1.85] text-[#7C6B60]">
                    Request appointments, follow their status and keep every detail in one place.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-9 w-full max-w-140 rounded-[22px] border border-[#E8DED3] bg-white p-7 shadow-[0_30px_70px_-45px_rgba(43,33,28,0.5)] sm:p-9"
                >
                    {/* google */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading || isGoogleLoading}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DED3] bg-white py-3.5 text-[15px] font-medium text-[#2B211C] transition hover:border-[#D8C7B6] hover:bg-[#FCFAF7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
                    </button>

                    {/* divider */}
                    <div className="my-7 flex items-center gap-4">
                        <span className="h-px flex-1 bg-[#E8DED3]" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#B5A79A]">
                            or register with email
                        </span>
                        <span className="h-px flex-1 bg-[#E8DED3]" />
                    </div>

                    {/* add photo */}
                    <div className="rounded-2xl border border-[#EFE6DC] bg-white p-5 shadow-[0_1px_2px_rgba(43,33,28,0.04)]">
                        <div className="flex items-start gap-5">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <label
                                    htmlFor={imageMode === "upload" ? "profile-image" : "profile-image-url"}
                                    className="group relative grid h-24 w-24 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-[#D8C7B6] bg-linear-to-b from-[#FCFAF7] to-[#F6F0E9] text-[#B5A79A] outline-none transition-colors hover:border-[#5B2233]/50 focus-within:ring-2 focus-within:ring-[#5B2233]/30 focus-within:ring-offset-2"
                                >
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="Profile preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="5" width="18" height="14" rx="3" />
                                            <circle cx="12" cy="12" r="3.2" />
                                            <path d="M8.2 5 9.3 3.2h5.4L15.8 5" />
                                        </svg>
                                    )}

                                    <span className="absolute inset-0 grid place-items-center rounded-full bg-[#2B211C]/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FCFAF7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="5" width="18" height="14" rx="3" />
                                            <circle cx="12" cy="12" r="3.2" />
                                            <path d="M8.2 5 9.3 3.2h5.4L15.8 5" />
                                        </svg>
                                    </span>
                                </label>
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                />

                                {/* Corner badge */}
                                <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-[#5B2233] text-white shadow-sm">
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.4"
                                        strokeLinecap="round"
                                    >
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                </span>
                            </div>

                            {/* Copy + actions */}
                            <div className="min-w-0 flex-1 pt-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#2B211C]">
                                        Profile photo
                                    </p>
                                    <span className="rounded-full border border-[#EFE6DC] bg-[#FBF7F2] px-2 py-0.5 text-[10px] font-medium tracking-[0.02em] text-[#B5A79A]">
                                        Optional
                                    </span>
                                </div>

                                <p className="mt-1 text-[11.5px] leading-relaxed text-[#8C7A6D]">
                                    Upload a photo from your device or paste a direct image link.
                                </p>

                                {/* Upload / URL mode toggle */}
                                <div className="mt-4 inline-flex rounded-full border border-[#EFE6DC] bg-[#FBF7F2] p-0.5">
                                    {([
                                        { id: "upload", label: "Upload image" },
                                        { id: "url", label: "Image URL" },
                                    ] as const).map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => {
                                                setImageMode(mode.id);
                                                setError(null);
                                            }}
                                            aria-pressed={imageMode === mode.id}
                                            className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${imageMode === mode.id
                                                    ? "bg-[#5B2233] text-white shadow-[0_1px_2px_rgba(43,33,28,0.2)]"
                                                    : "text-[#8C7A6D] hover:text-[#5B2233]"
                                                }`}
                                        >
                                            {mode.label}
                                        </button>
                                    ))}
                                </div>

                                {imageMode === "upload" ? (
                                    <>
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("profile-image")?.click()}
                                                className="inline-flex items-center gap-2 rounded-full bg-[#5B2233] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white shadow-[0_1px_2px_rgba(43,33,28,0.2)] transition hover:bg-[#481A28] active:scale-[0.98]"
                                            >
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M12 16V4" />
                                                    <path d="m6 10 6-6 6 6" />
                                                    <path d="M4 20h16" />
                                                </svg>
                                                {profileImage ? "Change image" : "Choose image"}
                                            </button>
                                            {profileImage && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="inline-flex items-center gap-2 rounded-full border border-[#E8DED3] bg-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8C7A6D] transition hover:border-[#D8C7B6] hover:text-[#5B2233]"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="mt-2 text-[11px] leading-relaxed text-[#A2938A]">
                                            JPG, PNG or WEBP — up to 5&nbsp;MB. A square image works best.
                                        </p>
                                    </>
                                ) : (
                                    <div className="mt-3">
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A79A]">
                                                <svg
                                                    width="15"
                                                    height="15"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                                                    <path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1" />
                                                </svg>
                                            </span>
                                            <input
                                                id="profile-image-url"
                                                type="url"
                                                inputMode="url"
                                                value={imageUrl}
                                                onChange={(e) => {
                                                    setImageUrl(e.currentTarget.value);
                                                    setError(null);
                                                }}
                                                aria-invalid={imageUrlIsInvalid}
                                                aria-describedby="profile-image-url-help"
                                                placeholder="https://example.com/photo.jpg"
                                                className={`w-full rounded-xl border bg-[#FCFAF7] py-2.5 pl-10 pr-3 text-[13px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:bg-white focus:ring-4 ${imageUrlIsInvalid
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                        : "border-[#E8DED3] focus:border-[#5B2233] focus:ring-[#5B2233]/10"
                                                    }`}
                                            />
                                        </div>
                                        <p
                                            id="profile-image-url-help"
                                            className={`mt-1.5 text-[11px] leading-relaxed ${imageUrlIsInvalid ? "text-red-600" : "text-[#A2938A]"
                                                }`}
                                        >
                                            {imageUrlIsInvalid
                                                ? "Use a full URL starting with http:// or https://."
                                                : "Paste a direct link to a JPG, PNG or WEBP image."}
                                        </p>
                                        {imageUrl.trim() && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8C7A6D] underline underline-offset-2 transition hover:text-[#5B2233]"
                                            >
                                                Clear link
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* full name */}
                    <label className="block text-[13px] font-semibold text-[#2B211C]">
                        Full name
                    </label>
                    <div className="relative mt-2.5">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                            </svg>
                        </span>
                        <input
                            name="fullName"
                            type="text"
                            required
                            placeholder="Ava Morgan"
                            className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
                        />
                    </div>

                    {/* email */}
                    <label className="mt-6 block text-[13px] font-semibold text-[#2B211C]">
                        Email address
                    </label>
                    <div className="relative mt-2.5">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M3 7l9 6 9-6" />
                            </svg>
                        </span>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
                        />
                    </div>

                    {/* password */}
                    <label className="mt-6 block text-[13px] font-semibold text-[#2B211C]">
                        Password
                    </label>
                    <div className="relative mt-2.5">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                        </span>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-12 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B5A79A] transition hover:text-[#5B2233]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                        {["At least 6 characters", "One uppercase letter", "One lowercase letter"].map((rule) => (
                            <li key={rule} className="flex items-center gap-2.5 text-[12px] text-[#7C6B60]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C08A3E]" />
                                {rule}
                            </li>
                        ))}
                    </ul>

                    {/* confirm password */}
                    <label className="mt-6 block text-[13px] font-semibold text-[#2B211C]">
                        Confirm password
                    </label>
                    <div className="relative mt-2.5">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A79A]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                        </span>
                        <input
                            name="confirmPassword"
                            type={showConformPassword ? "text" : "password"}
                            required
                            placeholder="Repeat your password"
                            className="w-full rounded-xl border border-[#E8DED3] bg-[#FCFAF7] py-3.5 pl-12 pr-4 text-[15px] text-[#2B211C] outline-none transition placeholder:text-[#B5A79A] focus:border-[#5B2233] focus:bg-white focus:ring-4 focus:ring-[#5B2233]/10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowConformPassword(!showConformPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B5A79A] transition hover:text-[#5B2233]"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>
                    {passwordMismatch && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                            Passwords do not match.
                        </p>
                    )}

                    <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[12px] leading-relaxed text-[#7C6B60]">
                        <input
                            name="termsAccepted"
                            type="checkbox"
                            required
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#5B2233]"
                        />
                        <span>
                            I agree to the <a href="/terms" className="font-semibold text-[#5B2233] underline underline-offset-2">Terms of Service</a>
                            {" and "}
                            <a href="/privacy" className="font-semibold text-[#5B2233] underline underline-offset-2">Privacy Policy</a>.
                        </span>
                    </label>
                    {eror && <p className="mt-3 text-sm text-red-600" role="alert">{eror}</p>}

                    {/* submit */}
                    <button
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#5B2233] py-4 text-[15px] font-semibold text-[#F6F0E9] transition hover:bg-[#712B41] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isUploading
                            ? "Uploading photo…"
                            : isLoading
                                ? "Creating account…"
                                : "Create account"}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>
                </form>

                <p className="mt-6 text-[14px] text-[#7C6B60]">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-semibold text-[#5B2233] underline underline-offset-4 transition hover:text-[#712B41]">
                        Sign in
                    </Link>
                </p>

                <p className="mt-4 max-w-130 text-[12px] leading-[1.8] text-[#A2938A]">
                    Public registration creates customer accounts only. Administrator access is assigned securely.
                </p>
            </section>

            {/* ============ RIGHT : IMAGE PANEL ============ */}
            <aside className="relative hidden w-[42%] lg:block">
                <div
                    className="absolute inset-0 bg-[#2B211C] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "linear-gradient(180deg, rgba(43,33,28,0.30) 0%, rgba(43,33,28,0.92) 100%), url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80')",
                    }}
                />

                <div className="relative flex h-full flex-col justify-between p-12">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E3B274" strokeWidth="1.8">
                            <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                        </svg>
                        SalonBook membership
                    </span>

                    <div>
                        <h2 className="font-display text-[clamp(30px,3vw,44px)] font-normal leading-[1.14] text-white">
                            A little more care,
                            <br />
                            <em className="italic text-brass-soft">every visit.</em>
                        </h2>
                        <p className="mt-5 max-w-90 text-[15px] leading-[1.9] text-white/70">
                            Your account remembers the details that matter, so every appointment starts where you left off.
                        </p>

                        <ul className="mt-8 space-y-4">
                            {[
                                "Book hair, skin, nails, massage and spa services",
                                "See live appointment and payment status",
                                "Secure Stripe checkout for confirmed bookings",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[14px] leading-[1.7] text-white/85">
                                    <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-soft" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-white/15 pt-7">
                        <p className="font-display text-[17px] italic leading-[1.75] text-white/85">
                            &quot;The easiest booking experience I have had at a salon — everything is exactly where you expect it.&quot;
                        </p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-brass-soft">
                            Sam W. — Skin client
                        </p>
                    </div>
                </div>
            </aside>
        </main>
    );
}