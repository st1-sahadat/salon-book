
export type SignUpEmailOptions = {
    name: string;
    email: string;
    password: string;
    image?: string;
    callbackURL: string;
};

export interface IServices {
    _id?: string;
    category: string;
    createdAt: string;
    description: string;
    duration: number | string;
    image: string;
    price: number;
    serviceName: string;
    status: string;
}