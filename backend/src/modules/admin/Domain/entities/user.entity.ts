import { Email } from "../../../../shared/domain/value-objects.ts/email.vo";
import { UserId } from "../../../../shared/domain/value-objects.ts/userId.vo";

export class UserAccount{
    constructor(
        private readonly id : UserId,
        private readonly email : Email,
        private isActive : boolean,
    ){};

    public static fromPresistence(props : {
        id : UserId,
        email : Email,
        isActive : boolean,
    }):UserAccount{
        return new UserAccount(
            props.id,
            props.email,
            props.isActive
        )
    }

    block():void{
        if(!this.isActive)return;
        this.isActive = false;
    }

    unblock():void{
        if(this.isActive)return;
        this.isActive = true;
    }

    getId():UserId{
        return this.id;
    }

    getEmail():Email{
        return this.email;
    }

    isActiveAccount():boolean{
        return this.isActive;
    }
}