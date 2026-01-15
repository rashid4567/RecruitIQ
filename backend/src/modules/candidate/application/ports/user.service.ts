export interface UserServicePort{
    findByWithPassword(userId : string):Promise<any>;
    updatePassword(userId : string, password : string):Promise<void>;
}