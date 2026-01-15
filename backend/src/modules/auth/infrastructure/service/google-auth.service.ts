import { OAuth2Client } from "google-auth-library";
import { GoogleAuthPort } from "../../application/ports/google-auth.ports";


export class GoogleService implements GoogleAuthPort{
     client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    async verifyToken(credential : string){
        const ticket = await this.client.verifyIdToken({
            idToken : credential,
            audience : process.env.GOOGLE_CLIENT_ID,
        })
        
        const payload = ticket.getPayload();
        if(!payload?.email || !payload.sub){
            throw new Error("Invalid Google token")
        }
        return{
            email : payload.email.toLocaleLowerCase().trim(),
            googleId : payload.sub,
            fullName : payload.name || "Google User",
            
        }
    }
}