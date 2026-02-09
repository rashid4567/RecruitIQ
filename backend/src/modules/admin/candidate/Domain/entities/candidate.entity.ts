import { UserId } from "../../../../../shared/domain/value-objects.ts/userId.vo";
import { Email } from "../../../../../shared/domain/value-objects.ts/email.vo";

export class Candidate {
  private constructor(
    private readonly id: UserId,
    private readonly name: string,
    private readonly email: Email,
    private readonly isActive: boolean,


    private readonly currentJob?: string,
    private readonly experienceYears?: number,
    private readonly educationLevel?: string,
    private readonly skills: string[] = [],
    private readonly preferredJobLocations: string[] = [],
    private readonly bio?: string,
    private readonly currentJobLocation?: string,
    private readonly gender?: string,
    private readonly linkedinUrl?: string,
    private readonly portfolioUrl?: string,
    private readonly profileCompleted?: boolean,
  ) {}


  static fromList(props: {
    id: UserId;
    name: string;
    email: Email;
    isActive: boolean;
  }): Candidate {
    return new Candidate(
      props.id,
      props.name,
      props.email,
      props.isActive,
    );
  }


  static fromProfile(props: {
    id: UserId;
    name: string;
    email: Email;
    isActive: boolean;
    currentJob?: string;
    experienceYears?: number;
    educationLevel?: string;
    skills?: string[];
    preferredJobLocations?: string[];
    bio?: string;
    currentJobLocation?: string;
    gender?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    profileCompleted?: boolean;
  }): Candidate {
    return new Candidate(
      props.id,
      props.name,
      props.email,
      props.isActive,
      props.currentJob,
      props.experienceYears,
      props.educationLevel,
      props.skills ?? [],
      props.preferredJobLocations ?? [],
      props.bio,
      props.currentJobLocation,
      props.gender,
      props.linkedinUrl,
      props.portfolioUrl,
      props.profileCompleted,
    );
  }


  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  isActiveAccount() {
    return this.isActive;
  }

  getCurrentJob() {
    return this.currentJob;
  }

  getExperienceYears() {
    return this.experienceYears;
  }

  getEducationLevel() {
    return this.educationLevel;
  }

  getSkills() {
    return this.skills;
  }

  getPreferredJobLocations() {
    return this.preferredJobLocations;
  }

  getBio() {
    return this.bio;
  }

  getCurrentJobLocation() {
    return this.currentJobLocation;
  }

  getGender() {
    return this.gender;
  }

  getLinkedinUrl() {
    return this.linkedinUrl;
  }

  getPortfolioUrl() {
    return this.portfolioUrl;
  }

  isProfileCompleted() {
    return this.profileCompleted;
  }
}
