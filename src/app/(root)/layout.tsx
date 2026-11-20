'use client';

import FooterFunctionality from '@/components/Shared/FooterFunctionality';
import Navbar from '@/components/Shared/Navbar';
import type { ReactNode } from 'react';


const RootLayout = ({ children }: { children: ReactNode }) => {
    

    return (
        <div>
            <Navbar />
            {children}
            <FooterFunctionality />
        </div>
    );
};

export default RootLayout;