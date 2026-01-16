

export interface UserServicePort {
  updateProfile(
    userId: string,
    data: { fullName?: string; email?:string, profileImage?: string }
  ): Promise<void>;

  findUserWithPassWord(userId: string): Promise<{
    password: string;
    role: string;
    authProvider: string;
  } | null>;

  updatePassword(userId: string, password: string): Promise<void>;
}
