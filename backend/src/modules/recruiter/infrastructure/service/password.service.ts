import bcrypt from "bcryptjs";
import { PasswordServicePort } from "../../application/ports/password.service.port";


export class PasswordService implements PasswordServicePort{
    compare(raw :string, hash : string){
        return bcrypt.compare(raw, hash)
    }
    hash(password : string){
        return bcrypt.hash(password, 10)
    }
}