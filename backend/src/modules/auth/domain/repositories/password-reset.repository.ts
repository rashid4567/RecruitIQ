import { PasswordReset } from "../entities/password-reset.entity";
import { ResetToken } from "../value.objects.ts/reset-token.vo";

export interface PasswordResetRepository {
  create(reset: PasswordReset): Promise<void>;
  findByToken(token: ResetToken): Promise<PasswordReset | null>;
  deleteByUserId(userId: string): Promise<void>;
}