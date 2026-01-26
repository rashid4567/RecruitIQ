import { userRoles } from "../constants/roles.constants";
import { AuthProvider } from "../value.objects.ts/auth-provider.vo"; 
import { Email } from "../value.objects.ts/email.vo"; 
import { GoogleId } from "../value.objects.ts/google-id.vo"; 
import { Password } from "../value.objects.ts/password.vo"; 
import { PasswordHasherPort  } from "../ports/password-hasher.port"; 
import { passwordServicePort } from "../../../candidate/application/ports/password.service.port";
import { th } from "zod/v4/locales";

export class User {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly role: userRoles,
    public readonly fullName: string,
    private readonly isActive: boolean,
    public readonly authProvider: AuthProvider,
    private readonly passwordHash?: string,
    public readonly googleId?: GoogleId
  ) {
    this.validateInvariants();
  }

  public static register(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    passwordHash: string;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.local(),
      params.passwordHash
    );
  }

  public static rehydrate(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    isActive: boolean;
    authProvider: AuthProvider;
    passwordHash?: string;
    googleId?: GoogleId;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      params.isActive,
      params.authProvider,
      params.passwordHash,
      params.googleId
    );
  }



  public static registerWithGoogle(params: {
    id: string;
    email: Email;
    role: userRoles;
    fullName: string;
    googleId: GoogleId;
  }): User {
    return new User(
      params.id,
      params.email,
      params.role,
      params.fullName,
      true,
      AuthProvider.google(),
      undefined,
      params.googleId
    );
  }

  public updateEmail(email : Email):User{
    if(!this.authProvider.isLocal()){
      throw new Error("Email update not allowed for social login")
    }

    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      this.passwordHash,
      this.googleId,
    )
  }
  public canLogin(): boolean {
    return this.isActive;
  }

  public async verifyPassword(
    password: Password,
    hasher: PasswordHasherPort 
  ): Promise<boolean> {
    if (!this.authProvider.isLocal() ||  !this.passwordHash) {
      return false; 
    }
    return hasher.compare(password, this.passwordHash);
  }

  public resetPassword(newPasswordHash : Password, hasher : PasswordHasherPort):Promise<User>{
    if(!this.authProvider.isLocal()){
      throw new Error("Password change not allowed for social login")
    }

   return this.withNewPassword(newPasswordHash, hasher)
  }

  public async updatePassword(current : Password, next : Password, hasher : PasswordHasherPort):Promise<User>{
     if(!this.authProvider.isLocal()){
      throw new Error("Password change not allowed for social login")
     }

     if(!this.passwordHash){
      throw new Error("Password not set")
     }

     const match = await hasher.compare(current, this.passwordHash);
     if(!match){
      throw new Error("Invalid current password")
     }
    return this.withNewPassword(next, hasher)
  }

  private async withNewPassword(
    password : Password,
    hasher : PasswordHasherPort,
  ):Promise<User>{
    const hash =await hasher.hash(password);
    return new User(
      this.id,
      this.email,
      this.role,
      this.fullName,
      this.isActive,
      this.authProvider,
      hash,
      this.googleId
    )
  }

  getPasswordHash():string | undefined{
    return this.passwordHash;
  }
  private validateInvariants():void{
    if(this.authProvider.isLocal() && !this.passwordHash){
      throw new Error("Local user must have a password hash")
    }
    if(this.authProvider.isGoogle() && !this.googleId){
      throw new Error("Google user must have a GoogleId")
    }

    if(this.authProvider.isGoogle() &&  this.passwordHash){
      throw new Error("Google user cannot have a password");
    }
  }

  
}
 