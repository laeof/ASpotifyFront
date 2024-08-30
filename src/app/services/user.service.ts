import { USERS } from "../data/data";
import { IUser } from "../dtos/user";

export class UserService {
    private users: IUser[] = USERS;
    private user: IUser = {
        Id: "",
        UserName: "",
        FirstName: null,
        LastName: null,
        Email: "",
        lovedPlaylistId: "",
        Image: "",
        Playlists: []
    }

    getCurrentUserInfo(): IUser {
        return this.users[0];
    }

    getUserInfoById(id: string): IUser {
        return this.users.find(user => user.Id === id) || this.user 
    }
}