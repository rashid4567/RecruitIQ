export interface passwordServicePort{
    hash(passWord : string):Promise<string>
    compare(password : string, hash : string):Promise<boolean>
}