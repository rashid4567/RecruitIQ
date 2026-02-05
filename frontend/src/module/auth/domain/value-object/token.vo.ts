export class Token{
    private readonly value : string;
    constructor(
        value : string
    ){
        this.value = value
    }

    static create(raw : string):Token{
        if(!raw){
            throw new Error('Token is required')
        }

        const trimmed = raw.trim();
    if(trimmed.length < 20){
        throw new Error("Invalid token")
    }

    return new Token(trimmed);
    }

    getValue():string{
        return this.value
    }
}