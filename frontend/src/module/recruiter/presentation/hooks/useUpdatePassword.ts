import { updatePasswordUC } from "@/module/auth/presentation/di/auth";
import { useState } from "react";
import {toast} from "sonner";


export function useUpdatePassword(){
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setCofirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () =>{
        setCurrentPassword("");
        setNewPassword("");
        setCofirmPassword("");
    }

    const updatePassword  = async () =>{
        try{
            setLoading(true);

            await updatePasswordUC.execute({
                currentPassword,
                newPassword
            })

            toast.success("Password updated succesfully");
            resetForm();
            return true
        }catch(error : any){
            toast.error(error?.message || "Failed to update Password");
            return false;
        }finally{
            setLoading(false);
        }
    }
    return{
        currentPassword,
        newPassword,
        confirmPassword,
        loading,

        setCurrentPassword,
        setNewPassword,
        setCofirmPassword,

        updatePassword,
        resetForm,
        
    }
}