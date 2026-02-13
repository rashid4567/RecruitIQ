export interface EmailServicePort{
    sendPasswordResetLink(email :string, token : string):Promise<void>
}