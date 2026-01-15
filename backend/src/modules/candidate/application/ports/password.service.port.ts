export interface passwordServicePort{
    compare(raw : string, hashed : string):Promise<boolean>;
    hash(password :string):Promise<string>
}