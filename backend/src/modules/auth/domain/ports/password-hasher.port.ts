import { Password } from "../value.objects/password-hash.vo"

export interface PasswordHasherPort {
    hash(password : Password):Promise<string>
    compare(password : Password, hash : string):Promise<boolean>
}