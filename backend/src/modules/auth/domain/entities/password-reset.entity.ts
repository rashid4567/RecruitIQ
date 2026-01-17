export class PasswordReset {
    constructor(
        public readonly usreId : string,
        public readonly token : string,
        public readonly expireAt :Date,
    ){};

    isExpired() : boolean{
        return this.expireAt < new Date();
    }
}