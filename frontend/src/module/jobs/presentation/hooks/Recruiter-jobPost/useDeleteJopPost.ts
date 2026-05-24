import { DeleteJobPostUseCase } from "@/module/jobs/application/usecase/jobPost/deleteJobPost.useCase";
import { ApiJobPostRepository } from "@/module/jobs/infrastructure/repository/ApiJobPostRepository";
import { useState } from "react"

export const useDeleteJobPost = () =>{
    const [loading, setLoading] = useState(false);
    const repo = new ApiJobPostRepository();
    const useCase = new DeleteJobPostUseCase(repo);

    const deleteJobPost = async (id : string) =>{
        try{
            setLoading(true);
            await useCase.execute(id);
            return true;
        }catch(err){
            console.error(err);
            return false;
        }finally{
            setLoading(false)
        }
    }
    return{
        deleteJobPost,
        loading
    }
}