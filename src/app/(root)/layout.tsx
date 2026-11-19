import Navbar from '@/components/Shared/Navbar';
import type { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Navbar/>
            {children}
        </div>
    ); 
};

export default RootLayout;