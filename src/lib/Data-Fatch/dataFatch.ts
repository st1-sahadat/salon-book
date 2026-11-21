
export const sixServices = async () => {
    const res = await fetch(`${process.env.SERVER_URL}/six-services`, {
        cache: "no-store",
    });
    return await res.json();
};

