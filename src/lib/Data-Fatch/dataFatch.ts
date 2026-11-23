import { connectToDatabase } from "@/lib/db";

export const allServices = async () => {
    // 1. Try external server if configured and responsive
    try {
        if (process.env.SERVER_URL) {
            const res = await fetch(`${process.env.SERVER_URL}/services`, {
                cache: "no-store",
            }).catch(() => null);
            if (res && res.ok) {
                const json = await res.json();
                if (Array.isArray(json) && json.length > 0) return json;
                if (Array.isArray(json?.data) && json.data.length > 0) return json.data;
            }
        }
    } catch (err) {
        console.error("Failed to fetch all services from server:", err);
    }

    // 2. Fallback / Direct read from MongoDB services collection
    try {
        const { db } = await connectToDatabase();
        const services = await db.collection("services").find().sort({ createdAt: -1 }).toArray();
        return JSON.parse(JSON.stringify(services));
    } catch (err) {
        console.error("Failed to fetch all services from database:", err);
        return [];
    }
};
