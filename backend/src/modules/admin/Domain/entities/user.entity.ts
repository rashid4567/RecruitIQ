import { Email } from "../../../auth/domain/value.objects/email.vo";
import { UserId } from "../../../../shared/value-objects/userId.vo";

export class UserAccount{
    constructor(
        private readonly id : UserId,
        private readonly email : Email,
        private isActive : boolean,
        private readonly profileImage ?: string,
    ){};

    public static fromPresistence(props : {
        id : UserId,
        email : Email,
        isActive : boolean,
        profileImage ?: string,
    }):UserAccount{
        return new UserAccount(
            props.id,
            props.email,
            props.isActive,
            props.profileImage,
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

    getProfileImage():string | undefined{
        return this.profileImage;
    }
}