export type GoogleLoginPayload = {
  credential: string;
  role?: "candidate" | "recruiter";
};


export type GoogleCredentialResponse = {
  credential?: string;
  select_by?: string;
};
