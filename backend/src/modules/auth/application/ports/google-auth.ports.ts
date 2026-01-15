export interface GoogleAuthPort {
    verifyToken(creadential : string):Promise<{
        email : string,
        googleId : string,
        fullName : string,
    }>
}