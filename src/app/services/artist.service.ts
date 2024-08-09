import { ARTISTS } from "../data/data";
import { IArtist } from "../dtos/artist";

export class ArtistService {
    Artists: IArtist[] = ARTISTS;
    // getArtistById(id: string): string {
    // }
    getArtistNameById(id: string) {
        const artist = this.Artists.find(item => item.Id === id);
        if (artist == undefined)
            return "";
        return artist.NickName;
    }
}