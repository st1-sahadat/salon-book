import SearchFilterClient from '@/components/SearchFilterClient';
import { allServices } from '@/lib/Data-Fatch/dataFatch';
import React from 'react';

const ServicePage = async() => {
    const allData = (await allServices()) || [];
    return (
        <div className="min-h-screen bg-[#FAFAF9] py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <SearchFilterClient services={allData} />
            </div>
        </div>
    );
};

export default ServicePage;