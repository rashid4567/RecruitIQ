import { User } from "../entities/user.entity";


export interface CreategoogleUserInput{
  email :string,
  googleId : string,
  fullName : string,
  role : "candidate" | "recruiter"
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getPasswordHash(email: string): Promise<string | null>;
  updatePassword(id : string, password : string):Promise<void>,
  create(user: User, passwordHash: string): Promise<User>;
  createGoogleUser(input : CreategoogleUserInput):Promise<User>
}
