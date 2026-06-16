import { User } from "../../domain/entities/user.entity";

export interface UserWithPassword {
  user: User;
  password: string;
}

export interface UserServicePort {
  findByWithPassword(userId: string): Promise<UserWithPassword | null>;
  updatePassword(userId: string, password: string): Promise<void>;
  updateEmail(userId: string, email: string): Promise<void>;
}