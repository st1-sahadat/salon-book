
export type SignUpEmailOptions = {
    name: string;
    email: string;
    password: string;
    image?: string;
    callbackURL: string;
};

export interface IServices {
    category: string;
    createdAt: string;
    description: string;
    duration: number;
    image: string;
    price: number;
    serviceName: string;
    status: string;
}