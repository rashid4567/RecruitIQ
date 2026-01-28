export class UserId{
    private constructor(private readonly value : string){}

    public static create(value : string):UserId{
        if(!value || value.trim() === ""){
            throw new Error("UserId cannot be empty");
        }

        return new UserId(value.trim())
    }

    public equals(other : UserId):boolean{
        return this.value === other.value;
    }
    public getValue() : string{
        return this.value;
    }
}