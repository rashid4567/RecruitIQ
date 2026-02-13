export interface RequestCandidateEmailUpdateUseCase {
  execute(userId: string, newEmail: string): Promise<void>;
}

export interface VerifyCandidateEmailUpdateUseCase {
  execute(input: {
    userId: string;
    newEmail: string;
    otp: string;
  }): Promise<void>;
}