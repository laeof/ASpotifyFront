import { BehaviorSubject, catchError, map, Observable, throwError } from "rxjs";
import { PLAYLISTS, USERS } from "../data/data";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { QueueService } from "./queue.service";
import { Injectable } from "@angular/core";
import { IUser } from "../dtos/user";
import { UserService } from "./user.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {
    private currentPlaylistPlayingId = new BehaviorSubject<string>("");
    private activePlaylistId = new BehaviorSubject<string>("");

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

    private GENERALPLAYLISTS: IPlaylist[] = PLAYLISTS;

    private playlistsBehavior = new BehaviorSubject<IPlaylist[]>([]);

    constructor(private queueService: QueueService,
        private userService: UserService,
        private http: HttpClient,
        private apiService: ApiService
    ) {
        this.userService.getCurrentUserInfo().subscribe((user: any) => {
            this.user = user;
        });

        this.user.Playlists.map(
            (playlist: any) => {
                this.getPlaylistByIdDev(playlist).subscribe(
                    (response: any) => {
                        let play: IPlaylist = {
                            Id: response.id,
                            AuthorId: response.authorId,
                            Image: response.imagePath,
                            Name: response.name,
                            Type: response.types,
                            TrackIds: response.tracks
                        }
                        this.playlistsBehavior.value.push(play)
                        this.playlistsBehavior.next(this.playlistsBehavior.value)
                    }
                )
            })
    }

    getPlaylistByIdDev(id: string): Observable<IPlaylist> {
        return this.http.get<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/' + id)
    }

    addToPlaylist(playlistId: string, trackId: string) {
        const sub = this.getPlaylistByIdDev(playlistId).subscribe((playlist: any) => {
            let play = {
                Id: playlist.id,
                AuthorId: playlist.authorId,
                Image: playlist.imagePath,
                Name: playlist.name,
                Type: playlist.types,
                TrackIds: playlist.tracks
            }
            play.TrackIds.unshift(trackId);
            if (playlistId == this.currentPlaylistPlayingId.value)
                this.queueService.addTrackAtIndex(trackId, 0);
        })

        sub.unsubscribe();
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        const sub = this.getPlaylistByIdDev(playlistId).subscribe((playlist: any) => {
            let play = {
                Id: playlist.id,
                AuthorId: playlist.authorId,
                Image: playlist.imagePath,
                Name: playlist.name,
                Type: playlist.types,
                TrackIds: playlist.tracks
            }
            play.TrackIds.splice(play.TrackIds.findIndex((id: string) => id === trackId), 1)
        })

        sub.unsubscribe();
    }

    getLovedTrackState(playlistId: string, trackId: string,): boolean {
        let res: boolean = false;

        const sub = this.getPlaylistByIdDev(playlistId).subscribe((playlist: any) => {
            let play = {
                Id: playlist.id,
                AuthorId: playlist.authorId,
                Image: playlist.imagePath,
                Name: playlist.name,
                Type: playlist.types,
                TrackIds: playlist.tracks
            }
            res = play.TrackIds.findIndex((id: string) => id == trackId) != -1
        })

        sub.unsubscribe();

        return res;
    }

    getAllPlaylistsUserId(id: string): string[] {
        return this.userService.getUserInfoById(id).Playlists;
    }

    getAllMyPlaylists(): Observable<IPlaylist[]> {
        return this.playlistsBehavior.asObservable();
    }

    createNewPlaylist(dto: IPlaylist) {

        const data = {
            'Tracks': dto.TrackIds,
            'Id': dto.Id,
            'Name': dto.Name,
            'AuthorId': dto.AuthorId,
            'ImagePath': dto.Image,
            'Types': dto.Type
        }

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', data)
            .subscribe(
                (response: any) => {
                    const playlist: IPlaylist = {
                        Id: response.id,
                        AuthorId: response.authorId,
                        Image: response.imagePath,
                        Name: response.name,
                        Type: response.types,
                        TrackIds: response.tracks
                    }
                    console.log(playlist)
                    this.playlistsBehavior.value.push(playlist);
                    this.playlistsBehavior.next(this.playlistsBehavior.value);
                    this.userService.addPlaylistToUserById(playlist.AuthorId, playlist.Id);
                },
                (error: any) => {
                    console.log(error)
                }
            );
    }

    createNewEmptyPlaylist() {

        const playlist: IPlaylist = {
            Id: "",
            AuthorId: this.user.Id,
            Image: "loved.jpg",
            Name: "New Playlist",
            Type: PlaylistType.Playlist,
            TrackIds: []
        }

        const formData = new FormData();
        formData.append('Id', playlist.Id);
        formData.append('CreatedDate', new Date().toString());
        formData.append('Tracks', [].toString());
        formData.append('Name', playlist.Name);
        formData.append('AuthorId', playlist.AuthorId);
        formData.append('ImagePath', playlist.Image);
        formData.append('Types', playlist.Type.toString());

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', playlist)
            .subscribe(
                (response: any) => {
                    this.playlistsBehavior.value.push(response);
                    this.playlistsBehavior.next(this.playlistsBehavior.value);

                    this.userService.addPlaylistToUserById(response.AuthorId, response.Id);
                }
            );
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