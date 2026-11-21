import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { IServices } from "@/components/Type/type";
import BookingDetailsPage from "@/components/Services/BookingDetailsPage";
import { ObjectId } from "mongodb";

interface PageProps {
  params: Promise<{ Id?: string; id?: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchService(id: string): Promise<IServices | null> {
  if (!id || typeof id !== "string") return null;

  // 1. Try fetching from Express Backend Server
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${serverUrl}/services/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && !Array.isArray(data) && data._id) {
        return data as IServices;
      }
      if (Array.isArray(data) && data.length > 0 && data[0]._id) {
        return data[0] as IServices;
      }
    }
  } catch (err) {
    // If Express backend is offline, continue to direct DB query
  }

  // 2. Direct MongoDB fallback
  try {
    const { db } = await connectToDatabase();
    let serviceDoc = null;

    if (ObjectId.isValid(id)) {
      serviceDoc = await db.collection("services").findOne({ _id: new ObjectId(id) });
    }

    if (!serviceDoc) {
      serviceDoc = await db.collection("services").findOne({ serviceName: id });
    }

    if (serviceDoc) {
      return {
        ...serviceDoc,
        _id: serviceDoc._id.toString(),
      } as unknown as IServices;
    }
  } catch (dbErr) {
    console.error("Direct DB fetch error:", dbErr);
  }

  return null;
}

const DetailsPage = async (props: PageProps) => {
  const resolvedParams = await props.params;
  const serviceId = resolvedParams?.Id || resolvedParams?.id || "";

  // 1. Authenticate user for protected route
  const session = await auth.api.getSession({
    headers: await headers(),
  }).catch(() => null);

  const user = session?.user;

  // If user is not authenticated, redirect to sign-in with callback
  if (!user) {
    redirect(`/sign-in?callbackUrl=/services/${encodeURIComponent(serviceId)}`);
  }

  // 2. Fetch service data
  const service = await fetchService(serviceId);

  // 3. Rule 3: Invalid service IDs should show an appropriate error message
  if (!service) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#2D2622] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EFE7DC] shadow-xl text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <p className="text-xs font-bold uppercase tracking-widest text-[#B88746] mb-1">
            Service Error
          </p>
          
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2622] font-normal mb-3">
            Invalid Service ID
          </h1>
          
          <p className="text-stone-500 text-sm leading-relaxed mb-6">
            We couldn&apos;t find any salon service associated with ID{" "}
            <span className="font-mono text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">
              {serviceId || "unknown"}
            </span>
            . The service may have been discontinued, deleted, or the link may be broken.
          </p>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-[#2D2622] hover:bg-[#433B36] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  // 4. Render Service Details & Booking View (Cloning Image 1 Design with Image 2 Requirements)
  return (
    <BookingDetailsPage
      service={service}
      initialUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      }}
    />
  );
};

export default DetailsPage;
