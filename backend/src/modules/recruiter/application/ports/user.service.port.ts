export interface UserServicePort {
  updateProfile(
    userId: string,
    data: {
      fullName?: string;
      profileImage?: string;
    }
  ): Promise<void>;

 



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


}
