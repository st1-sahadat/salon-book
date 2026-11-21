import Banner from "@/components/Homepage/Banner";
import Categories from "@/components/Homepage/Categories";
import ServicesCard from "@/components/Homepage/SixServicesCard";

export default function Home() {
  return (
    <div>
      <Banner />
      <ServicesCard />
      <Categories />
    </div>
  );
}
