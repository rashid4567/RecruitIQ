export class Candidate{
    constructor(
        public readonly id : string,
        public readonly name : string,
        public readonly email : string,
        public readonly status : "Active" | "Blocked"
    ){};
}