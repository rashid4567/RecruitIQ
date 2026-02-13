import { OAuth2Client } from "google-auth-library";
import { GoogleAuthPort, GoogleAuthResult } from "../../application/ports/google-auth.ports";
import { INFRA_ERRORS } from "../constants/error-messages.constants";


export class GoogleService implements GoogleAuthPort {
  private readonly client: OAuth2Client;
  constructor(){
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  async verifyToken(credential: string): Promise<GoogleAuthResult> {
      const ticket = await this.client.verifyIdToken({
        idToken : credential,
        audience : process.env.GOOGLE_CLIENT_ID,
      })
      
      const payload = ticket.getPayload();
    
      if(!payload?.email || !payload.sub){
        throw new Error(INFRA_ERRORS.INVALID_GOOGLE_TOKEN)
      }

      return {
        email : payload.email,
        googleId : payload.sub,
        fullName : payload.name ?? "",
      }
  }
}