import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles : string[];
}

const ProtectedRoute = ({allowedRoles} : ProtectedRouteProps) =>{
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    if(!token){
        return <Navigate to="/signin" replace/>
    }
    if(!userRole || !allowedRoles.includes(userRole)){
        return <Navigate to="/" />
    }
    return Outlet;
}

export default ProtectedRoute;