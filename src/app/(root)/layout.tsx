
import FooterFunctionality from '@/components/Homepage/FooterFunctionality';
import Navbar from '@/components/Homepage/Navbar';
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