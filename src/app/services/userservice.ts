import { USERS } from "../data/data";
import { IUser } from "../dtos/user";

export class UserService {
    private users: IUser[] = USERS
    getCurrentUserInfo(): IUser {
        return this.users[0];
    }
}