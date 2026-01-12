import axios from "axios";

export function getError(err : unknown, fallback = "something we wrong"){
    if(axios.isAxiosError(err)){
        return(
            err.response?.data?.message || err.message || fallback
        )
    }
    if(err instanceof Error){
        return err.message
    }
    return fallback
}