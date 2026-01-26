export class UserId{
    private constructor(private readonly value : string){}

    public static create(value : string):UserId{
        if(!value || value.trim().length === 0){
            throw new Error("UserId cannot be empty")
        }
        return new UserId(value)
    }
    public equlas(other : UserId):boolean{
        return this.value === other.value;
    }

    public getValue():string{
        return this.value;
    }

}