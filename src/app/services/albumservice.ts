import { ALBUMS } from "../data/data";
import { IAlbum } from "../dtos/album";

export class AlbumService {
    private Albums: IAlbum[] = ALBUMS;

    getAlbumById(id: string): IAlbum | undefined {
        return this.Albums.find(item => item.Id === id);
    }

    
    getAlbumNameById(id: string) {
        const album = this.Albums.find(item => item.Id === id);
        if (album == undefined)
            return "";
        return album.Name;
    }
}