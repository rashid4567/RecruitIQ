import { UserRepository } from "../../domain/repositories/user.repository";
import { ERROR_CODES } from "../constants/error-codes.constants";
import { ApplicationError } from "../errors/application.error";
import { AuthTokenServicePort } from "../ports/token.service.ports";

export class RefreshTokenUseCase{
  constructor(
    private readonly userRepo : UserRepository,
    private readonly tokenService : AuthTokenServicePort
  ){};

  async execute(refreshToken : string):Promise<{accessToken : string}>{

    if(!refreshToken){
      throw new ApplicationError(ERROR_CODES.UNAUTHORIZED)
    }
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findById(payload.userId);
    
    if(!user || !user.canLogin()){
      throw new ApplicationError(ERROR_CODES.ACCOUNT_DEACTIVATED)
    }
    return {
      accessToken : this.tokenService.generateAccessToken(user.id, user.role)
    }
  }
}