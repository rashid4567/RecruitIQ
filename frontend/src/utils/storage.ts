export const getToken = (): string | null =>{
    return localStorage.getItem("authToken")
}

export const setToken = (token : string) =>{
    localStorage.setItem("authToken",token);
}

export const removeToken = () =>{
    localStorage.removeItem("authToken")
}

export const getUser = (): string | null =>{
    return localStorage.getItem("userRole");
}

export const setUserRole = (role :string) =>{
    localStorage.setItem('userRole',role)
}

export const clearAuth = () =>{
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    
}