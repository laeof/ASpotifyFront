import { PLAYLISTS } from "../data/data";
import { IPlaylist } from "../dtos/playlist";

export class AlbumService {
    private Albums: IPlaylist[] = PLAYLISTS;

    getAlbumById(id: string): IPlaylist | undefined {
        return this.Albums.find(item => item.id === id);
    }
    
    getAlbumNameById(id: string) {
        const album = this.Albums.find(item => item.id === id);
        if (album == undefined)
            return "";
        return album.name;
    }
}