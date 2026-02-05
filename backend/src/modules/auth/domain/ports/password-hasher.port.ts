import { Password } from "../../../../shared/domain/value-objects.ts/password.vo"

export interface PasswordHasherPort {
    hash(password : Password):Promise<string>
    compare(password : Password, hash : string):Promise<boolean>
}