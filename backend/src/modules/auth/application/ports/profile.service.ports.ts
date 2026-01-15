export interface ProfileServicePort {
  createProfile(userId: string, role: string): Promise<void>;
}
