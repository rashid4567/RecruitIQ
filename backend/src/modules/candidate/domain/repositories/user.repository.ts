export interface UserRepository {
  findById(
    userId: string
  ): Promise<{
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  } | null>;

  findByEmail(
    email: string
  ): Promise<{
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  } | null>;

  updateProfile(
    userId: string,
    data: {
      fullName?: string;
      email?: string;
      profileImage?: string;
    }
  ): Promise<void>;
}
