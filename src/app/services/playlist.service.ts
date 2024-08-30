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

    private user: IUser = {
        Id: "",
        UserName: "",
        FirstName: null,
        LastName: null,
        Email: "",
        lovedPlaylistId: "",
        Image: "",
        latestPlayingPlaylist: '',
        latestPlayingTrack: '',
        Playlists: []
    };

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
        this.userService.getCurrentUserInfo().subscribe(user => {
            this.user = user;
        });
    }

    getLastPlaylistId() {
        return this.playlists.length + 1;
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
        return this.userService.getUserInfoById(id).Playlists;
    }

    createNewPlaylist() {
        var id = this.getLastPlaylistId();
        var newPlaylist: IPlaylist = {
            Id: id.toString(),
            AuthorId: this.user.Id,
            Image: '../assets/imgs/image.png',
            Name: 'Playlist ' + id,
            Type: PlaylistType.Playlist,
            TrackIds: []
        }
        this.playlists.push(newPlaylist);
        this.userService.addPlaylistToUserById(this.user.Id, newPlaylist.Id);
    }

    setActiveId(id: string) {
        this.activePlaylistId.next(id);
    }

    getActiveId(): Observable<string> {
        return this.activePlaylistId.asObservable();
    }

    setPlayingPlaylistId(id: string) {
        this.currentPlaylistPlayingId.next(id);
        this.queueService.setQueue(
            this.getPlaylistById(id).TrackIds);
    }

    getPlayingPlaylistId(): Observable<string> {
        return this.currentPlaylistPlayingId.asObservable();
    }

    getPlaylistType(type: PlaylistType): string {
        switch (type) {
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