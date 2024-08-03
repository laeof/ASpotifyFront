import { PLAYLISTS } from "../data/data";
import { IPlaylist } from "../dtos/playlist";

export class PlaylistService {

    private playlist: IPlaylist[] = PLAYLISTS;

    getPlaylistById(id: string): IPlaylist {
        return this.playlist[Number(id) - 1];
    }

    getAllPlaylists(id: string): IPlaylist[] {
        return this.playlist.filter(playlist => playlist.UserId === id);
    }

    createNewPlaylist(playlist: IPlaylist) {
        this.playlist.push(playlist);
    }
}