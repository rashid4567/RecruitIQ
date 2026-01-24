export interface UserServicePort {
  updateProfile(
    userId: string,
    data: {
      fullName?: string;
      profileImage?: string;
    }
  ): Promise<void>;

  updateEmail(
    userId: string,
    newEmail: string
  ): Promise<void>;

  findUserWithPassWord(
    userId: string
  ): Promise<{
    password: string;
    role: string;
    authProvider: string;
  } | null>;

  findUserById(
    userId: string
  ): Promise<{
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
    isActive: boolean;
    createdAt: Date;
  } | null>;

  updatePassword(
    userId: string,
    password: string
  ): Promise<void>;
}
