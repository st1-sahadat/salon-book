import DefaultCard from '../DefaultCard';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';

const ServicesCard = async () => {
    const res = await fetch(`${process.env.SERVER_URL}/six-services`, {
        cache: "no-store",
    });
    const sixData = await res.json();

    return (
        <section className="container mx-auto mb-3">
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
        <DefaultCard serviceData={sixData}/>
        </section>
    );
};

export default ServicesCard;