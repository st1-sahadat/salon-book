
export const allServices = async () => {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/services`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.error("Failed to fetch all services:", err);
        return [];
    }
};

