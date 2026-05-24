export class EmailTemplateId {
    private constructor(private readonly value : string){};

    static create(value : string){
        if(!value){
            throw new Error("Template id required")
        }
        return new EmailTemplateId(value);
    }

    getValue(){
        return this.value;
    }
}