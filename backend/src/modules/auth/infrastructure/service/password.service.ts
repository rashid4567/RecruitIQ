import bcrypt from "bcryptjs";
import { PasswordHasherPort } from "../../domain/ports/password-hasher.port";
import { BCRYPT_SALT_ROUNDS } from "../constants/security.constants";
import { Password } from "../../domain/value.objects.ts/password.vo";

export class PasswordService implements PasswordHasherPort{
    async hash(password: Password): Promise<string> {
        return bcrypt.hash(password.getValue(), BCRYPT_SALT_ROUNDS);
    }
    async compare(password: Password, hash: string): Promise<boolean> {
        return bcrypt.compare(password.getValue(), hash);
    }
}