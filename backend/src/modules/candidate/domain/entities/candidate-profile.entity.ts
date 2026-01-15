export class CandidateProfile {
  constructor(
    public readonly userId: string,
    public currentJob: string,
    public experienceYears?: number,
    public skills: string[] = [],
    public educationLevel?: string,
    public preferredJobLocation: string[] = [],
    public bio?: string,
    public profileCompleted: boolean = false
  ) {}

  completeProfile() {
    this.profileCompleted = true;
  }
}
