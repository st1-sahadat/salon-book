import { allServices } from "@/lib/Data-Fatch/dataFatch";
import BrowseServicesClient from "./BrowseServicesClient";

export default async function ServicePage() {
  const allData = await allServices();

  const services = Array.isArray(allData?.data)
    ? allData.data
    : Array.isArray(allData)
    ? allData
    : [];

  return <BrowseServicesClient services={services} />;
}
