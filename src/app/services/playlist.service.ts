import { BehaviorSubject, Observable } from "rxjs";
import { PLAYLISTS } from "../data/data";
import { IPlaylist } from "../dtos/playlist";

export class PlaylistService {

    
    private playlists: IPlaylist[] = PLAYLISTS;

    getPlaylistById(id: string): IPlaylist {
        return this.playlists[Number(id) - 1];
    }

    getAllPlaylists(id: string): IPlaylist[] {
        return this.playlists.filter(playlist => playlist.UserId === id);
    }

    createNewPlaylist(playlist: IPlaylist) {
        this.playlists.push(playlist);
    }

    private activeIdSubject = new BehaviorSubject<string>("");

    setActiveId(id: string) {
        this.activeIdSubject.next(id);
    }

    getActiveId(): Observable<string> {
        return this.activeIdSubject.asObservable();
    }
}