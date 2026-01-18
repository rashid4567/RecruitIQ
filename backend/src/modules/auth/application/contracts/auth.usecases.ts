export interface SendOtpUseCase {
  execute(email: string, role: "candidate" | "recruiter"): Promise<void>;
}

export interface VerifyRegistrationUseCase {
  execute(input: {
    email: string;
    otp: string;
    password: string;
    fullName: string;
    role: "candidate" | "recruiter";
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
  }>;
}

export interface LoginUseCase {
  execute(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
  }>;
}

export interface RefreshTokenUseCase {
  execute(refreshToken: string): Promise<string>;
}

export interface ForgotPasswordUseCase {
  execute(email: string): Promise<void>;
}

export interface ResetPasswordUseCase {
  execute(token: string, newPassword: string): Promise<void>;
}




export interface RequestEmailUpdateUseCase {
  execute(
    userId: string,
    role: "candidate" | "recruiter",
    newEmail: string
  ): Promise<void>;
}


export interface VerifyEmailUpdateUseCase {
  execute(input: {
    userId: string;
    role: "candidate" | "recruiter";
    newEmail: string;
    otp: string;
  }): Promise<void>;
}
