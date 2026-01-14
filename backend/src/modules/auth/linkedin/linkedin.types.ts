export type LinkedInRole = "candidate" | "recruiter";

export interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

export interface LinkedInProfile {
  localizedFirstName: string;
  localizedLastName: string;
  id: string;
}

export interface LinkedInEmailResponse {
  elements: Array<{
    "handle~": {
      emailAddress: string;
    };
    handle: string;
  }>;
}