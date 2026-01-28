export const VerificationStatus = {
    PENDING : "pending",
    VERIFIED : "verfied",
    REJECTED : "rejected",
}

export type verificationStatus = typeof VerificationStatus[keyof typeof VerificationStatus]