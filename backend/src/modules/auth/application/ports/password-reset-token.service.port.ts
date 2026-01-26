import { ResetToken } from "../../domain/value.objects.ts/reset-token.vo";

export interface PasswordResetTokenServicePort{
    generate(userId : string):ResetToken;
    verify(token : ResetToken):{userId : string}
}