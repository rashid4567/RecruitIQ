export const USER_ROLES = {
    ADMIN : "admin",
    RECRUTER : "recruiter",
    CANDIDATE : "candidate",
} as const;

export type userRoles = typeof USER_ROLES[keyof typeof USER_ROLES]