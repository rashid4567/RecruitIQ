import bcrypt from "bcryptjs";
import { passwordServicePort } from "../../application/ports/password.service.port";

export class PasswordService implements passwordServicePort{
    async hash(password : string):Promise<string>{
        return bcrypt.hash(password, 10);
    }

    async compare(password : string, hash : string):Promise<boolean>{
        return bcrypt.compare(password, hash)
    }
}