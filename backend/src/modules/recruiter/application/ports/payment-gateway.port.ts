export interface PaymentGateway{
    createSubscription(input : {
        planId : string;
        totalCount : number;
        notes : Record<string, string>;
    }):Promise<{id : string}>
}