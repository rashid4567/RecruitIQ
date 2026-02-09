export interface UserRepositry {
    blockUser(userId : string):Promise<void>;
    unblockUser(userId : string):Promise<void>
}