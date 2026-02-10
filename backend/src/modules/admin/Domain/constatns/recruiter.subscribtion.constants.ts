export const SubscribtionStatus = {
    FREE : "free",
    ACTIVE : "active",
    EXPIRED : "expired"
}

export type subscribtionStatus = typeof SubscribtionStatus[keyof typeof SubscribtionStatus]