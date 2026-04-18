export type jobState = 'draft' | "active" | "blocked" | "expired";
export type jobType = "fullName" | "part-time" | "contract" |  "internship";

export interface Salary {
    min : number;
    max : number;
    currency : string;
}


export interface location {
    city : string;
    state : string;
    country : string;
}


export interface JpbPost {
    id : string;
    recruiterId : string;
    title : string;
    description : string;

    responsiblities : string[];
    requirements : string[];

    requiredSkills : string[];
    prefferedSkills : string[];

    experienceMin : number;
    experienceMax : number;

    location : location;
    isRemote : boolean;

    jobType : jobType;
    salary : Salary;

    departMent : string;
    positons : number;

    status : jobState,

    postedOn ?: Date;
    expiresAt ?: Date;

    externalLink?: string;
    views : number;
    applicationCount : number;

    isDeleted : boolean;

    createdAt : Date;
    updateAt : Date;
}