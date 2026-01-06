import api from "./axios";

export const checkHelth = async () =>{
    const res = await api.get("/health");
    return res.data;
}