import { useEffect, useState } from "react";
import type { GetRecruiterOffersResponse } from "../../types/recruiterOffer.types";
import { getRecruiterOffers } from "../../api/recruiter-offer.api";

export function useRecruiterOffers(){
    const [offer, setOffers] = useState<GetRecruiterOffersResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchOffers = async () =>{
        setLoading(true);

        try {
            const data = await getRecruiterOffers();
            setOffers(data);
        }catch(err : unknown){
            const message = err instanceof Error ? err.message : "Failed to fetch offers";
            setError(message)
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchOffers()
    },[]);

    return {
        offer,
        loading,
        error,
        refetch : fetchOffers,
    }

}