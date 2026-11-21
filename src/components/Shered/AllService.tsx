import { allServices } from "@/lib/Data-Fatch/dataFatch";
import DefaultCard from "../DefaultCard";

const AllService = async() => {    
    const allData = await allServices();
    return (
        
        <div>
            {/* <DefaultCard allData = {serviceData}/> */}
            
        <DefaultCard serviceData={allData}/>
        </div>
    );
};

export default AllService;