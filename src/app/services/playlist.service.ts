import { BehaviorSubject, Observable } from "rxjs";
import { PLAYLISTS } from "../data/data";
import { IPlaylist, PlaylistType } from "../dtos/playlist";

export class PlaylistService {

    private currentPlaylistPlayingId = new BehaviorSubject<string>("");
    private activePlaylistId = new BehaviorSubject<string>("");

    private playlists: IPlaylist[] = PLAYLISTS;

    private playlist: IPlaylist = {
        Id: "",
        UserId: "",
        Image: "",
        Name: "",
        Type: PlaylistType.Playlist,
        TrackIds: []
    }

    getPlaylistById(id: string): IPlaylist {
        return this.playlists.find(pl => pl.Id === id) || this.playlist;
    }

    addToPlaylist(playlistId: string, trackId: string) {
        this.getPlaylistById(playlistId).TrackIds.unshift(trackId);
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        this.getPlaylistById(playlistId).TrackIds
            .splice(this.getPlaylistById(playlistId)
                .TrackIds.findIndex(id => id === trackId), 1)
    }

    getLovedTrackState(playlistId: string, trackId: string,): boolean {
        return this.getPlaylistById(playlistId).TrackIds.findIndex(id => id == trackId) != -1;
    }

    getAllPlaylistsUserId(id: string): IPlaylist[] {
        return this.playlists.filter(playlist => playlist.UserId === id);
    }

    createNewPlaylist(playlist: IPlaylist) {
        this.playlists.push(playlist);
    }

    setActiveId(id: string) {
        this.activePlaylistId.next(id);
    }

    getActiveId(): Observable<string> {
        return this.activePlaylistId.asObservable();
    }

    setPlayingPlaylistId(id: string) {
        this.currentPlaylistPlayingId.next(id);
    }

    getPlayingPlaylistId(): Observable<string> {
        return this.currentPlaylistPlayingId.asObservable();
    }
}