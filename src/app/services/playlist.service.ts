import { BehaviorSubject, catchError, first, forkJoin, map, Observable, switchMap, throwError } from "rxjs";
import { PLAYLISTS, USERS } from "../data/data";
import { IPlaylist, PlaylistType } from "../dtos/playlist";
import { QueueService } from "./queue.service";
import { Injectable } from "@angular/core";
import { IUser } from "../dtos/user";
import { UserService } from "./user.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import { ApiService } from "./api.service";
import { ITrack } from "../dtos/track";
import { ArtistService } from "./artist.service";
import { IArtist } from "../dtos/artist";

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

    constructor(private queueService: QueueService,
        private userService: UserService,
        private http: HttpClient,
        private apiService: ApiService,
        private artistService: ArtistService//temporary, need to use user
    ) {
        this.userService.getCurrentUserInfo().subscribe((user: any) => {
            this.user = user;
        });

        this.user.Playlists.map(
            (playlist: any) => {

            })
    }

    getPlaylistById(id: string): Observable<IPlaylist> {
        if(id === '' || id === undefined)
            return throwError(() => new Error('Playlist ID is undefined'));
        return this.http.get<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist/' + id)
    }

    addTrackToPlaylist(playlistId: string, trackId: string) {
        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', { playlistId, trackId })
    }

    //todo
    //add to backend
    removeTrackFromPlaylist(playlistId: string, trackId: string) {
        return this.http.put<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', { playlistId, trackId })
    }

    addToPlaylist(playlistId: string, trackId: string) {
        this.addToPlaylist(playlistId, trackId)
        if (playlistId == this.currentPlaylistPlayingId.value)
            this.queueService.addTrackAtIndex(trackId, 0);
    }

    removeFromPlaylist(playlistId: string, trackId: string) {
        this.removeFromPlaylist(playlistId, trackId);
    }

    getLovedTrackState(track: ITrack): boolean {
        if(this.user.Playlists.findIndex(trackId => trackId === track.id) != -1)
            return true
        return false;
    }

    getAllPlaylistsUserId(id: string): string[] {
        return this.userService.getUserInfoById(id)?.Playlists || [];
    }

    getAllMyPlaylists(): Observable<IPlaylist[]> {
        return this.artistService.getArtistById(this.user.Id).pipe(
            switchMap((user: IArtist) => {
                const playlistObservables = user.albums.map((id: string) => this.getPlaylistById(id));
    
                return forkJoin(playlistObservables);
            })
        )
    }

    createNewPlaylist(dto: IPlaylist) {
        // const data = {
        //     'Tracks': dto.TrackIds,
        //     'Id': dto.Id,
        //     'Name': dto.Name,
        //     'AuthorId': dto.AuthorId,
        //     'ImagePath': dto.Image,
        //     'Types': dto.Type
        // }

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', dto)
            .subscribe(
                (response: any) => {
                    this.userService.addPlaylistToUserById(response.authorId, response.id);
                },
                (error: any) => {
                    console.log(error)
                }
            );
    }

    createNewEmptyPlaylist() {

        const playlist: IPlaylist = {
            id: "",
            authorId: "",
            imagePath: "",
            name: "",
            types: PlaylistType.Playlist,
            tracks: []
        }

        const formData = new FormData();
        // formData.append('Id', playlist.Id);
        // formData.append('CreatedDate', new Date().toString());
        // formData.append('Tracks', [].toString());
        // formData.append('Name', playlist.Name);
        // formData.append('AuthorId', playlist.AuthorId);
        // formData.append('ImagePath', playlist.Image);
        // formData.append('Types', playlist.Type.toString());

        this.http.post<IPlaylist>(this.apiService.getPlaylistApi() + 'Playlist', playlist)
            .subscribe(
                (response: any) => {
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