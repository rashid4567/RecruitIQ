export type EmailLogType = "TEST" | "REAL";
export type EmailLogStatus = "SENT" | "FAILED";


export interface EmailLogProps{
    id : string,
    to : string,
    subject : string,
    type : EmailLogType,
    status : EmailLogStatus,
    timeStamp : string,
    error?:string;
}

export class EmailLog {
    public readonly props : EmailLogProps
    constructor(
        props : EmailLogProps
    ){
        this.props = props
    }

    getId(){
        return this.props.id;
    }

    getRecipient(){
        return this.props.to;
    }

    getSubject(){
        return this.props.to;
    }

    getType(){
        return this.props.type;
    }

    getStatus(){
        return this.props.status;
    }


    getError(){
        return this.props.error;
    }
    getTimeStamp(){
        return this.props.timeStamp;
    }

    isSent():boolean{
        return this.props.status === "SENT"
    }
    
    isFailed():boolean{
        return this.props.status === "FAILED"
    }
}