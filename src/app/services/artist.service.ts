import { USERS } from "../data/data";
import { IUser } from "../dtos/user";

export class ArtistService {
    Artists: IUser[] = USERS;
    // getArtistById(id: string): string {
    // }
    getArtistNameById(id: string) {
        const artist = this.Artists.find(item => item.Id === id);
        if (artist == undefined)
            return "";
        return artist.UserName;
    }
}