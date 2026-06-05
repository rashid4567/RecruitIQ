import { useEffect, useState } from "react"
import { JobApplication } from "../../domain/entity/job-application.entity"
import { getMyApplicationsUC } from "../di/application.di";

export const useMyApplicatons = () =>{
    const [application, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(()=>{
        loadApplication();
    },[])

    const loadApplication = async () =>{
        try{
            const result = await getMyApplicationsUC.execute();

            setApplications(result);
        }catch(err){
            setError(err instanceof Error ? err.message : "Failed to load application");
        }finally{
            setLoading(false);
        }
    }

    return {
        application,
        loading,
        error,
        refresh : loadApplication,
    }
}