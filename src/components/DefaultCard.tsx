import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { IServices } from "./Type/type";

const DefaultCard = ({ serviceData }: { serviceData: IServices[] }) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceData.map((service: IServices, index: number) => (
                <Card
                    key={service._id || index}
                    className="relative flex flex-col overflow-hidden rounded-2xl pt-0 border-0 bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)]"
                >
                    {/* Image Section */}
                    <div className="relative aspect-4/3 w-full">
                        <Image
                            src={service.image}
                            alt={service.serviceName}
                            fill
                            className="object-cover"
                        />
                        {/* Overlay Badge */}
                        <Badge className="absolute top-4 left-4 z-10 bg-white/90 text-black hover:bg-white uppercase tracking-wider font-semibold text-xs px-3 py-1 rounded-full shadow-sm">
                            {service.category}
                        </Badge>
                    </div>
                    {/* Content Section */}
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-baseline gap-2">
                            <CardTitle className="font-serif text-xl font-medium text-foreground">
                                {service.serviceName}
                            </CardTitle>
                            <span className="font-serif text-lg text-muted-foreground whitespace-nowrap">
                                ${service.price}
                            </span>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-2 leading-relaxed">
                            {service.description}
                        </CardDescription>
                    </CardHeader>
                    {/* Duration Section */}
                    <CardContent className="pb-6 pt-0 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{typeof service.duration === 'number' ? `${service.duration} mins` : service.duration}</span>
                        </div>
                    </CardContent>
                    {/* Footer Section */}
                    <CardFooter className="flex justify-between items-center pt-4 pb-4 mt-auto">
                        <span className="text-sm text-muted-foreground capitalize">
                            {service.status}
                        </span>
                        {service._id ? (
                            <Link href={`/services/${service._id}`}>
                                <Button
                                    variant="ghost"
                                    className="rounded-full h-9 px-4 text-sm font-medium hover:bg-muted cursor-pointer"
                                >
                                    View details
                                    <ArrowUpRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                variant="ghost"
                                className="rounded-full h-9 px-4 text-sm font-medium hover:bg-muted"
                            >
                                View details
                                <ArrowUpRight className="ml-2 w-4 h-4" />
                            </Button>
                        )}
                    </CardFooter>

                </Card>
            ))}
        </div>
    );
};

export default DefaultCard;