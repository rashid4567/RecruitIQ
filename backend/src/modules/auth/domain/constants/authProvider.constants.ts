export const AUTH_PROVIDER = {
    LOCAL : "local",
    GOOGLE : "google",
    LINKEDIN : "linkedin",
}

export type authProvider = typeof AUTH_PROVIDER[keyof typeof AUTH_PROVIDER];