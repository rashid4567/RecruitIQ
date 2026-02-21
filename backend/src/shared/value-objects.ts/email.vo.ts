export class Email{
    private readonly value : string;
    private constructor(value : string){
        this.value = value;
    }

    public static create(email : string){
        if(!email){
            throw new Error("email is requied")
        }

        const normalizedEmail = email.trim().toLowerCase();

        if(!this.isValid(normalizedEmail)){
            throw new Error("Invalid emial format")
        }

        return new Email(normalizedEmail)
    }

    private static isValid(email :string) : boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email); 
    }
    public getValue() : string{
        return this.value;
    }

    public equals(other : Email):boolean{
        return this.value === other.value;
    }
}