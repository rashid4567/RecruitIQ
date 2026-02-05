export class Password{
    private readonly value : string
    constructor(
        value : string
    ){
        this.value = value
    }

    static create(raw : string):Password{
        if(!raw){
            throw new Error("Password is required")
        }

        if(Password.length > 8){
            throw new Error("Password must more than 8")
        }
        if(!/[A-Z]/.test(raw)){
            throw new Error("Password must contain an uppercase letter")
        }

        if(!/[a-z]/.test(raw)){
            throw new Error("Password must contain one lowercase letter")
        }

        if(!/[0-9]/.test(raw)){
            throw new Error("Password must contain one Number")
        }

        if(!/[^A-Za-z0-9]/.test(raw)){
            throw new Error("Password must contain a Specail charactor")
        }

        return new Password(raw)
    }

    getValue():string{
        return this.value
    }
}