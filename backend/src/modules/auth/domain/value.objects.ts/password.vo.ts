export class Password{
    private readonly value : string;

    private constructor(value : string){
        this.value = value;
    }

    public static create(raw : string):Password{
        if(!raw){
            throw new Error("Password is required")
        }
        if(Password.length < 8){
            throw new Error("Password must be more than 8")
        }
        if(!/[A-Z]/.test(raw)){
            throw new Error("password must include a Capital letter")
        }
        if(!/[a-z]/.test(raw)){
            throw new Error("Password must include a Small letter")
        }
        if(!/[0-9]/.test(raw)){
            throw new Error("Password must include a digit")
        }
        return new Password(raw)
    }

    getValue():string{
        return this.value;
    }
}