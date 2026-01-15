import bcrypt from "bcryptjs";
import { passwordServicePort } from "../../application/ports/password.service.port";

export class PasswordService implements passwordServicePort{
    compare(raw : string, hash : string){
        return bcrypt.compare(raw, hash)
    }
    hash(password :string){
        return bcrypt.hash(password, 10)
    }
}