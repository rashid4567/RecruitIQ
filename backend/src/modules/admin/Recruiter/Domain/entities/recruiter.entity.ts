export class Recruiter{
    constructor(
        public readonly id : string,
        public readonly name : string,
        public readonly email : string,
        public readonly isActive : boolean,
        public readonly verificationStatus : "pending" | "verified" | "rejected",

    ){};

}