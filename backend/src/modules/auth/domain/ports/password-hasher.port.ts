import { Password } from "../../../../shared/value-objects/password.vo"

export interface PasswordHasherPort {
    hash(password : Password):Promise<string>
    compare(password : Password, hash : string):Promise<boolean>
}