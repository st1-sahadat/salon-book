import { sixServices } from '@/lib/Data-Fatch/dataFatch';
import { IServices } from '../Type/type';
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
import { ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';

const ServicesCard = async () => {
    const sixData = await sixServices();

    return (
        <section className="container mx-auto mt-5">
            <div className="flex mb-2 flex-col gap-5 rounded-sm bg-[#f8f5f2] px-6 py-7 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                <div className="max-w-2xl">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9b7567]">
                        The menu
                    </p>
                    <h2 className="font-serif text-3xl leading-tight text-[#3b2926] sm:text-4xl">
                        Rituals our clients come back for
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#756966]">
                        From a quick refresh to a full afternoon of care, every service is delivered one-to-one by a senior artist.
                    </p>
                </div>
                <Link href="services">
                <Button
                    variant="outline"
                    className="h-9 shrink-0 rounded-full border-[#d9cec8] bg-transparent px-4 text-xs text-[#4b3b37] hover:bg-white"
                >
                    All services
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {sixData.map((service: IServices, index: number) => (
                <Card
                    key={index}
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
                            <span>{service.duration}</span>
                        </div>
                    </CardContent>

                    {/* Footer Section */}
                    <CardFooter className="flex justify-between items-center pt-4 pb-4 mt-auto">
                        <span className="text-sm text-muted-foreground">
                            {service.status}
                        </span>
                        <Button
                            variant="ghost"
                            className="rounded-full h-9 px-4 text-sm font-medium hover:bg-muted"
                        >
                            View details
                            <ArrowUpRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>

                </Card>
            ))}
            </div>
        </section>
    );
};

export default ServicesCard;