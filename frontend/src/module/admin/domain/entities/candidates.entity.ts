export type CandidateStatus = "Active" | "Blocked";

export class Candidate{
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;
    public readonly status: CandidateStatus;
    public readonly registeredDate: string;
    public readonly location?: string;
    public readonly experience?: number;
    public readonly applications?: number;
    public readonly skills: string[] = []

    constructor(
        id : string
    )
}