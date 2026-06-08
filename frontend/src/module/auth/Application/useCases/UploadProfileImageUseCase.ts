import type { AuthRepository } from "../../domain/repository/AuthRepository";

export class UploadProfileImageUseCase{
    private readonly authRepo : AuthRepository;
    constructor(
        authRepo : AuthRepository
    ){
        this.authRepo = authRepo;
    }

    async execute(file : File):Promise<void>{
        await this.authRepo.uploadProfileImage(file);
    }
}