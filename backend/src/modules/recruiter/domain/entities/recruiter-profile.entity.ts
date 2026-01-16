export class RecruiterProfile{
    constructor(
        public readonly userId : string,
        public companyName?:string,
        public companyWebsite?:string,
        public companySize?:string,
        public designation?:string,
        public industry?:string,
        public bio?:string,
        public location?:string,
        public subscribtionStatus : "free" | "active" | "expiered" = "free",
        public jobPostUser : number = 0,
        public verificationStatus : "pending" | "verified" | "rejected" = "pending"
    ){};
}