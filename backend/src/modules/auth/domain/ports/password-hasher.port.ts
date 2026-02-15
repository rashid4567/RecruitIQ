import { Password } from "../../../../shared/value-objects.ts/password.vo.ts"

export interface PasswordHasherPort {
    hash(password : Password):Promise<string>
    compare(password : Password, hash : string):Promise<boolean>
}