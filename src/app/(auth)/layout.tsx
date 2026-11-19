import type { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='container mx-auto '>
            <h2>Authentication related page</h2>
            {children}
        </div>
    ); 
};

export default AuthLayout;