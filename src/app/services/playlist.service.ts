import { BehaviorSubject, Observable } from "rxjs";
import { PLAYLISTS, USERS } from "../data/data";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { QueueService } from "./queue.service";
import { Injectable } from "@angular/core";
import { IUser } from "../dtos/user";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {
    private currentPlaylistPlayingId = new BehaviorSubject<string>("");
    private activePlaylistId = new BehaviorSubject<string>("");

    private playlists: IPlaylist[] = PLAYLISTS;

    private playlist: IPlaylist = {
        Id: "",
        AuthorId: "",
        Image: "",
        Name: "",
        Type: PlaylistType.Playlist,
        TrackIds: []
    }

    constructor(private queueService: QueueService,
        private userService: UserService
    ) {

    }

    getPlaylistById(id: string): IPlaylist {
        return this.playlists.find(pl => pl.Id === id) || this.playlist;
    }

    addToPlaylist(playlistId: string, trackId: string) {
        this.getPlaylistById(playlistId).TrackIds.unshift(trackId);
        
        if(playlistId == this.currentPlaylistPlayingId.value)
            this.queueService.addTrackAtIndex(trackId, 0);
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        this.getPlaylistById(playlistId).TrackIds
            .splice(this.getPlaylistById(playlistId)
                .TrackIds.findIndex(id => id === trackId), 1)
    }

    getLovedTrackState(playlistId: string, trackId: string,): boolean {
        return this.getPlaylistById(playlistId).TrackIds.findIndex(id => id == trackId) != -1;
    }

    getAllPlaylistsUserId(id: string): string[] {
        // return this.playlists.filter(playlist => playlist.AuthorId === id);
        return this.userService.getUserInfoById(id).Playlists;
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

    getPlaylistType(playlist: IPlaylist): string {
        switch (playlist.Type) {
            case 0:
                return 'Playlist';
            case 1:
                return 'Album';
            case 2:
                return 'Single'
        }

        return ''
    }
}