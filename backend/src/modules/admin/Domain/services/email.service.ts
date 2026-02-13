export interface EmailService{
    send(data : {
        to : string,
        subject : string,
        body : string,
        type?: "REAL" | "TEST"
    }):Promise<void>;
}